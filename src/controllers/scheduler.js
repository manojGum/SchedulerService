const cron = require("node-cron");
const startSchedulerModel = require("../models/startSchedulerService");
const validateUrl = require("../utils/urlValidate");
const makeApiCall = require("../utils/makeApiCall");
let tasks = {};
let tasksMilliSecond = {};
/*
 * We use this controller to schedule the  the api according to the user's input.
 */
exports.startScheduler = async (req, res, next) => {
  const schedulerTemplete = await req.body;
  let time;
  let millisecond = schedulerTemplete.millisecond;
  console.log(millisecond);
  let second = Number(schedulerTemplete.second);
  let minute = schedulerTemplete.minute;
  let hour = schedulerTemplete.hours;
  let week = schedulerTemplete.week;
  let dayOfMonth = schedulerTemplete.dayofmonth;
  let url = schedulerTemplete.httpUrl;
  let method = schedulerTemplete.httpMethod;
  let data = schedulerTemplete.data || "";
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
  console.log(scheduleType);
  if (
    scheduleType !== "every second" &&
    scheduleType !== "every millisecond" &&
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

  if (scheduleType === "every millisecond") {
    if (!millisecond) {
      return res
        .status(400)
        .send("Enter valid input between 1 to less then 1000");
    }
    if (typeof millisecond == "string") {
      return res.status(400).send("Enter valid millisecond in Number");
    } else {
      if (
        typeof millisecond == "number" &&
        millisecond >= 1 &&
        millisecond <= 999
      ) {
        time = millisecond;
      } else {
        return res
          .status(400)
          .send("Enter valid input between 1 to less then 1000");
      }
    }
  } else if (scheduleType === "every second") {
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
    if (!minute) {
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
  let counter = 0;
  if (millisecond) {
    tasksMilliSecond[taskId] = setInterval(() => {
      console.log(`Task run: ${counter++}`);
      makeApiCall(url, method, data);
    }, time);
    return res.send({ taskId,scheduleType });
  } else {
    let task = cron.schedule(
      `${time}`,
      async () => {
        console.log(`running a task ${scheduleType}`);
        makeApiCall(url, method, data);
      },
      {
        scheduled: true,
        timezone: schedulerTemplete.timeZone,
      }
    );
    tasks[taskId] = task;
    console.log(task);
    const options = task.options;

    return res
      .status(200)
      .send({ message: "Seschedule your application", taskId, options });
  }
  // console.log(tasks)
};

/*
* We use this controller to update and reschedule the  the api according to the user's input.
*/
exports.updateScheduler = async (req, res, next) => {
  const schedulerTemplete = await req.body;
  let newTime;
  let newMillisecond = schedulerTemplete.millisecond;
  let newSecond = Number(schedulerTemplete.second);
  const newMinute = schedulerTemplete.minute;
  const newHour = schedulerTemplete.hours;
  const newWeek = schedulerTemplete.week;
  const newDayOfMonth = schedulerTemplete.dayofmonth;
  const id = schedulerTemplete.id;
  let url = schedulerTemplete.httpUrl;
  let method = schedulerTemplete.httpMethod;
  let data = schedulerTemplete.data || "";
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
  console.log(scheduleType)
  if (
    scheduleType !== "every second" &&
    scheduleType !== "every millisecond" &&
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
  if (scheduleType === "every millisecond") {
    if (!newMillisecond) {
      return res
        .status(400)
        .send("Enter valid input between 1 to less then 1000");
    }
    if (typeof newMillisecond == "string") {
      return res.status(400).send("Enter valid millisecond in Number");
    } else {
      if (
        typeof newMillisecond == "number" &&
        newMillisecond >= 1 &&
        newMillisecond <= 999
      ) {
        newTime = newMillisecond;
      } else {
        return res
          .status(400)
          .send("Enter valid input between 1 to less then 1000");
      }
    }
  }else if (scheduleType === "every second") {
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
  
  if(scheduleType=="every millisecond"){
    let task = tasksMilliSecond[id];
    if (task) {
    clearTimeout(task);
    task = setInterval(() => {
      makeApiCall(url, method, data);
    },newTime);
    tasksMilliSecond[id] = task;
      return res.status(200).send({id,scheduleType });
    }
    else{
      return res.status(400).send({
        message: "your application Id is incorrect or not schedule",
      });
    }
  }else{
    let task = tasks[id];
    if (task) {
      task.stop();
      task = cron.schedule(
        newTime,
        () => {
          console.log(`running a task ${scheduleType} ${newMinute}`);
          makeApiCall(url, method, data);
        },
        {
          scheduled: true,
          timezone: timeZone,
        }
      );
      tasks[id] = task;
      return res.status(200).send({
        message: "Updated and reschedule your application",
      });
    }
    else{
      return res.status(400).send({
        message: "your application Id is incorrect or not schedule",
      });
    }
  }
};





/*
 * We use this controller to stop running api according to the user's input Id.
 */
exports.stopScheduler = (req, res, next) => {
  let id = req.body.id;
  let scheduleType = req.body.scheduleType;
  if (scheduleType === "every millisecond") {
    let task = tasksMilliSecond[id];
    if (task) {
    clearTimeout(task);
    delete scheduledTasks[id];
    return res.status(200).send({ message: 'Your application is successfully stop' });
    }
    return res.status(400).send({message: 'Your application id is incorrect or  not found'})
  } else {
    let task = tasks[id];
    if (task) {
      task.stop();
      delete tasks[id];
      console.log(tasks);
     return res.status(200).send({
        message: "Your application is successfully stop",
      });
    }
    return res.send({message: 'Your application id is not found'})
  }
};
