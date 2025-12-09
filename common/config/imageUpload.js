const fsPromises = require("fs").promises;
const fs = require("fs");
const { finished } = require("stream/promises");
const base64Prefix = "data:image/png;base64,";
const { getAssetsPath, generateFileName } = require("./commonFunction");

/**
 * To be used for path of image.
 **/
const imagePaths = {
  generalSetting: "/images/generalSetting",
  authentication_logo: "/images/authentication_logo",
  temporaryImages: "/images/temporaryImages",
  applicationOverview: "/images/applicationOverview",
  userProfile: "/images/userProfile",
  account: "/images/account",
  npsElementType: "/images/npsElementType",
};

/**
 * Convert the file to bits-format and makes it accessible for database operations. ʲˢ
 *
 * This method takes image file as input and returns the bit-code in encoded format.
 * @param
 * image file sent in form-data
 * @example
 * await imageBuffer(args.language_flag)
 */
const encodeBase64 = async (image) => {
  try {
    const { createReadStream, filename } = await image;

    const validateImageExt = await validateImageExtenstion(filename);
    // Checking if the file extension is acceptable or not
    if (!validateImageExt) {
      return { status: false, message: "Invalid Image Type" };
    }

    const pathTemporary = getAssetsPath() + imagePaths.temporaryImages;
    const tempPathTemporary = `${pathTemporary}/${filename}`;
    // Checking if directories exists, if not creating them
    let isPathTempExists = fs.existsSync(pathTemporary);
    if (!isPathTempExists) {
      fs.mkdir(pathTemporary, { recursive: true }, (err) => {
        console.log("err in callback of mkdir image upload:", err);
      });
    }

    // Invoking the `createReadStream` will return a Readable Stream.
    // See https://nodejs.org/api/stream.html#stream_readable_streams
    const stream = createReadStream();

    // This is purely for demonstration purposes and will overwrite the
    // file with same name in the current working directory on EACH upload.
    const out = fs.createWriteStream(tempPathTemporary);
    stream.pipe(out);
    await finished(out);

    //Here we extract out the properties of image such as size
    const statsImage = await fsPromises.stat(tempPathTemporary);
    const imageSizeInKb = statsImage.size / 1024; // convert into kbs
    if (imageSizeInKb > Number(process.env.DB_FILE_SIZE_LIMIT)) {
      fs.unlinkSync(tempPathTemporary);
      return { status: false, message: "Image Size Too Big" };
    }

    //Logic to send file in bits to DB
    const data = await fsPromises.readFile(tempPathTemporary);
    let encodedImage = await new Buffer.from(data);

    // Remove the image from temporaryImages folder
    fs.unlinkSync(tempPathTemporary);

    return {
      status: true,
      message: "",
      data: base64Prefix + encodedImage.toString("base64"),
    };
  } catch (error) {
    return {
      status: false,
      message: error.message,
    };
  }
};

/**
 * Used for validating the image type. (Valid: jpg, jpeg, png, svg)
 *
 * This method takes file name as input and returns the true or false.
 * @param
 * filename-- file sent in form-data
 * @example
 * await validateImageExtenstion(args.language_flag)
 */
const validateImageExtenstion = async (filename) => {
  let { ext } = parse(filename);

  if (ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".svg") {
    return false;
  }

  return true;
};

/**
 * To store image in assets folder.
 *
 * This method takes file and path to store as input and returns the full path of image.
 * @param
 * file-- file sent in form-data
 * @param
 * filepath-- Path in asset to store under folder.
 * @example
 * await imgUpload(language_flag, imagePaths.generalSetting)
 */
const imgUpload = async (file, filepath) => {
  try {
    const rootPath = getAssetsPath();
    if (!fs.existsSync(rootPath + filepath)) {
      await fsPromises.mkdir(rootPath + filepath, { recursive: true });
    }

    let { createReadStream, filename } = await file;
    let stream = createReadStream();
    let { ext } = parse(filename);

    let assetsPath = filepath + `/` + generateFileName() + ext;

    const out = fs.createWriteStream(path.join(rootPath + assetsPath));
    stream.pipe(out);
    await finished(out);
    return { status: true, path: liveServerPath.adminPath + assetsPath };
  } catch (error) {
    return { status: false, message: error.message };
  }
};

/**
 * To delete image from assets folder.
 *
 * This method takes path of file as input.
 * @param
 * file-- file path
 * @example
 * await unlinkFileFromAssets(imagePaths.generalSetting, language_flag)
 */
const unlinkFileFromAssets = async (serverPath, filePath) => {
  filePath = filePath.replace(serverPath, "");
  const rootPath = getAssetsPath() + filePath;
  if (fs.existsSync(rootPath)) {
    fs.unlink(rootPath, (err) => {
      if (err) return err.message;
    });
  }
};

module.exports = {
  encodeBase64,
  validateImageExtenstion,
  unlinkFileFromAssets,
  imgUpload,
};
