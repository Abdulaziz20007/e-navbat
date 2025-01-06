const express = require("express");
const config = require("config");
const mainRouter = require("./routes");

const PORT = config.get("port");

const app = express();

app.use(express.json());
app.use("/api", mainRouter);

async function start() {
  try {
    app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

start();
