/*
WARNING: THIS IS STILL EXPERIMENTAL STUFF
I want to have the ability to assign specific behaviors to each room without messing with the main engine
So I'm creating a module for server-side modifications (mods). There is one also for the client.
Their naming convention is roomIdFunction.
The functions are called by the engine at crucial points, only if they exist.
*/

let io;
let gameState;

//called at the beginning
module.exports.initMod = function (theIo, theGameState) {
  io = theIo;
  gameState = theGameState;
  console.log("MOD: Initialized");
};

module.exports.onDrinkInteract = function (pId) {
  console.log("emiting drink");
  io.sockets.emit("drinkInteracted", {
    id: pId,
  });
};

module.exports.onBeerInteract = function (pId) {
  io.sockets.emit("beerInteracted", {
    id: pId,
  });
};

module.exports.onBeerFinished = function (pId) {
  io.sockets.emit("beerInteracted", {
    id: pId,
  });
};

module.exports.onBeerFinished = function (pId) {
  io.sockets.emit("beerFinished", {
    id: pId,
  });
};

module.exports.onGibberishInteracted = function (pId) {
  io.sockets.emit("gibberishInteracted", {
    id: pId,
  });
};

module.exports.onGibberishFinished = function (pId) {
  io.sockets.emit("gibberishFinished", {
    id: pId,
  });
};