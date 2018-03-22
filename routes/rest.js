// router file, only write routing things, keep it clean
var express = require("express");
var router = express.Router();
var problemService = require("../services/problemService");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var node_rest_client = require('node-rest-client').Client;
var rest_client = new node_rest_client();

EXECUTOR_SERVER_URL = 'http://localhost:5000/build_and_run';

// wrap a http request like a function method
rest_client.registerMethod('build_and_run', EXECUTOR_SERVER_URL, 'POST');

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

  rest_client.methods.build_and_run(
    {
      data: {code: userCode, lang: lang},
      headers: {"Content-Type": "application/json"}
    }, (data, response) => {
      console.log("Received resp from execution server: " + response);
      const text = `
      Build output: ${data['build']}
      Execute output: ${data['run']}
      `;
      data['text'] = text;
      res.json(data);
    }
  );
});

// export the router - -
module.exports = router;
