const Sequelize = require("sequelize");
const sequelize = require("../db");
// sync model to database
const User = sequelize.define(
  "user",
  {
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false,
    tableName: "users"
  }
);
module.exports = User;
