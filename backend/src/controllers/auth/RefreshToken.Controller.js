import jwt from 'jsonwebtoken'
import { models } from '../../models/index.js'
import { AccesstokenOption } from '../../utils/option.js';

const RefreshToken = async (req, res) => {
    try {
        const refrestoken = req.cookies?.RefreshToken;

        if (!refrestoken) {
            return res.status(400).json({
                message: "RefresToken NOt Received"
            })
        }

        const verifytoken = jwt.verify(
            refrestoken,
            process.env.REFRESH_TOKEN_SECRET
        )

        if (!verifytoken) {
            return res.status(400).json({
                message: "Invalid Token"
            })
        }

        const user = await models.User.findById(verifytoken._id);
        if (!user) {
            return res.status(404).json({
                message: "Invalid User"
            })
        }

        if (user.refreshToken != refrestoken) {
            return res.status(400).json({
                message: "Token Expired"
            })
        }

        const AccessToken = await user.generateAccessToken();


        return res.cookie("AccessToken", AccessToken, AccesstokenOption)
            .json({
                success: true
            })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Internal Servver Error"
        })
    }
}


export { RefreshToken }