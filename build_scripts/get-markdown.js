import path from 'path';
import fs from 'fs';
import MarkDownIt from 'markdown-it';

const md = new MarkDownIt();

const options = {
    encoding: 'utf-8'
};

export default pathToData => dataFile => {
    const resolvedPath = path.resolve(pathToData);
    const dataPath = resolvedPath + path.sep;
    const dataFilePath = path.resolve(path.join(dataPath, dataFile));
    if (dataPath !== dataFilePath.slice(0, dataPath.length)) {
        throw new Error(
            'Data path is not in data directory. Abort due potential data disclosure.'
        );
    }
    const text = fs.readFileSync(dataFilePath, options);
    return md.render(text);
};
