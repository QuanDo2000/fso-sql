const router = require('express').Router();

const { Blog } = require('../models');

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.post('/', async (req, res) => {
  const blog = await Blog.create(req.body);
  return res.json(blog);
});

router.delete('/:id', async (req, res) => {
  await Blog.destroy({
    where: {
      id: req.params.id,
    },
  });
  return res.status(204).end();
});

router.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (!blog)
    return res.status(404).end(`Blog with id ${req.params.id} not found`);
  await blog.update(req.body);
  return res.json(blog);
});

module.exports = router;
