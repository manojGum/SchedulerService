const cron = require("node-cron");
const startSchedulerModel = require("../models/startSchedulerService");
const validateUrl = require("../utils/urlValidate");
const makeApiCall = require("../utils/makeApiCall");
let tasks = {};
/*
* We use this controller to schedule the  the api according to the user's input.
*/
exports.startScheduler = async (req, res, next) => {
  const schedulerTemplete = await req.body;
  let time;
  let second = Number(schedulerTemplete.second);
  let minute = schedulerTemplete.minute;
  let hour = schedulerTemplete.hours;
  let week = schedulerTemplete.week;
  let dayOfMonth = schedulerTemplete.dayofmonth;
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
  let scheduleType = schedulerTemplete.scheduleType.toLowerCase();
  if (
    scheduleType !== "every second" &&
    scheduleType !== "every minute" &&
    scheduleType !== "every hours" &&
    scheduleType !== "every day" &&
    scheduleType !== "every week" &&
    scheduleType !== "evey months"
  ) {
    return res.status(400).send({
      message: `Types of Schedule is required `,
    });
  }
  if (scheduleType === "every second") {
    if (typeof second == "string") {
      return res.status(400).send("Enter valid Number");
    } else {
      if (typeof second == "number" && second <= 59) {
        time = `*/${second} * * * * *`;
      } else {
        return res.status(400).send("Enter valid input between less then 59");
      }
    }
  } else if (scheduleType === "every minute") {
    if(!minute)
    {
      return res.status(400).send("Enter valid Number");
    }
    if (typeof minute == "string") {
      return res.status(400).send("Enter valid Number");
    } else {
      if (typeof minute == "number" && minute > 0 && minute <= 59) {
        time = `*/${minute} * * * *`;
      } else {
        return res.status(400).send("Enter valid input between 1 to 59");
      }
    }
  } else if (scheduleType === "every hours") {
    if (typeof minute == "string" || typeof hour == "string") {
      return res.status(400).send("Enter valid Number");
    } else {
      if (typeof minute == "number" && minute >= 0 && minute <= 59) {
        if (typeof hour == "number" && hour > 0 && hour <= 23) {
          time = `${minute} */${hour} * * *`;
          console.log(time);
        } else {
          return res.status(400).send("Enter valid input between 1 to 23");
        }
      } else {
        return res.status(400).send("Enter valid input between 1 to 59");
      }
    }
  } else if (scheduleType === "every day") {
    if (typeof minute == "string" || typeof hour == "string") {
      return res.status(400).send("Enter valid Number");
    } else {
      if (typeof minute == "number" && minute >= 0 && minute <= 59) {
        if (typeof hour == "number" && hour >= 0 && hour <= 23) {
          time = `${minute} ${hour} * * *`;
          console.log(time);
        } else {
          return res.status(400).send("Enter valid input between 0 to 23");
        }
      } else {
        return res.status(400).send("Enter valid input between 0 to 59");
      }
    }
  } else if (scheduleType === "every week") {
    if (!minute || !hour || !week) {
      return res.status(400).send("Minute and hours are required field");
    }
    time = `${minute} ${hour} * * ${week}`;
    console.log(time);
  } else if (scheduleType === "evey months") {
    if (!minute || !hour || !dayOfMonth) {
      return res
        .status(400)
        .send("Minute and hours are day of month required field");
    }
    time = `${minute} ${hour} ${dayOfMonth} * *`;
    console.log(time);
  }
  let taskId = Date.now();
  if (!validateUrl(schedulerTemplete.httpUrl)) {
    return res.status(400).send(`Invalid URL: ${schedulerTemplete.httpUrl}`);
  }
  
  let task = cron.schedule(
    `${time}`,
    async () => {
      console.log(`running a task ${scheduleType}`);
      makeApiCall(schedulerTemplete.httpUrl,schedulerTemplete.httpMethod);
    },
    {
      scheduled: true,
      timezone: schedulerTemplete.timeZone,
    }
  );
  tasks[taskId] = task;
  console.log(task)
  const options=task.options
  
  return  res.status(200).send({message:'Updated and reschedule your application',taskId,options});
};

