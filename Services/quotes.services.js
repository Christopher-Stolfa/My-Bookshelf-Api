import { createRequire } from "module";
const require = createRequire(import.meta.url);
const quotesData = require("../Data/quotesData.json");

const getRandomQuote = () =>
  quotesData[Math.floor(Math.random() * quotesData.length)];

export { getRandomQuote };
