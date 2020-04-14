const Sequelize = require("sequelize");
const db = require("../db");

const Comment = db.define("comment", {
  comment: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  ticketId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  publisher: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Comment;
