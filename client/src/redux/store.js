import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./features/userSlice";
import themeModeSlice from "./features/themeModeSlice";
import globalLoadingSlice from "./features/globalLoadingSlice";
import authModalSlice from "./features/authModalSlice";
import appStateSlice from "./features/appStateSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    themeMode: themeModeSlice,
    appState: appStateSlice,
    globalLoading: globalLoadingSlice,
    authModal: authModalSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
