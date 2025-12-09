const { getAssetsPath, generateFileName } = require("./commonFunction");
const fs = require("fs");
const fsPromises = require("fs").promises;
const { parse } = require("path");
const path = require("path");
const { finished } = require("stream/promises");

const jsonFilePath = {
  defaultLayout: "/json/defaultLayout",
  defaultTemplate: "/json/defaultTemplate",
  defaultWorkflow: "/json/defaultWorkflow",
};

const saveAsJson = async (filePath, fileName, jsonData) => {
  try {
    const rootPath = getAssetsPath();
    const jsonPath = path.join(rootPath, filePath);

    if (!fs.existsSync(jsonPath)) {
      await fsPromises.mkdir(jsonPath, { recursive: true }, (err) => {
        throw new Error(err);
      });
    }

    // Create File
    const fileNamePath = `${jsonPath}/${fileName}.json`;

    fs.writeFile(fileNamePath, JSON.stringify(jsonData), (err) => {
      if (err) {
        throw new Error(err);
      }
      return true;
    });

    return { status: true, finalPath: `${filePath}/${fileName}.json` };
  } catch (error) {
    return { status: false, message: error.message };
  }
};
const validateJsonFile = async (filename) => {
  let { ext } = parse(filename);

  if (ext != ".json") {
    return {
      status: false,
      message: "error_file.invalid_file",
    };
  }

  return { status: true };
};
const jsonFileUpload = async (file) => {
  try {
    const rootPath = getAssetsPath();
    const filepath = "/temporaryJsonFile";
    if (!fs.existsSync(rootPath + filepath)) {
      await fsPromises.mkdir(rootPath + filepath, {
        recursive: true,
      });
    }
    let { createReadStream } = await file;
    let stream = createReadStream();

    let assetsPath = filepath + `/` + generateFileName() + ".txt";

    const out = fs.createWriteStream(path.join(rootPath + assetsPath));

    stream.pipe(out);
    await finished(out);

    let data = await fsPromises.readFile(path.join(rootPath + assetsPath));
    data = JSON.parse(data);

    fs.unlink(path.join(rootPath + assetsPath), (err) => {
      if (err) return { status: false, message: err.message };
    });

    return {
      status: true,
      data: data,
    };
  } catch (error) {
    return {
      status: false,
      message: error.message,
    };
  }
};
module.exports = { saveAsJson, jsonFilePath, validateJsonFile, jsonFileUpload };
