const router = require('express').Router();

const { Blog, User } = require('../models');
const { Op } = require('sequelize');
const { tokenExtractor } = require('../util/middleware');

router.get('/', async (req, res) => {
  let where = {};

  if (req.query.search) {
    where = {
      [Op.or]: [
        { title: { [Op.iLike]: `%${req.query.search}%` } },
        { author: { [Op.iLike]: `%${req.query.search}%` } },
      ],
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: { model: User, attributes: ['name'] },
    where,
    order: [['likes', 'DESC']],
  });
  res.json(blogs);
});

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.create({
    ...req.body,
    userId: user.id,
    date: new Date(),
  });
  return res.json(blog);
});

router.delete('/:id', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.findByPk(req.params.id);
  if (!blog)
    return res.status(404).end(`Blog with id ${req.params.id} not found`);
  if (blog.userId !== user.id)
    return res
      .status(401)
      .end('You are not authorized to delete this blog post');
  await blog.destroy();
  return res.status(204).end();
});

router.put('/:id', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.findByPk(req.params.id);
  if (!blog)
    return res.status(404).end(`Blog with id ${req.params.id} not found`);
  if (blog.userId !== user.id)
    return res
      .status(401)
      .end('You are not authorized to update this blog post');
  await blog.update(req.body);
  return res.json(blog);
});

module.exports = router;
