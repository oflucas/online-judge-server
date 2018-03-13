var problems = [
  {id: 1, name: "first", desc: "dddd", difficulty: "easy"},
  {id: 2, name: "second", desc: "dddd", difficulty: "easy"},
  {id: 3, name: "third", desc: "dddd", difficulty: "medium"},
  {id: 4, name: "fourth", desc: "dddd", difficulty: "easy"},
  {id: 5, name: "fifth", desc: "dddd", difficulty: "hard"},
  {id: 6, name: "sixth", desc: "dddd", difficulty: "hard"},
  {id: 7, name: "seventh", desc: "dddd", difficulty: "super"}
];

var getProblems = function() {
  return new Promise((resolve, reject) => {
    resolve(problems);
  });
}

var getProblem = function(id) {
  return new Promise((resolve, reject) => {
    resolve(
      problems.find(problem => problem.id === id)
    );
  });
}

var addProblem = function(newProblem) {
  return new Promise((resolve, reject) => {
    if (problems.find(problem => problem.name === newProblem.name)) {
      reject("Problem already exists");
    } else {
      newProblem.id = problems.length + 1;
      problems.push(newProblem);
      resolve(newProblem);
    }
  });
}

// export for others to use
module.exports = {
  getProblems: getProblems,
  getProblem: getProblem,
  addProblem: addProblem
}
