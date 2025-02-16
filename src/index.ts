import express, { Express } from "express";
import { setupSwaggerDocs } from "./config/swagger";
import dotenv from "dotenv";
import cors from "cors";
import transactionRoutes from "./routes/transactionRoutes";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

app.use(
  cors({
    //Opening cors to all domains for submission
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/api", transactionRoutes);

setupSwaggerDocs(app, PORT);

app.get("/", (req, res) => {
  res.send("Transaction Widget Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
