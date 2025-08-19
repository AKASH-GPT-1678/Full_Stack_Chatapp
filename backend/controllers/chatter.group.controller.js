import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const registerGroup = async (req, res) => {
    try {
        // Check authentication
        if (!req.user) {
            return res.status(401).json({
                verified: false,
                status: 401,
                message: "Unauthorized request"
            });
        }

        const userId = req.user.id;
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
        membersArray.push({ id: userId });


        const groups = await prisma.groups.create({
            data: {
                groupName: groupName,
                description: description,
                isPublic: isPublic,
                groupProfile: "",
                members: {
                    connect: membersArray
                }

            }
        });
        console.log(groups);





        res.status(201).json({
            status: 201,
            message: "Group created successfully",
            group: groups
        });
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
};


const getGroupsofUser = async (req, res) => {
    try {
        // 1. Check authentication
        if (!req.user) {
            return res.status(401).json({
                verified: false,
                status: 401,
                message: "Unauthorized request"
            });
        }

        // 2. Extract user ID from decoded token
        const userId = req.user.id;

        // 3. Find all groups where the user is a member
        const groups = await prisma.groups.findMany({
            where: {
                members: {
                    some: {
                        id: userId
                    }
                }
            }
        });

        // 4. Return response
        return res.status(200).json({
            verified: true,
            status: 200,
            data: groups
        });
    } catch (error) {
        console.error("Error fetching user groups:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
};

const getMembersIds = async (groupId) => {
    try {
        if (!groupId) {
            throw new Error("Group ID is required");
        }

        // Find the group and only fetch the members field
        const group = await prisma.groups.findUnique({
            where: {
                id: groupId
            },
            select: {
                members: true
            }
        });

        if (!group) {
            return res.status(404).json({
                verified: false,
                status: 404,
                message: "Group not found"
            });
        }

        // Extract only the memberId values as strings
        const memberIds = group.members.map(m => m.id.toString());
        console.log(memberIds);

        return memberIds;

    } catch (error) {
        console.error("Error fetching member IDs:", error);

    }
}
export { registerGroup, getGroupsofUser, getMembersIds };