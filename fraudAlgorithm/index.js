//FRAUD ALGORITHM
const fraudAlgorithm = tickets => {
  const newTickets = tickets.map(ticket => {
    let fraudRisk = 0;
    const ticketData = ticket.dataValues;
    const currentTicketPrice = parseInt(ticket.dataValues.price);
    const currentTicketAuthorId = parseInt(ticket.dataValues.userId);
    const currentTicketEventId = parseInt(ticket.dataValues.eventId);
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
      (accumulator, reduceTicket) => {
        if (reduceTicket.dataValues.eventId === currentTicketEventId) {
          const price = parseInt(reduceTicket.dataValues.price);
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
    if (percentageDifferenceCurrentTicket < 0) {
      fraudRisk += Math.abs(percentageDifferenceCurrentTicket);
    } else if (percentageDifferenceCurrentTicket >= 10) {
      fraudRisk -= 10;
    } else {
      fraudRisk -= percentageDifferenceCurrentTicket;
    }
    //if the ticket was added during business hours (9-17), deduct 10% from the risk, if not, add 10% to the risk
    const ticketCreationHour = ticket.dataValues.createdAt
      .toString()
      .substr(16, 2);
    fraudRisk =
      ticketCreationHour > 17 || ticketCreationHour < 9
        ? (fraudRisk += 10)
        : (fraudRisk -= 10);
    // // //if there are >3 comments on the ticket, add 5% to the risk
    if (ticketData.comments.length > 3) fraudRisk += 5;
    //The minimal risk is 5% (there's no such thing as no risk) and the maximum risk is 95%.
    if (fraudRisk < 5) fraudRisk = 5;
    if (fraudRisk > 95) fraudRisk = 95;
    return { ...ticketData, fraudRisk: fraudRisk };
  });
  return newTickets;
};

module.exports = fraudAlgorithm;
