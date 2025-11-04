import axiosInstance from "./axiosInstance";
import { API_PATHS } from "./apiPaths";

export const login = (credentials) =>
  axiosInstance.post(API_PATHS.AUTH.LOGIN, credentials);

export const register = (userData) =>
  axiosInstance.post(API_PATHS.AUTH.REGISTER, userData);

// export const logout = () => axiosInstance.post(API_PATHS.AUTH.LOGOUT);

// export const refreshAccessToken = () =>
//   axiosInstance.post(API_PATHS.AUTH.REFRESH_TOKEN);

// export const forgotPassword = (email) =>
//   axiosInstance.post(API_PATHS.AUTH.FORGOT_PASSWORD, { email });

// export const resetPassword = (token, newPassword) =>
//   axiosInstance.post(API_PATHS.AUTH.RESET_PASSWORD, { token, newPassword });

// export const changePassword = (data) =>
//   axiosInstance.post(API_PATHS.AUTH.CHANGE_PASSWORD, data);
