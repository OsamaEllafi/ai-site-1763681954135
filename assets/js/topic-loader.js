// JavaScript for dynamically populating quiz/flashcard templates

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const topic = urlParams.get('topic');

    const pathParts = window.location.pathname.split('/');
    const currentPage = pathParts[pathParts.length - 1]; // e.g., grammar-quiz-template.html

    let dataFile = '';
    let topicType = '';
    if (currentPage.includes('grammar')) {
        dataFile = 'assets/data/grammar-data.json';
        topicType = 'grammar';
    } else if (currentPage.includes('vocabulary')) {
        dataFile = 'assets/data/vocabulary-data.json';
        topicType = 'vocabulary';
    }

    if (!topic || !dataFile) {
        document.getElementById('topic-title').textContent = 'Topic Not Found';
        console.error('Topic or data file not specified in URL.');
        return;
    }

    try {
        const response = await fetch(dataFile);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const allTopicsData = await response.json();
        const selectedTopicData = allTopicsData[topic];

        if (!selectedTopicData) {
            document.getElementById('topic-title').textContent = 'Topic Data Not Available';
            console.error(`Data for topic '${topic}' not found in ${dataFile}.`);
            return;
        }

        // Update topic title
        document.getElementById('topic-title').textContent = selectedTopicData.name;

        // Initialize Quiz and Flashcard modes
        const quizModeBtn = document.getElementById('quiz-mode-btn');
        const flashcardModeBtn = document.getElementById('flashcard-mode-btn');
        const quizSection = document.getElementById('quiz-section');
        const flashcardSection = document.getElementById('flashcard-section');

        const showQuizMode = () => {
            quizSection.classList.remove('hidden');
            flashcardSection.classList.add('hidden');
            quizModeBtn.classList.add('active');
            flashcardModeBtn.classList.remove('active');
        };

        const showFlashcardMode = () => {
            flashcardSection.classList.remove('hidden');
            quizSection.classList.add('hidden');
            flashcardModeBtn.classList.add('active');
            quizModeBtn.classList.remove('active');
        };

        quizModeBtn.addEventListener('click', showQuizMode);
        flashcardModeBtn.addEventListener('click', showFlashcardMode);

        // Initialize quiz and flashcards using global functions from their respective scripts
        if (typeof initializeQuiz === 'function') {
            initializeQuiz(selectedTopicData, topic);
        }
        if (typeof initializeFlashcards === 'function') {
            initializeFlashcards(selectedTopicData, topic);
        }

        // Default to quiz mode on load
        showQuizMode();

    } catch (error) {
        console.error('Failed to load topic data:', error);
        document.getElementById('topic-title').textContent = 'Error Loading Content';
    }
});
