// Core JavaScript for managing flashcard flipping, navigation, and 'learned' status

const flashcardSection = document.getElementById('flashcard-section');
const flashcardElement = document.getElementById('flashcard');
const flashcardFront = document.getElementById('flashcard-front');
const flashcardBack = document.getElementById('flashcard-back');
const flipCardBtn = document.getElementById('flip-card-btn');
const prevCardBtn = document.getElementById('prev-card-btn');
const nextCardBtn = document.getElementById('next-card-btn');
const markLearnedBtn = document.getElementById('mark-learned-btn');
const flashcardProgressText = document.getElementById('flashcard-progress-text');

let currentFlashcardData = [];
let currentCardIndex = 0;
let flashcardLearnedStatus = {}; // { cardId: true/false }
let flashcardTopicKey = ''; // Will be set by topic-loader.js

const initializeFlashcards = (topicData, topicKey) => {
    currentFlashcardData = topicData.flashcards;
    flashcardTopicKey = topicKey;
    currentCardIndex = 0;
    loadFlashcardProgress();
    displayFlashcard();
    updateFlashcardProgressDisplay();
};

const displayFlashcard = () => {
    if (currentFlashcardData.length === 0) {
        flashcardFront.textContent = 'No flashcards available.';
        flashcardBack.textContent = '';
        flipCardBtn.disabled = true;
        prevCardBtn.disabled = true;
        nextCardBtn.disabled = true;
        markLearnedBtn.disabled = true;
        flashcardElement.classList.remove('flipped');
        return;
    }

    const card = currentFlashcardData[currentCardIndex];
    flashcardFront.textContent = card.front;
    flashcardBack.textContent = card.back;

    flashcardElement.classList.remove('flipped');

    // Update 'Mark as Learned' button state
    const cardId = card.id; // Assuming each flashcard has a unique ID
    if (flashcardLearnedStatus[cardId]) {
        markLearnedBtn.textContent = 'Marked as Learned';
        markLearnedBtn.disabled = true;
        markLearnedBtn.style.backgroundColor = 'var(--secondary-color)';
        markLearnedBtn.style.borderColor = 'var(--secondary-color)';
        markLearnedBtn.style.color = 'var(--bg-white)';
    } else {
        markLearnedBtn.textContent = 'Mark as Learned';
        markLearnedBtn.disabled = false;
        markLearnedBtn.style.backgroundColor = ''; // Reset to default
        markLearnedBtn.style.borderColor = '';
        markLearnedBtn.style.color = '';
    }

    // Disable prev/next buttons at ends
    prevCardBtn.disabled = currentCardIndex === 0;
    nextCardBtn.disabled = currentCardIndex === currentFlashcardData.length - 1;
    flipCardBtn.disabled = false;
};

const flipCard = () => {
    flashcardElement.classList.toggle('flipped');
};

const navigateCards = (direction) => {
    flashcardElement.classList.remove('flipped'); // Always flip back before navigating
    setTimeout(() => { // Small delay for visual effect
        currentCardIndex += direction;
        if (currentCardIndex < 0) {
            currentCardIndex = 0;
        } else if (currentCardIndex >= currentFlashcardData.length) {
            currentCardIndex = currentFlashcardData.length - 1;
        }
        displayFlashcard();
    }, 100); // Adjust delay as needed
};

const markCardAsLearned = () => {
    if (currentFlashcardData.length === 0) return;

    const card = currentFlashcardData[currentCardIndex];
    if (card && card.id) {
        flashcardLearnedStatus[card.id] = true;
        saveFlashcardProgress();
        displayFlashcard(); // Update button state
        updateFlashcardProgressDisplay();
    }
};

const saveFlashcardProgress = () => {
    if (flashcardTopicKey) {
        LocalStorageManager.saveProgress(`flashcards_${flashcardTopicKey}`, flashcardLearnedStatus);
    }
};

const loadFlashcardProgress = () => {
    if (flashcardTopicKey) {
        const savedProgress = LocalStorageManager.loadProgress(`flashcards_${flashcardTopicKey}`);
        if (savedProgress) {
            flashcardLearnedStatus = savedProgress;
        }
    }
};

const updateFlashcardProgressDisplay = () => {
    const learnedCount = Object.values(flashcardLearnedStatus).filter(status => status).length;
    const totalCards = currentFlashcardData.length;
    flashcardProgressText.textContent = `${learnedCount}/${totalCards} learned`;
};

flipCardBtn.addEventListener('click', flipCard);
prevCardBtn.addEventListener('click', () => navigateCards(-1));
nextCardBtn.addEventListener('click', () => navigateCards(1));
markLearnedBtn.addEventListener('click', markCardAsLearned);

// Exposed functions for topic-loader.js
window.initializeFlashcards = initializeFlashcards;
window.loadFlashcardProgress = loadFlashcardProgress;
window.updateFlashcardProgressDisplay = updateFlashcardProgressDisplay;
