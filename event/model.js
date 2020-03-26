const Sequelize = require("sequelize");
const db = require("../db");

const Event = db.define("event", {
  name: {
    type: Sequelize.STRING
  },
  imageUrl: {
    type: Sequelize.STRING
  },
  startDate: {
    type: Sequelize.DATE(6)
  },
  endDate: {
    type: Sequelize.DATE(6)
  },
  description: {
    type: Sequelize.STRING
  }
});

module.exports = Event;
