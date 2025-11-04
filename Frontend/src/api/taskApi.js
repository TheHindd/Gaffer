import axiosInstance from "./axiosInstance";
import { API_PATHS } from "./apiPaths";

export const createTask = (data) => axiosInstance.post(API_PATHS.TASKS.CREATE, data);

export const getProjectTasks = (projectId) =>
  axiosInstance.get(API_PATHS.TASKS.GET_PROJECT_TASKS(projectId));

export const getTask = (taskId) => axiosInstance.get(API_PATHS.TASKS.GET_TASK(taskId));

export const updateTaskStatus = (taskId, status) =>
  axiosInstance.patch(API_PATHS.TASKS.UPDATE_STATUS(taskId), { status });

export const updateTask = (taskId, data) =>
  axiosInstance.patch(API_PATHS.TASKS.UPDATE(taskId), data);

export const reviewTask = (taskId, data) =>
  axiosInstance.post(API_PATHS.TASKS.REVIEW(taskId), data);

export const deleteTask = (taskId) =>
  axiosInstance.delete(API_PATHS.TASKS.DELETE(taskId));

// 🗒 Personal Notes
export const createNote = (data) => axiosInstance.post(API_PATHS.TASKS.CREATE_NOTE, data);

export const getNotes = () => axiosInstance.get(API_PATHS.TASKS.GET_NOTES);

export const updateNote = (noteId, data) =>
  axiosInstance.patch(API_PATHS.TASKS.UPDATE_NOTE(noteId), data);

export const deleteNote = (noteId) =>
  axiosInstance.delete(API_PATHS.TASKS.DELETE_NOTE(noteId));
