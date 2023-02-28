const cron = require("node-cron");
const cronParser = require("cron-parser");
const SaveSchema = require("../models/startSchedulerService");
const validateUrl = require("../utils/urlValidate");
const makeApiCall = require("../utils/makeApiCall");
let tasks = require('../utils/data.json')
/*
// let tasks = {};
 * We use this controller to schedule the  the api according to the user's input.
 */
exports.startScheduler = async (req, res, next) => {
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
    let task = cron.schedule(
      expression,
      async () => {
        /*
          * let d = new Date();
          * let milliseconds = d.getMilliseconds()
          * let second = d.getSeconds();
         */
        if (times == "Infinity" || times == "NaN") {
          makeApiCall(url, method, data);
          /*
          // console.log(d);
          // console.log("millisecond", milliseconds)
          // console.log("second", second);
          */
        } else {
          console.log("hello.............................................");
          for (let i = 0; i < times; i++) {
            setTimeout(function () {
              /*
              // const d = new Date();
              // const second = d.getSeconds();
              // const millisecond = d.getMilliseconds();
              // console.log(d);
              // console.log(millisecond);
              // console.log(second);
              */
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

    // console.log("task",task)
    // console.log("task._scheduler.timeout._idlePrev._idlePrev",task._scheduler.timeout._idlePrev._idlePrev)
    // console.log(task)
    delete task._scheduler.timeout
    let change = req.body;
    change.ScheduledTask = task
    /*
    // tasks[taskId] = change.ScheduledTask;
    // console.log(change.ScheduledTask)
    */
    let details = await SaveSchema.create(change)
    if (!details) {

      return res.status(500).send('The Details cannot be created');
    }
    tasks[details.id] = change.ScheduledTask;
    // console.log(tasks)
    return res.json(details.id)
    /*
     // let details = new SaveSchema({
     //   schedulerName:req.body.schedulerName,
     //   httpUrl:req.body.httpUrl,
     //   httpMethod:req.body.httpMethod,
     //   pattern:req.body.pattern,
     //   milliseconds:req.body.milliseconds,
     //   schedule:true,
     //   timeZone:req.body.timeZone ||"asia/kolkata",
     //   scheduleId:{task},
     // })
     // details = await details.save();
     // if (!details)
     //   return res.status(500).send('The Details cannot be created')
     // return res.send(details)
     */
    /*
        // tasks[taskId] = task;
        // const options = task.options;
        // return res.status(201).json({
        //   message: "Seschedule your application",
        //   taskId,
        //   options,
        // });
        */
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
};

/*
 * We use this controller to update and reschedule the  the api according to the user's input.
 */
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
          ).then((detailss)=>{
            if(!detailss){
              return res.status(400).send("the Details cannot be updated");
            }
            else{
              return res.status(201).json({id:detailss._id,message:"Details updated"})
            }
          }).catch((err)=>{
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
          message: "your application is incorrect or not schedule",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).send(error.message);
    }
  };

  /*
   * We use this controller to stop running api according to the user's input Id.
   */
  exports.stopScheduler = async (req, res, next) => {
    /*
    // let id = req.body.id;
    */
    const id = await req.params.id
    
    try {
      let task = tasks[id];
      if (task) {
        task.stop();
        delete tasks[id];
        const details = await SaveSchema.findByIdAndRemove(id);
        if(details)
        {
          return res.status(200).send({
            message: "Your application is successfully stop and deleted",
          });

        }
      }
      return res.status(400).send({ message: "Your application id is not Schedule" });
    } catch (error) {
      return res.status(500).send({ error });
    }
  };

  exports.countScheduler =async (req, res) => {
    const totalSchedule = await SaveSchema.countDocuments({ schedule: true });
  if (!totalSchedule) {
    return res.status(500).json({ success: false, message:"Schedule not avilable" });
  }
  return res.send({ totalSchedule });
/*
    // let length = 0;
    // for (let key in tasks) {
    //   if (tasks.hasOwnProperty(key)) {
    //     ++length;
    //   }
    // }
    // if (tasks) {
    //   return res.status(200).send({
    //     message: `${length} scheduler service is running currently`,
    //   });
    // }
    // return res.send({ message: "currently no schedule" });
  */

  };
