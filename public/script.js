const questions = [
  {
    question: "What is the capital of France?",
    options: [
      { label: "A", value: "Berlin" },
      { label: "B", value: "Madrid" },
      { label: "C", value: "Paris" },
      { label: "D", value: "Rome" },
    ],
    answer: "C",
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    options: [
      { label: "A", value: "Gold" },
      { label: "B", value: "Oxygen" },
      { label: "C", value: "Silver" },
      { label: "D", value: "Iron" },
    ],
    answer: "B",
  },
  {
    question: "What is the largest planet in our solar system?",
    options: [
      { label: "A", value: "Earth" },
      { label: "B", value: "Jupiter" },
      { label: "C", value: "Saturn" },
      { label: "D", value: "Neptune" },
    ],
    answer: "B",
  },
  {
    question: "Which programming language is known as the language of the web?",
    options: [
      { label: "A", value: "Python" },
      { label: "B", value: "Java" },
      { label: "C", value: "JavaScript" },
      { label: "D", value: "C++" },
    ],
    answer: "C",
  },
  {
    question: "What is the powerhouse of the cell?",
    options: [
      { label: "A", value: "Nucleus" },
      { label: "B", value: "Ribosome" },
      { label: "C", value: "Mitochondria" },
      { label: "D", value: "Endoplasmic Reticulum" },
    ],
    answer: "C",
  },
];

let count = 0;
let score = 0;
let username = ""; // Variable to store the username
let timeRemaining = 15; // Declare timeRemaining as a global variable

const disabledQuestions = new Set(); // To keep track of disabled questions
const answerColors = new Map(); // To store colors for each option

// Function to fetch username from /data endpoint
async function fetchUsername() {
  const response = await fetch("/data");
  const data = await response.json();

  username = data.username; // Store the fetched username in the variable
  document.getElementById("welcome").innerHTML = `Welcome ${username}`;
}

function updateQuestion() {
  const question = questions[count];
  document.getElementById("h2").innerHTML = question.question;

  // Update buttons
  question.options.forEach((option) => {
    const button = document.getElementById(`option${option.label}`);
    button.innerHTML = `${option.label}) ${option.value}`;
    button.dataset.questionIndex = count; // Set the question index

    // Enable or disable buttons based on the state
    if (disabledQuestions.has(count)) {
      button.classList.add("disabled");
      button.disabled = true;
      button.style.backgroundColor =
        answerColors.get(`${count}-${option.label}`) || ""; // Set the color if stored
    } else {
      button.classList.remove("disabled");
      button.disabled = false;
      button.style.backgroundColor = ""; // Reset background color
    }
  });

  // Navigation button state
  document.getElementById("preBtn").style.opacity = count > 0 ? 1 : 0;
  document.getElementById("span").innerHTML =
    count < questions.length - 1 ? "Next" : "Save";
}

function timer() {
  if (timeRemaining < 10) {
    document.getElementById("timer").style.color = "red";
  }

  if (timeRemaining < 1) {
    document.getElementById("timer").innerHTML = "Time OUT!";
    clearInterval(inter); // Stop the timer when time runs out

    // Disable all buttons for the current question
    const buttons = document.querySelectorAll(".optBtn");
    buttons.forEach((button) => {
      if (button.dataset.questionIndex == count) {
        button.classList.add("disabled");
        button.disabled = true;
      }
    });

    // Track the current question as disabled due to timeout
    disabledQuestions.add(count);
  } else {
    document.getElementById("timer").innerHTML = `${timeRemaining}`;
    timeRemaining--; // Decrement the timeRemaining
  }
}

function handleOptionClick(event) {
  const buttons = document.querySelectorAll(".optBtn");
  const clickedButton = event.target;
  const currentQuestion = questions[count];
  const clickedOptionLabel = clickedButton.textContent[0];

  if (clickedButton.dataset.questionIndex == count) {
    // Check answer and style accordingly
    if (clickedOptionLabel === currentQuestion.answer) {
      clickedButton.style.backgroundColor = "rgba(0, 255, 0, 0.5)"; // Green
      score++;
    } else {
      clickedButton.style.backgroundColor = "rgba(255, 0, 0, 0.5)"; // Red
      // Update correct answer button color
      buttons.forEach((button) => {
        if (
          button.dataset.questionIndex == count &&
          button.textContent[0] === currentQuestion.answer
        ) {
          button.style.backgroundColor = "rgba(0, 255, 0, 0.5)"; // Green
        }
      });
    }
    // Store colors for the current question
    questions[count].options.forEach((option) => {
      if (option.label === currentQuestion.answer) {
        answerColors.set(`${count}-${option.label}`, "rgba(0, 255, 0, 0.5)"); // Green for correct answer
      } else if (option.label === clickedOptionLabel) {
        answerColors.set(`${count}-${option.label}`, "rgba(255, 0, 0, 0.5)"); // Red for selected wrong answer
      }
    });

    // Disable buttons for the current question
    buttons.forEach((button) => {
      if (button.dataset.questionIndex == count) {
        button.classList.add("disabled");
        button.disabled = true;
      }
    });
    // Track the current question as disabled
    disabledQuestions.add(count);
  }
}

function setupEventListeners() {
  const buttons = document.querySelectorAll(".optBtn");

  buttons.forEach((button) => {
    button.addEventListener("click", handleOptionClick);
  });
}

function nextBtn() {
  if (count < questions.length - 1) {
    count++;

    timeRemaining = 15;

    // Reset the timer for the next question
    updateQuestion();
    console.log(timeRemaining);
  } else {
    // Log the score when the last question is reached and "Save" is clicked
    console.log(`Your final score is: ${score}`);
    document.getElementById("question-container").style.opacity = 0;
    document.getElementById("welcome").style.opacity = 0;
    document.getElementById("timer").style.opacity = 0;
    document.getElementById(
      "score"
    ).innerHTML = `${username}, Your score is ${score}`; // Use the stored username here

    const buttons = document.getElementsByClassName("prenextbtn");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].style.opacity = 0;
    }
  }
}

function preBtn() {
  if (count > 0) {
    count--;
    timeRemaining = 15; // Reset the timer for the previous question
    updateQuestion();
  }
}

const timeoutQuestion = () => {
  // set timer to timout for answered questions
};

// Initialize and start the timer

const inter = setInterval(timer, 1000);

// Fetch username and initialize
fetchUsername();
updateQuestion();
setupEventListeners();
