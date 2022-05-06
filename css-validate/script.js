/* eslint-disable no-console */

const fs = require('fs');
const { resolve, isAbsolute } = require('path');

const filesPath = resolve(__dirname, 'dist', 'server', 'pages');
const REGEX_HTML_PAGE = /[^.amp.html].html$/g;

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

      if (REGEX_HTML_PAGE.test(item)) {
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
  const styles = html.match(/<style(.|\n)*?<\/style>/gm);
  const erros = [...styles].filter((item) => item.match(/undefined/gm), []);
  if (erros.length > 0) {
    console.log(
      '\x1b[36m',
      `\nEstilo(s) com elemento não definido - ${removeAbsolutePath(pagePath)}`
    );

    erros.forEach((item) => {
      item = item.replace('undefined', '\x1b[31mundefined\x1b[33m');
      console.log('\x1b[33m', `${item}`, '\x1b[00m');
    });
  }
}

(function validator(folderToAnalyze) {
  if (isAbsolute(folderToAnalyze) && isFolder(folderToAnalyze)) {
    const filesRawPath = getFilesFromPath(folderToAnalyze);
    console.log(
      '***************** 🔥 CSS VALIDATION IS RUNNING 🔥 *****************'
    );

    filesRawPath.forEach(async (filePath) => {
      const rawFile = fs.readFileSync(filePath, 'utf8');
      await validatePage(rawFile, filePath);
    });

    console.log(
      `\x1b[36minfo\x1b[00m - Verified pages: ${filesRawPath.length}\n***************** 🔥 CSS VALIDATION IS COMPLETED 🔥 *****************`
    );
  } else {
    console.error(`
      ******************** 🔥 CSS VALIDATION IS WITH ERROR 🔥 ******************** \n
      > ${removeAbsolutePath(
        folderToAnalyze
      )} - does not exist, please check.                               \n
      > SUGESTION: run build                                           \n
      ****************************************************************
    `);
  }
})(filesPath);
