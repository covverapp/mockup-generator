var Jimp = require("jimp");

async function createImageWithTransparentPadding(image) {
  return new Jimp(
    image.bitmap.width + 2,
    image.bitmap.height + 2,
    "#00000000" // Transparent background
  )
    .composite(image, 1, 1)
    .resize(image.bitmap.width, image.bitmap.height);
}

async function displace(image, map, offset) {
  const source = await createImageWithTransparentPadding(image);
  const destination = await new Jimp(
    image.bitmap.width,
    image.bitmap.height,
    "#00000000" // Transparent background
  );
  image.scanQuiet(
    0,
    0,
    image.bitmap.width,
    image.bitmap.height,
    function (x, y, idx) {
      // Make it so white values (255) are not displaced
      // This makes it so white is out front and everything else gets displaced back
      let displacement = ((map.bitmap.data[idx] - 255) / 127.5) * offset;
      displacement = Math.round(displacement);

      if (
        x + displacement < image.bitmap.width &&
        y + displacement < image.bitmap.height
      ) {
        const ids = image.getPixelIndex(x + displacement, y + displacement);
        destination.bitmap.data[idx] = source.bitmap.data[ids];
        destination.bitmap.data[idx + 1] = source.bitmap.data[ids + 1];
        destination.bitmap.data[idx + 2] = source.bitmap.data[ids + 2];
        destination.bitmap.data[idx + 3] = source.bitmap.data[ids + 3];
      }
    }
  );

  return destination;
}

const main = async () => {
  const x = 400;
  const y = 617;
  const blur = 5;
  const contrast = 0.1;
  const displacementAmount = 40;

  const mockupImage = await Jimp.read("./static/shirt.jpg");
  let printfile = await Jimp.read("./static/printfile.png");
  const displacementMap = mockupImage
    .clone()
    .crop(x, y, printfile.bitmap.width, printfile.bitmap.height);

  displacementMap.greyscale().gaussian(blur).contrast(contrast); // set greyscale
  displacementMap.write("displacementMap.png");

  printfile = await displace(printfile, displacementMap, displacementAmount);
  printfile.write("printfile.png");
  mockupImage.composite(printfile, x, y).write("output.jpg");
};

main()
  .then(() => console.log("DONE"))
  .catch((err) => console.log(err));
