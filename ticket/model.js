const Sequelize = require("sequelize");
const db = require("../db");
const User = require("../user/model");
const Event = require("../event/model");
const Comment = require("../comment/model");

const Ticket = db.define("ticket", {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  imageUrl: {
    type: Sequelize.STRING
  },
  price: {
    type: Sequelize.STRING,
    allowNull: false
  },
  fraudRisk: {
    type: Sequelize.INTEGER
  },
  ownerName: {
    type: Sequelize.STRING
  }
});

User.hasMany(Ticket);
Event.hasMany(Ticket);
Ticket.hasMany(Comment);
module.exports = Ticket;
