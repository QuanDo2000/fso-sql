const router = require('express').Router();

const { User, Blog, ReadingList } = require('../models');
const { tokenExtractor } = require('../util/middleware');

router.post('/', async (req, res) => {
  const { userId, blogId } = req.body;

  const user = await User.findByPk(userId);
  const blog = await Blog.findByPk(blogId);

  if (!user) {
    return res.status(404).json({ error: 'user not found' });
  }

  if (!blog) {
    return res.status(404).json({ error: 'blog not found' });
  }

  const readingList = await ReadingList.create({
    userId: user.id,
    blogId: blog.id,
  });

  res.json(readingList);
});

router.put('/:id', tokenExtractor, async (req, res) => {
  const { id } = req.params;
  const { unread } = req.body;

  const readingList = await ReadingList.findByPk(id);

  if (!readingList) {
    return res.status(404).json({ error: 'reading entry not found' });
  }

  if (readingList.userId !== req.decodedToken.id) {
    return res
      .status(401)
      .json({ error: 'operation not allowed. This is not your reading list' });
  }

  await readingList.update({ unread });

  res.json(readingList);
});

module.exports = router;
