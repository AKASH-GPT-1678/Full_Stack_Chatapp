import User from "../models/user.model.js";
import MyContact from "../models/user.contactModel.js";
import MessageRequest from "../models/message.request.js";


async function addToContactChatter(req, res) {
    if (!req.user) {
        return { verified: false, status: 401, message: "Unauthorized request" };
    };

    const userId = req.user.id

    try {


        const { contactId } = req.body;
        console.log(contactId, userId);

        const contact = await User.findOne({ username: contactId });
        console.log(contact);
        if (!contact) {
            return { verified: false, status: 404, message: `No User Found wih username ${contactId}` };
        };

        const createContact = await MyContact.create({
            userId: userId,
            contactUserId: contact._id,
            username: contact.username
        });

        const user = await User.findOne({
            _id: userId
        });

        await MessageRequest.create({
            senderId: userId,
            recieverId: contact._id,
            senderName: user.username,



        })

        return res.status(201).json({ message: "Contact Added", contact: createContact });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong", error: error });

    }

};

async function acceptRequestChatter(req, res) {

    if (!req.user) {
        return { verified: false, status: 401, message: "Unauthorized request" };
    };

    const userId = req.user.id


    const { requestId } = req.body;

    try {
        const request = await MessageRequest.findOne({
            _id: requestId
        });



        if (!request) {
            return res.status(404).json({ message: "Request Not Found" });
        };

        const contact = await MyContact.findOne({
            contactUserId: userId,
            userId: request.senderId


        });

        if (!contact) {
            return res.status(404).json({ message: "Contact Not Found" });
        };

        const contact2 = await MyContact.create({
            userId: userId,
            contactUserId: request.senderId,
            username: request.senderName,
            accepted: true
        });
        contact2.save();

        contact.accepted = true;
        await contact.save();
        request.accepted = true;
        await request.deleteOne();
        return res.status(200).json({ message: "Request Accepted" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong", error: error });

    }

}
;

async function checkForRequestChatter(req, res) {

    if (!req.user) {
        return { verified: false, status: 401, message: "Unauthorized request" };
    };

    const userId = req.user.id

    try {
        const request = await MessageRequest.find({
            recieverId: userId,
            accepted: false

        });
        console.log(request);

        if (!request) {
            return res.status(200).json({ message: "No Request" })
        } else {

            return res.status(200).json({ message: "Request Recieved", data: request });
        };

    } catch (error) {
        return res.status(500).json({ message: "Something Went Wrong", error: error });

    }

};
async function getMyContactsChatter(req, res) {


    if (!req.user) {
        return { verified: false, status: 401, message: "Unauthorized request" };
    };

    const userId = req.user.id
    try {
        const contacts = await MyContact.find({ userId: userId, accepted: true });
        
        const contacts2 = contacts.map(contact => ({
            ...contact,
            type: "contacts"
        }));
        return res.status(200).json({ contacts: contacts });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong" });
    }

}


export { addToContactChatter, acceptRequestChatter, checkForRequestChatter, getMyContactsChatter };