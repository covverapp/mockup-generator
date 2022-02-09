var Jimp = require("jimp");

const main = async () => {
  const displacementMap = await Jimp.read("./static/map.png");
  const original = displacementMap.clone();

  displacementMap.greyscale().contrast(0.25).gaussian(5); // set greyscale
  displacementMap.write("displacementMap.png");

  const printfile = await Jimp.read("./static/printfile.png");
  printfile.displace(displacementMap, 8);
  printfile.filterType(0).write("printfile.png");
  original.composite(printfile, 0, 0).write("output.jpg");
};

main()
  .then(() => console.log("DONE"))
  .catch((err) => console.log(err));
