const { Router } = require("express");
const User = require("../user/model");
const Event = require("../event/model");
const Ticket = require("../ticket/model");
const Comment = require("./model");
const auth = require("../auth/middleWare");
const { Op } = require("sequelize");
const router = new Router();

router.post("/:ticketId", auth, async (req, res, next) => {
  try {
    const { comment, ticketId } = { ...req.body };
    const authUserId = req.user.id;
    const user = await User.findOne({ where: { id: authUserId } });
    if (user) {
      const publisher = user.firstName + " " + user.lastName;
      console.log(
        `comment: ${comment} ticketId: ${ticketId} userId: ${authUserId}, ownerName: ${publisher} `
      );
      Comment.create({ comment, userId: authUserId, ticketId, publisher })
        .then(() => {
          const datetime = new Date();
          Event.findAll({
            where: {
              endDate: { [Op.gte]: datetime },
            },
            include: [
              {
                model: Ticket,
                include: [Comment],
              },
            ],
          }).then((events) => res.json(events));
        })
        .catch((err) => {
          res.status(500).send("Something went wrong");
          // console.log(err);
        });
    } else {
      return res.status(400).send("Not authorized");
    }
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;
