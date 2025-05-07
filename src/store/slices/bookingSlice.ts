import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the state interface for your booking schema
interface bookingState {
  bookingId: string;
  date: any;
  startTime: string;
  endTime: string;
  customerEmail: string;
  customerName: string;
  bookingStatus: string; // For example: "confirmed", "pending", "cancelled"
  paymentStatus: string; // "paid" or "unpaid"
  bookingUserId: number;
  price: number;
  bookingpagebg: string;
  bookingpagetext: string;
}

// Initialize the state
const initialState: bookingState = {
  bookingId: "",
  date: "",
  startTime: "",
  endTime: "",
  customerEmail: "",
  customerName: "",
  bookingStatus: "pending", // Default booking status
  paymentStatus: "unpaid", // Default payment status
  bookingUserId: 0,
  price: 0,
  bookingpagebg: "",
  bookingpagetext: "",
};

// Create the slice
export const bookingSlice = createSlice({
  name: "bookingState",
  initialState,
  reducers: {
    // Set the value for a specific field in the booking state
    setField: (state, action: PayloadAction<{ name: string; value: any }>) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    setAppointment: (state, action: PayloadAction<{ name: string; value: any }>) => {
      const { name, value } = action.payload;
      // Create a new state object with the updated property
      return { ...state, [name]: value };
    },
    
    // Set all fields for the booking state
    setBookingDetails: (state, action: PayloadAction<bookingState>) => {
      const {
        bookingId,
        date,
        startTime,
        endTime,
        customerEmail,
        customerName,
        bookingStatus,
        paymentStatus,
        bookingUserId,
      } = action.payload;
      
      state.bookingId = bookingId;
      state.date = date;
      state.startTime = startTime;
      state.endTime = endTime;
      state.customerEmail = customerEmail;
      state.customerName = customerName;
      state.bookingStatus = bookingStatus;
      state.paymentStatus = paymentStatus;
      state.bookingUserId = bookingUserId;
    },

    // Reset the booking state (useful for clearing booking information after completion or cancellation)
    resetBookingState: (state) => {
      state.bookingId = "";
      state.date = "";
      state.startTime = "";
      state.endTime = "";
      state.customerEmail = "";
      state.customerName = "";
      state.bookingStatus = "pending";
      state.paymentStatus = "unpaid";
      state.bookingUserId = 0;
    },
  },
});

// Export the actions for use in your components
export const { setField, setBookingDetails, resetBookingState, setAppointment } = bookingSlice.actions;

// Export the reducer for use in your store
export default bookingSlice.reducer;
