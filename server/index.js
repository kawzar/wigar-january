const express = require("express");
const cors = require("cors");
const enforce = require('express-sslify');

require("dotenv").config();

const app = express();
const IO_PORT = process.env.PORT || 3000;

app.use(express.static(`${__dirname}/../public/`));
app.use(cors());

const data = require("./routes/api/data");
const routes = require("./routes/routes.js");
app.use("/api/data", data.router);
app.use("/", routes.router);
if (process.env.ENVIRONMENT === "production") {
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

let io;
(async () => {
  await Promise.all([data.getRooms(), data.getSettings(), data.getImages(), data.getSounds()]).then((values) => {
    const server = app.listen(IO_PORT, () => console.log("Server started. Listening to port " + IO_PORT));
    io = require("socket.io").listen(server);
    io.set("transports", ["polling"]);
    const sockets = require("./sockets");

    sockets(io, values[0].rooms, values[1].settings, values[2].images, values[3].sounds);
  });
})();
