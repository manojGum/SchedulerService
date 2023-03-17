const express = require("express");
const router = express.Router();
const scheduler = require("../controllers/scheduler");
const {register} = require('../controllers/register')
const {stopScheduler,countScheduler} = require('../controllers/stopScheduler')
const updateScheduler = require('../controllers/updateScheduler')
/*
 * We use this router to schedule the  the api according to the user's input like time,date and save the return request for next working like reschedule update and more.
 */
router.post("/register",register);
// router.post("/register", scheduler.startScheduler);
/*
 * We use this router to reschedule the  the api according to the user's input like time,date,url and save the return   request for next working like  update and stop.it first  destroy running  job afterthat   reschedule that job request accoriding to the user  time and url.
 */
router.put("/updateScheduler/:id", updateScheduler.updateScheduler);
/*
 * This router is used for stop the running  scheduler job through the job id and deleted the data form database .
 */
router.delete("/stopScheduler/:id",stopScheduler);
// router.delete("/stopScheduler/:id", scheduler.stopScheduler);
router.get("/countScheduler", countScheduler);
module.exports = router;
// https://crontab.cronhub.io/
//https://kb.objectrocket.com/mongo-db/mongoose-schema-types-1418
