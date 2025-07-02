import express from "express";
import helmet from "helmet";
import cors from "cors";
import { demonstratePoolConnection } from "./db/db.js";
import { readCSVFileAndInsertData } from "./data_input/input.js";
// import { startCronJobs } from "./cron/cron_service.js";

const app = express();

app.use(helmet());
app.use(cors());

const PORT = process.env.PORT || 3000;

await demonstratePoolConnection();
await readCSVFileAndInsertData();

// startCronJobs();

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Code analysis server started on PORT ${PORT}`);
});
