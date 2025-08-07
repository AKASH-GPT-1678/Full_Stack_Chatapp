import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { verifyToken } from "../middlewares/checkToken.js";
import MyContact from "../models/user.contactModel.js";
import MessageRequest from "../models/message.request.js";




async function registerUser(req, res) {
    const { fullName, email, username, phone, password, app } = req.body;

    // ✅ Check required fields (excluding phone)
    if (!email || !username || !password) {
        return res.status(400).json({
            error: "fullName, email, username, and password are required.",
        });
    }



    try {

        const existingUser = await User.findOne({
            $or: [
                { email: email },
                { username: username }

            ],
            $and: [{ app: app }]
        });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }


        const hashpassword = await bcrypt.hash(password, 10);


        const user = await User.create({
            email: email,
            username: username,
            password: hashpassword,
            app: app

        });


        return res.status(201).json({ message: "User registered", success: true, user: user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong", error: error.message });



    }

};

async function deletUser(req, res) {
    const { email } = req.body


    if (!email) {
        throw new Error("Email Cannot BeEmpty");
    };

    const user = User.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ message: "User Not Found" });
    }
    await User.deleteOne({ email: email });
    return res.status(200).json({ message: "User Deleted", success: true });

}


async function checktoken(req, res) {
    if (!req.user) {
        return res.status(401).json({ verified: false, status: 401, message: "Unauthorized" });
    }
    else {
        return res.status(200).json({ message: "Token is valid", verified: true });

    }

}


const generatetoken = (user) => {
    const payload = {
        email: user.email,
        id: user.id
    }


    const secret = "Kunal_Kamra";
    const options = { expiresIn: '3h' };

    return jwt.sign(payload, secret, options)


}

async function googleLogin(req, res) {

    const { email, name, password } = req.body;
    if (!email) {
        throw new Error("Email Cannot BeEmpty");
    }
    try {
        const user = await client.user.findUnique({
            where: {
                email: email
            }
        });

        const hashpassword = await bcrypt.hash(password, 10);
        if (!user) {
            const create = await client.user.create({
                data: {
                    name: name, email: email, googlemail: email, password: hashpassword,

                }

            });

            const seller = await client.sellerAccount.create({
                data: {
                    id: create.id,


                }
            })

            const payload = {
                email: create.email,
                id: create.id,
            };

            const token = await generatetoken(payload);
            return res.status(201).json({ message: "Created", token: token, seller: seller });
        }

        const verify = await bcrypt.compare(password, user.password);
        if (!verify) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const payload = {
            email: user.email,
            id: user.id,
        }

        const token = await generatetoken(payload);
        return res.status(200).json({ success: true, message: "Found User", token: token });


    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message })

    }

}


async function loginUser(req, res) {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new Error("The Required fields cannot be Empty")
    }

    try {
        const finduser = await User.findOne({
            email: email
        })

        const payload = {
            email: finduser.email,
            id: finduser.id
        }



        const compare = await bcrypt.compare(password, finduser.password);
        if (compare) {
            const token = generatetoken(payload);
            res.status(200).json({ success: true, message: "Found the User", token: token });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }


    } catch (error) {
        console.log(error);
        res.status(404).json({ error: "User not found" });
    }

};

async function addToContact(req, res) {




    try {


        const { contactId, userId } = req.body;
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


async function acceptRequest(req, res) {


    const { userId, requestId } = req.body;

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

async function checkForRequest(req, res) {

    const { userId } = req.query;

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

}


async function addNickName(req, res) {
    if (!req.user) {
        return { verified: false, status: 401, message: "Unauthorized request" };
    };

    const userId = req.user.id;



    try {
        const { contactId, nickname } = req.body;
        const contact = await User.findOne({ id: contactId });
        if (!contact) {
            return { verified: false, status: 404, message: `No User Found wih username ${contactId}` };
        };

        const Contact = await MyContact.findOne({ userId: userId, contactUserId: contact._id });
        if (!Contact) {
            return { verified: false, status: 404, message: `No User Found wih username ${contactId}` };
        };

        Contact.nickname = nickname;
        await Contact.save();
        return res.status(201).json({ message: "Contact Added", contact: Contact });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong" });

    }



};

async function getMyContacts(req, res) {


    const { userId } = req.query;
    try {
        const contacts = await MyContact.find({ userId: userId, accepted: true });
        return res.status(200).json({ contacts: contacts });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong" });
    }

}


async function loadProfileDetails(req, res) {
    const { email } = req.query;

    try {

        const response = await User.findOne({ email: email });
        return res.status(200).json({ response: response, success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong", error: error });

    }

}


async function loadMyProfile(req , res) {
    if(!req.user){
        return { verified: false, status: 401, message: "Unauthorized request" };
    };

    const userId = req.user.email;

    try {
        const response = await User.findOne({ email: userId });
        
        return res.status(200).json({ response: response, success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong", error: error });

    }
    
}


export { registerUser, loginUser, checkForRequest, acceptRequest, checktoken, getMyContacts, addToContact, addNickName, deletUser, loadProfileDetails, loadMyProfile };