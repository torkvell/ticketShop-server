const { Router } = require("express");
const Ticket = require("./model");
const auth = require("../auth/middleWare");

const router = new Router();

router.get("/all", (req, res, next) => {
  Ticket.findAll()
    .then(tickets => {
      //FRAUD ALGORITHM
      const newTickets = tickets.map(ticket => {
        let fraudRisk = 0;
        const ticketData = ticket.dataValues;
        const currentTicketPrice = ticket.dataValues.price;
        const currentTicketAuthorId = ticket.dataValues.userId;
        const currentTicketEventId = ticket.dataValues.eventId;
        const ticketsBySameAuthor = tickets.filter(
          ticket => ticket.dataValues.userId === currentTicketAuthorId
        );
        //if the ticket is the only ticket of the author, add 10%
        if (ticketsBySameAuthor.length <= 1) {
          fraudRisk += 10;
        }
        /*if the ticket price is lower than the average ticket price for that event, that's a risk*/
        //-->if a ticket is X% cheaper than the average price, add X% to the risk
        //-->if a ticket is X% more expensive than the average price, deduct X% from the risk, with a maximum of 10% deduction*/
        const totalPriceCurrentEventTickets = tickets.reduce(
          (accumulator, currentTicket) => {
            if (currentTicket.dataValues.eventId === currentTicketEventId) {
              const price = parseInt(currentTicket.dataValues.price);
              return accumulator + price;
            } else {
              return accumulator;
            }
          },
          0
        );
        const amountOfTicketsCurrentEvent = tickets.filter(
          ticket => ticket.dataValues.eventId === currentTicketEventId
        ).length;
        const averageTicketPriceCurrentEvent =
          totalPriceCurrentEventTickets / amountOfTicketsCurrentEvent;
        const differenceFromAverage =
          currentTicketPrice - averageTicketPriceCurrentEvent;
        const percentageDifferenceCurrentTicket = Math.round(
          (differenceFromAverage / averageTicketPriceCurrentEvent) * 100
        );
        if (percentageDifferenceCurrentTicket <= 0) {
          fraudRisk += Math.abs(percentageDifferenceCurrentTicket);
        } else if (percentageDifferenceCurrentTicket >= 10) {
          fraudRisk -= 10;
        } else {
          fraudRisk -= percentageDifferenceCurrentTicket;
        }
        //if the ticket was added during business hours (9-17), deduct 10% from the risk, if not, add 10% to the risk

        return { ...ticketData, fraudRisk: fraudRisk };
      });

      console.log("New tickets sent to client: ", newTickets);

      res.json(newTickets);
    })
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
  console.log("REQUEST BODY TO CREATE TICKET", req.body);
  const title = req.body.title;
  const description = req.body.description;
  const imageUrl = req.body.imageURL;
  const price = req.body.price;
  const eventId = req.body.eventId;
  const userId = req.body.userId;

  Ticket.create({ title, description, imageUrl, price, userId, eventId })
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

router.put("/update/:id", auth, (req, res, next) => {
  console.log("UPDATE", req.body);
  Ticket.findOne({
    where: {
      id: req.params.id
    }
  })
    .then(ticket => {
      if (ticket) {
        ticket.update(req.body).then(ticket => res.json(ticket));
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

module.exports = router;
