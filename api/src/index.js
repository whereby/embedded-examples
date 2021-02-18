/**
 * Whereby API
 *
 */

const path = require("path");
const fs = require("fs");
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const port = 3001;
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/meetings", async (req, res) => {
  const isLocked = true;

  const roomMode = "normal";

  const roomNamePrefix = "/embedded-example";

  const roomNamePattern = "uuid";

  const response = await fetch("https://api.whereby.dev/v1/meetings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      startDate: new Date("2021-01-01").toISOString(),
      endDate: new Date("2099-01-01").toISOString(),
      fields: ["hostRoomUrl"],
      isLocked,
      roomMode,
      roomNamePrefix,
      roomNamePattern,
    }),
  });

  if (response.status === 201) {
    const { meetingId, roomUrl, hostRoomUrl } = await response.json();
    res.status(200).json({ meetingId, roomUrl, hostRoomUrl });
  } else {
    res.status(500).send("Server error");
  }
});

const server = https.createServer(
  {
    key: fs.readFileSync(
      path.join(__dirname, "../../certificates/embedded-example.com-key.pem")
    ),
    cert: fs.readFileSync(
      path.join(__dirname, "../../certificates/embedded-example.com.pem")
    ),
  },
  app
);

server.listen(port, () => {
  console.log("server starting on port : " + port);
});
