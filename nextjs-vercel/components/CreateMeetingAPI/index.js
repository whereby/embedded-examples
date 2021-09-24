import Form from "../Form";
import ResponseBlock from "../ResponseBlock";

import useCreateMeetingAPI from "./useCreateMeetingAPI";

const CreateMeetingAPI = ({ onMeetingCreated, createdMeetingInfo }) => {
  const { errors, handleSubmit, formFields } = useCreateMeetingAPI({
    onMeetingCreated,
  });

  return (
    <>
      <Form
        title={"Create meeting:"}
        submitText={"Create"}
        onSubmit={handleSubmit}
      >
        <Form.FormField label={"isLocked"} error={errors.isLocked}>
          <Form.SelectField {...formFields.isLocked}>
            <option value="false">false</option>
            <option value="true">true</option>
          </Form.SelectField>
        </Form.FormField>

        <Form.FormField label={"roomNamePrefix"} error={errors.roomNamePrefix}>
          <Form.InputField {...formFields.roomNamePrefix} />
        </Form.FormField>

        <Form.FormField
          label={"roomNamePattern"}
          error={errors.roomNamePattern}
        >
          <Form.SelectField {...formFields.roomNamePattern}>
            <option value="uuid">uuid</option>
            <option value="human-short">human-short</option>
          </Form.SelectField>
        </Form.FormField>

        <Form.FormField label={"roomMode"} error={errors.roomMode}>
          <Form.SelectField {...formFields.roomMode}>
            <option value="group">group</option>
            <option value="normal">normal</option>
          </Form.SelectField>
        </Form.FormField>

        <Form.FormField label={"endDate*"} error={errors.endDate}>
          <Form.InputField type="date" {...formFields.endDate} required />
        </Form.FormField>

        <Form.FormField label={"endTime*"} error={errors.endTime}>
          <Form.InputField type="time" {...formFields.endTime} required />
        </Form.FormField>

        <Form.FormField label={"fields"} error={errors.fields}>
          <Form.InputField {...formFields.fields} />
        </Form.FormField>
      </Form>
      <ResponseBlock responseData={createdMeetingInfo} />
    </>
  );
};

export default CreateMeetingAPI;
