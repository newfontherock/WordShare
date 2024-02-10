function runGame() {
  const serverURL = "http://localhost:3000";
      
  let myTable = document.getElementById("puzzle");
  
  class WordShareGame {

    constructor(i, j) {
      this.cellNumberThisAttempt = i;
      this.attemptNumber = j;
    }

    guess = new String("");
    solution = new String("");
    keyboardString = "QWERTYUIOP<ASDFGHJKL*ZXCVBNM";
    
    isSolved() { 
      return(this.guess===this.solution);
    }

    insertNextLetter(letter) {
      if (!(this.isSolved())) {
        var myBody = document.getElementsByTagName("body")[0];
        myTable = document.getElementsByTagName("table")[1]; //[0] is the title "Word Share"

        if (this.cellNumberThisAttempt != 5) {
          var myRow = myTable.getElementsByTagName("tr")[this.attemptNumber];
          var myCell = myRow.getElementsByTagName("td")[this.cellNumberThisAttempt];
          myCell.innerText = letter;
          if (this.cellNumberThisAttempt < 5) {
            this.cellNumberThisAttempt++;
          }
        }
      }
      
    }

    deletePreviousCell() {
      var myBody = document.getElementsByTagName("body")[0];
      myTable = document.getElementsByTagName("table")[1]; //[0] is the title "Word Share"
      var myRow = myTable.getElementsByTagName("tr")[this.attemptNumber];
      if (myRow.getElementsByTagName("td")[0].classList.contains("shake")) {
        for (var i = 0; i < 5; i++) {
          myRow.getElementsByTagName("td")[i].classList.remove("shake"); //allows us to tell the user you made another word up on this attempt!
        }
      }
      if (this.cellNumberThisAttempt != 0) { // 5 means complete answer
        this.cellNumberThisAttempt--;
      }
      var myCell = myRow.getElementsByTagName("td")[this.cellNumberThisAttempt];
      myCell.innerText = "  ";
    }

    async getTodaysSolution() {
      try {
        const response = await fetch(serverURL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const solution = await response.text();
        return(solution);
      } catch (error) {
        
        console.error(error);
        return("N/A")
      }
   
    }

    async getColors() {      
      let myTable = document.getElementsByTagName("table")[1];
      let myRow = myTable.getElementsByTagName("tr")[this.attemptNumber];
      let cellArray = Array.from(myRow.cells);
      let answer = this.solution.toLowerCase();
      let alreadyFoundTheseGreen = [""];
      cellArray.map(function (cell, index) {
        
        setTimeout(() => {
          let cellCharacter = cell.innerHTML.toLowerCase();
          let indexForSearchedLetter = answer.indexOf(cellCharacter);
          
          if (index == indexForSearchedLetter) {
            console.log("Turn letter at this index Green");
            cell.classList.add("right");
            alreadyFoundTheseGreen[alreadyFoundTheseGreen.length] = answer[index];// for repeat letters after the present index.
          }

          else if (indexForSearchedLetter != -1) {
            if (alreadyFoundTheseGreen.includes(cellCharacter)) { 
              // Covers the problem of repeat letters, when first iteration of letter is green, The second instance will always be yellow, unless indexOf() is called again starting from the present index.
              if (answer.indexOf(cellCharacter, index) === index) {
                cell.classList.add("right");
              }
              else {
                console.log("Turn Letter at this index Yellow");
                cell.classList.add("halfRight");
              }
            }
            else {
              console.log("Turn Letter at this index Yellow");
              cell.classList.add("halfRight");
            }
          }
          else {
            console.log("Turn letter at this index Grey");
            cell.classList.add("wrong");
          }
        }, ((index + 1) * 500) / 2); 
        
        if(!wsGame.isSolved()) {
          cell.classList.add("flip");
          cell.style.animationDelay = `${ (index * 500) / 2 }ms`;
        }
      });

      if(wsGame.isSolved()) {
        // cell.classList.add("bounce");
          // cell.style.animationDelay = `${1600}ms`;
        for (var i = 0; i < 5; i++) {
          
          cellArray[i].classList.add("win" +`${(i)}`);
        }
      }
      
    }

    async checkAnswer() {
      if (this.isSolved()) {
        return;
      }
      if(this.attemptNumber === 0) { 
        try {
          const rightAnswer = await this.getTodaysSolution().then(rightAnswer => {
            if (rightAnswer === "N/A") {
              alert("Server is down, please check your internet connection, or contact developer: davewalters7@gmail.com");
              return;
            }
            this.solution = rightAnswer;  
            console.log("client solution" + this.solution);

            if (this.solution == "not updated yet!") {
              alert("The correct answer for Wordle is pulled from the Wordle Review page of the New York Times at 3:00 AM Eastern. Please check back then!");
              return;
            }
            if (this.cellNumberThisAttempt == 5) {
              var myTable = document.getElementsByTagName("table")[1]; //[0] is the title "Word of the Day"

              var myRow = myTable.getElementsByTagName("tr")[this.attemptNumber];
              this.guess = "";
              for (var i = 0; i < 5; i++) {
                this.guess = this.guess + myRow.getElementsByTagName("td")[i].innerText;
                console.log("guess" + this.guess);
             }

              this.guess = this.guess.toLowerCase(); 
              this.solution = this.solution.toLowerCase();
            
              if (!allAnswers.includes(this.guess)) {
                console.log("Makie it shake!!!!");
                for (var i = 0; i < 5; i++){
                  myRow.getElementsByTagName("td")[i].classList.add("shake");
                }
                return;
              }
            }
            else {
              console.log("User pressed entered key with < 5 letters, do nothing");
              return;
              //TODO: come up with custom alert.
            } 
            this.getColors();
            this.attemptNumber++;
            this.cellNumberThisAttempt = 0;
          }); 
        } catch(error) {
          console.error(error);
        }
      }
    
      else { //  attempt numbers 1 through 4
        
        if (this.solution == "not updated yet!") {
          //TODO: Custom Alert
          alert("The correct answer for Wordle is pulled from the Wordle Review page of the New York Times at 3:00 AM Eastern. Please check back then!");
          return;
        }
        if (this.cellNumberThisAttempt == 5) {
          var myTable = document.getElementsByTagName("table")[1]; //[0] is the title "Word of the Day!"
          var myRow = myTable.getElementsByTagName("tr")[this.attemptNumber];
          this.guess = "";
          for (var i = 0; i < 5; i++) {
            this.guess = this.guess + myRow.getElementsByTagName("td")[i].innerText;
            console.log("guess" + this.guess);
          }

        this.guess = this.guess.toLowerCase(); 
        this.solution = this.solution.toLowerCase();
        
        if (!allAnswers.includes(this.guess)) {
          alert("Word not in Dictionary... animate row: shake back and forth");
          return;
        }
      }
      else {
        alert("The answer is 5 letters!");
        return;
        //TODO: come up with custom alert.
      }

      this.getColors();
      this.attemptNumber++;
      this.cellNumberThisAttempt = 0;
      }
    } 

    createHTMLKeyboard() {
      for (var i = 0; i < this.keyboardString.length; i++) {
        if (this.keyboardString[i] == "<") {

          let keyboard = document.getElementsByTagName("p")[0];
          let button = document.createElement("button");
          button.innerHTML = "<"; 
          button.className = "delete";
          keyboard.appendChild(button);
          button.setAttribute("onclick", "wsGame.deletePreviousCell()");
          let br = document.createElement("br");
          keyboard.appendChild(br);

        }
        else if (this.keyboardString[i] == "*") {
          let keyboard = document.getElementsByTagName("p")[0];
          let button = document.createElement("button");
          button.innerHTML = "Enter";

          button.type = "submit";
          button.className = "enter";

          keyboard.appendChild(button);
          
          button.setAttribute("onclick", "wsGame.checkAnswer()");
          
          let br = document.createElement("br");
          keyboard.appendChild(br);
        }
        else {
          let keyboard = document.getElementsByTagName("p")[0];
          let button = document.createElement("button");
          button.innerHTML = this.keyboardString[i];

          button.className = "button";

          keyboard.appendChild(button);
          button.setAttribute("onclick", "wsGame.insertNextLetter(\(this.innerHTML))");

        }
      }
    }
  }

  // Source: https://codingbeautydev.com/blog/javascript-check-if-character-is-letter/
  function isCharLetter(ch) {
    return ch.toLowerCase() !== ch.toUpperCase();
  }


  var wsGame = new WordShareGame(0, 0); //0,0 is top left, the first word, first letter of Table
  
  wsGame.createHTMLKeyboard();
  
  document.addEventListener('keyup', (event) => {

    var name = event.key;
    var keyCode = event.keyCode;

    if (keyCode >= 48 && keyCode <= 90) {
      wsGame.insertNextLetter(name.toUpperCase())
    }
    else if (keyCode === 13) {
      wsGame.checkAnswer();
    }
    else if (keyCode === 46 || keyCode === 8) {
      wsGame.deletePreviousCell();
    }


  }, false);
}