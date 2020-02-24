//1. Import sequelize as a variable named Sequelize. You should capitalize the variable because it is a class.
const Sequelize = require("sequelize");
//2. Declare a variable named databaseUrl and set it equal to your database url. Heroku uses env. var as DATABASE_URL
const databaseUrl =
  process.env.DATABASE_URL ||
  "postgres://postgres:secret@localhost:5432/postgres";
//3. Create a new instance of the Sequelize class named db, passing the databaseUrl to the constructor.
const db = new Sequelize(databaseUrl);
/*4. Call the sync method of the instance you created. This method will sync the data in your database with the schema you are about to create.*/
db.sync()
  .then(() => console.log("Database schema updated"))
  .catch(console.error);
//5. Export db
module.exports = db;
