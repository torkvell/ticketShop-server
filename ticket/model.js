const Sequelize = require("sequelize");
const db = require("../db");
const User = require("../user/model");
const Event = require("../event/model");

const Ticket = db.define("ticket", {
  /*The first argument to define is the table name(note: sequelize will give it plural s). The second argument 
  is an object that defines the table fields. */
  description: {
    type: Sequelize.STRING
  },
  imageUrl: {
    type: Sequelize.STRING
  },
  price: {
    type: Sequelize.STRING
  }
});

/**Sequelize gives every model the fields createdAt and updatedAt by default. These fields have the datatype DATE.
 * They store the date and time that the field was created and updated. You can disable these fields if you want.
 * Edit your model files and pass another argument to db.define. It should be an object with the property 'timestamps: false`.
 * This object can be used to set other options for the table. You can see more options in the Model definition page here:
 * http://docs.sequelizejs.com/manual/models-definition.html */

User.hasMany(Ticket);
Event.hasMany(Ticket);
module.exports = Ticket;
