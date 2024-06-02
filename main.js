let quizzdb = {
  "allgemeine Fragen": [
    { a: "2 + 2", l: ["4", "3", "5", "6"] },
    { a: "3 * 5", l: ["15", "12", "25", "18"] },
    { a: "7 - 3", l: ["4", "3", "2", "5"] },
    { a: "8 / 2", l: ["4", "3", "2", "5"] },
  ],
  "Mathematik": [
    { a: "x^2 + x^2", l: ["2x^2", "x^4", "x^8", "2x^4"] },
    { a: "x^2 * x^2", l: ["x^4", "x^2", "2x^2", "4x"] },
    { a: "2x + 3x", l: ["5x", "6x", "7x", "8x"] },
    { a: "4x / 2", l: ["2x", "3x", "4x", "5x"] },
  ],
  "Internettechnologien": [
    { a: "What does HTML stand for?", l: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlink and Text Markup Language", "Home Tool Markup Language"] },
    { a: "What is CSS used for?", l: ["Styling web pages", "Creating interactive elements", "Server-side scripting", "Database management"] },
    { a: "What does HTTP stand for?", l: ["Hypertext Transfer Protocol", "High Tech Transfer Protocol", "Hyperlink and Text Transfer Protocol", "Home Tool Transfer Protocol"] },
    { a: "What is the role of JavaScript?", l: ["Adding interactivity to websites", "Styling web pages", "Database management", "Server-side scripting"] },
  ],
};

let startbtn = document.getElementById("startbtn");
let nextbtn = document.getElementById("nextbtn");
let currentQuestionIndex = 0;
let score = 0;
const startdiv = document.getElementById("start");
let qusetionsdiv = document.getElementById("qusetions");
let qusetiontext = document.getElementById("qusetiontext");
let scoreDisplay = document.querySelector(".score");

document.addEventListener("DOMContentLoaded", function () {
  var categoryList = document.getElementById("category");
  var listItems = categoryList.getElementsByTagName("li");
  let starth1 = document.querySelector("#start h1");

  for (var i = 0; i < listItems.length; i++) {  // um duie Clicks zu aktivieren 
    listItems[i].addEventListener("click", function () {
      // Remove 'active' class from all list items
      for (var j = 0; j < listItems.length; j++) {
        listItems[j].classList.remove("active");
      }

      // Add 'active' class to the clicked list item
      this.classList.add("active");   //for the selected class auf zu rufen
      starth1.innerHTML = this.innerHTML;
      startbtn.style.display = "block";
      qusetionsdiv.style.display = "none";

      if (this.innerHTML === "Externel Aufgabe laden") {    // im Falle von clicken der Externe Aufgabe soll es gelsden werden
        loadExternalQuestions();
      }
    });
  }
});

startbtn.addEventListener("click", startquizz);
nextbtn.addEventListener("click", nextQuestion);

function startquizz() {     // um den Block der selectierten Thema zu holen
  qusetionsdiv.style.display = "block";
  startdiv.style.display = "none";
  loadQuestions();
  showQuestion(currentQuestionIndex);
}

function loadQuestions() {    // um die Fragen der Block zu zeigen
  let categoryQuestions = quizzdb[document.querySelector("#start h1").innerHTML];
  quizzdb[document.querySelector("#start h1").innerHTML] = shuffle(categoryQuestions);
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function showQuestion(index) {
  const currentQuestion = quizzdb[document.querySelector("#start h1").innerHTML][index];
  document.getElementById("qusetiontext").innerHTML = currentQuestion.a;
  let seq = index + 1;
  document.getElementById("legend").innerHTML = "Frage " + seq;
  let prog = (index / quizzdb[document.querySelector("#start h1").innerHTML].length) * 100;
  document.getElementById("progress").style.width = prog + "%";
  document.getElementById("progress").innerHTML = Math.round(prog) + "%";

  let optionsList = document.getElementById('options');
  optionsList.innerHTML = '';

  let shuffledOptions = shuffle([...currentQuestion.l]);

  for (let i = 0; i < shuffledOptions.length; i++) {
    let option = document.createElement('li');
    option.innerHTML = '<input type="radio" name="answer" value="' + shuffledOptions[i] + '">' + shuffledOptions[i];
    optionsList.appendChild(option);
  }
}

function loadExternalQuestions() {
  const apiUrl = 'https://opentdb.com/api.php?amount=10&category=9&type=multiple';

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      quizzdb["Externel Aufgabe laden"] = data.results.map(question => {
        return {
          a: question.question,
          l: [...question.incorrect_answers, question.correct_answer]
        };
      });

      shuffle(quizzdb["Externe Aufgabe laden"]);
    })
    .catch(error => console.error('Error fetching trivia questions from the Open Trivia Database:', error));
}

function nextQuestion() {
  const selectedAnswer = document.querySelector('input[name="answer"]:checked');

  if (selectedAnswer) {
    let userAnswer = selectedAnswer.value;
    let currentQuestion = quizzdb[document.querySelector("#start h1").innerHTML][currentQuestionIndex];
    let correctAnswer = currentQuestion.l[0]; // Assuming the correct answer is always the first one

    if (userAnswer === correctAnswer) { // wenn der Antwort richtig ist, wird sich der Score erhöhen
      score++;
    }
    scoreDisplay.textContent = "Du hast: " + score + " von " + quizzdb[document.querySelector("#start h1").innerHTML].length + " erreicht";
    currentQuestionIndex++;

    if (currentQuestionIndex < quizzdb[document.querySelector("#start h1").innerHTML].length) {
      showQuestion(currentQuestionIndex);
    } else {
      qusetiontext.innerHTML = 'Quiz ist zu Ende, du bist Fertig :) ';
      document.getElementById("progress").style.width = "100%";
      document.getElementById("progress").innerHTML = "100%";

      scoreDisplay.textContent = "Du hast: " + score + " von " + quizzdb[document.querySelector("#start h1").innerHTML].length + " erreicht";

      let grade = getGrade(score);
      document.getElementById('gradeDisplay').textContent = "Deine Note: " + grade;

      document.getElementById('options').innerHTML = '';
      nextbtn.style.display = 'none';

      var resetButton = document.getElementById("resetButton");

      resetButton.addEventListener("click", function() {
        location.reload();
      });
    }
  } else {
    alert('Bitte wählen Sie eine Antwort, bevor Sie zur nächsten Frage gehen.');
  }
}

function getGrade(score) {
  if (score === 2) {
    return "Ausreichend";
  } else if (score === 3) {
    return "Gut";
  } else if (score >= 4) {
    return "Sehr Gut";
  } else {
    return "Nicht ausreichend";
  }
}
