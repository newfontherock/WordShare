import express from "express";
import got from "got";

const SOLUTIONPREFIX = "Today’s word is ";

const app = express();

const port = process.env.PORT || 3000;



 
let today = new Date();

// if ((today.getHours() == 4 && today.getMinutes() >= 30) || today.getHours() > 4) {
// //TODO: add if (all the stuff on if line) + client local after midnight
//   console.log("Time to update the Solution!")

  let year = today.getFullYear();
  let month  = today.getMonth() + 1;
  let day = today.getDate();
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }
  let solution = "";

  got("https://www.nytimes.com/" + year +"/" + month +"/" + day+ "/crosswords/wordle-review.html").then((result) => {
    
    let sourceString = String(result.body);
        
    let solutionStartingIndex = sourceString.search(SOLUTIONPREFIX) + SOLUTIONPREFIX.length;
    solution  =  sourceString.substring(solutionStartingIndex, solutionStartingIndex + 5);
  }); 
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  app.get('/', function(req, res){
  
    console.log("Here's my solution: " + solution);      // your JSON
      res.json({rightAnswer: solution});    // echo the result back
  });
  

  app.listen(port, () => {
    console.log('Now listening on port ' + port);
  });


