const { Router } = require("express");
const auth = require("../auth/middleWare");
const Comment = require("./model");

const router = new Router();

router.post("/create", auth, (req, res, next) => {
  console.log(`request body create comment, `, req.body);
  const comment = { ...req.body };
  Comment.create(comment)
    .then(comment => {
      res.json(comment);
    })
    .catch(error => next(error));
});

module.exports = router;
