const express = require("express");
const app = express();
const teamRouter = require("./shop/router");
const port = process.env.PORT || 4000;
const cors = require("cors");
const userRouter = require("./user/router");

const corsMiddleware = cors();
app.use(corsMiddleware);

app.use(express.json()); //Express own bodyParser

app.use("/shop", teamRouter);
app.use("/user", userRouter);

//Pass the port and a logging function to app.listen to start the server.
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
