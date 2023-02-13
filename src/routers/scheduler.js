const express = require("express");
const router = express.Router();
const scheduler = require("../controllers/scheduler");
const updateScheduler = require('../controllers/updateScheduler')
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