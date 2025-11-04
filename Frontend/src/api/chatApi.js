import axiosInstance from "./axiosInstance";
import { API_PATHS } from "./apiPaths";

export const getAllChats = () => axiosInstance.get(API_PATHS.CHATS.GET_ALL);

export const getChatById = (chatId) => axiosInstance.get(API_PATHS.CHATS.GET_CHAT(chatId));

export const createDirectChat = (data) =>
  axiosInstance.post(API_PATHS.CHATS.CREATE_DIRECT, data);

export const createGroupChat = (data) =>
  axiosInstance.post(API_PATHS.CHATS.CREATE_GROUP, data);

export const sendMessage = (chatId, message) =>
  axiosInstance.post(API_PATHS.CHATS.SEND_MESSAGE(chatId), { message });

export const getMessages = (chatId) =>
  axiosInstance.get(API_PATHS.CHATS.GET_MESSAGES(chatId));

export const addMembersToGroup = (chatId, members) =>
  axiosInstance.post(API_PATHS.CHATS.ADD_MEMBERS(chatId), { members });
