import axiosInstance from "./axiosInstance";
import { API_PATHS } from "./apiPaths";

export const getUserData = () => axiosInstance.get(API_PATHS.USERS.GET_USER_DATA);

// export const getAllUsers = () => axiosInstance.get(API_PATHS.USERS.GET_ALL);

export const getUserById = (id) => axiosInstance.get(API_PATHS.USERS.GET_BY_ID(id));

// export const createUser = (data) => axiosInstance.post(API_PATHS.USERS.CREATE_USER, data);

// export const updateUser = (id, data) => axiosInstance.patch(API_PATHS.USERS.UPDATE(id), data);

// export const deleteUser = (id) => axiosInstance.delete(API_PATHS.USERS.DELETE(id));
