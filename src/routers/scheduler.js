const express = require("express");
const router = express.Router();
const scheduler = require("../controllers/scheduler");
/*
 * We use this router to schedule the  the api according to the user's input like time,date and save the return request for next working like reschedule update and more.
 */
router.post("/startScheduler", scheduler.startScheduler);
/*
 *We use this router to reschedule the  the api according to the user's input like time,date,url and save the return request for next working like  update and stop.it first  destroy running  job afterthat   reschedule that job request accoriding to the user  time and url.
 */
router.post("/updateScheduler", scheduler.updateScheduler);
/*
 * This router is used for stop the running  scheduler job through the job id.
 */
router.post("/stopScheduler", scheduler.stopScheduler);
module.exports = router;
// https://crontab.cronhub.io/

/* for developer refrence its temprory for some times */

// // CodeNEntertainment
// DevTainment
// The Coding Entertainer
// EntertainTech
// WebWit
// Coding & Comedy
// TechTalks & Fun
// DevLaugh
// The Entertaining Developer
// CodeClowns.
// */2 * * * * cron schedule every 2 minute
// 0 */2 * * *  cron schedule every 2 hours
// 0 6 * * * cron schedule every day 6 am
// 0 17 * * 6 This crontab entry runs the script at 17:00 (5PM) on Saturdays:
// 0 0 1 * * every months At 12:00am on the 1st
// // https://linuxize.com/post/scheduling-cron-jobs-with-crontab/#:~:text=There%20are%20several%20special%20Cron%20schedule%20macros%20used,midnight%20%2812%3A00%20am%29%20of%20the%201st%20of%20January.
// Run the a script at 9:15pm, on the 1st and 15th of every month:

// 15 9 1,15 * * /path/to/script.sh
