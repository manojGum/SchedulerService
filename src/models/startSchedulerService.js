const mongoose = require("mongoose");
const startSchedulerSchema = mongoose.Schema(
    {
        schedulerName: {
            type: String,
            required: true
        },
        httpUrl: {
            type: String,
            required: true
        },
        httpMethod: {
            type: String,
            required: true,
            enum: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        },
        scheduleType: {
            type: String,
            required: true,
            enum: [
                "every second",
                "every minute",
                "every hours",
                "every day",
                "every week",
                "evey months",
            ],
        },
        second:{
            type:Number,
            min:0,
            max:59,
            required:true,
            default:""
        },
        minute:{
            type:Number,
            min:0,
            max:59,
            required:true,
            default:""
        },
        hours:{
            type:Number,
            min:0,
            max:59,
            default:''
        },
        dayOfWeek:{
            type:String,
            min:0,
            max:6,
            message:"Enter valid number only 0 to 6",
            default:''
        },
        dayofMonth:{
            type:Number,
            min:1,
            max:31,
            default:''
        },
       Month:{
            type:Number,
            min:0,
            max:6,
            default:''
        },
        schedule: {
            type: Boolean,
            enum: ["true", "false"],
            default: true
        },
        timeZone: {
            type: String,
            default: "asia/kolkata"
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = mongoose.model("scheduler",startSchedulerSchema)
