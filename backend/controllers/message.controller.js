import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();



async function saveMessagePG(senderId, receiverId, content, groupId, status, app) {
    if (!senderId || !receiverId || !content || !status || !app) {
        console.log("❌ Required fields missing");
        return null;
    };
    console.log("i am working ");
    const upperApp = app.toUpperCase();


    try {
        const messsage = await prisma.message.create({
            data: {
                senderId,
                receiverId,
                content,
                groupId,
                status,
                app: upperApp
            }
        });
        console.log("✅ Message saved:", messsage);
        return messsage;

    }
    catch (error) {
        console.log("❌ Error saving message:", error);
        return null;

    }

};
async function checkPendingMessagesPG(receiverId) {
    try {
        const pendingMessages = await prisma.message.findMany({
            where: {
                receiverId: receiverId,
                status: "PENDING"
            }
        })

        if (pendingMessages.length === 0) {
            return null;
        }

        const messages = pendingMessages.map((item) => ({
            senderId: item.senderId,
            receiverId: item.receiverId,
            content: item.content,
            groupId: item.groupId,
            timestamp: item.createdAt

        }


        )


        )
        console.log(messages);

        return messages;
    } catch (err) {
        console.error("❌ Error fetching pending messages:", err);
        return null;  // ✅ Return null on error too
    }
};

async function updateStatusPG(receiverId) {
    const updated = await prisma.message.updateMany({
        where: {
            receiverId: receiverId,
            status: "PENDING"
        },
        data: {
            status: "SUCCESS"
        }
    })

    console.log(`✅ Updated ${updated.count} messages`);
    return "success";
};





export { saveMessagePG, checkPendingMessagesPG , updateStatusPG };