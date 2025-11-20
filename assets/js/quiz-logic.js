// Core JavaScript for managing quiz flow

const quizSection = document.getElementById('quiz-section');
const quizQuestionContainer = document.getElementById('quiz-question-container');
const quizResultsContainer = document.getElementById('quiz-results-container');
const questionNumberElement = quizQuestionContainer.querySelector('.question-number');
const questionTextElement = quizQuestionContainer.querySelector('.question-text');
const optionsContainer = quizQuestionContainer.querySelector('.options-container');
const feedbackMessageElement = quizQuestionContainer.querySelector('.feedback-message');
const nextQuestionBtn = document.getElementById('next-question-btn');
const finalScoreElement = document.getElementById('final-score');
const reviewQuizBtn = document.getElementById('review-quiz-btn');
const restartQuizBtn = document.getElementById('restart-quiz-btn');
const quizProgressBar = document.getElementById('quiz-progress-bar');
const quizProgressText = document.getElementById('quiz-progress-text');

let currentQuizData = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;
let quizTopicKey = ''; // Will be set by topic-loader.js

const initializeQuiz = (topicData, topicKey) => {
    currentQuizData = topicData.quizzes;
    quizTopicKey = topicKey;
    currentQuestionIndex = 0;
    score = 0;
    loadQuizProgress();
    displayQuestion();
    quizResultsContainer.classList.add('hidden');
    quizQuestionContainer.classList.remove('hidden');
    nextQuestionBtn.textContent = 'Next Question';
    nextQuestionBtn.disabled = true;
    feedbackMessageElement.textContent = '';
};

const displayQuestion = () => {
    if (currentQuestionIndex < currentQuizData.length) {
        const question = currentQuizData[currentQuestionIndex];
        questionNumberElement.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuizData.length}`;
        questionTextElement.textContent = question.question;
        optionsContainer.innerHTML = '';
        feedbackMessageElement.textContent = '';
        nextQuestionBtn.disabled = true;

        question.options.forEach((option, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.classList.add('option-btn');
            optionBtn.textContent = option;
            optionBtn.addEventListener('click', () => selectOption(optionBtn, index, question.correctAnswerIndex));
            optionsContainer.appendChild(optionBtn);
        });
    } else {
        showQuizResults();
    }
    updateQuizProgressBar();
};

const selectOption = (selectedBtn, selectedIndex, correctAnswerIndex) => {
    if (selectedOption === null) { // Only allow selection if not already answered
        Array.from(optionsContainer.children).forEach(btn => {
            btn.classList.remove('selected');
        });
        selectedBtn.classList.add('selected');
        selectedOption = selectedIndex;
        nextQuestionBtn.disabled = false;

        if (selectedIndex === correctAnswerIndex) {
            feedbackMessageElement.textContent = 'Correct!';
            feedbackMessageElement.style.color = 'var(--secondary-color)';
            selectedBtn.classList.add('correct');
            score++;
        } else {
            feedbackMessageElement.textContent = `Incorrect. The correct answer was: ${currentQuizData[currentQuestionIndex].options[correctAnswerIndex]}`;
            feedbackMessageElement.style.color = 'red';
            selectedBtn.classList.add('incorrect');
            // Highlight correct answer
            optionsContainer.children[correctAnswerIndex].classList.add('correct');
        }
    }
};

const nextQuestion = () => {
    if (currentQuestionIndex < currentQuizData.length - 1) {
        currentQuestionIndex++;
        selectedOption = null;
        displayQuestion();
    } else {
        showQuizResults();
    }
};

const showQuizResults = () => {
    quizQuestionContainer.classList.add('hidden');
    quizResultsContainer.classList.remove('hidden');
    finalScoreElement.textContent = `${score} out of ${currentQuizData.length}`;
    saveQuizProgress();
    updateQuizProgressBar(); // Ensure final progress is shown
};

const restartQuiz = () => {
    currentQuestionIndex = 0;
    score = 0;
    selectedOption = null;
    displayQuestion();
    quizResultsContainer.classList.add('hidden');
    quizQuestionContainer.classList.remove('hidden');
    feedbackMessageElement.textContent = '';
    nextQuestionBtn.textContent = 'Next Question';
    nextQuestionBtn.disabled = true;
    saveQuizProgress(); // Reset progress in local storage
};

const saveQuizProgress = () => {
    if (quizTopicKey) {
        const progress = {
            score: score,
            totalQuestions: currentQuizData.length,
            completed: currentQuestionIndex >= currentQuizData.length
        };
        LocalStorageManager.saveProgress(`quiz_${quizTopicKey}`, progress);
    }
};

const loadQuizProgress = () => {
    if (quizTopicKey) {
        const savedProgress = LocalStorageManager.loadProgress(`quiz_${quizTopicKey}`);
        if (savedProgress && savedProgress.completed) {
            score = savedProgress.score;
            currentQuestionIndex = savedProgress.totalQuestions; // Mark as completed
        } else if (savedProgress) {
            // If not completed, perhaps load score if needed, but restart logic might be simpler
            score = savedProgress.score || 0;
            // We don't load currentQuestionIndex to force a restart from beginning if not completed
        }
    }
};

const updateQuizProgressBar = () => {
    if (currentQuizData.length > 0) {
        const progressPercentage = (currentQuestionIndex / currentQuizData.length) * 100;
        quizProgressBar.style.width = `${progressPercentage}%`;
        quizProgressText.textContent = `${Math.round(progressPercentage)}%`;
    } else {
        quizProgressBar.style.width = '0%';
        quizProgressText.textContent = '0%';
    }
};

nextQuestionBtn.addEventListener('click', nextQuestion);
restartQuizBtn.addEventListener('click', restartQuiz);
// reviewQuizBtn functionality will be more complex, might involve re-displaying questions with answers, skipping for now.

// Exposed functions for topic-loader.js
window.initializeQuiz = initializeQuiz;
window.loadQuizProgress = loadQuizProgress;
window.updateQuizProgressBar = updateQuizProgressBar;
