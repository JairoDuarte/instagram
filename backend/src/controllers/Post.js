const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const Post = require('../models/Post');

module.exports = {
  async index(req, res) {
    const posts = await Post.find().sort('createdAt');
    return res.json(posts);
  },
  async store({ body, file, io }, res) {
    const { author, description, place, hashtags } = body;
    const { filename: image } = file;

    const [name] = image.split('.');
    const fileName = `${name}.jpg`;

    await sharp(file.path)
      .resize(500)
      .jpeg({ quality: 70 })
      .toFile(path.resolve(file.destination, 'resized', fileName));
    fs.unlinkSync(file.path);

    const post = await Post.create({
      author,
      description,
      place,
      hashtags,
      image: fileName
    });

    io.emit('post', post);

    return res.json(post);
  },
  async like({ params, io }, res) {
    const post = await Post.findById(params.id);
    post.likes += 1;

    await post.save();

    io.emit('like', post);

    return res.json(post);
  }
};
