// router file, only write routing things, keep it clean
var express = require("express");
var router = express.Router();
var problemService = require("../services/problemService");

// HTTP GET
router.get("/problems", function(req, res) {
  problemService.getProblems()
    .then(problems => res.json(problems));
});

// export the router - -
module.exports = router;
