const { Router } = require("express");
const User = require("../user/model");
const Ticket = require("../ticket/model");
const auth = require("../auth/middleWare");
const router = new Router();

router.post("/", auth, async (req, res, next) => {
  try {
    const authUserId = req.user.id;
    const { title, description, imageUrl, price, eventId } = req.body;
    const user = await User.findOne({ where: { id: authUserId } });
    if (user) {
      const ownerName = `${user.firstName} ${user.lastName}`;
      Ticket.create({
        title,
        description,
        imageUrl,
        price,
        userId: authUserId,
        eventId,
        ownerName
      })
        .then(ticket => {
          res.send(ticket);
        })
        .catch(() => res.status(500).send("Ticket could not be created"));
    } else {
      return res.status(400).send("Not authorized");
    }
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

router.put("/:ticketId", auth, async (req, res, next) => {
  try {
    const authUserId = req.user.id;
    const user = await User.findOne({ where: { id: authUserId } });
    if (user) {
      Ticket.findOne({
        where: {
          id: req.params.ticketId
        }
      }).then(ticket => {
        if (ticket) {
          ticket.update(req.body).then(ticket => res.json(ticket));
        } else {
          res.status(404).send("Ticket not found");
        }
      });
    } else {
      return res.status(500).send("Not authorized");
    }
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

router.delete("/:ticketId", auth, (req, res, next) => {
  const ticketId = parseInt(req.params.ticketId);
  const authUserId = req.user.id;
  User.findOne({ where: { id: authUserId } })
    .then(() => {
      Ticket.findByPk(ticketId)
        .then(() =>
          Ticket.destroy({
            where: {
              id: ticketId
            }
          })
        )
        .then(() => {
          res.json(ticketId);
        })
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

module.exports = router;
