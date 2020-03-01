const { Router } = require("express");
const User = require("./model");
const Ticket = require("../ticket/model");
const Event = require("../event/model");
const Comment = require("../comment/model");
const auth = require("../auth/middleWare");
const bcrypt = require("bcrypt");
const router = new Router();
const { toJWT } = require("../auth/jwt");
const { Op } = require("sequelize");

/*--------------------SIGNUP / LOGIN--------------------*/

router.post("/signup", (req, res) => {
  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.firstName ||
    !req.body.lastName
  ) {
    return res.status(400).send("Missing input data");
  } else {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10); //hash password using bcrypt
    const user = { ...req.body, password: hashedPassword };
    User.create(user)
      .then(user => res.send("User created"))
      .catch(e => {
        // console.log(JSON.stringify(e.errors[0].message, null, 2));
        res.status(500).send("Something went wrong");
      });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    const passwordValid = bcrypt.compareSync(req.body.password, user.password);

    if (passwordValid) {
      const userNew = {
        id: user.id,
        email: user.email,
        token: toJWT({ id: user.id })
      };
      return res.send(userNew);
    } else {
      return res.status(400).send("Incorrect password");
    }
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

/*--------------------USER TICKETS--------------------*/

router.get("/:userId/ticket", async (req, res, next) => {
  // const userId = parseInt(req.params.id);
  // Ticket.findAll({
  //   where: {
  //     userId: userId
  //   }
  // })
  //   .then(tickets => {
  //     res.json(tickets);
  //   })
  //   .catch(error => {
  //     res.status(500).send("Something went wrong"); //TO ASK: Issue with using catch error in promise --> doesn't give back .send("message") instead sends a whole HTML page with error msg
  //   });
  try {
    const userId = parseInt(req.params.userId);
    const tickets = await Ticket.findAll({
      where: {
        userId: userId
      }
    });
    if (tickets) {
      return res.send(tickets);
    } else {
      return res.status(500).send("Can't get tickets");
    }
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

router.post("/:userId/ticket", auth, (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const imageUrl = req.body.imageURL;
  const price = req.body.price;
  const eventId = req.body.eventId;
  const userId = req.params.userId;

  User.findOne({ where: { id: userId } })
    .then(user => {
      const ownerName = `${user.firstName} ${user.lastName}`;
      Ticket.create({
        title,
        description,
        imageUrl,
        price,
        userId,
        eventId,
        ownerName
      })
        .then(ticket => {
          res.send(ticket);
        })
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

router.delete("/:userId/ticket/:ticketId", auth, (req, res, next) => {
  const ticketId = parseInt(req.params.ticketId);
  Ticket.findByPk(ticketId)
    .then(ticket =>
      Ticket.destroy({
        where: {
          id: ticketId
        }
      })
    )
    .then(amountDeleted => {
      res.json(ticketId);
    })
    .catch(error => next(error));
});

router.put("/:userId/ticket/:ticketId", auth, (req, res, next) => {
  Ticket.findOne({
    where: {
      id: req.params.ticketId
    }
  })
    .then(ticket => {
      if (ticket) {
        ticket.update(req.body).then(ticket => res.json(ticket));
      } else {
        res.status(404).send("Ticket not found");
      }
    })
    .catch(error => next(error));
});

/*--------------------USER EVENT--------------------*/
router.get("/:userId/event", (req, res, next) => {
  const userId = parseInt(req.params.userId);
  Event.findAll({
    where: {
      userId: userId
    }
  })
    .then(events => {
      res.send(events);
    })
    .catch(error => next(error));
});

router.post("/:userId/event", auth, (req, res, next) => {
  const name = req.body.name;
  const imageUrl = req.body.imageUrl;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const description = req.body.description;
  const userId = req.params.userId;
  Event.create({ name, imageUrl, startDate, endDate, description, userId })
    .then(Event => {
      res.json(Event);
    })
    .catch(error => next(error));
});

router.delete("/:userId/event/:eventId", auth, (req, res, next) => {
  const eventId = req.params.eventId;
  Event.findByPk(eventId)
    .then(Event =>
      Event.destroy({
        where: {
          id: eventId
        }
      })
    )
    .then(amountDeleted => {
      res.send(eventId);
    })
    .catch(error => next(error));
});

/*--------------------USER COMMENT--------------------*/

router.post("/:userId/ticket/:ticketId/comment", auth, (req, res, next) => {
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
      }).then(events => res.json(events));
    })
    .catch(error => next(error));
});

module.exports = router;
