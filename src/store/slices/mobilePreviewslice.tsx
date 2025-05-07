import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the state interface for your authentication schema
interface Mobile_preview_state {
    username: string,
    password: string,
    email: string,
    phone: string,
    website: string,
    bio: string,
    address: string,
    profile_picture: string,
    testing:  string,
    
   
}

// Initialize the state
const initialState: Mobile_preview_state = {
    username: "",
    password: "",
    email: "",
    phone: "",
    website: "",
    bio: "",
    address: "",
    profile_picture: "",
    testing:  "",
   

};

// Create the slice
export const userState = createSlice({
  name: "Mobile_preview_state",
  initialState,
  reducers: {
    // The `setfield` reducer accepts a payload with a `name` and `value` property
    setValue: (state, action: PayloadAction<{ name:  string; value: any  }>) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
  },
});

// Export the action for use in your components
export const { setValue } = userState.actions;

// Export the reducer for use in your store
export default userState.reducer;
