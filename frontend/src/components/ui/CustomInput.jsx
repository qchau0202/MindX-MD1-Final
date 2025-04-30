import {
  Input as AntdInput,
  Select as AntdSelect,
  InputNumber as AntdInputNumber,
} from "antd";
import { forwardRef } from "react";

const { Option } = AntdSelect;

const CustomInput = forwardRef(
  ({ type = "text", className = "", ...props }, ref) => {
    const baseClass =
      "rounded-xl border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:shadow-md transition-all duration-300 hover:border-blue-300 hover:shadow-lg px-4 py-3 bg-white text-gray-800 placeholder-gray-400";

    if (type === "textarea") {
      return (
        <AntdInput.TextArea
          ref={ref}
          className={`${baseClass} ${className}`}
          {...props}
        />
      );
    }

    if (type === "select") {
      return (
        <AntdSelect
          ref={ref}
          className={`${baseClass} ${className}`}
          popupClassName="shadow-lg rounded-xl border-blue-100"
          {...props}
        />
      );
    }

    if (type === "number") {
      return (
        <AntdInputNumber
          ref={ref}
          className={`${baseClass} ${className}`}
          {...props}
        />
      );
    }

    return (
      <AntdInput
        ref={ref}
        type={type}
        className={`${baseClass} ${className}`}
        {...props}
      />
    );
  }
);

CustomInput.Option = Option;

export default CustomInput;
