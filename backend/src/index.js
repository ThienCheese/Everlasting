import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import hallsRoutes from "./routes/halls.js";
import dishesRoutes from "./routes/dishes.js";
import servicesRoutes from "./routes/services.js";
import bookingsRoutes from "./routes/bookings.js";
import invoicesRoutes from "./routes/invoices.js";
import rulesRoutes from "./routes/rules.js";
import reportsRoutes from "./routes/reports.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/halls", hallsRoutes);
app.use("/api/dishes", dishesRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/invoices", invoicesRoutes);
app.use("/api/rules", rulesRoutes);
app.use("/api/reports", reportsRoutes);

app.get("/", (req, res) => res.send("Wedding Planner API is running 🚀"));

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
