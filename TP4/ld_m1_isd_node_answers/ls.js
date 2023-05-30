const fs = require ('fs');
const path = require ('path');
const uid_resolve = require ('./uid_resolve.js');

function printPerm(perm) {
  let r = (perm & 4) != 0 ? "r" : "-";
  let w = (perm & 2) != 0 ? "w" : "-";
  let x = (perm & 1) != 0 ? "x" : "-";
  return r + w + x;
}

function printStats(stat, path, name) {

  let t = "-";
  if (stat.isDirectory()) {
    t = "d";
  } else if (stat.isSymbolicLink()) {
    t = "l";
    let target = fs.readlinkSync(path)
    name = `${name} -> ${target}`
  };

  let u = printPerm (stat.mode >> 6);
  let g = printPerm (stat.mode >> 3);
  let o = printPerm (stat.mode);

  let user =  uid_resolve.getUserName(stat.uid);

  let group = uid_resolve.getGroupName(stat.gid);

  let size = stat.size;

  let mtime = stat.mtime.toISOString();

  return `${t}${u}${g}${o} ${user} ${group} ${size} ${mtime} ${name}`
}


/* Question 1 */
function parseCmdLine(argv) {
  let conf = {
    path : ".",
    column : false,
    long : false,
    sorted : false
  };

  for (let i = 2; i < argv.length; i++) {
    switch (argv[i]) {
      case "-l":
        conf.long = true;
        conf.column = true;
        break;
      case "-1":
        conf.column = true;
        break;
      case "-t":
        conf.sorted = true;
        break;
      default:
        try {
          let p = fs.realpathSync(argv[i]);
          if (fs.lstatSync(p).isDirectory()) {
            conf.path = p;
          }
        } catch (e) {};
    }
  };
  return conf;
}

function main () {
  /* Question 1 */
  let conf = parseCmdLine(process.argv);
  /* Uniquement pour q1 puis commenter par la suite */
  /* console.log(conf) */

  /* Question 2 */
  let entries = fs.readdirSync(conf.path);

  /* Question 2 */
  if (entries.length == 0) return;


  /* Question 2 */
  entries = entries.map ((e) => {
    let fullPath = path.join(conf.path, e);
    return [ fs.lstatSync(fullPath), fullPath, e];
  });

  /* Question 3 */
  if (conf.sorted) {
    entries.sort((a, b) => a[0].mtime > b[0].mtime ? -1 : a[0].mtime < b[0].mtime ? 1 : 0);
  }

  let strEntries;

  if (conf.long) {
    strEntries = entries.map((e) => printStats(e[0], e[1], e[2]));
  } else {

  /* Question 2 */
    strEntries = entries.map (e => e[2]);
  }


  /* Question 2 */
  sep = conf.column ? "\n" : " ";


  /* Question 2 */
  process.stdout.write(strEntries[0]);


  /* Question 2 */
  for (let i = 1; i < strEntries.length; i++) {
    process.stdout.write(sep);
    process.stdout.write(strEntries[i]);
  }

  /* Question 2 */
  process.stdout.write("\n");

}

main ();