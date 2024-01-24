import { getDefaultMiddleware } from "@reduxjs/toolkit";
const customizeMiddleware = getDefaultMiddleware({
  serializableCheck: false,
});

export default customizeMiddleware;
