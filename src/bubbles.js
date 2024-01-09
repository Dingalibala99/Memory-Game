const bubbleContainer = document.querySelector(".bubbles");

const bubbleData = [
  11, 12, 24, 10, 14, 23, 18, 16, 19, 20, 22, 25, 18, 21, 15, 13, 26, 17, 13,
  28, 11, 12, 24, 10, 14, 23, 18, 16, 19, 20, 22, 25, 18, 21, 15, 13, 26, 17,
  13, 28,
];

bubbleData.forEach((item) => {
  const span = document.createElement("span");
  span.style.setProperty("--i", item);
  bubbleContainer.appendChild(span);
});
