import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import { getErrorMessage } from "../utils/error";
import type { MyErrorResponse } from "../types/error";

// ─── Types ───────────────────────────────────────────────────
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isInitialized: boolean;
  loading: boolean;
  registerLoading: boolean;
  error: MyErrorResponse | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// ─── Thunks ──────────────────────────────────────────────────

export const registerUser = createAsyncThunk<
  void,
  RegisterCredentials,
  { rejectValue: MyErrorResponse }
>("auth/registerUser", async (userData, { rejectWithValue }) => {
  try {
    await api.post("/user/register", userData);
    // Register tidak auto-login, redirect ke /login setelah sukses
  } catch (err: unknown) {
    const errorMessage = getErrorMessage(err);
    return rejectWithValue(errorMessage);
  }
});

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/user/login", userData);
      return response.data.data;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      return rejectWithValue(errorMessage);
    }
  },
);

export const getMe = createAsyncThunk<
  User,
  void,
  { rejectValue: MyErrorResponse }
>("auth/getMe", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/me");
    return response.data.data.user;
  } catch (err: unknown) {
    const errorMessage = getErrorMessage(err);
    return rejectWithValue(errorMessage);
  }
});

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/user/logout");
      return null;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      return rejectWithValue(errorMessage);
    }
  },
);

// ─── Initial State ───────────────────────────────────────────
const initialState: AuthState = {
  user: null,
  isInitialized: false,
  loading: false,
  registerLoading: false,
  error: null,
};

// ─── Slice ───────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Register ──────────────────────────────────────────
      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.registerLoading = false;
        // user tetap null — harus login dulu setelah register
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerLoading = false;
        state.error = action.payload as MyErrorResponse;
      })

      // ── Login ─────────────────────────────────────────────
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isInitialized = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as MyErrorResponse;
        state.isInitialized = true;
      })

      // ── Get Me (cek session saat refresh) ─────────────────
      .addCase(getMe.pending, (state) => {
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isInitialized = true;
        state.loading = false;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.user = null;
        state.isInitialized = true;
        state.error = action.payload as MyErrorResponse;
        state.loading = false;
      })

      // ── Logout ────────────────────────────────────────────
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;
