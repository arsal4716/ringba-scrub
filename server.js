"use strict";

require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const moment = require("moment-timezone");

const connectDB = require("./config/db");
const apiRoutes = require("./routes/api");

const { startAutoDeleteCron } = require("./cron/autoDeleteCron");
const { scheduleFetchJob } = require("./cron/fetchCron");

const Job = require("./models/Job");

const app = express();

connectDB();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());

// serve generated txt files
app.use("/uploads/generated", express.static(path.join(__dirname, "uploads/generated")));

// API
app.use("/api", apiRoutes);

const FRONTEND_DIST = path.join(__dirname,"frontend", "dist");
const FRONTEND_INDEX = path.join(FRONTEND_DIST, "index.html");

app.use(express.static(FRONTEND_DIST));

app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(FRONTEND_INDEX, (err) => {
    if (err) {
      res.status(404).json({
        message:
          "Frontend build not found. Run: cd frontend && npm run build (must create /frontend/dist).",
      });
    }
  });
});

const initCron = async () => {
  startAutoDeleteCron({
    timezone: process.env.APP_TIMEZONE || "Asia/Karachi",
    daysToKeep: process.env.FILE_RETENTION_DAYS || 7,
  });

  const lastJob = await Job.findOne().sort({ createdAt: -1 }).lean();

  if (lastJob && lastJob.runTime && lastJob.timezone) {
    scheduleFetchJob(lastJob.runTime, lastJob.timezone);
    return;
  }

  const tz = process.env.APP_TIMEZONE || "Asia/Karachi";
  const now = moment.tz(tz);
  const next = now.clone().hour(8).minute(0).second(0).millisecond(0);
  if (next.isSameOrBefore(now)) next.add(1, "day");

  const job = await Job.create({ runTime: next.toDate(), timezone: tz });
  scheduleFetchJob(job.runTime, job.timezone);
};

initCron().catch((e) => {
  console.error("Cron init failed:", e?.message || e);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));