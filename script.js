const currentTimeEl = document.getElementById('currentTime');
const currentDateEl = document.getElementById('currentDate');
const targetPreviewEl = document.getElementById('targetPreview');
const targetDayTextEl = document.getElementById('targetDayText');
const targetTimeEl = document.getElementById('targetTime');
const calculateBtn = document.getElementById('calculateBtn');
const countdownTextEl = document.getElementById('countdownText');
const statusTextEl = document.getElementById('statusText');
const totalMinutesEl = document.getElementById('totalMinutes');
const finishAtEl = document.getElementById('finishAt');
const chips = document.querySelectorAll('.chip');
const countdownPanel = document.querySelector('.countdown-panel');

let activeTarget = null;

function pad(num) {
  return String(num).padStart(2, '0');
}

function formatDate(date) {
  return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
}

function formatTime(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function formatShortTime(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getTargetDateFromTimeValue(value) {
  const now = new Date();
  const [hours, minutes] = value.split(':').map(Number);
  const target = new Date(now);
  target.setHours(hours, minutes, 0, 0);

  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  return target;
}

function updateClock() {
  const now = new Date();
  currentTimeEl.textContent = formatTime(now);
  currentDateEl.textContent = formatDate(now);

  if (activeTarget) {
    renderCountdown();
  }
}

function renderCountdown() {
  const now = new Date();
  const diffMs = activeTarget - now;

  if (diffMs <= 0) {
    countdownTextEl.textContent = '已完成';
    statusTextEl.textContent = '充電完成時間已到 ✨';
    totalMinutesEl.textContent = '0';
    finishAtEl.textContent = formatShortTime(activeTarget);
    countdownPanel.classList.remove('is-ready');
    return;
  }

  const totalMinutes = Math.floor(diffMs / 1000 / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  countdownTextEl.textContent = `${hours} 小時 ${minutes} 分鐘`;
  statusTextEl.textContent = `從現在到 ${formatShortTime(activeTarget)} 還有 ${totalMinutes} 分鐘`;
  totalMinutesEl.textContent = totalMinutes;
  finishAtEl.textContent = formatShortTime(activeTarget);
  countdownPanel.classList.add('is-ready');
}

function calculateRemainingTime() {
  const value = targetTimeEl.value;

  if (!value) {
    countdownTextEl.textContent = '-- 小時 -- 分鐘';
    statusTextEl.textContent = '請先輸入預計完成時間';
    totalMinutesEl.textContent = '--';
    finishAtEl.textContent = '--:--';
    targetPreviewEl.textContent = '尚未設定';
    targetDayTextEl.textContent = '請先選擇時間';
    countdownPanel.classList.remove('is-ready');
    activeTarget = null;
    return;
  }

  activeTarget = getTargetDateFromTimeValue(value);
  const now = new Date();
  const isTomorrow = activeTarget.toDateString() !== now.toDateString();

  targetPreviewEl.textContent = value;
  targetDayTextEl.textContent = isTomorrow ? '將於明天完成' : '將於今天完成';

  renderCountdown();
}

calculateBtn.addEventListener('click', calculateRemainingTime);
targetTimeEl.addEventListener('change', calculateRemainingTime);

chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    const minutesToAdd = Number(chip.dataset.addMinutes);
    const target = new Date(Date.now() + minutesToAdd * 60 * 1000);
    targetTimeEl.value = `${pad(target.getHours())}:${pad(target.getMinutes())}`;
    calculateRemainingTime();
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((error) => {
      console.error('Service worker 註冊失敗:', error);
    });
  });
}

updateClock();
setInterval(updateClock, 1000);
