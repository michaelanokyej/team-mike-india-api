// const express = require("express");
// const path = require("path");
// const xss = require("xss");
// const channelRouter = express.Router();
// const bodyParser = express.json();
// const logger = require("../logger");
// const { addUser, removeUser, getUser, getUsersInChannel } = require("./channel-service");
// const app = require("../app");
// const socketio = require("socket.io");
// // const http = require("http");
// const config = require("../config");
// const { getChannelValidationError } = require("./channel-validator");
// const jwt = require("jsonwebtoken");


// var server = require("http").createServer(onRequest);
// var io = require("socket.io")(server, {handlePreflightRequest: (req, res) => {
//   const headers = {
//       "Access-Control-Allow-Headers": "Content-Type, Authorization",
//       "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
//       "Access-Control-Allow-Credentials": true
//   };
//   res.writeHead(200, headers);
//   res.end();
// }});

// // Make the express server use sockets
// // const server = http.createServer(app);

// // Create an instance of the socket
// // const io = socketio(server);

// function onRequest(req,res){
//   res.writeHead(200, {
//   'Access-Control-Allow-Origin' : '*'
//   });
//   };

// io.on("connection", socket => {
//   // io.origins(['*']);

//   console.log("we have a new connection!!!");

//   socket.on("join", ({ name, channel }, callback) => {
//     // the addUser service returns either
//     // an error property or a user property
//     const { error, user } = addUser({ id: socket.id, name, channel });

//     // if there is an error, our callback fn will
//     // dynamically use the error object from our service
//     if (error) return callback(error);

//     // send the new user a welcome message
//     socket.emit("message", {
//       user: "admin",
//       text: `${user.name}, welcome to the ${user.channel} channel`
//     });

//     // Notify all users about the new user
//     socket.broadcast.to(user.channel).emit("message", {
//       user: "admin",
//       text: `${user.name} has joined the channel!`
//     });

//     socket.join(user.channel);

//     io.to(user.channel).emit("channelData", {
//       channel: user.channel,
//       users: getUsersInChannel(user.channel)
//     });

//     callback();
//   });

//   // NB: the admin generated message is "message"  and
//   // the user generated message is "sendMessage"

//   socket.on("sendMessage", (message, callback) => {
//     const user = getUser(socket.id);

//     io.to(user.channel).emit("message", { user: user.name, text: message });
//     io.to(user.channel).emit("channelData", {
//       channel: user.channel,
//       users: getUsersInChannel(user.channel)
//     });

//     callback();
//   });

//   socket.on("disconnect", () => {
//     const user = removeUser(socket.id);

//     if (user) {
//       io.to(user.channel).emit("message", {
//         user: "admin",
//         text: `${user.name} left`
//       });
//     }
//   });
// });

// channelRouter
// .route("/")
// .get((req, res, next) => {
//   res.send("server is running");
// });

// // app.use(router);

// // server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));

// module.exports = channelRouter;
