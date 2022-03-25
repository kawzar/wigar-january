let moment = require("moment");
let game = require("./game");
let filter = game.filter;

//should be the same as index maxlength="16"
let MAX_NAME_LENGTH = 32;

//cap the overall players
let MAX_PLAYERS = -1;

//refuse people when a room is full
let MAX_PLAYERS_PER_ROOM = 200;

//save the server startup time and send it in case the clients need to syncronize something
let START_TIME = moment().toDate();

let VERSION = "1.0";

//views since the server started counts relogs
let visits = 0;

let banned = [];

exports = module.exports = function (io, rooms, settings, images, sounds) {
  // //modding
  var MOD = {};
  //load server side mod file
  try {
    MOD = require("./gameMod");

    if (MOD.initMod != null) {
      MOD.initMod(io, game.gameState);
    }
  } catch (e) {
    console.log(e);
  }

  //when a client connects the socket is established and I set up all the functions listening for events
  io.on("connection", function (socket) {
    //this bit (middleware?) catches all incoming packets
    //I use to make my own lil rate limiter without unleashing 344525 dependencies
    //a rate limiter prevents malicious flooding from a hacked client

    socket.use((packet, next) => {
      if (game.gameState.players[socket.id] != null) {
        var p = game.gameState.players[socket.id];
        p.floodCount++;
        if (p.floodCount > settings.PACKETS_PER_SECONDS) {
          console.log(socket.id + " is flooding! BAN BAN BAN");

          if (p.IP != "") {
            //comment this if you don't want to ban the IP
            banned.push(p.IP);
            socket.emit("errorMessage", "Flooding attempt! You are banned");
            socket.disconnect();
          }
        }
      }
      next();
    });

    //this appears in the terminal
    console.log("A user connected");

    let data = {
      rooms: rooms,
      sounds: sounds,
      settings: settings,
      images: images
    };

    //this is sent to the client upon connection
    socket.emit("serverWelcome", VERSION, data, START_TIME);
    //wait for the player to send their name and info, then broadcast them
    socket.on("join", function (playerInfo) {
      //console.log("Number of sockets " + Object.keys(io.sockets.connected).length);

      try {
        //if running locally it's not gonna work
        var IP = "";
        //oh look at this beautiful socket.io to get an goddamn ip address
        if (socket.handshake.headers != null)
          if (socket.handshake.headers["x-forwarded-for"] != null) {
            IP = socket.handshake.headers["x-forwarded-for"].split(",")[0];
          }

        if (playerInfo.nickName == "") console.log("New user joined the server in lurking mode " + socket.id + " " + IP);
        else
          console.log(
            "New user joined the game: " + playerInfo.nickName + " avatar# " + playerInfo.avatar + " colors# " + playerInfo.colors + " " + socket.id
          );

        var roomPlayers = 1;
        var myRoom = io.sockets.adapter.rooms[playerInfo.room];
        if (myRoom != undefined) {
          roomPlayers = myRoom.length + 1;
          console.log("There are now " + roomPlayers + " users in " + playerInfo.room);
        }

        var serverPlayers = Object.keys(io.sockets.connected).length + 1;

        var isBanned = false;

        //prevent banned IPs from joining
        if (IP != "") {
          var index = banned.indexOf(IP);
          //found
          if (index > -1) {
            console.log("ATTENTION: banned " + IP + " is trying to log in again");
            isBanned = true;
            socket.emit("errorMessage", "You have been banned");
            socket.disconnect();
          }
        }

        //prevent secret rooms to be joined through URL
        if (rooms && rooms[playerInfo.room] != null) {
          if (
            rooms[playerInfo.room].secret == true ||
            moment().isBetween(moment(rooms[playerInfo.room].startDate), moment(rooms[playerInfo.room].endDate))
          ) {
            playerInfo.room = settings.defaultRoom;
          }
        }

        if (isBanned) {}
        //prevent a hacked client from duplicating players
        else if (game.gameState.players[socket.id] != null) {
          console.log("ATTENTION: there is already a player associated to the socket " + socket.id);
        } else if ((serverPlayers > MAX_PLAYERS && MAX_PLAYERS != -1) || (roomPlayers > MAX_PLAYERS_PER_ROOM && MAX_PLAYERS_PER_ROOM != -1)) {
          //limit the number of players
          console.log("ATTENTION: " + playerInfo.room + " reached maximum capacity");
          socket.emit("errorMessage", "The server is full, please try again later.");
          socket.disconnect();
        } else {
          //if client hacked truncate
          if (playerInfo.nickName.length > MAX_NAME_LENGTH) playerInfo.nickName = playerInfo.nickName.substring(0, MAX_NAME_LENGTH);

          //the first validation was to give the player feedback, this one is for real
          var val = 1;

          //always validate lurkers, they can't do anything
          if (playerInfo.nickName != "") val = game.validateName(playerInfo.nickName);

          if (val == 0 || val == 3) {
            console.log("ATTENTION: " + socket.id + " tried to bypass username validation");
          } else {
            //if there is an | strip the after so the password remains in the admin client
            var combo = playerInfo.nickName.split("|");
            playerInfo.nickName = combo[0];

            if (val == 2) console.log(playerInfo.nickName + " joins as admin");

            //the player objects on the client will keep track of the room
            var newPlayer = {
              id: socket.id,
              nickName: filter.clean(playerInfo.nickName),
              colors: playerInfo.colors,
              room: playerInfo.room,
              avatar: playerInfo.avatar,
              x: playerInfo.x,
              y: playerInfo.y,
            };

            //save the same information in my game state
            game.gameState.players[socket.id] = newPlayer;
            //set last message at the beginning of time, the SEVENTIES
            game.gameState.players[socket.id].lastMessage = 0;
            //is it admin?
            game.gameState.players[socket.id].admin = val == 2 ? true : false;
            game.gameState.players[socket.id].spam = 0;
            game.gameState.players[socket.id].lastActivity = new Date().getTime();
            game.gameState.players[socket.id].muted = false;
            game.gameState.players[socket.id].IP = IP;
            game.gameState.players[socket.id].floodCount = 0;
            game.gameState.players[socket.id].room = playerInfo.room;

            //send the user to the default room
            socket.join(playerInfo.room, function () {
              //console.log(socket.rooms);
            });

            newPlayer.new = true;

            //let"s not count lurkers
            if (playerInfo.nickName != "") {
              visits++;
              analytics.logVisitor(IP);
            }

            //send all players information about the new player
            //upon creation destination and position are the same
            io.to(playerInfo.room).emit("playerJoined", newPlayer);

            //check if there are NPCs in this room and make them send info to the player
            for (var NPCId in game.gameState.NPCs) {
              var npc = game.gameState.NPCs[NPCId];

              if (npc.room == playerInfo.room) {
                npc.sendIntroTo(socket.id);
              }
            }

            //check if there is a custom function in the MOD to call at this point
            if (MOD[playerInfo.room + "Join"] != null) {
              //call it!
              MOD[playerInfo.room + "Join"](newPlayer, playerInfo.room);
            }

            console.log("There are now " + Object.keys(game.gameState.players).length + " players on this server. Total visits " + visits);

            analytics.getTotalVisits().then((total) => {
              console.log(total);
              io.sockets.emit("playerAmount", {
                current: Object.keys(game.gameState.players).length,
                total: total
              });
            });
          }
        }
      } catch (e) {
        console.log("Error on join, object malformed from" + socket.id + "?");
        console.error(e);
      }
    });

    //when a client disconnects I have to delete its player object
    //or I would end up with ghost players
    socket.on("disconnect", function () {
      try {
        console.log("Player disconnected " + socket.id);

        var playerObject = game.gameState.players[socket.id];

        io.sockets.emit("playerLeft", {
          id: socket.id,
          disconnect: true
        });

        //check if there is a custom function in the MOD to call at this point
        if (playerObject != null)
          if (playerObject.room != null) {
            if (MOD[playerObject.room + "Leave"] != null) {
              //call it!
              MOD[playerObject.room + "Leave"](playerObject, playerObject.room);
            }
          }

        //send the disconnect
        //delete the player object
        delete game.gameState.players[socket.id];
        console.log("There are now " + Object.keys(game.gameState.players).length + " players on this server");
        io.sockets.emit("playerAmount", {
          current: Object.keys(game.gameState.players).length,
          total: visits
        });
      } catch (e) {
        console.log("Error on disconnect, object malformed from" + socket.id + "?");
        console.error(e);
      }
    });

    //when I receive an intro send it to the recipient
    socket.on("intro", function (newComer, obj) {
      //verify the id to make sure a hacked client can"t fake players
      if (obj != null) {
        if (obj.id == socket.id) {
          io.to(newComer).emit("onIntro", obj);

          if (MOD[obj.room + "Intro"] != null) {
            MOD[obj.room + "Intro"](newComer, obj);
          }
        } else {
          console.log("ATTENTION: Illegitimate intro from " + socket.id);
        }
      }
    });

    //when I receive a talk send it to everybody in the room
    socket.on("talk", function (obj) {
      try {
        var time = new Date().getTime();

        //block if spamming
        if (time - game.gameState.players[socket.id].lastMessage > settings.ANTI_SPAM && !game.gameState.players[socket.id].muted) {
          //Admin commands can be typed as messages
          //is this an admin
          if (game.gameState.players[socket.id].admin && obj.message.charAt(0) == "/") {
            console.log("Admin " + game.gameState.players[socket.id].nickName + " attempts command " + obj.message);
            game.adminCommand(socket, obj.message);
          } else {
            //normal talk stuff

            //aphostrophe
            obj.message = obj.message.replace("’", "'");

            //replace unmapped characters
            obj.message = obj.message.replace(/[^A-Za-z0-9_!$%*()@./#&+-|]*$/g, "");

            //remove leading and trailing whitespaces
            obj.message = obj.message.replace(/^\s+|\s+$/g, "");
            //filter bad words
            obj.message = filter.clean(obj.message);
            //advanced cleaning

            //f u c k
            var test = obj.message.replace(/\s/g, "");
            //fffffuuuuck
            var test2 = obj.message.replace(/(.)(?=.*\1)/g, "");
            //f*u*c*k
            var test3 = obj.message.replace(/\W/g, "");
            //spaces
            var test4 = obj.message.replace(/\s/g, "");

            if (filter.isProfane(test) || filter.isProfane(test2) || filter.isProfane(test3) || test4 == "") {
              console.log(socket.id + " is problematic");
            } else {
              //check if there is a custom function in the MOD to call at this point
              if (MOD[obj.room + "TalkFilter"] != null) {
                //call it!
                obj.message = MOD[obj.room + "TalkFilter"](game.gameState.players[socket.id], obj.message);

                if (obj.message == null) {
                  console.log("MOD: Warning - TalkFilter should return a message ");
                  obj.message = "";
                }
              }

              if (obj.message != "")
                io.to(obj.room).emit("playerTalked", {
                  id: socket.id,
                  color: obj.color,
                  message: obj.message,
                  x: obj.x,
                  y: obj.y,
                });
            }
          }

          //update the last message time
          if (game.gameState.players[socket.id] != null) {
            game.gameState.players[socket.id].lastMessage = time;
            game.gameState.players[socket.id].lastActivity = time;
          }
        }
      } catch (e) {
        console.log("Error on talk, object malformed from" + socket.id + "?");
        console.error(e);
      }
    });

    //when I receive a move sent it to everybody
    socket.on("changeRoom", function (obj) {
      try {
        var roomPlayers = 1;
        var myRoom = io.sockets.adapter.rooms[obj.to];
        if (myRoom != undefined) {
          roomPlayers = myRoom.length + 1;
        }

        if (roomPlayers > MAX_PLAYERS_PER_ROOM && MAX_PLAYERS_PER_ROOM != -1) {
          //limit the number of players
          console.log("ATTENTION: " + obj.to + " reached maximum capacity");
          //keep the player in game, send a message
          socket.emit("godMessage", "The room looks full");
        } else {
          //console.log("Player " + socket.id + " moved from " + obj.from + " to " + obj.to);

          socket.leave(obj.from);
          socket.join(obj.to);

          //broadcast the change to everybody in the current room
          //from the client perspective leaving the room is the same as disconnecting
          io.to(obj.from).emit("playerLeft", {
            id: socket.id,
            room: obj.from,
            disconnect: false,
          });

          //same for joining, sending everybody in the room the player state
          var playerObject = game.gameState.players[socket.id];
          playerObject.room = obj.to;
          playerObject.x = playerObject.destinationX = obj.x;
          playerObject.y = playerObject.destinationY = obj.y;
          playerObject.new = false;

          //check if there is a custom function in the MOD to call at this point
          if (MOD[obj.from + "Leave"] != null) {
            //call it!
            MOD[obj.from + "Leave"](playerObject, obj.from);
          }

          io.to(obj.to).emit("playerJoined", playerObject);

          //check if there is a custom function in the MOD to call at this point
          if (MOD[obj.to + "Join"] != null) {
            //call it!
            MOD[obj.to + "Join"](playerObject, obj.to);
          }

          //check if there are NPCs in this room and make them send info to the player
          for (var NPCId in game.gameState.NPCs) {
            var npc = game.gameState.NPCs[NPCId];

            if (npc.room == obj.to) {
              npc.sendIntroTo(socket.id);
            }
          }
        }
      } catch (e) {
        console.log("Error on join, object malformed from" + socket.id + "?");
        console.error(e);
      }
    });

    //when I receive a move sent it to everybody
    socket.on("move", function (obj) {
      try {
        game.gameState.players[socket.id].lastActivity = new Date().getTime();

        //broadcast the movement to everybody
        io.to(obj.room).emit("playerMoved", {
          id: socket.id,
          x: obj.x,
          y: obj.y,
          destinationX: obj.destinationX,
          destinationY: obj.destinationY,
        });
      } catch (e) {
        console.log("Error on join, object malformed from" + socket.id + "?");
        console.error(e);
      }
    });

    //when I receive a user name validate it
    socket.on("sendName", function (nn) {
      try {
        var res = game.validateName(nn);

        //send the code 0 no - 1 ok - 2 admin
        socket.emit("nameValidation", res);
      } catch (e) {
        console.log("Error on sendName " + socket.id + "?");
        console.error(e);
      }
    });

    //when a character emote animation changes
    socket.on("emote", function (obj) {
      try {
        io.to(obj.room).emit("playerEmoted", socket.id, obj.em);
      } catch (e) {
        console.log("Error on emote " + socket.id + "?");
        console.error(e);
      }
    });

    //user afk
    socket.on("focus", function (obj) {
      try {
        //console.log(socket.id + " back from AFK");
        io.to(obj.room).emit("playerFocused", socket.id);
      } catch (e) {
        console.log("Error on focus " + socket.id + "?");
        console.error(e);
      }
    });

    socket.on("blur", function (obj) {
      try {
        //console.log(socket.id + " is AFK");
        io.to(obj.room).emit("playerBlurred", socket.id);
      } catch (e) {
        console.log("Error on blur " + socket.id + "?");
        console.error(e);
      }
    });

    //generic action listener, looks for a function with that id in the mod
    socket.on("action", function (aId) {
      if (MOD["on" + aId] != null) {
        //call it!
        //console.log("on" + aId + " exists in the mod, call it");
        MOD["on" + aId](socket.id);
      }
    });
  });
};