// Dedicated JavaScript module for handling all interactions with browser local storage

const LocalStorageManager = {
    saveProgress: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            console.log(`Progress for ${key} saved successfully.`);
        } catch (e) {
            console.error(`Error saving progress for ${key}:`, e);
        }
    },

    loadProgress: (key) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error(`Error loading progress for ${key}:`, e);
            return null;
        }
    },

    clearProgress: (key) => {
        try {
            localStorage.removeItem(key);
            console.log(`Progress for ${key} cleared successfully.`);
        } catch (e) {
            console.error(`Error clearing progress for ${key}:`, e);
        }
    },

    clearAllProgress: () => {
        try {
            localStorage.clear();
            console.log('All local storage progress cleared.');
        } catch (e) {
            console.error('Error clearing all local storage progress:', e);
        }
    }
};

// Expose the manager globally for other scripts
window.LocalStorageManager = LocalStorageManager;
