var Jimp = require("jimp");

const TRANSPARENT_COLOR = "#00000000";

/**
 * Pads an image with a transparent border so that weird border effects from
 * displacing the image will be transparent
 * @param {Jimp} image to pad
 * @returns {Jimp} padded image
 */
async function createImageWithTransparentPadding(image) {
  return new Jimp(
    image.bitmap.width + 2,
    image.bitmap.height + 2,
    TRANSPARENT_COLOR
  )
    .composite(image, 1, 1)
    .resize(image.bitmap.width, image.bitmap.height);
}

/**
 * Gets the average color of the displacement map. Makes it so the average color
 * becomes sort of the baseline and everything is displaced forwards and backwards
 * from said color.
 * @param {Jimp} image to calculate the average color of
 * @returns {number} the average color of the greyscale image
 */
function getAverageColor(map) {
  let averageColor = 0;
  map.scanQuiet(
    0,
    0,
    map.bitmap.width,
    map.bitmap.height,
    function (_, _, idx) {
      averageColor += map.bitmap.data[idx];
    }
  );
  return averageColor / (map.bitmap.width * map.bitmap.height);
}

/**
 * Algorithm loosely based from here https://docs.gimp.org/2.6/en/plug-in-displace.html
 * @param {Jimp} image to apply the displacement on
 * @param {Jimp} map the greyscale displacement map
 * @param {number} offset the amount that should be displaced
 * @returns {Jimp} displaced image
 */
async function displace(image, map, offset) {
  const source = await createImageWithTransparentPadding(image);
  const destination = await new Jimp(
    image.bitmap.width,
    image.bitmap.height,
    TRANSPARENT_COLOR
  );
  const averageColor = getAverageColor(map);

  console.log(averageColor);
  image.scanQuiet(
    0,
    0,
    image.bitmap.width,
    image.bitmap.height,
    function (x, y, idx) {
      let displacement =
        ((map.bitmap.data[idx] - averageColor) / 127.5) * offset;
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

TANK_PARAMS = [370, 300, 2, 0, 20, "tank.jpg", 260, 350];
SHIRT_PARAMS = [400, 617, 5, 0.1, 40, "shirt.jpg", 473, 630];

const main = async (params) => {
  const x = params[0];
  const y = params[1];
  const blur = params[2];
  const contrast = params[3];
  const displacementAmount = params[4];

  const baseImage = await Jimp.read(`./static/${params[5]}`);
  let printfile = (await Jimp.read("./static/printfile.png")).resize(
    params[6],
    params[7]
  );
  const displacementMap = baseImage
    .clone()
    .crop(x, y, printfile.bitmap.width, printfile.bitmap.height);

  displacementMap.greyscale().gaussian(blur).contrast(contrast); // set greyscale
  displacementMap.write("displacementMap.png");

  printfile = await displace(printfile, displacementMap, displacementAmount);
  printfile.write("printfile.png");
  baseImage.composite(printfile, x, y).scale(0.5).write("output.jpg");
};

main(SHIRT_PARAMS)
  .then(() => console.log("DONE"))
  .catch((err) => console.log(err));
