import { set, isBefore, format, parse, isDate, add } from "date-fns";
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
  startDate: yup
    .date()
    .transform(dateInput2Date)
    .min(new Date(now.toDateString()))
    .required(),
  startTime: yup.date().transform(timeInput2Date).required(),
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
  startDate: format(now, "yyyy-LL-dd"),
  startTime: format(now, "HH:mm"),
  endDate: format(add(now, { hours: 1 }), "yyyy-LL-dd"),
  endTime: format(add(now, { hours: 1 }), "HH:mm"),
  fields: "",
};

const useCreateMeetingForm = ({ onMeetingCreated }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const onSubmit = async ({
    isLocked,
    roomNamePrefix,
    roomNamePattern,
    roomMode,
    startDate,
    startTime,
    endDate,
    endTime,
    fields,
  }) => {
    const startDateTime = set(startDate, {
      hours: startTime.getHours(),
      minutes: startTime.getMinutes(),
    });
    const endDateTime = set(endDate, {
      hours: endTime.getHours(),
      minutes: endTime.getMinutes(),
    });

    if (isBefore(endDateTime, startDateTime)) {
      setError("endDate", {
        type: "manual",
        message: "Meeting end date and time is before start date and time",
      });
      setError("endTime", {
        type: "manual",
        message: "Meeting end date and time is before start date and time",
      });
      return;
    }

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
        startDate: startDateTime,
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
    startDate: register("startDate"),
    startTime: register("startTime"),
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
