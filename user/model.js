const Sequelize = require("sequelize");
const sequelize = require("../db");
const Comment = require("../comment/model");
const Event = require("../event/model");

const User = sequelize.define("user", {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});
User.hasMany(Event);
User.hasMany(Comment);
module.exports = User;
