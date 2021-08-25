import { wb } from "./";

async function handler(req, res) {
  const { method, body, headers } = req;

  switch (method) {
    case "POST":
      if (wb.isWebhookEventValid({ headers, body })) {
        console.log("validated Event: ", body);
        res.status(200).end("Webhook event received");
      } else {
        res.status(500).send("Server error");
      }

      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default handler;
