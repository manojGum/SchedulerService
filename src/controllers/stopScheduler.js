const SaveSchema = require("../models/SchedulerServiceModel");
let tasks = require('../utils/data.json')


exports.stopScheduler = async (req, res, next) => {

  /*
  // let id = req.body.id;
  */
  const id = await req.params.id
  /*
  // const details = await SaveSchema.findById(id);
  // let ScheduledTask = details.ScheduledTask
  // console.log(details.ScheduledTask)

  // ScheduledTask.stop();
  */
  try {
    let task = tasks[id];
    if (task) {

      task.stop();
      delete tasks[id];
      const details = await SaveSchema.findByIdAndUpdate({ _id: id }, { $set: { scheduled: false }, $unset: { ScheduledTask: 0 } }, { new: true });
      if (details) {
        console.log({ message: "Your application is successfully stop", })
        return res.status(200).send({
          message: "Your application is successfully stop",
        });

      }
    }
    return res.status(400).send({ message: "Your application id is incorrect or not Schedule" });
  } catch (error) {
    return res.status(500).send({ error });
  }
};

exports.countScheduler = async (req, res) => {
 await SaveSchema.countDocuments({ scheduled: true }).then((total)=>{
    if (!total) {
      return res.status(500).json({ success: false, message: "Schedule not avilable" });
    }
    return res.send({ total });
  });
 


};