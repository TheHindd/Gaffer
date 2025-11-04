import axiosInstance from "./axiosInstance";
import { API_PATHS } from "./apiPaths";

export const getProjects = () => axiosInstance.get(API_PATHS.PROJECTS.LIST);

export const getDashboardData = () => axiosInstance.get(API_PATHS.PROJECTS.GET_DASHBOARD);

export const getProjectDetails = (projectId) =>
  axiosInstance.get(API_PATHS.PROJECTS.DETAILS(projectId));

export const createProject = (data) =>
  axiosInstance.post(API_PATHS.PROJECTS.CREATE, data);

export const updateProject = (projectId, data) =>
  axiosInstance.patch(API_PATHS.PROJECTS.UPDATE(projectId), data);

export const deleteProject = (projectId) =>
  axiosInstance.delete(API_PATHS.PROJECTS.DELETE(projectId));

export const archiveProject = (projectId) =>
  axiosInstance.patch(API_PATHS.PROJECTS.ARCHIVE(projectId));

export const addMembers = (projectId, members) =>
  axiosInstance.post(API_PATHS.PROJECTS.ADD_MEMBERS(projectId), { members });

export const grantAccess = (projectId, data) =>
  axiosInstance.post(API_PATHS.PROJECTS.GRANT_ACCESS(projectId), data);

export const revokeAccess = (projectId, data) =>
  axiosInstance.post(API_PATHS.PROJECTS.REVOKE_ACCESS(projectId), data);
