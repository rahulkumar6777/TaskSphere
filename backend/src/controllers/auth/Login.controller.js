import { body, validationResult } from "express-validator";
import { GenerateAccessTokenAndRefreshToken } from '../../utils/GenerateAccessTokenAndRefreshToken.js';
import { AccesstokenOption, RefreshtokenOption } from "../../utils/option.js";
import { models } from "../../models/index.js";

const LoginValidate = [
    body('email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email Formet'),
    body('password')
        .notEmpty()
        .withMessage('password is required')
        .isString()
];

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(password)

        await Promise.all(LoginValidate.map((validate) => validate.run(req)));
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.array()[0].msg
            });
        }


        const user = await models.User.findOne({ email: email }).select('+password')
        if (!user) {
            return res.status(400).json({
                message: "Account not Exist with this Email"
            });
        }

        console.log(user)
        const verifypass = await user.comparePassword(password);
        if (!verifypass) {
            return res.status(400).json({
                message: "Invalid Password"
            });
        }

        const { RefreshToken, AccessToken } = await GenerateAccessTokenAndRefreshToken(user._id)

        return res
            .cookie("RefreshToken", RefreshToken, RefreshtokenOption)
            .cookie("AccessToken", AccessToken, AccesstokenOption)
            .status(200).json({
                message: "Login Success",
            });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Internal server Error"
        });
    }
};

export { Login };