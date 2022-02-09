const axios = require("axios");
const quotesData = require("../Data/quotesData.json");

const getRandomQoute = () =>
  quotesData[Math.floor(Math.random() * quotesData.length)];

module.exports = {
  getRandomQoute,
};
