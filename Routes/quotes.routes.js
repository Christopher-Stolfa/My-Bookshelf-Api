import express from "express";
import { randomQuote } from "../Controllers/quotes.controllers.js";
import { GET_RANDOM_QUOTE } from "../Constants/quotesRoutes.js";
const router = express.Router();

router.get(GET_RANDOM_QUOTE, randomQuote);

export default router;
