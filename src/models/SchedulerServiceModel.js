const mongoose = require("mongoose");
const startSchedulerSchema = new mongoose.Schema(
  {
    schedulerName: {
      type: String,
      required: false,
    },
    httpUrl: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      default: ""
    },
    httpMethod: {
      type: String,
      required: true,
      enum: ["get", "post", "put", "patch", "delete"],
    },
    pattern: {
      type: String,
      required: true,
    },
    milliseconds: {
      type: Number,
      min: 1,
      max: 999,
      default: "",
    },
    
scheduled:{
  type:Boolean,
  default:"true"
},
    timeZone: {
      type: String,
      required: true,
      default: "asia/kolkata",
    },
    ScheduledTask:mongoose.Mixed,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
module.exports = mongoose.model("scheduler", startSchedulerSchema);
