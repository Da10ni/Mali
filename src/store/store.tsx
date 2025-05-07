import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";  // Import the authSlice reducer
import userReducer from "./slices/userSlice";  // Import the authSlice reducer
import MobilePreviewReducer from "./slices/mobilePreviewslice";  // Import the authSlice reducer
import BookingReducer from "./slices/bookingSlice";  // Import the authSlice reducer

// Configure the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,  // Add the auth slice reducer
    user: userReducer,
    mobilePreview: MobilePreviewReducer,
    booking: BookingReducer,
  },
});

// Export the store for use in your app
export default store;

// Define types for the store state and dispatch functions
export type RootState = ReturnType<typeof store.getState>;  // State type of the entire store
export type AppDispatch = typeof store.dispatch;  // Dispatch type for the store
