const { Router } = require("express");
const User = require("./model");
const Ticket = require("../ticket/model");
const Event = require("../event/model");
const bcrypt = require("bcrypt");
const router = new Router();
const { toJWT } = require("../auth/jwt");

/*--------------------SIGNUP / LOGIN--------------------*/

router.post("/signup", (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).send("Missing input data");
  } else {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const user = { ...req.body, password: hashedPassword };
    User.create(user)
      .then((user) => res.send("User created"))
      .catch((e) => {
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
        firstName: user.firstName,
        lastName: user.lastName,
        token: toJWT({ id: user.id }),
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
  try {
    const userId = parseInt(req.params.userId);
    const tickets = await Ticket.findAll({
      where: {
        userId: userId,
      },
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

/*--------------------USER EVENTS--------------------*/
router.get("/:userId/event", (req, res, next) => {
  const userId = parseInt(req.params.userId);
  Event.findAll({
    where: {
      userId: userId,
    },
  })
    .then((events) => {
      res.send(events);
    })
    .catch((error) => next(error));
});

module.exports = router;
