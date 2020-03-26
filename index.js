const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const cors = require("cors");
const userRouter = require("./user/router");
const eventRouter = require("./event/router");
const commentRouter = require("./comment/router");
const ticketRouter = require("./ticket/router");
const corsMiddleware = cors();

app.use(corsMiddleware);
app.use(express.json()); //Express own bodyParser
app.use("/user", userRouter);
app.use("/ticket", ticketRouter);
app.use("/event", eventRouter);
app.use("/comment", commentRouter);

//Pass the port and a logging function to app.listen to start the server.
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
