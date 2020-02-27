const { Router } = require("express");
const auth = require("../auth/middleWare");
const Comment = require("./model");
const Event = require("../event/model");
const Ticket = require("../ticket/model");
const { Op } = require("sequelize");

const router = new Router();

router.post("/create", auth, (req, res, next) => {
  console.log(`request body create comment, `, req.body);
  const comment = { ...req.body };
  Comment.create(comment)
    .then(comment => {
      const datetime = new Date();
      Event.findAll({
        where: {
          endDate: { [Op.gte]: datetime }
        },
        include: [
          {
            model: Ticket,
            include: [Comment]
          }
        ]
      }).then(Events => res.json(Events));
      // res.json(comment);
    })
    .catch(error => next(error));
});

module.exports = router;
