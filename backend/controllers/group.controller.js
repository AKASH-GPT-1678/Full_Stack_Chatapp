import Group from "../models/group.chat.js";

const createGroup = async (req, res) => {
    try {
        // Check authentication
        if (!req.user) {
            return res.status(401).json({
                verified: false,
                status: 401,
                message: "Unauthorized request"
            });
        }

        const userId = req.user.id; // Creator's ID
        const { groupName, description, isPublic, members } = req.body;
        console.log(req.body);

        // Basic validation
        if (!groupName) {
            return res.status(400).json({
                status: 400,
                message: "Group name is required"
            });
        }

        // Ensure members is an array (optional field)
        const membersArray = Array.isArray(members) ? members : [];

        // Add the creator as admin (always included)
        const allMembers = [
            {
                memberId: userId,
                memberName: req.user.email || "Unknown",
                memberStatus: "active",
                role: "admin"
            },
            ...membersArray.map(m => ({
                memberId: m.id,
                memberName: m.name,
                memberStatus: "active",
                role: "member"
            }))
        ];

        // Create the group
        const newGroup = new Group({
            groupName,
            description,
            createdBy: userId,
            isPublic: isPublic || false,
            members: allMembers
        });

        await newGroup.save();

        res.status(201).json({
            status: 201,
            message: "Group created successfully",
            group: newGroup
        });
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
};
const getUserGroups = async (req, res) => {
  try {
    // 1. Check authentication
    if (!req.user) {
      return res.status(401).json({
        verified: false,
        status: 401,
        message: "Unauthorized request",
      });
    }

    // 2. Extract user ID from decoded token
    const userId = req.user.id;

    // 3. Find all groups where the user is a member
    const groups = await Group.find({
      "members.memberId": userId
    })
      .populate("members.memberId", "name email") // populate user details
      .populate("createdBy", "name email");       // populate creator details

    // 4. Return response
    return res.status(200).json({
      verified: true,
      status: 200,
      data: groups,
    });
  } catch (error) {
    console.error("Error fetching user groups:", error);
    return res.status(500).json({
      verified: false,
      status: 500,
      message: "Server error",
    });
  }
};

const getGroupMemberIds = async (groupId) => {
  try {
    if(!groupId){
        throw new Error("Group ID is required");
    }

    // Find the group and only fetch the members field
    const group = await Group.findById(groupId).select("members");

    if (!group) {
      return res.status(404).json({
        verified: false,
        status: 404,
        message: "Group not found",
      });
    }

    // Extract only the memberId values as strings
    const memberIds = group.members.map(m => m.memberId.toString());
    console.log(memberIds);

    return memberIds;

  } catch (error) {
    console.error("Error fetching member IDs:", error);

  }
};

export { createGroup, getUserGroups , getGroupMemberIds};