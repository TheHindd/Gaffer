import ChatRoomModel from "../models/chatRoomModel";

export const CreateNewChat = async (req, res) => {

  const { description, memberIds = []} = req.body;

  try {
    if ( memberIds.length==1 ) {
  const DirectMessageChat =  await ChatRoomModel.create  ({
    name: req.user.name,
    type: "dm",
    members: req.user._id
   })}
   res.status(201).json({ success: true, data: DirectMessageChat });
  } catch (error) {
    
    res.status(400).json({ success: false, error: error.message }); }   
};



export const createNewGroupChat = async (req, res) => {

  const { title, description, memberIds = []} = req.body;

  try {


    const deduped = Array.from(
    new Set([req.user._id.toString(), ...memberIds.map(String)]) ); 

    const membersToInsert = deduped.map(userId => ({
    project: project._id,
    user: new mongoose.Types.ObjectId(userId),
    roleInProject: userId === req.user._id.toString() ? "lead" : "member",
    canCreateTasks: false
    }));

  if (membersToInsert.length) {
   await ProjectMemberModel.insertMany(membersToInsert, { session }); }

    const memberObjectIds = membersToInsert.map(m => m.user);
    const GroupChat = await ChatRoomModel.create  ({  
    type: "group",
    name: title,
    description: description,
    members: memberObjectIds,
    createdBy: req.user._id
  })

    res.status(201).json({ success: true, data: GroupChat });
    
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
 
}