import React from "react";

const Form = ({ title, children, onSubmit, submitText }) => (
  <form
    onSubmit={onSubmit}
    className="flex-1 flex flex-col justify-start items-center max-w-lg"
  >
    <div className="flex flex-row justify-start items-center w-full my-4 border-0 border-b-2 border-gray-200">
      <h2 className="m-0 leading-normal text-3xl font-sub-headline">{title}</h2>
    </div>
    <div className="grid grid-cols-2 gap-6">{children}</div>
    <button
      className="bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline my-4"
      type="button"
      onClick={onSubmit}
    >
      {submitText}
    </button>
  </form>
);

const FormField = ({ label, children, error }) => {
  let errorMsg;
  if (Array.isArray(error)) {
    errorMsg = error.map((e) => (
      <p key={e.message} className="text-negative">
        {e.message}
      </p>
    ));
  } else {
    errorMsg = error && <p className="text-negative">{error.message}</p>;
  }
  return (
    <label className="grid grid-cols-1 gap-2">
      <span className="text-primary">{label}</span>
      {children}
      {error && errorMsg}
    </label>
  );
};

const SelectField = React.forwardRef(({ children, ...rest }, ref) => (
  <select
    className="block w-full mt-0 px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black"
    {...rest}
    ref={ref}
  >
    {children}
  </select>
));
SelectField.displayName = "SelectField";

const InputField = React.forwardRef(({ children, ...rest }, ref) => (
  <input
    className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black"
    {...rest}
    ref={ref}
  />
));
InputField.displayName = "InputField";

Form.FormField = FormField;
Form.SelectField = SelectField;
Form.InputField = InputField;

export default Form;
