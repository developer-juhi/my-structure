require("dotenv").config();
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const cors = require("cors");
const log4js = require("log4js");
const mongoose = require("mongoose");
const morgan = require("morgan");
const stripe = require('stripe')(process.env.STRIPE_KEY);
const indexRouter = require("./routes/index");
const cronService = require("./controllers/common/cron");

// config();
var port = process.env.PORT;



const app = express();
app.use(morgan(":method :url :response-time"));

// prefix start

// body mathi data get  karva start
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// body mathi data get  karva over

app.set("view engine", "ejs");
const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Use this after the variable declaration
// start route

app.get("/api/", function (req, res) {
    res.send("Hello World!123");
});
app.use("/api", indexRouter);


const server = http.createServer(app);
server.listen(port, async (req, res) => {

    if (process.env.MONGO_URI) {
        await mongoose.connect(process.env.MONGO_URI);
    }
    console.log("Server is running on Port: " + port);
    // logger.info('Express server started on port: ' + port);
});
server.timeout = 90000;

cron.schedule("0 0 */3 * *", async () => {
    await cronService.removeLogger();
});

cron.schedule("0 12 * * *", async () => {
    await cronService.databaseBackup();
});