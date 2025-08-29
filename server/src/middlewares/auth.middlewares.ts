import { UserService } from "../services/user";

export const verifyJWT = async (req: any, res: any, next: any) => {
    try {
        const token = (req.cookies?.token || req.header("Authorization"))

        if (!token) {
            return res.status(401).json({ message: "no token provided" });
        }

        const decodedToken = UserService.decodeJwtToken(token);
        req.user = decodedToken
        console.log(decodedToken)

        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
}