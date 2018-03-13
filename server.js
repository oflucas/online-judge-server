var express = require("express");
const app = express()
var restRouter = require("./routes/rest");
var mongoose = require("mongoose");

// mongodb://<dbuser>:<dbpassword>@ds213259.mlab.com:13259/oj
// <dbuser> == user, <dbpassword> == user
mongoose.connect("mongodb://user:user@ds213259.mlab.com:13259/oj");

// this is actually a router
app.get('/', (req, res) => res.send('Hello World!'))

app.use("/api/v1", restRouter);

app.listen(3000, () => console.log('Example app listening on port 3000!'))
