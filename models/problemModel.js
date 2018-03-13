var mongoose = require("mongoose");
// expectation of data in DB
var ProblemSchema = mongoose.Schema({
  id: Number,
  name: String,
  desc: String,
  difficulty: String
});
var problemModel = mongoose.model("ProblemModel", ProblemSchema);

module.exports = problemModel;
