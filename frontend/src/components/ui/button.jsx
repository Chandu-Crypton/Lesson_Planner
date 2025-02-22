import * as React from "react";

export const Button = ({ children, className, ...props }) => {
  return <button className={`bg-blue-500 text-white px-4 py-2 rounded ${className}`} {...props}>{children}</button>;
};
