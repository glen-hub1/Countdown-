// --- CONFIGURATION ---
const CHRISTMAS_DAY = 25;
const CHRISTMAS_MONTH = 11; // JavaScript months are 0-11 (December is 11)
const OPEN_DURATION_HOURS = 72; // Website closes after 72 hours
// ---------------------

// Element references
const countdownEl = document.getElementById('countdown');
const countdownView = document.getElementById('countdown-view');
const surpriseView = document.getElementById('surprise-view');
const openButton = document.getElementById('open-button');
const letterContent = document.getElementById('letter-content');
const countdownMusic = document.getElementById('countdownMusic');
const christmasMusic = document.getElementById('christmasMusic');

let timerInterval;

// Function to handle the opening click on Dec 25th
function revealLetter() {
    openButton.classList.add('hidden');
    letterContent.classList.remove('hidden');

    // Switch music
    if (countdownMusic.duration > 0 && !countdownMusic.paused) {
        countdownMusic.pause();
    }
    if (christmasMusic.duration > 0) {
        christmasMusic.play().catch(e => console.log("Christmas Music Auto-Play failed:", e));
    }
}

// Function to calculate and display the countdown
function updateCountdown(targetDate) {
    const now = new Date().getTime();
    const distance = targetDate - now;

    // Time calculations
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result
    countdownEl.innerHTML = `
        <div class="timer-segment">${days}<span>Days</span></div>
        <div class="timer-segment">${hours}<span>Hours</span></div>
        <div class="timer-segment">${minutes}<span>Minutes</span></div>
        <div class="timer-segment">${seconds}<span>Seconds</span></div>
    `;
    
    // Check if the timer has reached 0
    if (distance <= 0) {
        clearInterval(timerInterval);
        initializeWebsite(); // Re-check the time to switch views
    }
}

// Main logic to determine which view to show
function initializeWebsite() {
    const now = new Date();
    const currentYear = now.getFullYear();

    // 1. Define the Christmas Open Time (Dec 25th, 12:00:00 AM)
    let christmasOpenDate = new Date(currentYear, CHRISTMAS_MONTH, CHRISTMAS_DAY, 0, 0, 0);

    // 2. Define the Christmas Close Time (Dec 28th, 12:00:00 AM, i.e., 72 hours later)
    let christmasCloseDate = new Date(christmasOpenDate.getTime() + OPEN_DURATION_HOURS * 60 * 60 * 1000);

    let targetDate;

    if (now >= christmasOpenDate && now < christmasCloseDate) {
        // --- PHASE 2: OPEN (Dec 25th - Dec 28th) ---
        
        // Stop countdown if running
        if (timerInterval) clearInterval(timerInterval);
        
        // Show the surprise view
        countdownView.classList.add('hidden-view');
        surpriseView.classList.remove('hidden-view');

        // Initial music start (it will switch upon button click)
        if (countdownMusic.duration > 0) countdownMusic.play().catch(e => console.log("Countdown Music Auto-Play failed:", e));

    } else {
        // --- PHASE 1/3: CLOSED (Countdown to the NEXT Dec 25th) ---

        // Determine the next target date
        if (now >= christmasCloseDate) {
            // If it's after this year's Christmas close, target next year's Christmas
            targetDate = new Date(currentYear + 1, CHRISTMAS_MONTH, CHRISTMAS_DAY, 0, 0, 0);
        } else {
            // If it's before this year's Christmas open, target this year's Christmas
            targetDate = christmasOpenDate;
        }

        // Show the countdown view
        surpriseView.classList.add('hidden-view');
        countdownView.classList.remove('hidden-view');
        
        // Ensure Christmas music is stopped
        if (christmasMusic.duration > 0 && !christmasMusic.paused) {
            christmasMusic.pause();
        }
        // Start countdown music
        if (countdownMusic.duration > 0) countdownMusic.play().catch(e => console.log("Countdown Music Auto-Play failed:", e));

        // Start the countdown timer
        updateCountdown(targetDate.getTime());
        timerInterval = setInterval(() => updateCountdown(targetDate.getTime()), 1000);
    }
}

// Start the whole process when the page loads
document.addEventListener('DOMContentLoaded', initializeWebsite);
