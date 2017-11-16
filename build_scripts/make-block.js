'use strict';

import fs from 'fs';
import path from 'path';
import { createInterface } from 'readline';
import { paths } from './settings';

const rl = createInterface(process.stdin, process.stdout);

// folder with all blocks
console.log(paths.src.components);
const BLOCKS = path.basename(paths.src.components);
const ROOT_DIR = path.basename(paths.src.root);
const BLOCKS_DIR = paths.src.components;
const BLOCK_IMPORT_FILE = '_block-import.scss'
// //////////////////////////////////////////////////////////////////////////////////////////////////

// default content for files in new block
const fileSources = {
	pug: `mixin {blockName}()\n\u0020\u0020\u0020\u0020+b.{blockName}&attributes(attributes)\n\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020| {blockName}\n`,
	scss: `.{blockName} {\n\u0020\u0020\u0020\u0020display: block;\n}\n`
};

function getImportData(importFile, blockName, pageName) {
	return new Promise((resolve, reject) => {
		fs.readFile(importFile, 'utf8', (err, data) => {
			const res = `@import "${ROOT_DIR}/${BLOCKS}/${pageName}${blockName}/${blockName}";\n`;
			if (err) {
				if(err.code === 'ENOENT'){
					resolve(res);
				}
				else {
					reject(`ERR>>> Failed to read a import file '${importFile}'`);
				}
			} else {
				//console.log(data);
				//data.write(`@import ${blockName}`);
				const alreadyHasImport = new RegExp(`${blockName}/${blockName}`).test(data);
				if (alreadyHasImport) {
					reject(`Block ${blockName} is already imported`);
				} else {
					resolve(data + res);
				}
			}

		});
	});

}

function createImportFile(filePath, blockData) {
	return new Promise((resolve, reject) => {
		fs.writeFile(filePath, blockData, 'utf8', err => {
			if (err) {
				reject(`ERR>>> Failed to create a file '${filePath}'`);
			} else {
				resolve();
			}
		});
	});
}

function validateBlockName(blockName) {
	return new Promise((resolve, reject) => {
		const isValid = /^(\d|\w|-|\/)+$/.test(blockName);

		if (isValid) {
			resolve(isValid);
		} else {
			const errMsg = (
				`ERR>>> An incorrect block name '${blockName}'\n` +
				`ERR>>> A block name must include letters, numbers & the minus symbol.`
			);
			reject(errMsg);
		}
	});
}

function directoryExist(blockPath, blockName) {
	return new Promise((resolve, reject) => {
		fs.stat(blockPath, notExist => {
			if (notExist) {
				resolve();
			} else {
				reject(`ERR>>> The block '${blockName}' already exists.`);
			}
		});
	});
}

function createDir(dirPath) {
	return new Promise((resolve, reject) => {
		fs.mkdir(dirPath, err => {
			if (err) {
				reject(`ERR>>> Failed to create a folder '${dirPath}'`);
			} else {
				resolve();
			}
		});
	});
}

function createFiles(blocksPath, blockName) {
	const promises = [];
	Object.keys(fileSources).forEach(ext => {
		const fileSource = fileSources[ext].replace(/\{blockName}/g, blockName);
		const filename = ((ext === 'pug') ? '' : '_') + `${blockName}.${ext}`;
		const filePath = path.join(blocksPath, filename);

		promises.push(
			new Promise((resolve, reject) => {
				fs.writeFile(filePath, fileSource, 'utf8', err => {
					if (err) {
						reject(`ERR>>> Failed to create a file '${filePath}'`);
					} else {
						resolve();
					}
				});
			})
		);
	});

	return Promise.all(promises);
}

function getFiles(blockPath) {
	return new Promise((resolve, reject) => {
		fs.readdir(blockPath, (err, files) => {
			if (err) {
				reject(`ERR>>> Failed to get a file list from a folder '${blockPath}'`);
			} else {
				resolve(files);
			}
		});
	});
}

function printErrorMessage(errText) {
	console.log(errText);
	rl.close();
}

// //////////////////////////////////////////////////////////////////////////

function initMakeBlock(blockName, pageName) {
	const blockPath = path.join(BLOCKS_DIR, pageName, blockName);
	const importFile = path.join(BLOCKS_DIR, BLOCK_IMPORT_FILE);
	if (pageName !== '') {
		pageName = pageName + '/';
	}
	return validateBlockName(blockName)
		.then(() => directoryExist(blockPath, blockName))
		.then(() => createDir(blockPath))
		.then(() => createFiles(blockPath, blockName))
		.then(() => getFiles(blockPath))
		.then(files => {
			const line = '-'.repeat(48 + blockName.length);
			console.log(line);
			console.log(`The block has just been created in '${BLOCKS_DIR}/${blockName}'`);
			console.log(line);

			// Displays a list of files created
			files.forEach(file => console.log(file));

			rl.close();
		})
		.then(() => getImportData(importFile, blockName, pageName))
		.then(data => createImportFile(importFile, data));
}


// //////////////////////////////////////////////////////////////////////////
//
// Start here
//

// Command line arguments
const blockNameFromCli = process.argv[2];
const pageNameFromCli = process.argv[3] || '';

	//.slice(2);
	// join all arguments to one string (to simplify the capture user input errors)
	//.join(' ');


// If the user pass the name of the block in the command-line options
// that create a block. Otherwise - activates interactive mode
if (blockNameFromCli !== '') {
	initMakeBlock(blockNameFromCli, pageNameFromCli).catch(printErrorMessage);
} else {
	rl.setPrompt('Block name: ');
	rl.prompt();
	rl.on('line', (line) => {
		const blockName = line.trim();
		initMakeBlock(blockName).catch(printErrorMessage);
	});
}