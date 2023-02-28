const mongoose = require('mongoose');

const scheduledTaskSchema = new mongoose.Schema({
  options: {
    scheduled: { type: Boolean },
    name: { type: String },
    timezone: { type: String }
  },
  _task: {
    _execution: { type: Object }
  },
  _scheduler: {
    timeMatcher: {
      pattern: { type: String },
      timezone: { type: String },
      expressions: { type: Array }
    },
    autorecover: { type: Boolean },
    timeout: {
      _idleTimeout: { type: Number },
      _idlePrev: { type: Object },
      _idleNext: { type: Object },
      _idleStart: { type: Number },
      _onTimeout: { type: Object },
      _timerArgs: { type: Object },
      _repeat: { type: Boolean },
      _destroyed: { type: Boolean },
      Symbol: { type: Boolean },
    }
  }
});

const ScheduledTask = mongoose.model('ScheduledTask', scheduledTaskSchema);

module.exports = ScheduledTask;
