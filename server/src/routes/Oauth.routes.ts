import { Router } from "express";
import axios from "axios";
import jwt from "jsonwebtoken"
import { prismaClient } from "../lib/db";
import { UserService } from "../services/user";
const router = Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const YOUR_REDIRECT_URI = process.env.YOUR_REDIRECT_URI;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET


router.get("/login-register/google", (req, res) => {
    if (!GOOGLE_CLIENT_ID || !YOUR_REDIRECT_URI || !GOOGLE_CLIENT_SECRET)
        return res.status(500).json({ message: "could not load google client id" })

    const redirectUri = "https://accounts.google.com/o/oauth2/v2/auth";
    const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: YOUR_REDIRECT_URI,
        response_type: "code",
        scope: "email profile",
        access_type: "offline",
        prompt: "consent",
    });
    res.json({ url: `${redirectUri}?${params.toString()}` })
});


router.get("/callback/google", async (req, res) => {
    const { code } = req.query;

    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: YOUR_REDIRECT_URI,
        grant_type: "authorization_code"
    });

    const { id_token } = tokenRes.data;

    const decoded = jwt.decode(id_token);
    console.log("decoded:", decoded)

    const { email, name, picture } = decoded as { email: string, name: string, picture: string };

    let user = await prismaClient.user.findUnique({ where: { email } });
    if (!user) {
        user = await prismaClient.user.create({
            data: {
                email,
                name,
                password: "google-oauth",
                salt: "no-salt",
                profileImgUrl: picture,
                Oauth: true
            },
        });
    }

    const token = UserService.makeToken({ id: user.id, email: user.email })
    res.json({ token });
});


export { router }