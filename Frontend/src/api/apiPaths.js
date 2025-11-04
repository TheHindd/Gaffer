export const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const API_PATHS = {
  AUTH: {
    LOGIN: `${API_BASE}/auth/login`,
    REGISTER: `${API_BASE}/auth/register`,
    LOGOUT: `${API_BASE}/auth/logout`,
    RESET_PASSWORD : `${API_BASE}/auth/resetpassword`,
    FORGOT_PASSWORD : `${API_BASE}/auth/forgotpassword`,
    CHANGE_PASSWORD : `${API_BASE}/auth/firstloginpasswordreset`,
    REFRESH_TOKEN:  `${API_BASE}/auth/refreshToken`

  },
  USERS: {
    GET_USER_DATA: `${API_BASE}/users/me`,
    CREATE_USER: `${API_BASE}/users`,
    GET_ALL: `${API_BASE}/users`,
    GET_BY_ID: (id) => `${API_BASE}/users/${id}`,
    UPDATE: (id) => `${API_BASE}/users/${id}`,
    DELETE: (id) => `${API_BASE}/users/${id}`,
   
  },
  PROJECTS: {
    GET_DASHBOARD: `${API_BASE}/projects/dashboard`,
    LIST: `${API_BASE}/projects`,
    CREATE: `${API_BASE}/projects/create`,
    DETAILS: (projectId) => `${API_BASE}/projects/${projectId}`,
    UPDATE: (projectId) => `${API_BASE}/projects/${projectId}`,
    DELETE: (projectId) => `${API_BASE}/projects/${projectId}`,
    ARCHIVE: (projectId) => `${API_BASE}/projects/${projectId}/archive`,
    ADD_MEMBERS: (projectId) => `${API_BASE}/projects/${projectId}/members`,
    GRANT_ACCESS: (projectId) => `${API_BASE}/projects/${projectId}/grant-assistant`,
    REVOKE_ACCESS: (projectId) => `${API_BASE}/projects/${projectId}/revoke-assistant`,

  },
  TASKS: {
    CREATE: `${API_BASE}/tasks`,                            // POST "/"
  BY_PROJECT: (projectId) => `${API_BASE}/tasks/project/${projectId}`, // GET "/project/:projectId"
  DETAILS: (taskId) => `${API_BASE}/tasks/${taskId}`,      // GET "/:taskId"
  UPDATE_STATUS: (taskId) => `${API_BASE}/tasks/${taskId}/status`, // PATCH "/:taskId/status"
  UPDATE: (taskId) => `${API_BASE}/tasks/${taskId}`,       // PATCH "/:taskId"
  REVIEW: (taskId) => `${API_BASE}/tasks/${taskId}/review`,// POST "/:taskId/review"
  DELETE: (taskId) => `${API_BASE}/tasks/${taskId}`,       // DELETE "/:taskId"

  // ─── Personal Notes ───────────────────────────────────
  CREATE_NOTE: `${API_BASE}/tasks/notes/create`,           // POST "/notes/create"
  GET_NOTES: `${API_BASE}/tasks/notes`,                    // GET "/notes"
  UPDATE_NOTE: (noteId) => `${API_BASE}/tasks/notes/${noteId}`, // PATCH "/notes/:noteId"
  DELETE_NOTE: (noteId) => `${API_BASE}/tasks/notes/${noteId}`,
},
  // FILES: {
  //   UPLOAD: `${API_BASE}/files/upload`,
  //   GET_BY_PROJECT: (projectId) => `${API_BASE}/files/project/${projectId}`,
  //   DELETE: (fileId) => `${API_BASE}/files/${fileId}`,
  // },
  // CHATS: {
  //   CREATE_DM: `${API_BASE}/chats/dm`,
  //   CREATE_GROUP: `${API_BASE}/chats/group`,
  //   GET_MESSAGES: (chatId) => `${API_BASE}/chats/${chatId}/messages`,
  // },
};