import * as fs from 'fs'
import path from 'path';

function parseCmdLine(argv) {
    const options = {
        path : null,
        long : false,
        column : false,
        sorted : false
    };

    for (let i = 2; i < argv.length; i++) {
        const arg = argv[i];
        switch (arg) {
            case "-1":
                options.column = true;
                break;
            case "-l":
                options.long = true;
                break;
            case "-t":
                options.sorted = true;
                break;
            default:
                if (options.path != null) {
                    throw `extra argument '${arg}'`;
                }
                const path = fs.realpathSync(arg);
                const stat = fs.lstatSync(path);
                if (stat.isDirectory()) {
                    options.path = path;
                } else {
                    throw `invalid path '${arg}'`
                }
        }
    }
    if (options.path == null) {
        options.path = ".";
    }
    return options;
}

function compareEntriesByMtime(a, b) {
    if (a[0].mtime < b[0].mtime) {
        return -1;
    } else if (a[0].mtime > b[0].mtime) {
        return 1;
    } else {
        return 0;
    }
}

function compareEntriesByMtimeRev(a, b) {
    return - compareEntriesByMtime(a, b);
}

/**
 * 
 * @param {fs.Stats} s 
 * @param {String} p 
 * @param {String} e 
 */
function printStats(s, p, e) {
    let output = "";
    output += s.isDirectory() ? "d" : s.isSymbolicLink() ? "l" : "-";
    let perm = "";
    let num = s.mode;
    for (let i = 0; i < 3; i++) {
        perm = ((num & 1) == 1 ? "x" : "-") + perm;
        num = num / 2; //or num >> 1;
        perm = ((num & 1) == 1 ? "w" : "-") + perm;
        num = num / 2;
        perm = ((num & 1) == 1 ? "r" : "-") + perm;
        num = num / 2;
    }
    output += `${perm} ${s.uid} ${s.gid} ${s.size} ${s.mtime.toISOString()} ${e}`;
    if (s.isSymbolicLink()) {
        const target = fs.readlinkSync(path.join(p));
        output += ` -> ${target}`;
    }
    return output;
}

function main() {
    try {
        const options = parseCmdLine(process.argv);
        const entries = fs.readdirSync(options.path);
        if (entries.length == 0) {
            process.exit(0)
        }
        const list = entries.map((e) => {
            const p = path.join(options.path, e);
            const s = fs.lstatSync(p);
            return [s, p, e];
        });
        if (options.sorted) {
            list.sort(compareEntriesByMtimeRev);
        }
        if (options.long) {
            for (let [s, p, e] of list) {
                process.stdout.write(printStats(s, p, e));
                process.stdout.write("\n");
            }
        } else {
            const sep = options.column ? "\n" : " ";
            for (let [s, p, e] of list) {
                process.stdout.write(e);
                process.stdout.write(sep);
            }
            if (!options.column) process.stdout.write("\n");
        }
    } catch (e) {
        console.log("Erreur :", e);
        process.exit(1);
    }
}

main();