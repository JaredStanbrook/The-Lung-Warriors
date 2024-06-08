var express = require("express");
var router = express.Router();
const fs = require('fs');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "LungWarriors"});
});

router.get("/file:dynamic", function (req, res) {
  const { dynamic } = req.params;
  const { key } = req.query;
  switch(dynamic) {
    case "filter": 
      console.log("filter");
      break;
    default:
  }
});

router.post("/", function (req, res) {
  const parcel = req.body;
  const { key } = req.query;
  console.log(key);
  if (!parcel) {
    return res.status(400).send({ status: "failed" });
  }
  switch(key) {
    case "save":
      break;
    case "print":
      console.log(parcel)
      break;
    default:
    res.status(200).send({ status: "recieved" });
  }
});

module.exports = router;
