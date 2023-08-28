  // Timer function
  function startTimer(duration, display) {
    let timer = duration;
    const countdown = setInterval(function () {
      display.textContent = timer;
      timer--;

      if (timer < 0) {
        clearInterval(countdown);
        // Set the value to "None" and submit the form
        document.querySelector('input[name="ans"]').value = "None";
        document.querySelector('#quiz-form').submit();
      }
    }, 1000);
  }

// The total time for each question in seconds (30 seconds)
const questionTime = 30;
  
// Start the timer on page load
document.addEventListener('DOMContentLoaded', function () {
  const display = document.querySelector('#timer');
  startTimer(questionTime, display);
});