const cron = require("node-cron");
const cronParser = require("cron-parser");
const SaveSchema = require("../models/SchedulerServiceModel");
const validateUrl = require("../utils/urlValidate");
const makeApiCall = require("../utils/makeApiCall");
let tasks = require('../utils/data.json')
const startScheduler = async (req, res, next) => {
  const schedulerTemplete = await req.body;
  let url = schedulerTemplete.httpUrl;
  let method = schedulerTemplete.httpMethod;
  let data = schedulerTemplete.data || "";
  const timeZone = schedulerTemplete.timeZone || "asia/kolkata";
  if (!schedulerTemplete.schedulerName) {
    return res.status(400).send({
      message: `Scheduler Name is required filled `,
    });
  }
  if (!schedulerTemplete.httpUrl) {
    return res.status(400).send({
      message: `'URL can't be empty'`,
    });
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
  if (!validateUrl(url)) {
    return res.status(400).send(`Invalid URL: ${schedulerTemplete.httpUrl}`);
  }

  try {
    const interval = cronParser.parseExpression(pattern);
    // Extract the fields from the interval object and build the cron expression string
    const expression = `${interval.fields.second.toString()} ${interval.fields.minute.toString()} ${interval.fields.hour.toString()} ${interval.fields.dayOfMonth.toString()} ${interval.fields.month.toString()} ${interval.fields.dayOfWeek.toString()} `;

    /*// Schedule a task to run every generated cron expression
    // let taskId = Date.now();
    */
    let mili = schedulerTemplete.milliseconds.trim();
    if (mili) {
      if (pattern.trim().split(" ").length < 6) {
        return res.send("cron expression is invalid or missing");
      }
    }
    let times = (1000 / mili)
    const change = new SaveSchema(schedulerTemplete);
    let task = cron.schedule(
      expression,
      async () => {
        if (times == "Infinity" || times == "NaN") {
          makeApiCall(url, method, data)
        } else {
          console.log("hello.............................................");
          for (let i = 0; i < times; i++) {
            setTimeout(function () {
              makeApiCall(url, method, data);
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

    // console.log("task",task)
    // console.log("task._scheduler.timeout._idlePrev._idlePrev",task._scheduler.timeout._idlePrev._idlePrev)
    // console.log(task)
    delete task._scheduler.timeout
    change.ScheduledTask = task
    // console.log( task)

    /*
    // tasks[taskId] = change.ScheduledTask;
    // console.log(change.ScheduledTask)
    */
    let details = await change.save();
    // let details = await SaveSchema.create(change)
    if (!details) {

      return res.status(404).send('Not found: The requested resource could not be found');
    }
    tasks[details.id] = change.ScheduledTask;
    return res.json(details)
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};


module.exports = {
  register: startScheduler,
}
// schedulerTaskData:schedulerTaskData