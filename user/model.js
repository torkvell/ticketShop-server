const Sequelize = require("sequelize");
const sequelize = require("../db");
const Ticket = require("../ticket/model");
const Event = require("../event/model");

// sync model to database
const User = sequelize.define(
  "user",
  {
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
  }
  // {
  //   timestamps: false,
  //   tableName: "users"
  // }
);
User.hasMany(Event);
module.exports = User;
