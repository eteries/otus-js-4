const fs = require('fs');

const tree = (root = process.argv[2] || "node_modules") => {
    const result = {files: [], folders: []};

    const processFile = (file, cb) => {
        result.files.push(file);
        cb();
    };
    const processFolder = (dir, cb) => {
        process(dir, () => {
          result.folders.push(dir);
          cb();
        });
    };
    const process = (dir, onComplete) => {
        fs.readdir(dir, (err, list) => {
            if (err) throw err;

            let queueLength = list.length;
            !queueLength && onComplete(result);

            const check = () => !--queueLength && onComplete(result);

            list.forEach(element => {
                const path = `${dir}/${element}`;
                fs.stat(path, (err, stats) => {
                    if (err) throw err;
                    stats.isDirectory() ? processFolder(path, check) : processFile(path, check);
                });
            });
        });
    };

    process(root, result => console.log(result));
};

tree();