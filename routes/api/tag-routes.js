const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  const tags = await Tag.findAll({
    include: [{
      model: Product
    }]
  }).catch((err) => {
    res.status(400).json(err);
  });
  res.status(200).json(tags);
});

router.get('/:id', async (req, res) => {
  const tag = await Tags.findByPk(req.params.id, {
    include: [{
      model: Product
    }]
  }).catch((err) => {
    res.status(400).json(err);
  });
  res.status(200).json(tag);
});

router.post('/', (req, res) => {
  Tag.create(req.body)
    .then((tag) => {
      if (req.body.productIds.length) {
        const productTagIdArr = req.body.productIds.map((tag_id) => {
          return {
            tag_id: tag.id,
            product_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      res.status(200).json(tag);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((e=TAG) => {
      return ProductTag.findAll({ where: { tag_id: req.params.id } });
    })
    .then((productTags) => {
      const productTagIds = productTags.map(({ product_id }) => product_id);
      const newProductTags = req.body.productIds
        .filter((product_id) => !productTagIds.includes(product_id))
        .map((product_id) => {
          return {
            tag_id: req.params.id,
            product_id
          };
        });
      const productTagsToRemove = productTags
        .filter(({ product_id }) => !req.body.productIds.includes(product_id))
        .map(({ id }) => id);

      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  const product = await Tag.destroy({
    where: {
      id: req.params.id
    }
  }).then((tag) => {
    return ProductTag.findAll({ where: { tag_id: req.params.id } });
  }).then((productTagsToRemove) => {
    ProductTag.destroy({where: { id: productTagsToRemove }})
  })
  .catch((err) => {
    res.status(400).json(err);
  });
  res.status(200).json(product);
});

module.exports = router;
