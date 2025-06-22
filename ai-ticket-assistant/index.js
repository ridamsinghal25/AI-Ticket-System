import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.js";
import ticketRoutes from "./routes/ticket.js";
import { serve } from "inngest/express";
import { inngest } from "./inngest/client.js";
import { onUserSignup } from "./inngest/functions/on-signup.js";
import { onTicketCreated } from "./inngest/functions/on-ticket.create.js";

const PORT = process.env.PORT || 4000;
const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: [onUserSignup, onTicketCreated],
  })
);

app.use("/api/auth", userRoutes);
app.use("/api/tickets", ticketRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(PORT, () =>
      console.log(`🚀 Server at http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB error: ", err));
