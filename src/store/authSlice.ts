import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/login", userData);
      return response.data.data;
    } catch (err: any) {
      const errorData = err.response?.data || {
        code: 500,
        success: false,
        message: "Kesalahan mengambil data.",
      };
      return rejectWithValue(errorData);
    }
  },
);

export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/me");
      return response.data.data.user;
    } catch (err: any) {
      return rejectWithValue("Session Expired");
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/user/logout");
      return null;
    } catch (err: any) {
      return rejectWithValue("Logout Gagal");
    }
  },
);

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null; // User bisa null atau object User
  isInitialized: boolean;
  loading: boolean;
  error: any;
}

const initialState: AuthState = {
  user: null,
  isInitialized: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Reducer manual jika ingin hapus state dari client saja
    resetAuth: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Me (Cek Session saat Refresh)
      .addCase(getMe.pending, (state) => {
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload as User;
        state.isInitialized = true;
        state.loading = false;
      })
      .addCase(getMe.rejected, (state) => {
        state.user = null;
        state.isInitialized = true;
        state.loading = false;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;
