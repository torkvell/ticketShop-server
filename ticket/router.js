const { Router } = require("express");
const { Ticket } = require("./model");
const auth = require("../auth/middleWare");

const router = new Router();

router.get("/all", (req, res, next) => {
  Ticket.findAll()
    .then(tickets => res.json(tickets))
    .catch(error => next(error)); //TODO: Give error back to client for display/res to user
});

router.get("/all/:id", (req, res, next) => {
  const userId = parseInt(req.params.id);
  console.log(userId);
  Ticket.findAll({
    where: {
      userId: userId
    }
  }).then(tickets => {
    res.json(tickets);
  });
});

router.post("/create", auth, (req, res, next) => {
  console.log("REQUEST BODY TO CREATE TEAM", req.body);
  const description = req.body.description;
  const imageUrl = req.body.imageURL;
  const price = req.body.price;
  const userId = req.body.userId;
  Ticket.create({ description, imageUrl, price, userId })
    .then(ticket => {
      console.log("Created the ticket!");
      res.json(ticket);
    })
    .catch(error => next(error)); //TODO: Give error back to client for display/res to user
});

router.post("/delete", auth, (req, res, next) => {
  // console.log("DELETE", request.body);
  Ticket.findByPk(req.body.id)
    .then(ticket =>
      Ticket.destroy({
        where: {
          id: req.body.id
        }
      })
    )
    .then(ticket => {
      res.json(req.body.id);
    });
});

// router.get("/products", (req, res, next) => {
//   Product.findAll()
//     .then(teams => res.json(teams))
//     .catch(error => next(error));
// });

// router.get("/:id", (req, res, next) => {
//   const teamId = parseInt(req.params.id);
//   console.log(teamId);
//   Team.findByPk(teamId).then(team => {
//     if (!team) {
//       res.status(404).send("Team not found!");
//     } else {
//       res.json(team);
//     }
//   });
// });

module.exports = router;
