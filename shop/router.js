const { Router } = require("express");
const { Product } = require("./model");

const router = new Router();

router.get("/products", (req, res, next) => {
  Product.findAll()
    .then(teams => res.json(teams))
    .catch(error => next(error));
});

router.get("/:id", (req, res, next) => {
  const teamId = parseInt(req.params.id);
  console.log(teamId);
  Team.findByPk(teamId).then(team => {
    if (!team) {
      res.status(404).send("Team not found!");
    } else {
      res.json(team);
    }
  });
});

router.post("/", (req, res, next) => {
  console.log("REQUEST BODY TO CREATE TEAM", req.body.name);
  const teamName = req.body.name;
  Team.create({ name: teamName })
    .then(team => {
      console.log("Created the team!");
      res.json(team);
    })
    .catch(error => next(error));
});

module.exports = router;
