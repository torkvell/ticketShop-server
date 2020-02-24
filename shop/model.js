const Sequelize = require("sequelize");
const db = require("../db");

const Product = db.define(
  "product",
  {
    /*The first argument to define is the table name(note: sequelize will give it plural s). The second argument 
  is an object that defines the table fields. */
    name: {
      type: Sequelize.STRING
    },
    imageUrl: {
      type: Sequelize.STRING
    },
    price: {
      type: Sequelize.STRING
    }
  } //You can also determine the name of the table by passing an another object argument with a tableName property to define:
  // { tableName: "football_teams" }
);

/**Sequelize gives every model the fields createdAt and updatedAt by default. These fields have the datatype DATE.
 * They store the date and time that the field was created and updated. You can disable these fields if you want.
 * Edit your model files and pass another argument to db.define. It should be an object with the property 'timestamps: false`.
 * This object can be used to set other options for the table. You can see more options in the Model definition page here:
 * http://docs.sequelizejs.com/manual/models-definition.html */

module.exports = { Product };
