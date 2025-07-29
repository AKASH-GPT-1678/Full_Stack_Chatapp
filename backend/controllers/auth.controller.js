import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { verifyToken } from "../middlewares/checkToken.js";
import MyContact from "../models/user.contactModel.js";



async function registerUser(req, res) {
    const { fullName, email, username, phone, password, app } = req.body;

    // ✅ Check required fields (excluding phone)
    if (!fullName || !email || !username || !password) {
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
            fullName: fullName,
            email: email,
            username: username,
            phone: phone,
            password: hashpassword,
            app: app

        });


        return res.status(201).json({ message: "User registered", user: user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong", error: error.message });



    }

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
            res.status(200).json({ message: "Found the User", token: token });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }


    } catch (error) {
        console.log(error);
        res.status(404).json({ error: "User not found" });
    }

};

async function addToContact(req, res) {
    if (!req.user) {
        return { verified: false, status: 401, message: "Unauthorized request" };
    };

    const userId = req.user.id;

    const { contactId } = req.body;

    const contact = await User.findOne({ username: contactId });
    if (!contact) {
        return { verified: false, status: 404, message: `No User Found wih username ${contactId}` };
    };

    try {

        const createContact = await MyContact.create({
            userId: userId,
            contactUserId: contact._id,
            username: contact.username
        });

        return res.status(201).json({ message: "Contact Added", contact: createContact });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong" });

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



}

async function getMyid(req, res) {
    if (!req.user) {
        return { verified: false, status: 401, message: "Unauthorized request" };

    }
    const id = req.user.id;

    try {
        return res.status(200).json({ id: id });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong" });
    }

}

export { registerUser, loginUser, verifyToken, getMyid, googleLogin, checktoken, addToContact, addNickName };