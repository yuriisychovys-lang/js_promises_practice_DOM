/* eslint-disable prefer-promise-reject-errors */
'use strict';

const showSuccess = (msg) => {
  const old = document.querySelector('[data-qa="notification"]');

  if (old) {
    old.remove();
  }

  const div = document.createElement('div');

  div.dataset.qa = 'notification';
  div.className = 'success';
  div.textContent = msg;
  document.body.appendChild(div);
};

const showError = (msg) => {
  const old = document.querySelector('[data-qa="notification"]');

  if (old) {
    old.remove();
  }

  const div = document.createElement('div');

  div.dataset.qa = 'notification';
  div.className = 'error';
  div.textContent = msg;
  document.body.appendChild(div);
};

let leftClicked = false;
let firstSettled = false;

const firstPromise = new Promise((resolve, reject) => {
  const timer = setTimeout(() => {
    if (!leftClicked) {
      firstSettled = true;
      reject('First promise was rejected');
    }
  }, 3000);

  document.addEventListener('mousedown', (e) => {
    if (e.button === 0) {
      leftClicked = true;
      firstSettled = true;
      clearTimeout(timer);
      resolve('First promise was resolved');
    }
  });
});

const secondPromise = new Promise((resolve) => {
  document.addEventListener('mousedown', (e) => {
    if (e.button === 0 || e.button === 2) {
      resolve('Second promise was resolved');
    }
  });
});

let left = false;
let right = false;

const thirdPromise = new Promise((resolve) => {
  document.addEventListener('mousedown', (e) => {
    if (e.button === 0) {
      left = true;
    }

    if (e.button === 2) {
      right = true;
    }

    if (left && right) {
      resolve('Third promise was resolved');
    }
  });
});

firstPromise.then(showSuccess).catch(showError);

secondPromise.then((msg) => {
  if (!firstSettled) {
    showSuccess(msg);
  }
});

thirdPromise.then(showSuccess);
