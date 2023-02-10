const app = require("./index");
const http = require("http");
const connect = require("../config/db");
const port = process.env.PORT || 6000;
const hostname = process.env.HOSTNAME || "127.0.0.1";

app.listen(port, hostname, async () => {
  try {
    await connect();
    console.log(`Server running at http://${hostname}:${port}`);
  } catch (err) {
    console.log("some thing wrong");
  }
});
