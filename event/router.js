const { Router } = require("express");
const Event = require("./model");
const auth = require("../auth/middleWare");
const { Op } = require("sequelize");

const router = new Router();

router.get("/all", (req, res, next) => {
  //As a customer I only want to see events that are not finished yet
  const datetime = new Date();
  Event.findAll({
    where: {
      endDate: { [Op.gte]: datetime }
    }
  })
    .then(Events => res.json(Events))
    .catch(error => next(error)); //TODO: Give error back to client for display/res to user
});

router.get("/all/:id", (req, res, next) => {
  const userId = parseInt(req.params.id);
  console.log(userId);
  Event.findAll({
    where: {
      userId: userId
    }
  }).then(Events => {
    res.json(Events);
  });
});

router.post("/create", auth, (req, res, next) => {
  console.log("REQUEST BODY TO CREATE TEAM", req.body);
  const name = req.body.name;
  const imageUrl = req.body.imageUrl;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const description = req.body.description;
  const userId = req.body.userId;
  Event.create({ name, imageUrl, startDate, endDate, description, userId })
    .then(Event => {
      console.log("Created the Event!");
      res.json(Event);
    })
    .catch(error => next(error)); //TODO: Give error back to client for display/res to user
});

router.post("/delete", auth, (req, res, next) => {
  // console.log("DELETE", request.body);
  Event.findByPk(req.body.id)
    .then(Event =>
      Event.destroy({
        where: {
          id: req.body.id
        }
      })
    )
    .then(Event => {
      res.json(req.body.id);
    });
});

module.exports = router;
