const express = require("express");
const multer = require("multer");
const uploadConfig = require("./config/upload");
const PostController = require("./controllers/Post");
const routes = new express.Router();

routes.get("/", (req, res) => {
  return res.send(`hello world ${req.params.name}`);
});
const upload = multer(uploadConfig);
routes.post("/posts", upload.single("image"), PostController.store);
routes.get("/posts", PostController.index);
routes.post("/posts/:id/like", PostController.like);
module.exports = routes;
