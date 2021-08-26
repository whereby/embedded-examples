import React from "react";

import Form from "../Form";
import ResponseBlock from "../ResponseBlock";

const GetMeetingAPI = ({ defaultMeetingId }) => {
  const [meetingInfo, setMeetingInfo] = React.useState(null);
  const [meetingId, setMeetingId] = React.useState("");

  const handleSubmit = async () => {
    if (!meetingId && !defaultMeetingId) {
      return;
    }

    const response = await fetch(
      `/api/whereby/meetings/${meetingId || defaultMeetingId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      console.log("GetMeetingAPI: ", data);
      setMeetingInfo(data);
    }
  };

  return (
    <>
      <Form title={"Get meeting:"} submitText={"Get"} onSubmit={handleSubmit}>
        <Form.FormField label={"meetingId"}>
          <Form.InputField
            onChange={(v) => setMeetingId(v)}
            defaultValue={defaultMeetingId}
          />
        </Form.FormField>
      </Form>
      <ResponseBlock responseData={meetingInfo} />
    </>
  );
};

export default GetMeetingAPI;
