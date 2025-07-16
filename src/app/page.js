"use client";
import { useState } from "react";
import Calendar from "react-calendar";

const page = () => {
  const [value, onChange] = useState(new Date());

  return <div className="h-auto p-1"></div>;
};

export default page;
