import { set, isBefore } from "date-fns";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { timeInput2Date } from "../Form";

const schema = yup.object().shape({
  isLocked: yup.boolean(),
  roomNamePrefix: yup
    .string()
    .matches(/[/][a-z0-9]/, { excludeEmptyString: true })
    .max(40),
  roomNamePattern: yup.string().oneOf(["uuid", "human-short"]),
  roomMode: yup.string().oneOf(["group", "normal"]),
  startDate: yup.date().min(new Date()).required(),
  startTime: yup.date().required(),
  endDate: yup.date().min(new Date()).required(),
  endTime: yup.date().required(),
  fields: yup.array(yup.string().oneOf(["hostRoomUrl"])),
});

const defaultValues = {
  isLocked: false,
  roomNamePrefix: "",
  roomNamePattern: "uuid",
  roomMode: "normal",
  startDate: new Date(),
  startTime: new Date(),
  endDate: new Date(),
  endTime: new Date(),
  fields: [],
};

const useCreateMeetingForm = ({ onMeetingCreated } = {}) => {
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

    const data = await response.json();
    console.log(data);
    if (onMeetingCreated) {
      onMeetingCreated(data);
    }
  };

  const formFields = {
    isLocked: {
      ...register("isLocked", { setValueAs: (v) => v === "true" }),
      defaultValue: defaultValues.isLocked,
    },
    roomNamePrefix: {
      ...register("roomNamePrefix"),
      defaultValue: defaultValues.roomNamePrefix,
    },
    roomNamePattern: {
      ...register("roomNamePattern"),
      defaultValue: defaultValues.roomNamePattern,
    },
    roomMode: {
      ...register("roomMode"),
      defaultValue: defaultValues.roomMode,
    },
    startDate: {
      ...register("startDate", {
        valueAsDate: true,
      }),
    },
    startTime: {
      ...register("startTime", {
        setValueAs: timeInput2Date,
      }),
    },
    endDate: {
      ...register("endDate", {
        valueAsDate: true,
      }),
    },
    endTime: {
      ...register("endTime", {
        setValueAs: timeInput2Date,
      }),
    },
    fields: {
      ...register("fields", {
        setValueAs: (v) => {
          if (typeof v === "string") {
            return v.split(",");
          }

          return v;
        },
      }),
      defaultValue: "",
    },
  };

  return {
    errors,
    handleSubmit: handleSubmit(onSubmit),
    register,
    formFields,
  };
};

export default useCreateMeetingForm;
