// eslint-disable-next-line no-unused-vars
import React from "react";

function Button({
  btnText,
  type = "button",
  bgColor = "bg-blue-600",
  textColor = "text-white",
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      className={`px-4 py-2 rounded-lg ${className} ${bgColor} ${textColor}`}
      {...props}
    >
      {btnText}
    </button>
  );
}

export default Button;
