import { wb, cors } from "../";

async function handler(req, res) {
  await cors(req, res);

  const {
    method,
    query: { meetingId, fields },
  } = req;

  switch (method) {
    case "DELETE":
      const deleteResponse = await wb.deleteMeeting(meetingId);

      if (deleteResponse.status === 204) {
        res.status(204).end("Metting deleted");
      } else {
        res.status(500).send("Server error");
      }

      break;
    case "GET":
      const getResponse = await wb.getMeeting(meetingId, { fields });

      if (getResponse.status === 200) {
        const { meetingId, roomUrl, startDate, endDate, hostRoomUrl } =
          await getResponse.json();
        res
          .status(200)
          .json({ meetingId, roomUrl, startDate, endDate, hostRoomUrl });
      } else {
        res.status(500).send("Server error");
      }

      break;
    default:
      res.setHeader("Allow", ["GET", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default handler;
