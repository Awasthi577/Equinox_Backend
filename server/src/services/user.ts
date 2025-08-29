import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from "node:crypto";
import JWT from "jsonwebtoken";

export interface userInterface {
    email: string,
    password: string
}

export const contextMiddleware = (context: any) => {
    console.log(context)
    if (context && context.user) {
        return context.user
    }
    throw ("dont know who you are!")
}


const JWT_SECRET = process.env.JWT_SECRET;

export class UserService {
    private static generateHash(salt: string, password: string) {
        const hashedPassword = createHmac("sha256", salt).update(password).digest('hex');
        return hashedPassword;
    }

    public static async changeUserName(email: string, userId: string, newUserName: string) {
        const userDetails = await prismaClient.user.findFirst({
            where: {
                id: userId
            }
        })

        if (!userDetails?.email || userDetails?.email != email)
            throw new Error("User not Authorised")

        await prismaClient.user.update({
            where: {
                id: userId
            },
            data: {
                name: newUserName
            }
        })
    }

    public static async createUser(payload: userInterface) {
        const { email, password } = payload;
        const salt = randomBytes(32).toString('hex');
        const hashedPassword = UserService.generateHash(salt, password);

        return await prismaClient.user.create({
            data: {
                email,
                password: hashedPassword,
                salt
            }
        })
    }

    public static async getUserToken(payload: userInterface) {
        if (!JWT_SECRET) throw new Error("jwt secret not defined")
        const user = await UserService.getUserByEmail(payload.email);
        if (!user) throw new Error("User does not exist");

        const userSalt = user.salt;
        const userHashPassword = UserService.generateHash(userSalt, payload.password)
        if (userHashPassword != user.password) throw new Error("wrong password");

        return this.makeToken({ id: user.id, email: user.email })
    }

    public static makeToken(payload: { id: string, email: string }) {
        if (!JWT_SECRET) throw new Error("jwt secret not defined")
        return JWT.sign(payload, JWT_SECRET)
    }

    public static decodeJwtToken(token: string) {
        if (!JWT_SECRET) throw new Error("jwt secret not defined")
        return JWT.verify(token, JWT_SECRET)
    }

    public static async getUserByEmail(email: string) {
        return await prismaClient.user.findUnique({ where: { email } })
    }
    public static async getUserById(id: string) {
        return await prismaClient.user.findUnique({ where: { id } });
    }

}