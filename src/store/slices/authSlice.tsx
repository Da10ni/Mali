import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the state interface for your authentication schema
interface AuthState {
  email: string;
  password: string;
  username: string;
  confirmpassword: string;
}

// Initialize the state
const initialState: AuthState = {
  email: "",
  password: "",
  username: "",
  confirmpassword: "",
};

// Create the slice
export const authSlice = createSlice({
  name: "AuthSlice",
  initialState,
  reducers: {
    // The `setfield` reducer accepts a payload with a `name` and `value` property
    setfield: (state, action: PayloadAction<{ name: keyof AuthState; value: string }>) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
  },
});

// Export the action for use in your components
export const { setfield } = authSlice.actions;

// Export the reducer for use in your store
export default authSlice.reducer;
