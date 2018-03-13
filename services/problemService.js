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

// export for others to use
module.exports = {
  getProblems: getProblems
}
