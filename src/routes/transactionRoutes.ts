import { Router } from "express";
import { getTransactionHistory } from "../controllers/transactionController";

const router = Router();

/**
 * @swagger
 * /transactions/{walletAddress}:
 *   get:
 *     summary: Retrieve a list of transactions for a specific wallet address.
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: walletAddress
 *         required: true
 *         schema:
 *           type: string
 *         description: The wallet address to retrieve transactions for.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of items per page.
 *     responses:
 *       200:
 *         description: A list of transactions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction'
 *                 page:
 *                   type: integer
 *                 perPage:
 *                   type: integer
 *               example:
 *                 transactions:
 *                   - id: 1
 *                     walletAddress: "0x1234567890abcdef"
 *                     transactionType: "buy"
 *                     amountSpent: 100.50
 *                     amountReceived: 0.005
 *                     timestamp: "2024-10-20T14:48:00.000Z"
 *                 page: 1
 *                 perPage: 10
 *       400:
 *         description: Bad request. Wallet address is missing.
 *         content:
 *           application/json:
 *             example:
 *               message: "Wallet address is required"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */

router.get("/transactions/:walletAddress", getTransactionHistory);

export default router;
