const { Router } = require("express");
const Event = require("./model");
const auth = require("../auth/middleWare");
const { Op } = require("sequelize");
const Ticket = require("../ticket/model");
const Comment = require("../comment/model");
const fraudAlgorithm = require("../fraudAlgorithm");
const User = require("../user/model");

const router = new Router();

//Get all events with all tickets and comments
router.get("/", (req, res, next) => {
  //As a customer I only want to see events that are not finished yet
  const datetime = new Date();
  //Before we send all event data to client --> calculate fraud risk and insert it into db
  Ticket.findAll({
    include: [
      {
        model: Comment
      }
    ]
  })
    .then(tickets => {
      const newTickets = fraudAlgorithm(tickets);
      newTickets.map(ticket => {
        Ticket.update(
          { fraudRisk: ticket.fraudRisk },
          { where: { id: ticket.id } }
        );
      });
    })
    .catch(error => next(error));
  //After all tickets has been updated --> get all events with all its data
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
  })
    .then(Events => {
      res.json(Events);
    })
    .catch(error => next(error));
});

// router.get("/all/:id", (req, res, next) => {
//   const eventId = parseInt(req.params.id);
//   Ticket.findAll({
//     where: { eventId: eventId },
//     include: [
//       {
//         model: Comment
//       }
//     ]
//   })
//     .then(tickets => {
//       res.json(tickets);
//     })
//     .catch(error => next(error));
// });

module.exports = router;
