let questions = [];
let currentQuestionIndex = 0;
let score = 0;
const questionTime = 15; // 15 seconds per question
let timer;

async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=15&type=multiple'); // Fetch 15 multiple-choice questions
        const data = await response.json();
        questions = data.results.map((question) => ({
            question: question.question,
            options: [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5),
            answer: question.correct_answer
        }));
        updateQuestionTracker(); // Update question tracker after fetching questions
        loadQuestion();
    } catch (error) {
        console.error('Error fetching questions:', error);
    }
}

function loadQuestion() {
    resetTimer();
    const currentQuestion = questions[currentQuestionIndex];
    document.querySelector('.question').innerText = currentQuestion.question;
    const options = document.querySelectorAll('.option');
    options.forEach((option, index) => {
        option.innerText = currentQuestion.options[index];
        option.classList.remove('correct', 'incorrect');
        option.style.backgroundColor = '#4169e1';
        option.style.pointerEvents = 'auto';
    });
}

function startTimer() {
    let timeLeft = questionTime;
    updateTimer(timeLeft);
    timer = setInterval(() => {
        timeLeft--;
        updateTimer(timeLeft);
        if (timeLeft === 0) {
            clearInterval(timer);
            handleTimeout();
        }
    }, 1000);
}

function updateTimer(seconds) {
    document.querySelector('.timer-btn').innerText = seconds;
}

function resetTimer() {
    clearInterval(timer);
    document.querySelector('.timer-btn').innerText = questionTime;
}

function checkAnswer(selectedOption) {
    clearInterval(timer);
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption.innerText === currentQuestion.answer) {
        selectedOption.classList.add('correct');
        score++;
        document.getElementById('score').innerText = score;
    } else {
        selectedOption.classList.add('incorrect');
    }
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });
    document.getElementById('next-btn').style.display = 'block'; // Display next button immediately
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
        updateQuestionTracker(); // Update question tracker when loading next question
        resetTimer();
        startTimer();
        document.getElementById('next-btn').style.display = 'none'; // Hide next button after loading new question
    } else {
        clearInterval(timer);
        document.getElementById('next-btn').style.display = 'none';
    }
}

function handleTimeout() {
    const currentQuestion = questions[currentQuestionIndex];
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        if (option.innerText === currentQuestion.answer) {
            option.classList.add('correct');
        }
        option.style.pointerEvents = 'none';
    });
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        document.getElementById('next-btn').style.display = 'block';
        updateQuestionTracker(); // Update question tracker after timeout
    } else {
        clearInterval(timer);
        document.getElementById('next-btn').style.display = 'none';
    }
}

function updateQuestionTracker() {
    document.getElementById('current-question').innerText = currentQuestionIndex + 1;
    document.getElementById('total-questions').innerText = questions.length;
}

fetchQuestions();
