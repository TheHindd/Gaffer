import express from 'express';

const chatRouter = express.Router();

//get 
chatRouter.get('/', getAllChats);
chatRouter.get('',  )

//Group Chat
chatRouter.post('/newGroup', createNewGroupChat);
chatRouter.post('/addToGroup', addUserToGroupChat);
chat


chatRouter.post('/newDm', createNewDirectMessageChat);