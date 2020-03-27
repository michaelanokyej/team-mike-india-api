require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const errorHandler = require("./error-handler");
const userRouter = require("./components/users/user-router");
const mentorRouter = require("./components/mentor/mentor-router");
const menteeRouter = require("./components/mentee/mentee-router");
const postRouter = require("./components/posts/post-router");
const messageRouter = require("./components/messages/message-router");
const commentRouter = require("./components/comments/comment-router");
const authRouter = require("./components/auth/auth-router");
const userFollowersRouter = require("./components/user-followers/user-followers-router");

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
