import jwt from "jsonwebtoken"



export async function verifyToken(token) {
    try {
        const verfication = await jwt.verify(token, "Kunal_Kamra");
        return verfication
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return { message: "Token Expired" }
        } else {
            return null
        }
    }

}