exports.reSchedule = (req, res, next) => {
  /*
  // let id = req.body.id;
  // let newTime = req.body.time;
  // let newUrl = req.body.url;
  // let task = tasks[id];
  // if (task) {
  //   task.destroy();
  //   task = cron.schedule(newTime, () => {
  //     // make a request to the newUrl
  //   });
  // }

  // res.status(200).send({
  //   message: "We have successfully reschedule your application",
  // });
  */
};
/*
* We use this controller to update and reschedule the  the api according to the user's input.
*/
exports.updateScheduler = async (req, res, next) => {
  const schedulerTemplete = await req.body;
  let newTime;
  let newSecond = Number(schedulerTemplete.second);
  const newMinute = schedulerTemplete.minute;
  const newHour = schedulerTemplete.hours;
  const newWeek = schedulerTemplete.week;
  const newDayOfMonth = schedulerTemplete.dayofmonth;
  const id = schedulerTemplete.id;
  const newUrl = schedulerTemplete.httpUrl;
  const timeZone = schedulerTemplete.timeZone || "asia/kolkata";
  if (!schedulerTemplete.id) {
    return res.status(400).send({
      message: `Scheduler id is required filled `,
    });
  }
  if (!newUrl) {
    return res.status(400).send({
      message: `'URL can't be empty'`,
    });
  }
  if (!schedulerTemplete.httpMethod) {
    return res.status(400).send({
      message: `Request Method is required `,
    });
  }
  let scheduleType = schedulerTemplete.scheduleType.toLowerCase();
  if (
    scheduleType !== "every second" &&
    scheduleType !== "every minute" &&
    scheduleType !== "every hours" &&
    scheduleType !== "every day" &&
    scheduleType !== "every week" &&
    scheduleType !== "evey months"
  ) {
    return res.status(400).send({
      message: `Types of Schedule is required `,
    });
  }

  if (scheduleType === "every second") {
    if (typeof newSecond == "string") {
      return res.status(400).send("Enter valid Number");
    } else {
      if (typeof newSecond == "number" && newSecond <= 59) {
        newTime = `*/${newSecond} * * * * *`;
      } else {
        return res.status(400).send("Enter valid input between less then 59");
      }
    }
  } else if (scheduleType === "every minute") {
    if (typeof newMinute == "string") {
      return res.send("Enter valid Number");
    } else {
      if (typeof newMinute == "number" && newMinute > 0 && newMinute <= 59) {
        newTime = `*/${newMinute} * * * *`;
      } else {
        return res.send("Enter valid input between 1 to 59");
      }
    }
  } else if (scheduleType === "every hours") {
    if (typeof newMinute == "string" || typeof newHour == "string") {
      return res.send("Enter valid Number");
    } else {
      if (typeof newMinute == "number" && newMinute >= 0 && newMinute <= 59) {
        if (typeof newHour == "number" && newHour > 0 && newHour <= 23) {
          newTime = `${newMinute} */${newHour} * * *`;
          console.log(newTime);
        } else {
          return res.send("Enter valid input between 1 to 23");
        }
      } else {
        return res.send("Enter valid input between 1 to 59");
      }
    }
  } else if (scheduleType === "every day") {
    if (typeof newMinute == "string" || typeof newHour == "string") {
      return res.send("Enter valid Number");
    } else {
      if (typeof newMinute == "number" && newMinute >= 0 && newMinute <= 59) {
        if (typeof newHour == "number" && newHour >= 0 && newHour <= 23) {
          newTime = `${newMinute} ${newHour} * * *`;
          console.log(newTime);
        } else {
          return res.send("Enter valid input between 0 to 23");
        }
      } else {
        return res.send("Enter valid input between 0 to 59");
      }
    }
  } else if (scheduleType === "every week") {
    if (!newMinute || !newHour || !newWeek) {
      return res.send("Minute and hours are required field");
    }
    newTime = `${newMinute} ${newHour} * * ${newWeek}`;
  } else if (scheduleType === "evey months") {
    if (!newMinute || !newHour || !newDayOfMonth) {
      return res.send("Minute and hours are day of month required field");
    }
    let newTime = `${newMinute} ${newHour} ${newDayOfMonth} * *`;
    console.log(newTime);
  }
  if (!validateUrl(schedulerTemplete.httpUrl)) {
    return res.status(400).send(`Invalid URL: ${schedulerTemplete.httpUrl}`);
  }
  let task = tasks[id];
  if (task) {
    task.stop();
    task = cron.schedule(
      newTime,
      () => {
        console.log(`running a task ${scheduleType} ${newMinute}`);
        makeApiCall(schedulerTemplete.httpUrl);
      },
      {
        scheduled: true,
        timezone: timeZone,
      }
    );
    tasks[id] = task;
  }

  res.status(200).send({
    message: "Updated and reschedule your application",
  });
};

/*
* We use this controller to stop running api according to the user's input Id.
*/
exports.stopScheduler = (req, res, next) => {
  let id = req.body.id;
  let task = tasks[id];
  if (task) {
    task.stop();
    delete tasks[id];
    console.log(tasks);
  }
  res.status(200).send({
    message: "Your application is successfully stop",
  });
};
