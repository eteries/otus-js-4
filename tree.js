const fs = require('fs');

const tree = () => {
    const result = {files: [], folders: []};
    const process = (dir, onComplete) => {
        fs.readdir(dir, (err, list) => {
            if (err) throw err;

            let queueLength = list.length;
            !queueLength && onComplete(result);

            const processFile = file => {
                result.files.push(file);
                !--queueLength && onComplete(result);
            };
            const processFolder = dir => {
                process(dir, () => {
                    result.folders.push(dir);
                    !--queueLength && onComplete(result);
                });
            };

            list.forEach(element => {
                const path = `${dir}/${element}`;
                fs.stat(path, (err, stats) => {
                    if (err) throw err;
                    stats.isDirectory() ? processFolder(path) : processFile(path);
                });
            });
        });
    };

    process('node_modules', result => console.log(result));
};

tree();