const child_process = require ('child_process');

function readFromGetent(map, value, field) {

  try {

    let output = child_process.execSync (`getent ${map} ${value}`, {encoding : "utf-8"});
    let result = output.split(":");
    if (result.length > field) {
      return result[field];
    } else {
      throw `Invalid field ${field} in readFromGetent`;
    }
  } catch (e) {
    console.error(e);
    return value;
  }

};

const userNameCache = {};
const groupNameCache = {};

function getUserName(uid) {
  if (userNameCache.hasOwnProperty(uid)) {
    return userNameCache[uid];
  } else {
    return userNameCache[uid] = readFromGetent("passwd", uid, 0);
  }
};
module.exports.getUserName = getUserName;


function getGroupName(gid) {
  if (groupNameCache.hasOwnProperty(gid)) {
    return groupNameCache[gid];
  } else {
    return groupNameCache[gid] = readFromGetent("group", gid, 0);
  }
};

module.exports.getGroupName = getGroupName;