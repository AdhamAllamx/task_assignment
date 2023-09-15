import express, { Request, Response } from "express";
import axios, { AxiosResponse } from "axios"; // Import AxiosResponse type
import "dotenv/config";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";
import { getHistoricalBalance } from "./services/getHistoricalBalances";

// Import the logger
import logger from "./logger"; // Adjust the import path as needed

interface HistoricalBalance {
  amount: number;
  currency: string;
  date: string;
}

interface Transaction {
  amount: number;
  currency: string;
  date: string;
  status: string;
}

const app = express();

const baseURL = "https://uh4goxppjc7stkg24d6fdma4t40wxtly.lambda-url.eu-central-1.on.aws";
const apiKey = "b4a4552e-1eac-44ac-8fcc-91acca085b98-f94b74ce-aa17-48f5-83e2-8b8c30509c18";

app.use(express.json());

app.get("/historical-balances", async (req: Request, res: Response) => {
  const { from, to, sort } = req.query;

  const headers = {
    "x-api-key": apiKey,
  };

  try {
    // Get the transactions data
    const transactionsResponse: AxiosResponse<Transaction[]> = await axios.get(`${baseURL}/transactions`, {
      headers,
    });

    if (transactionsResponse.status !== 200) {
      // Log an error message
      logger.error('Failed to fetch transaction data:', transactionsResponse.statusText);

      return res.status(transactionsResponse.status).json({ error: "Failed to fetch transaction data" });
    }

    const transactions: Transaction[] = transactionsResponse.data;

    // Sort transactions in ascending or descending order based on 'sort' query parameter
    if (sort === "desc") {
      transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
      transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    // Initialize the current balance with the initial balance
    let currentBalance = 0; // Change this to your initial balance

    // Calculate daily balances
    const dailyBalances: HistoricalBalance[] = [];

    for (const transaction of transactions) {
      const transactionDate = new Date(transaction.date);

      // Check if the transaction date is within the specified date range
      if (transactionDate >= new Date(from as string) && transactionDate <= new Date(to as string)) {
        const transactionAmount = transaction.amount;

        // Update the current balance by applying the transaction
        currentBalance += transactionAmount;

        // Add the daily balance to the result
        dailyBalances.push({
          date: transactionDate.toISOString().substr(0, 10), // Format date as "YYYY-MM-DD"
          amount: currentBalance,
          currency: transaction.currency,
        });
      }
    }

    // Log an info message
    logger.info('Request to /historical-balances successful.');

    return res.json(dailyBalances);
  } catch (error) {
    // Log an error message
    logger.error('Error fetching data:', error);

    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(3000, () => {
  // Log an info message
  logger.info('Server is running on port 3000');
});

export default app;
