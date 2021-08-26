const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  // Mkcert generated SSL certificate path
  // Add `whereby.localhost.dev` as `127.0.0.1` alias in `/etc/hosts`
  key: fs.readFileSync("./https_cert/whereby.localhost.dev-key.pem"),
  cert: fs.readFileSync("./https_cert/whereby.localhost.dev.pem"),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log("ready - started server on url: https://localhost:" + port);
  });
});
