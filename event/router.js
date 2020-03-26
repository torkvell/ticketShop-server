const { Router } = require("express");
const Event = require("./model");
const User = require("../user/model");
const auth = require("../auth/middleWare");
const { Op } = require("sequelize");
const Ticket = require("../ticket/model");
const Comment = require("../comment/model");
const fraudAlgorithm = require("../fraudAlgorithm");
const router = new Router();

//Get all events with all tickets and comments
router.get("/", async (req, res, next) => {
  try {
    //As a customer I only want to see events that are not finished yet
    const datetime = new Date();
    const tickets = await Ticket.findAll({
      include: [
        {
          model: Comment
        }
      ]
    });
    //Before we send all event data to client --> calculate fraud risk and insert it into db
    const newTickets = fraudAlgorithm(tickets);
    newTickets.map(ticket => {
      Ticket.update(
        { fraudRisk: ticket.fraudRisk },
        { where: { id: ticket.id } }
      );
    });
    const events = await Event.findAll({
      where: {
        endDate: { [Op.gte]: datetime }
      },
      include: [
        {
          model: Ticket,
          include: [Comment]
        }
      ]
    });
    if (events) return res.json(events);
  } catch (error) {
    res.status(500).send("Something went wrong getting all event data");
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const { name, imageUrl, startDate, endDate, description } = req.body;
    const authUserId = req.user.id;
    const user = await User.findOne({ where: { id: authUserId } });
    if (user) {
      Event.create({
        name,
        imageUrl,
        startDate,
        endDate,
        description,
        userId: authUserId
      })
        .then(event => {
          res.json(event);
        })
        .catch(() => res.status(500).send("Event could not be created"));
    } else {
      return res.status(500).send("Not authorized");
    }
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

router.delete("/:eventId", auth, async (req, res, next) => {
  try {
    const eventId = req.params.eventId;
    const authUserId = req.user.id;
    const user = await User.findOne({ where: { id: authUserId } });
    if (user) {
      Event.findByPk(eventId)
        .then(event =>
          event.destroy({
            where: {
              id: eventId
            }
          })
        )
        .then(() => {
          res.status(200).send(eventId);
        })
        .catch(() => res.status(500).send("Event could not be deleted"));
    } else {
      return res.status(400).send("Not authorized");
    }
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;
