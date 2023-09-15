"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios")); // Import AxiosResponse type
require("dotenv/config");
// Import the logger
const logger_1 = __importDefault(require("./logger")); // Adjust the import path as needed
const app = (0, express_1.default)();
const baseURL = "https://uh4goxppjc7stkg24d6fdma4t40wxtly.lambda-url.eu-central-1.on.aws";
const apiKey = "b4a4552e-1eac-44ac-8fcc-91acca085b98-f94b74ce-aa17-48f5-83e2-8b8c30509c18";
app.use(express_1.default.json());
app.get("/historical-balances", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { from, to, sort } = req.query;
    const headers = {
        "x-api-key": apiKey,
    };
    try {
        // Get the transactions data
        const transactionsResponse = yield axios_1.default.get(`${baseURL}/transactions`, {
            headers,
        });
        if (transactionsResponse.status !== 200) {
            // Log an error message
            logger_1.default.error('Failed to fetch transaction data:', transactionsResponse.statusText);
            return res.status(transactionsResponse.status).json({ error: "Failed to fetch transaction data" });
        }
        const transactions = transactionsResponse.data;
        // Sort transactions in ascending or descending order based on 'sort' query parameter
        if (sort === "desc") {
            transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        else {
            transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }
        // Initialize the current balance with the initial balance
        let currentBalance = 0; // Change this to your initial balance
        // Calculate daily balances
        const dailyBalances = [];
        for (const transaction of transactions) {
            const transactionDate = new Date(transaction.date);
            // Check if the transaction date is within the specified date range
            if (transactionDate >= new Date(from) && transactionDate <= new Date(to)) {
                const transactionAmount = transaction.amount;
                // Update the current balance by applying the transaction
                currentBalance += transactionAmount;
                // Add the daily balance to the result
                dailyBalances.push({
                    date: transactionDate.toISOString().substr(0, 10),
                    amount: currentBalance,
                    currency: transaction.currency,
                });
            }
        }
        // Log an info message
        logger_1.default.info('Request to /historical-balances successful.');
        return res.json(dailyBalances);
    }
    catch (error) {
        // Log an error message
        logger_1.default.error('Error fetching data:', error);
        console.error("Error fetching data:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}));
app.listen(3000, () => {
    // Log an info message
    logger_1.default.info('Server is running on port 3000');
});
exports.default = app;
