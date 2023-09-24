function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const axios = require("axios");
const { error } = require("console");
const he = require("he");
const dotenv = require("dotenv");

dotenv.config();

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static("public"));
app.set("view engine", "ejs");


let questions = [];
let options=[];
let correctOpt=[];
let difficulty;
var Qno = 1;
var score=0;

app.get("/", function(req, res){
  setTimeout(()=>{
    res.sendFile(__dirname+"/index.html");
  },1000)
});
app.get("/questions", function(req, res){
    const q = he.decode(questions[Qno-1]);
    const opt1 = he.decode(options[Qno-1][0]);
    const opt2 = he.decode(options[Qno-1][1]);
    const opt3 = he.decode(options[Qno-1][2]);
    const opt4 = he.decode(options[Qno-1][3]);
    res.render("question",{ Category: difficulty,Qno: Qno, question: q, opt1: opt1, opt2: opt2,opt3: opt3 ,opt4: opt4});  
})

app.post("/questions", function(req, res){
  //console.log(req.body);
    const selectedOption = req.body.option;
    //console.log(selectedOption);
    if(selectedOption == correctOpt[Qno-1]){
        //console.log(correctOpt[Qno-1]);
        score++;
        Qno++;
    }else{
        Qno++;
    }
    if(Qno>=questions.length){
      setTimeout(()=>{
        res.render("end", {score: score});
      },1000); 
      Qno=1;
      score=0;
      questions=[];
      options=[];
      correctOpt=[];
    }else{
      setTimeout(function(){
        res.redirect("/questions");
      },1000)   
    }
});
app.post("/", function(req, res){
    const category = req.body.category;
    difficulty = req.body.difficulty;
    const url = `https://opentdb.com/api.php?amount=11&difficulty=${difficulty}&category=${category}&type=multiple`;
    axios.get(url)
  .then((response) => {
    const data = response.data;
    const results = data.results;
    results.forEach((element) => {
      questions.push(element.question);
      const allOptions = [...element.incorrect_answers, element.correct_answer];
      shuffleArray(allOptions);
      options.push(allOptions);
      correctOpt.push(element.correct_answer);
    });
    //console.log(correctOpt);
    // console.log(questions);
    // console.log(options);
    setTimeout(function(){
        res.redirect("/questions");
    },3000)
  })
  .catch((error) => {
    console.log(error);
  });
  
});

app.post("/home", function(req, res){
  setTimeout(()=>{
    res.redirect("/")
  }, 1000);
})

app.listen(process.env.PORT||3000, function() { 
    console.log("Server is up at 3000");
});