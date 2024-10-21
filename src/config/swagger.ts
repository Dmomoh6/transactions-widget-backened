import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import dotenv from "dotenv";
dotenv.config();

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Transaction API",
      version: "1.0.0",
      description:
        "API documentation for the Wallet Transaction API (MC2-Finance)",
    },
    components: {
      schemas: {
        Transaction: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            walletAddress: {
              type: "string",
              example: "0x1234567890abcdef",
            },
            transactionType: {
              type: "string",
              example: "buy",
            },
            amountSpent: {
              type: "number",
              example: 100.5,
            },
            amountReceived: {
              type: "number",
              example: 0.005,
            },
            timestamp: {
              type: "string",
              format: "date-time",
              example: "2024-10-20T14:48:00.000Z",
            },
          },
        },
      },
    },
    servers: [
      {
        url: process.env.SERVER_URL || "http://localhost:5000/api",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwaggerDocs = (app: Express, port: number): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
};
