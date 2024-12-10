const form = document.querySelector('#age-form');
const dayInput = document.querySelector('#day');
const monthInput = document.querySelector('#month');
const yearInput = document.querySelector('#year');
const resultYears = document.querySelector('.years');
const resultMonths = document.querySelector('.months');
const resultDays = document.querySelector('.days');
const submitButton = document.querySelector('.card__button');

const validateInput = (input, min, max) => {
  const value = parseInt(input.value);
  if (isNaN(value) || value < min || value > max) {
    input.classList.add('card__input--error');
    return false;
  }
  input.classList.remove('card__input--error');
  return true;
};

const calculateAge = (birthDate) => {
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (months < 0 || (months === 0 && days < 0)) {
    years--;
    months += 12;
  }

  if (days < 0) {
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, birthDate.getDate());
    days = Math.floor((today - lastMonth) / (1000 * 60 * 60 * 24));
    months--;
  }

  return { years, months, days };
};

const animateNumber = (element, endValue, duration = 1000) => {
  const startValue = 0;
  const startTime = performance.now();
  
  const update = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
    
    element.textContent = current;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };
  
  requestAnimationFrame(update);
};

const resetResults = () => {
  resultYears.textContent = '--';
  resultMonths.textContent = '--';
  resultDays.textContent = '--';
};

const handleInput = (input) => {
  input.addEventListener('input', () => {
    input.classList.remove('card__input--error');
  });
};

[dayInput, monthInput, yearInput].forEach(handleInput);

const animateSubmitButton = () => {
  submitButton.classList.add('calculating');
  setTimeout(() => {
    submitButton.classList.remove('calculating');
  }, 2000); // Duration of the animation
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  animateSubmitButton();
  
  const isValidDay = validateInput(dayInput, 1, 31);
  const isValidMonth = validateInput(monthInput, 1, 12);
  const isValidYear = validateInput(yearInput, 1900, new Date().getFullYear());

  if (!isValidDay || !isValidMonth || !isValidYear) {
    resetResults();
    return;
  }

  const birthDate = new Date(yearInput.value, monthInput.value - 1, dayInput.value);
  const age = calculateAge(birthDate);

  const resultElement = document.querySelector('.card__result');
  resultElement.style.animation = 'none';
  resultElement.offsetHeight;
  resultElement.style.animation = null;

  setTimeout(() => {
    animateNumber(resultYears, age.years);
    animateNumber(resultMonths, age.months);
    animateNumber(resultDays, age.days);
  }, 100);
});