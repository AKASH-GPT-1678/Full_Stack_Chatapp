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

export { registerGroup };