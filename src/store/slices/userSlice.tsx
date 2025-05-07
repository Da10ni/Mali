import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the state interface for your authentication schema
interface userState {
    user: any;
    username: string,
    gmail: string,
    bio: string;
    displayName: string;
    profilePicture: string;
    earn: string;
    goals: string;
    liketosell: string[];
    categories: string[];
    tiktokUsername: string;
    instagramUsername: string;
}

// Initialize the state
const initialState: userState = {
  user: null,
    bio: "",
    profilePicture: "",
    displayName: "",
    gmail: "",
    username: "",
    goals: "",
    earn: "",
    liketosell: [],
    categories: [],
    tiktokUsername: "",
    instagramUsername: "",

};

// Create the slice
export const userState = createSlice({
  name: "userState",
  initialState,
  reducers: {
    // The `setfield` reducer accepts a payload with a `name` and `value` property
    setfield: (state, action: PayloadAction<{ name:  string; value: any  }>) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
  },
});

// Export the action for use in your components
export const { setfield } = userState.actions;

// Export the reducer for use in your store
export default userState.reducer;
