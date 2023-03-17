const cron = require("node-cron");
const cronParser = require("cron-parser");
const SaveSchema = require("../models/SchedulerServiceModel");
const validateUrl = require("../utils/urlValidate");
const makeApiCall = require("../utils/makeApiCall");
let tasks = require('../utils/data.json')
exports.updateScheduler = async (req, res, next) => {
  const schedulerTemplete = await req.body;
  const id = await req.params.id;
  let url = schedulerTemplete.httpUrl;
  let method = schedulerTemplete.method;
  let data = schedulerTemplete.data || "";
  const timeZone = schedulerTemplete.timeZone || "asia/kolkata";
  if (!id) {
    return res.status(400).send({
      message: `Scheduler id is required`,
    });
  }
  if (!url) {
    return res.status(400).send({
      message: `'URL can't be empty'`,
    });
  }
  if (!validateUrl(url)) {
    return res.status(400).send(`Invalid URL: ${schedulerTemplete.httpUrl}`);
  }
  if (!schedulerTemplete.httpMethod) {
    return res.status(400).send({
      message: `Request Method is required `,
    });
  }
  const pattern = schedulerTemplete.pattern;
  if (!pattern) {
    return res.status(400).send({
      message: `Enter the time pattern`,
    });
  }
  try {
    const interval = cronParser.parseExpression(pattern);
    // console.log(interval)

    // Extract the fields from the interval object and build the cron expression string
    const expression = `${interval.fields.second.toString()} ${interval.fields.minute.toString()} ${interval.fields.hour.toString()} ${interval.fields.dayOfMonth.toString()} ${interval.fields.month.toString()} ${interval.fields.dayOfWeek.toString()} `;

    let mili = schedulerTemplete.milliseconds.trim();
    if (mili) {
      if (pattern.trim().split(" ").length < 6) {
        return res.send("cron expression is invalid or missing");
      }
    }
    let times = (1000 / mili)
    const details = await SaveSchema.findById(req.params.id);
    if (details.id) {
      let task = tasks[details.id];
      let count = 0;
      if (task) {
        task.stop();
        task = cron.schedule(
          expression,
          async () => {
            if (times == "Infinity" || times == "NaN") {
              console.log(`running a task ${count++}`);
              makeApiCall(url, method, data);
            } else {
              for (let i = 0; i < times; i++) {
                setTimeout(function () {
                  makeApiCall(url, method, data);
                  console.log("Task running every 100 milliseconds");
                }, mili * i);
                //1000 ms is 1 sec, here I have give 0.5 seconds as a delay;
              }
            }
          },
          {
            scheduled: true,
            name: schedulerTemplete.schedulerName,
            timezone: timeZone,
          }
        );
        tasks[details.id] = task;
        delete task._scheduler.timeout
        let change = req.body;
        change.ScheduledTask = task

        await SaveSchema.findByIdAndUpdate(
          req.params.id,
          change,
          { new: true }
        ).then((detailss) => {
          if (!detailss) {
            return res.status(400).send("the Details cannot be updated");
          }
          else {
            return res.status(201).json({ id: detailss._id, message: "Details updated" })
          }
        }).catch((err) => {
          res.status(500).json({
            error: err,
            success: false,
          });
        });
      } else {
        return res.status(400).send({
          message: "your application is not schedul",
        });
      }
    } else {
      return res.status(400).send({
        message: "Invalid request / invalid input id",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};