import { Rating } from "@mui/material";
import React from "react";

const Rate = ({ value }) => {
  return <Rating name="read-only" value={value} precision={0.1} readOnly />;
};

export default Rate;
