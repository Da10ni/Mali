import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaCheckSquare } from "react-icons/fa";

// Define an interface for the data to ensure type safety
interface RegisterData {
  username: string;
  email: string;
  password: string;
  phone: Number;
  fullName: string;
}

interface LoginData {
  email: string;
  username: string;
  password: string;
}

interface UsernameData {
  username: string;
}
export interface UserInfoPayload {
  bio?: string;
  liketosell?: string[];
  categories?: string[];
  profilepicture?: string;
  displayName?: string,
  tiktokUsername?: string,
  instagramUsername?: string,

}

// Register function
const registerUser = async (data: RegisterData): Promise<void> => {
  const { email, password, username, phone, fullName } = data;
  if (!email || !password || !username) {
    toast.error('Email, Password, and username  All are required');
    return;
  }

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`, {
      email,
      password,
      username,
      phone,
      fullName
    });
    localStorage.setItem('token', response.data.Token);
    console.log('Registration successful:', response.data);
    toast.success('Registration successful! Please check your email to verify your account.');
  } catch (error: any) {
    console.error('Registration failed:', error.response?.data || error.message);
    toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
  }
};

// Login function
const loginUser = async (data: LoginData): Promise<any> => {
  const { email, username, password } = data;

  if ((!email && !username) || !password) {
    toast.error('Either Email or Username and Password are required');
    return;
  }

  // Build payload dynamically to avoid sending both
  const payload: any = { password };
  if (email) payload.email = email;
  else if (username) payload.username = username;

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`,
      payload
    );

    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      toast.success('Login successful!');
      return response;
    } else {
      throw new Error("Token not found in the response");
    }
  } catch (error: any) {
    console.error('Login failed:', error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Login failed. Please try again.");
  }
};

const checkUsername = async (data: UsernameData): Promise<any> => {
  const { username } = data;

  if (!username) {
    // toast.error('Username is required');
    return;
  }

  try {
    // Hit the API endpoint to check if the username exists
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/checkusername?username=${username}`);

    // If the username exists, return the response or any success message
    if (response.status === 200 && response.data.message === 'Username exists') {
      // toast.success('Username is available');
      return {errormessage: `${username} already exist ❌`};
    } else {
      // If username does not exist in the database
      // toast.error('Username does not exist');
    }
  } catch (error: any) {
    // console.error('Error checking username:', error.response?.data || error.message);
    // toast.error("Error checking username. Please try again.");
    return { message: `${username}  is available ✅`};
    // return { error: 'Error checking username' };
  }
};

// Function to call the backend API for token verification
 const verifyMagicLink = async (token: string) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verifylink?token=${token}`);
    return response.data; // return the server response
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error verifying token');
  }
};

 const resetPassword = async (email) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/requestresetpassword`, {
      email,
    });

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.error("resetPassword error:", error);

    return {
      success: false,
      error: error.response?.data?.error || "Failed to send reset email.",
    };
  }
};

 const updatePassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/resetpassword`, {
      token,
      newPassword,
    });

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.error("updatePassword error:", error);
    return {
      success: false,
      error: error.response?.data?.error || "Failed to reset password.",
    };
  }
};

 const updateEmail = async (email: string) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/update-email`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    localStorage.setItem("token", res.data.token);
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error || "Email update failed");
  }
};
 const updateUsername = async (username: string) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/update-username`,
      { username },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    localStorage.setItem("token", res.data.token);
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error || "Username update failed");
  }
};


export const verifyEmail = async (token: string) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email?token=${token}`);
    return response.data;  // Return the response data if the verification is successful
  } catch (error) {
    throw new Error('Verification failed: ' + (error.response?.data?.message || error.message));
  }
};

 const updateUserInfo = async (
  payload: UserInfoPayload
): Promise<any> => {
  try {
    const token = localStorage.getItem("token"); // or whatever key you used

    if (!token) {
      throw new Error("User token not found");
    }

    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/auth/userinfo-update`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("updateUserInfo error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to update user info");
  }
};


 const getUserProfile = async (): Promise<any> => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User is not authenticated");
  }

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/userprofile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data.user;
  } catch (error: any) {
    console.error("getUserProfile error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to fetch user profile");
  }
};

 const logout = async () => {
  try {
    // Send POST request to logout API
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`);

    // Return the response data from the API
    return response.data;
  } catch (error) {
    console.error('Error during logout:', error);
    throw error; // Rethrow the error to be handled by the calling component
  }
};


export {
  registerUser,
  loginUser,
  checkUsername ,
  verifyMagicLink,
  resetPassword,
  updatePassword,
  updateUsername,
  updateEmail,
  updateUserInfo,
  getUserProfile,
  logout
};
