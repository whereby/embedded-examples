import { wb, cors } from "../";

async function handler(req, res) {
  await cors(req, res);

  const { method, body } = req;

  switch (method) {
    case "POST":
      const response = await wb.createMeeting(body);

      if (response.status === 201) {
        const { meetingId, roomUrl, hostRoomUrl } = await response.json();
        res.status(201).json({ meetingId, roomUrl, hostRoomUrl });
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
