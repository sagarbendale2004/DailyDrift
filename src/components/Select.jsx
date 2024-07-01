import React, { useId } from "react";

const Select = React.forwardRef(function Select(
  { options, label, className = "", ...props },
  ref
) {
  const id = useId();
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className=""></label>}
      <select
        {...props}
        ref={ref}
        id={id}
        className={`px-3 py-2 bg-white text-black outline-none 
      focus:bg-gray-50 duration-200 border border-gray-200 w-full ${className}`}
      >
        {options?.map((option) => (
          <option value="option" key={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
});

export default Select;
