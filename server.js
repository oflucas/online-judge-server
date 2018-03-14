var express = require("express");
const app = express()
var restRouter = require("./routes/rest");
var indexRouter = require("./routes/index");
var path = require('path');
var mongoose = require("mongoose");

// mongodb://<dbuser>:<dbpassword>@ds213259.mlab.com:13259/oj
// <dbuser> == user, <dbpassword> == user
mongoose.connect("mongodb://user:user@ds213259.mlab.com:13259/oj");

app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter)

app.use("/api/v1", restRouter);

// handle refresh and direct webpage address other than '/'
app.use(function(req, res) {
  // send index.html to start client side
  res.sendFile("index.html", {
    root: path.join(__dirname, '../public/')
  });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))
