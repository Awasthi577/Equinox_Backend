import { Router, Request, Response } from "express"
import { upload } from "../middlewares/multer.middleware";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { verifyJWT } from "../middlewares/auth.middlewares";
import { prismaClient } from "../lib/db";


declare global {
    namespace Express {
        interface User {
            email?: string;
            id?: string
        }
        interface Request {
            user?: User;
        }
    }
}

const router = Router();

router.use(verifyJWT)

router.route("/update-profileImg").put(upload.single("profilepic"), 
async (req: Request, res: Response) => {
    let pfpPath: string | undefined;
    const email = req.user?.email
    if (!email) return res.status(403).json({ message: "Unauthorized access" })
    if (req.file) {
        pfpPath = req.file.path;
    }
    console.log("pfpPath" + pfpPath)
    let pfp: any = null;

    if (pfpPath) {
        pfp = await uploadOnCloudinary(pfpPath)
        console.log("pfp");
        console.log(pfp)
    }


    if (!pfp?.secure_url && pfpPath) {
        return res.status(400).json({ message: "could not upload profile picture" });
    }
    const profileImgUrl = pfp.secure_url
    try {
        await prismaClient.user.update({
            where: {
                email
            },
            data: {
                profileImgUrl
            }
        })
    } catch (error) {
        return res.status(500).json({ message: "error while saving link in db" });
    }

    return res.status(200).json({
        data: profileImgUrl,
        message: "profile image successfully updated"
    })

})

export { router }