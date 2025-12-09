const path = require("path");
const pdf = require("html-pdf");
const fs = require("fs");
const fsPromises = require("fs").promises;
const ejs = require("ejs");
const xl = require("excel4node");
const httpStatus = require("./httpStatus");
const { getAssetsPath, generateFileName } = require("./commonFunction");

const optionNormal = {
  // height: '11.25in',
  // width: '8.5in',
  format: "A3",
  orientation: "landscape",
  header: {
    height: "10mm",
  },
  footer: {
    height: "28mm",
  },
};

const reportPaths = {
  state: "/report/state",
  application: "/report/application",
  package: "/report/package",
  couponCode: "/report/couponCode",
  feature: "/report/feature",
  country: "/report/country",
  locale: "/report/locale",
  account: "/report/account",
  users: "/report/users",
};

const reportTemplates = {
  state: "statePdfTemplate.ejs",
  application: "applicationPdfTemplate.ejs",
  package: "package.ejs",
  couponCode: "couponCode.ejs",
  feature: "feature.ejs",
  country: "countryPdfTemplate.ejs",
  locale: "localePdfTemplate.ejs",
  account: "accountPdfTemplate.ejs",
  users: "users.ejs",
};

const ejsData = async (template, data, ptName) => {
  const pt = ptName;
  const pdfTemplatePath = path.join(__dirname, `../assets/ejs/${template}`);
  return await ejs.renderFile(path.join(pdfTemplatePath), {
    data: data,
    pdfTitle: pt,
  });
};

const createPDF = async (filepath, data, template, columnsNames) => {
  try {
    const newDirPath = getAssetsPath();
    if (!fs.existsSync(newDirPath + filepath)) {
      await fsPromises.mkdir(newDirPath + filepath, { recursive: true });
    }

    let ejsData = await ejs.renderFile(
      path.join(__dirname, `../templates/report-ejs/${template}`),
      {
        data: data,
        columns: columnsNames,
      }
    );

    const fileName = generateFileName();
    return await new Promise((resolve, reject) => {
      try {
        pdf
          .create(ejsData, optionNormal)
          .toFile(
            newDirPath + "/" + filepath + "/" + fileName + `.pdf`,
            (err, res) => {
              if (err)
                return reject({
                  ...httpStatus.INTERNAL_SERVER_ERROR,
                  data: null,
                  error: [err.message],
                });
              if (res)
                return resolve({
                  ...httpStatus.SUCCESS,
                  data: filepath + "/" + fileName + `.pdf`,
                });
            }
          );
      } catch (error) {
        return reject({
          ...httpStatus.INTERNAL_SERVER_ERROR,
          data: null,
          error: [error.message],
        });
      }
    });
  } catch (error) {
    return {
      ...httpStatus.INTERNAL_SERVER_ERROR,
      data: null,
      error: [error.message],
    };
  }
};

const createExcel = async (wsName, headingColumnNames, data, filepath) => {
  try {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet(wsName);

    let headingColumnIndex = 1;
    headingColumnNames.forEach((heading) => {
      ws.cell(1, headingColumnIndex++).string(heading);
    });

    let rowIndex = 2;
    let value = "";
    data.forEach((record) => {
      let columnIndex = 1;
      Object.keys(record).forEach((columnName) => {
        value = record[columnName] ? "" + record[columnName] : "";
        ws.cell(rowIndex, columnIndex++).string(value);
      });
      rowIndex++;
    });

    const newDirPath = getAssetsPath();
    if (!fs.existsSync(newDirPath + filepath)) {
      await fsPromises.mkdir(newDirPath + filepath, { recursive: true });
    }
    const fileName = generateFileName();
    wb.write(
      newDirPath + "/" + filepath + "/" + fileName + `.xlsx`,
      function (err) {
        if (err) {
          return {
            ...httpStatus.INTERNAL_SERVER_ERROR,
            data: null,
            error: [err.message],
          };
        }
      }
    );

    return {
      ...httpStatus.SUCCESS,
      data: filepath + "/" + fileName + `.xlsx`,
    };
  } catch (error) {
    return {
      ...httpStatus.INTERNAL_SERVER_ERROR,
      data: null,
      error: [error.message],
    };
  }
};

module.exports = {
  createPDF,
  ejsData,
  createExcel,
  reportPaths,
  reportTemplates,
};
