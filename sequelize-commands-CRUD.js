//initializing the database api
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  "postgres://postgres:secret@localhost:5432/postgres"
);
//initializing the server
const express = require("express");
const app = express();
const port = 3061;
const bodyParser = require("body-parser");

//define the tables to be created with data props
const User = sequelize.define("user", {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
});
const Task = sequelize.define("task", {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING
  },
  completed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

/** the following snippet connects us to the database and creates the user and task tables (if they do not already exist) */
sequelize
  .sync()
  .then(() => console.log("Tables created successfully"))
  .catch(err => {
    console.error("Unable to create tables, shutting down...", err);
    process.exit(1);
  });

// define server routes and actions
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// parse request with body parser
app.use(bodyParser.json());

// testing if request works with body parser
app.post("/echo", (req, res) => {
  res.json(req.body);
});

/**TASKS */

// create a new user account
app.post("/users", (req, res, next) => {
  User.create(req.body)
    .then(user => res.json(user))
    .catch(err => next(err));
});

// get a user's information
app.get("/users/:userId", (req, res, next) => {
  User.findByPk(req.params.userId)
    .then(user => {
      if (!user) {
        res.status(404).end();
      } else {
        res.json(user);
      }
    })
    .catch(next);
});

// update a user's information
app.put("/users/:userId", (req, res, next) => {
  User.findByPk(req.params.userId)
    .then(user => {
      if (user) {
        user.update(req.body).then(user => res.json(user));
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

/**TASKS */

// Create a new task
app.post("/users/:userId/tasks", (req, res, next) => {
  User.findByPk(req.params.userId)
    .then(user => {
      if (!user) {
        res.status(404).end();
      } else {
        Task.create({
          ...req.body,
          userId: req.params.userId
        }).then(task => {
          res.json(task);
        });
      }
    })
    .catch(next);
});

// Get a single user task
app.get("/users/:userId/tasks/:taskId", (req, res, next) => {
  Task.findOne({
    where: {
      id: req.params.taskId,
      userId: req.params.userId
    }
  })
    .then(task => {
      if (task) {
        return res.json(task);
      }
      return res.status(404).end();
    })
    .catch(next);
});

// Update an existing task
app.put("/users/:userId/tasks/:taskId", (req, res, next) => {
  Task.findOne({
    where: {
      id: req.params.taskId,
      userId: req.params.userId
    }
  })
    .then(task => {
      if (task) {
        task.update(req.body).then(task => res.json(task));
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

// Delete a user's task
app.delete("/users/:userId/tasks/:taskId", (req, res, next) => {
  Task.destroy({
    where: {
      id: req.params.taskId,
      userId: req.params.userId
    }
  })
    .then(numDeleted => {
      if (numDeleted) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

// Delete all user's tasks
app.delete("/users/:userId/tasks", (req, res, next) => {
  Task.destroy({
    where: {
      userId: req.params.userId
    }
  })
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
});
