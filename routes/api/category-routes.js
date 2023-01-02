const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  const categories = await Category.findAll({
    include: [{
      model: Product
    }]
  }).catch((err) => {
    res.status(400).json(err);
  });
  res.status(200).json(categories);
});

router.get('/:id', async (req, res) => {
  const category = await Category.findByPk(req.params.id, {
    include: [{
      model: Product
    }]
  }).catch((err) => {
    res.status(400).json(err);
  });
  res.status(200).json(category);
});

router.post('/', async (req, res) => {
  const category = await Category.create(req.body)
    .catch((err) => {
      res.status(400).json(err);
    });
  res.status(200).json(category);
});

router.put('/:id', async (req, res) => {
  const category = await Category.update(req.body, {
    where: {
      id: req.params.id
    }
  }).catch((err) => {
    res.status(400).json(err);
  });
  res.status(200).json(category);
});

router.delete('/:id', async (req, res) => {
  const category = await Category.destroy({
    where: {
      id: req.params.id
    }
  }).catch((err) => {
    res.status(400).json(err);
  });
  res.status(200).json(category);
});

module.exports = router;
