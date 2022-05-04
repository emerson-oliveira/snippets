/* eslint-disable no-console */

const fs = require('fs');
const { resolve, isAbsolute } = require('path');
const AmpHtmlValidator = require('amphtml-validator');

const filesPath = resolve(__dirname, 'dist', 'server', 'pages');
const REGEX_AMP_PAGE = /\.amp\.html$/g;

function isFolder(pathFolder) {
  try {
    return !!fs.lstatSync(pathFolder).isDirectory();
  } catch (error) {
    return false;
  }
}

const removeAbsolutePath = (fullPath = '') =>
  fullPath.replace(resolve(__dirname), '');

function getFilesFromPath(pathToAnalyse) {
  const files = [];

  const extractPathFromFiles = (pathFolder) => {
    const folderContent = fs.readdirSync(pathFolder);

    folderContent.forEach((item) => {
      const itemPath = resolve(pathFolder, item);

      if (REGEX_AMP_PAGE.test(item)) {
        files.push(itemPath);
      }

      if (isFolder(itemPath)) {
        extractPathFromFiles(itemPath);
      }
    });
  };

  extractPathFromFiles(pathToAnalyse);

  return files;
}

async function validatePage(html, pagePath) {
  const validator = await AmpHtmlValidator.getInstance();
  const result = validator.validateString(html);

  if (result.status === 'FAIL') {
    console.error(
      `> ERRO! -> ${JSON.stringify({
        status: result.status,
        file: removeAbsolutePath(pagePath),
        errors: result.errors.reduce((acc, curr) => {
          acc.push(
            `> line ${curr.line}, col ${curr.col}: ${curr.message} ${
              curr.specUrl ? ` - see ${curr.specUrl}` : ''
            }`
          );
          return acc;
        }, [])
      })}`
    );
    return;
  }

  console.log(`> ${removeAbsolutePath(pagePath)} - AMP VALIDATION PASSED ⚡`);
}

(function (folderToAnalyze) {
  if (isAbsolute(folderToAnalyze) && isFolder(folderToAnalyze)) {
    const filesRawPath = getFilesFromPath(folderToAnalyze);

    if (filesRawPath.length === 0) {
      console.warn(`
        ******************** AMP VALIDATOR WARNING ⚡ ******************** \n
        > ${removeAbsolutePath(
          folderToAnalyze
        )} - PATH IS WITHOUT AMP PAGES   \n
        ****************************************************************
      `);
      return;
    }

    console.log(
      `***************** AMP VALIDATION IS RUNNING ⚡ ***************** \n`
    );
    filesRawPath.forEach(async (filePath) => {
      const rawFile = fs.readFileSync(filePath, 'utf8');
      await validatePage(rawFile, filePath);
    });
  } else {
    console.error(`
      ******************** AMP VALIDATOR ERROR ⚡ ******************** \n
      > ${removeAbsolutePath(
        folderToAnalyze
      )} - does not exist, please check.                               \n
      > SUGESTION: run build                                           \n
      ****************************************************************
    `);
  }
})(filesPath);
