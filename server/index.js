const express = require("express");
const cors = require("cors");
const enforce = require('express-sslify');

require("dotenv").config();

const app = express();
const IO_PORT = process.env.PORT || 3000;
const sockets = require("./sockets");
const data = require('./data');

app.use(express.static(`${__dirname}/../public/`));
app.use(cors());

const routes = require("./routes/routes.js");
app.use("/", routes.router);
if (process.env.ENVIRONMENT === "production") {
  app.use(enforce.HTTPS({
    trustProtoHeader: true
  }));
}

let io;
const server = app.listen(IO_PORT, () => console.log("Server started. Listening to port " + IO_PORT));
io = require("socket.io").listen(server);
io.set("transports", ["polling"]);
sockets(io, data.rooms, data.settings, data.images, data.sounds);