import { set, format, parse, isDate, add } from "date-fns";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const timeInput2Date = (_currentValue, originalValue) => {
  const now = new Date();
  return isDate(originalValue)
    ? originalValue
    : new Date(`${now.toDateString()} ${originalValue}`);
};

const dateInput2Date = (_currentValue, originalValue) => {
  return isDate(originalValue)
    ? originalValue
    : parse(originalValue, "yyyy-LL-dd", new Date());
};

const text2Array = (_currentValue, originalValue) => {
  return originalValue.length > 0 ? originalValue.split(",") : [];
};

const now = new Date();

const schema = yup.object().shape({
  isLocked: yup.boolean().transform((v) => v === "true"),
  roomNamePrefix: yup
    .string()
    .matches(/[/][a-z0-9]/, { excludeEmptyString: true })
    .max(40),
  roomNamePattern: yup.string().oneOf(["uuid", "human-short"]),
  roomMode: yup.string().oneOf(["group", "normal"]),
  endDate: yup
    .date()
    .transform(dateInput2Date)
    .min(new Date(now.toDateString()))
    .required(),
  endTime: yup.date().transform(timeInput2Date).required(),
  fields: yup
    .array()
    .transform(text2Array)
    .of(yup.string().oneOf(["hostRoomUrl"])),
});

const defaultValues = {
  isLocked: "false",
  roomNamePrefix: "",
  roomNamePattern: "uuid",
  roomMode: "normal",
  endDate: format(add(now, { hours: 1 }), "yyyy-LL-dd"),
  endTime: format(add(now, { hours: 1 }), "HH:mm"),
  fields: "",
};

const useCreateMeetingForm = ({ onMeetingCreated }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const onSubmit = async ({
    isLocked,
    roomNamePrefix,
    roomNamePattern,
    roomMode,
    endDate,
    endTime,
    fields,
  }) => {
    const endDateTime = set(endDate, {
      hours: endTime.getHours(),
      minutes: endTime.getMinutes(),
    });

    const response = await fetch("/api/whereby/meetings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isLocked,
        roomNamePrefix,
        roomNamePattern,
        roomMode,
        endDate: endDateTime,
        fields,
      }),
    });

    if (response.status === 201) {
      const data = await response.json();
      console.log("CreateMeetingAPI: ", data);
      onMeetingCreated(data);
    }
  };

  const formFields = {
    isLocked: register("isLocked"),
    roomNamePrefix: register("roomNamePrefix"),
    roomNamePattern: register("roomNamePattern"),
    roomMode: register("roomMode"),
    endDate: register("endDate"),
    endTime: register("endTime"),
    fields: register("fields"),
  };

  return {
    errors,
    handleSubmit: handleSubmit(onSubmit),
    register,
    formFields,
  };
};

export default useCreateMeetingForm;
