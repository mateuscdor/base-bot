const chats = require("./chats");
const groups = require("./groups");
const groupsUpdate = require("./groupsUpdate");
const members = require("./members");
const messages = require("./messages");
const connection = require("./connection");

module.exports = {
  messages,
  connection,
  groupsUpdate,
  groups,
  members,
  chats,
};
