const { Router } = require("express");
const User = require("./model");
const bcrypt = require("bcrypt");
const router = new Router();
const { toJWT } = require("../auth/jwt");

//when we get a request to /user create a user and return response, also handle bad requests and errors
router.post("/create", (request, response, next) => {
  //validate request(do we have email and pasword in req.body)
  if (
    !request.body.email ||
    !request.body.password ||
    !request.body.firstName ||
    !request.body.lastName
  ) {
    return response.send({
      status: "error",
      error: "Missing input data"
    });
  }
  const hashedPassword = bcrypt.hashSync(request.body.password, 10); //hash password using bcrypt
  const user = { ...request.body, password: hashedPassword };
  User.create(user)
    .then(user => response.send(user.email))
    .catch(e => {
      // console.log(JSON.stringify(e.errors[0].message, null, 2));
      response.send({
        error: true,
        message: "Something went wrong"
      });
    });
});

router.post("/login", async (request, response) => {
  try {
    // console.log(request.body);
    const user = await User.findOne({ where: { email: request.body.email } });
    const passwordValid = bcrypt.compareSync(
      request.body.password,
      user.password
    );

    if (passwordValid) {
      const userNew = {
        id: user.id,
        email: user.email,
        token: toJWT({ id: user.id })
      };
      return response.send(userNew);
    } else {
      return response.send({ error: true, message: "incorrect password" });
    }
  } catch (error) {
    response.send({ error: true, message: "Login not successful" });
  }
});

module.exports = router;
