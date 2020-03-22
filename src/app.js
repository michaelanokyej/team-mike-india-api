require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const errorHandler = require("./error-handler");
const userRouter = require("./components/user-router");
const mentorRouter = require("./components/mentor-router");
const menteeRouter = require("./components/mentee-router");
const postRouter = require("./components/post-router");
// const channelRouter = require("./components/channel-router");
const messageRouter = require("./components/message-router");
const commentRouter = require("./components/comment-router");
const authRouter = require("./components/auth-router");
const userFollowersRouter = require("./components/user-followers-router");

const app = express();

app.use(
  morgan(NODE_ENV === "production" ? "tiny" : "common", {
    skip: () => NODE_ENV === "test"
  })
);

app.use(helmet());
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/mentors", mentorRouter);
app.use("/api/mentees", menteeRouter);
app.use("/api/posts", postRouter);
app.use("/api/userfollowers", userFollowersRouter);
// app.use("/api/chat", channelRouter);
app.use("/api/messages", messageRouter);
app.use("/api/comments", commentRouter);
app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use(errorHandler);

module.exports = app;
