"use strict";

let randomArray = [];
let len = 0;
const modifiedBarColor = "#06283d";
const originalBarColor = "#1363df";
const trackColor = "#dff6ff";
const initColor = "#B2C8DF";
const successColor = "#79DAE8";
let algorithm = "";

const bar_list = document.querySelectorAll(".bar");
const randomBtn = document.querySelector(".btn--random");
const sortBtn = document.querySelector(".btn--sort");

const dropdown = document.querySelector(".drop");
const dropButton = dropdown.querySelector(".dropdown-toggle");
const selectItems = dropdown.querySelectorAll(".drop-list");

selectItems.forEach((item) => {
  item.addEventListener("click", () => {
    dropButton.textContent = item.textContent;
    algorithm = item.textContent.toString().toLowerCase();
  });
});

function randomize(length) {
  const maxValue = 100;
  const minValue = 10;
  randomArray = [];
  for (let i = 0; i < length; i++) {
    randomArray.push(
      Math.floor(Math.random() * (maxValue - minValue) + minValue + 1)
    );
  }
  len = randomArray.length;
  bar_list.forEach((bar, index) => {
    setBarHeight(bar, randomArray[index]);
    setBarColor(bar, initColor);
  });
}

randomize(30);

let si = 0;
let flag = 0;
let swap = false;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function selectionSort() {
  for (let i = 0; i < len - 1; i++) {
    setBarColor(bar_list[i], modifiedBarColor);
    si = i;
    flag = 0;
    await sleep(10);
    for (let j = i + 1; j < len; j++) {
      setBarColor(bar_list[j], trackColor);
      await sleep(100);
      setBarColor(bar_list[j], originalBarColor);
      if (randomArray[j] < randomArray[si]) {
        if (flag !== 0) {
          setBarColor(bar_list[si], originalBarColor);
        }
        si = j;
        flag = 1;
        setBarColor(bar_list[j], modifiedBarColor);
        await sleep(10);
      }
    }
    [randomArray[i], randomArray[si]] = [randomArray[si], randomArray[i]];
    setBarHeight(bar_list[i], randomArray[i]);
    setBarHeight(bar_list[si], randomArray[si]);
    setBarColor(bar_list[i], originalBarColor);
    setBarColor(bar_list[si], originalBarColor);
    await sleep(10);
  }
}

async function bubbleSort() {
  for (let i = 0; i < len - 1; i++) {
    swap = false;
    setBarColor(bar_list[i], originalBarColor);
    for (let j = 0; j < len - i - 1; j++) {
      setBarColor(bar_list[j], modifiedBarColor);
      setBarColor(bar_list[j + 1], modifiedBarColor);
      await sleep(120);
      if (randomArray[j] > randomArray[j + 1]) {
        swap = true;
        [randomArray[j], randomArray[j + 1]] = [
          randomArray[j + 1],
          randomArray[j],
        ];
        setBarHeight(bar_list[j], randomArray[j]);
        setBarHeight(bar_list[j + 1], randomArray[j + 1]);
        await sleep(10);
      }
      setBarColor(bar_list[j], originalBarColor);
      setBarColor(bar_list[j + 1], originalBarColor);
    }
    if (!swap) return;
  }
}

async function mergeSort() {
  async function merge(left, mid, right) {
    const arr1Len = mid - left + 1;
    const arr2Len = right - mid;

    let arr1 = [];
    for (let i = 0; i < arr1Len; i++) arr1.push(0);
    let arr2 = [];
    for (let i = 0; i < arr2Len; i++) arr2.push(0);

    for (let i = 0; i < arr1Len; i++) arr1[i] = randomArray[left + i];

    for (let j = 0; j < arr2Len; j++) arr2[j] = randomArray[mid + 1 + j];

    let i = 0;
    let j = 0;
    let k = left;

    while (i < arr1Len && j < arr2Len) {
      setBarColor(bar_list[i + left], trackColor);
      setBarColor(bar_list[mid + 1 + j], trackColor);
      await sleep(20);
      setBarColor(bar_list[i + left], originalBarColor);
      setBarColor(bar_list[mid + 1 + j], originalBarColor);
      if (arr1[i] <= arr2[j]) {
        randomArray[k] = arr1[i];
        setBarColor(bar_list[k], modifiedBarColor);
        setBarHeight(bar_list[k], randomArray[k]);
        await sleep(110);
        setBarColor(bar_list[k], originalBarColor);
        i++;
      } else {
        randomArray[k] = arr2[j];
        setBarColor(bar_list[k], modifiedBarColor);
        setBarHeight(bar_list[k], randomArray[k]);
        await sleep(110);
        setBarColor(bar_list[k], originalBarColor);
        j++;
      }
      k++;
    }

    while (i < arr1Len) {
      randomArray[k] = arr1[i];
      setBarColor(bar_list[k], modifiedBarColor);
      setBarHeight(bar_list[k], randomArray[k]);
      await sleep(110);
      setBarColor(bar_list[k], originalBarColor);
      i++;
      k++;
    }

    while (j < arr2Len) {
      randomArray[k] = arr2[j];
      setBarColor(bar_list[k], modifiedBarColor);
      setBarHeight(bar_list[k], randomArray[k]);
      await sleep(110);
      setBarColor(bar_list[k], originalBarColor);
      j++;
      k++;
    }
  }

  async function innerMergeSort(left, right) {
    if (left < right) {
      let mid = Math.floor((right + left) / 2);
      await innerMergeSort(left, mid);
      await innerMergeSort(mid + 1, right);
      await merge(left, mid, right);
    }
  }

  console.log(randomArray);

  await innerMergeSort(0, len - 1);
  console.log(randomArray);
}

const sortObject = {
  "selection sort": selectionSort,
  "bubble sort": bubbleSort,
  "merge sort": mergeSort,
};

function setBarHeight(bar, height) {
  bar.style.height = `${height}%`;
}

function setBarColor(bar, color) {
  bar.style.backgroundColor = color;
}

async function changeAllBarColorWithDelay(color, ms) {
  for (let i = 0; i < len; i++) {
    setBarColor(bar_list[i], color);
    await sleep(ms);
  }
}

function changeAllBarColor(color) {
  bar_list.forEach((bar) => {
    setBarColor(bar, color);
  });
}

randomBtn.addEventListener("click", () => {
  randomize(30);
});

sortBtn.addEventListener("click", async () => {
  console.log(algorithm);
  await sortObject[algorithm]();
  await changeAllBarColorWithDelay(successColor, 30);
  setTimeout(() => {
    changeAllBarColor(initColor);
  }, 1000);
});
