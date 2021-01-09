//time before disconnecting (forgot the tab open?)
var ACTIVITY_TIMEOUT = 10 * 60 * 1000;

/*
A very rudimentary admin system. 
Reserved usernames and admin pass are stored in .env file as
ADMINS=username1|pass1,username2|pass2

Admin logs in as username|password in the normal field
If combo user|password is correct (case insensitive) mark the player as admin on the server side
The "username|password" remains stored on the client as var nickName 
and it's never shared to other clients, unlike player.nickName

admins can call admin commands from the chat like /kick nickName
*/
let admins = [];
if (process.env.ADMINS != null) admins = process.env.ADMINS.split(",");

//We want the server to keep track of the whole game state
//in this case the game state are the attributes of each player
let gameState = {
  players: {},
  NPCs: {},
};

//a collection of banned IPs
//not permanent, it lasts until the server restarts
let banned = [];

//rate limiting - clears the flood count
setInterval(function () {
  for (var id in gameState.players) {
    if (gameState.players.hasOwnProperty(id)) {
      gameState.players[id].floodCount = 0;
    }
  }
}, 1000);

function validateName(nn) {
  var admin = false;
  var duplicate = false;
  var reserved = false;

  //check if the nickname is a name + password combo
  var combo = nn.split("|");

  //it may be
  if (combo.length > 1) {
    var n = combo[0];
    var p = combo[1];

    for (var i = 0; i < admins.length; i++) {
      if (admins[i].toUpperCase() == nn.toUpperCase()) {
        //it is an admin name! check if the password is correct, case insensitive
        var envCombo = admins[i].split("|");

        if (p == envCombo[1]) admin = true;
      }
    }
    //if there is an | just strip the after
    nn = n;
  }

  //if not admin check if the nickname is reserved (case insensitive)
  if (!admin) {
    for (var i = 0; i < admins.length; i++) {
      var combo = admins[i].split("|");
      if (combo[0].toUpperCase() == nn.toUpperCase()) {
        //it is! kill it. Yes, it should be done at login and communicated
        //but hey I don't have to be nice to users who steal my name
        reserved = true;
      }
    }
  }

  var id = idByName(nn);
  if (id != null) {
    duplicate = true;
    console.log("There is already a player named " + nn);
  }

  //i hate this double negative logic but I hate learning regex more
  var res = nn.match(/^([a-zA-Z0-9 !@#$%&*(),._-]+)$/);

  if (res == null) return 3;
  else if (duplicate || reserved) return 0;
  else if (admin) {
    console.log(nn + " logging as admin");
    return 2;
  } else return 1;
}

//parse a potential admin command
function adminCommand(adminSocket, str) {
  try {
    //remove /
    str = str.substr(1);
    var cmd = str.split(" ");
    switch (cmd[0]) {
      case "kick":
        var s = socketByName(cmd[1]);
        if (s != null) {
          //shadow disconnect
          s.disconnect();
        } else {
          //popup to admin
          adminSocket.emit("popup", "I can't find a user named " + cmd[1]);
        }
        break;

      case "mute":
        var s = idByName(cmd[1]);
        if (s != null) {
          gameState.players[s].muted = true;
        } else {
          //popup to admin
          adminSocket.emit("popup", "I can't find a user named " + cmd[1]);
        }
        break;

      case "unmute":
        var s = idByName(cmd[1]);
        if (s != null) {
          gameState.players[s].muted = false;
        } else {
          //popup to admin
          adminSocket.emit("popup", "I can't find a user named " + cmd[1]);
        }
        break;

      //trigger a direct popup
      case "popup":
        var s = socketByName(cmd[1]);
        if (s != null) {
          //take the rest as string
          cmd.shift();
          cmd.shift();
          var msg = cmd.join(" ");
          s.emit("popup", msg);
        } else {
          //popup to admin
          adminSocket.emit("popup", "I can't find a user named " + cmd[1]);
        }
        break;

      //send fullscreen message to everybody
      case "god":
        cmd.shift();
        var msg = cmd.join(" ");
        io.sockets.emit("godMessage", msg);
        break;

      //disconnect all sockets
      case "nuke":
        for (var id in io.sockets.sockets) {
          io.sockets.sockets[id].emit("errorMessage", "Server Restarted\nPlease Refresh");

          io.sockets.sockets[id].disconnect();
        }
        break;

      //add to the list of banned IPs
      case "ban":
        var IP = IPByName(cmd[1]);
        var s = socketByName(cmd[1]);
        if (IP != "") {
          banned.push(IP);
        }

        if (s != null) {
          s.emit("errorMessage", "You have been banned");
          s.disconnect();
        } else {
          //popup to admin
          adminSocket.emit("popup", "I can't find a user named " + cmd[1]);
        }

        break;

      case "unban":
        //releases the ban
        banned = [];
        break;

      //forces a hard refresh - all players disconnect
      //used to load a new version of the client
      case "refresh":
        io.sockets.emit("refresh");
        break;
    }
  } catch (e) {
    console.log("Error admin command");
    console.error(e);
  }
}

//admin functions, the admin exists in the client frontend so they don't have access to ip and id of other users
function socketByName(nick) {
  var s = null;
  for (var id in gameState.players) {
    if (gameState.players.hasOwnProperty(id)) {
      if (gameState.players[id].nickName.toUpperCase() == nick.toUpperCase()) {
        s = io.sockets.sockets[id];
      }
    }
  }
  return s;
}

function idByName(nick) {
  var i = null;
  for (var id in gameState.players) {
    if (gameState.players.hasOwnProperty(id)) {
      if (gameState.players[id].nickName.toUpperCase() == nick.toUpperCase()) {
        i = id;
      }
    }
  }
  return i;
}

function IPByName(nick) {
  var IP = "";
  for (var id in gameState.players) {
    if (gameState.players.hasOwnProperty(id)) {
      if (gameState.players[id].nickName.toUpperCase() == nick.toUpperCase()) {
        IP = gameState.players[id].IP;
      }
    }
  }
  return IP;
}
//check the last activity and disconnect players that have been idle for too long
setInterval(function () {
  var time = new Date().getTime();

  for (var id in gameState.players) {
    if (gameState.players.hasOwnProperty(id)) {
      if (gameState.players[id].nickName != "" && time - gameState.players[id].lastActivity > ACTIVITY_TIMEOUT) {
        console.log(id + " has been idle for more than " + ACTIVITY_TIMEOUT + " disconnecting");
        io.sockets.sockets[id].emit("refresh");
        io.sockets.sockets[id].disconnect();
      }
    }
  }
}, 1000);

//in my gallery people can swear but not use slurs, override bad-words list, and add my own, pardon for my french
const Filter = require("bad-words");
let myBadWords = [
  "chink",
  "cunt",
  "cunts",
  "fag",
  "fagging",
  "faggitt",
  "faggot",
  "faggs",
  "fagot",
  "fagots",
  "fags",
  "jap",
  "homo",
  "nigger",
  "niggers",
  "n1gger",
  "nigg3r",
  "putas",
  "trolas",
  "put4as",
  "tr0l4s",
];
let filter = new Filter({ emptyList: true });
filter.addWords(...myBadWords);

//p5 style alias
function print(s) {
  console.log(s);
}

/*
  NPC 
  exists in a room
  broadcasts the the same join, leave, move, talk, intro events
  is rendered like and avatar by the client
  is controlled by the server
  */

global.NPC = function (o) {
  console.log("Create NPC " + o.id + " in room " + o.room + " nickNamed " + o.nickName);

  this.id = o.id;
  this.nickName = o.nickName;
  this.room = o.room;
  this.avatar = o.avatar;
  this.colors = o.colors;
  this.x = o.x * 2;
  this.y = o.y * 2;
  this.destinationX = o.x;
  this.destinationY = o.y;

  if (o.labelColor != null) this.labelColor = o.labelColor;
  else this.labelColor = "#FFFFFF"; //oops server doesn't know about colors

  //mimicks the emission from players
  this.sendIntroTo = function (pId) {
    //print("HELLO I"m " + this.nickName + " in " + this.room);
    //If I"m not the new player send an introduction to the new player
    //slight issue, server doesn't compute movements so if moving it appears at the destination
    //a way to solve this would be to save the time of the movement and lerp it
    io.sockets.sockets[pId].emit("onIntro", {
      id: this.id,
      nickName: this.nickName,
      colors: this.colors,
      avatar: this.avatar,
      room: this.room,
      x: this.destinationX,
      y: this.destinationY,
      destinationX: this.destinationX,
      destinationY: this.destinationY,
    });
  };

  this.move = function (dx, dy) {
    //print("HELLO I'm " + this.nickName + " and I move to " + dx + " " + dy);
    //broadcast the movement to everybody in the room
    //it doesn't check if the position is valid
    io.to(this.room).emit("playerMoved", {
      id: this.id,
      x: this.x,
      y: this.y,
      destinationX: dx,
      destinationY: dy,
    });

    //update for future intros
    this.destinationX = this.x = dx;
    this.destinationY = this.y = dy;
  };

  this.talk = function (message) {
    io.to(this.room).emit("playerTalked", {
      id: this.id,
      color: this.labelColor,
      message: message,
      x: this.x,
      y: this.y,
    });
  };

  this.delete = function () {
    io.to(this.room).emit("playerLeft", {
      id: this.id,
      room: this.room,
      disconnect: true,
    });
    delete gameState.NPCs[this.id];
  };

  //add to NPC list
  gameState.NPCs[this.id] = this;
};

module.exports = {
  validateName,
  adminCommand,
  socketByName,
  idByName,
  IPByName,
  filter,
  gameState,
  admins,
};
