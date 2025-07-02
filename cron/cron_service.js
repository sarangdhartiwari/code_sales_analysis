import cron from "node-cron";
import { readCSVFileAndInsertData } from "./data_input/input.js";

export const startCronJobs = () => {
  cron.schedule("0 0 * * *", () => {
    readCSVFileAndInsertData();
  });
};
