// router file, only write routing things, keep it clean
var express = require("express");
var router = express.Router();
var problemService = require("../services/problemService");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

// HTTP GET
router.get("/problems", function(req, res) {
  problemService.getProblems()
    .then(problems => res.json(problems));
});

// use example: ..../problems/1
router.get("/problems/:id", function(req, res) {
  var id = req.params.id; // express made 'id' available
  problemService.getProblem(+id) // id is string, +id becomes number
    .then(problem => res.json(problem));
});

// HTTP POST
router.post("/problems", jsonParser, function(req, res) {
  // express use the parse you provided to parse request data and put the parsed into req.body
  problemService.addProblem(req.body)
    .then(
      problem => { res.json(problem); }
    ).catch(
      error => {res.status(400).send("Problem name already exists!");}
    )
});

router.post("/build_and_run", jsonParser, function(req, res){
  const userCode = req.body.user_code;
  const lang = req.body.lang;

  console.log(lang + ': ' + userCode);
  res.json({});
});

// export the router - -
module.exports = router;
