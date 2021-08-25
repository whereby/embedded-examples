import React from "react";

import Form from "../Form";
import ResponseBlock from "../ResponseBlock";

const DeleteMeetingAPI = ({ defaultMeetingId, onMeetingDeleted }) => {
  const [response, setResponse] = React.useState(null);
  const [meetingId, setMeetingId] = React.useState("");

  const handleSubmit = async () => {
    if (!meetingId && !defaultMeetingId) {
      return;
    }

    const response = await fetch(
      `/api/whereby/meetings/${meetingId || defaultMeetingId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 204) {
      setResponse(response);
      onMeetingDeleted();
    }
  };

  return (
    <>
      <Form
        title={"Delete meeting:"}
        submitText={"Delete"}
        onSubmit={handleSubmit}
      >
        <Form.FormField label={"meetingId"}>
          <Form.InputField
            onChange={(v) => setMeetingId(v)}
            value={meetingId || defaultMeetingId}
          />
        </Form.FormField>
      </Form>
      <ResponseBlock responseData={response} />
    </>
  );
};

export default DeleteMeetingAPI;
