import { body, validationResult } from "express-validator"
import { models } from "../../models/index.js";

const validateVerifyregister = [
    body('name')
        .notEmpty()
        .withMessage("Fullname is Required")
        .isString(),
    body('email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .normalizeEmail()
        .withMessage("Invalid Email Formet"),
    body('password')
        .notEmpty()
        .withMessage("Password is Required")
        .isString()
        .isLength({ min: 8 })
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .withMessage(
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
        ),
    body('otp')
        .notEmpty()
        .withMessage("otp is required")
        .isLength({ min: 6 })
        .isNumeric()
        .withMessage("Otp Length is 6 and should be number")
]


export const verifyRegister = async (req, res) => {
    try {
        await Promise.all(validateVerifyregister.map((validate) => validate.run(req)));
        const error = validationResult(req)

        if (!error.isEmpty()) {
            return res.status(400).json({
                message: error.array()[0].msg
            })
        }

        const { name, email, otp, password } = req.body;

        const findAndValidateInTempuser = await models.TempUser.findOne({ email })
        if (!findAndValidateInTempuser) {
            return res.status(404).json({
                message: "you not init register!"
            })
        }

        const user = await models.OtpValidate.findOneAndDelete({ email: email, code: otp })
        if (!user) {
            return res.status(400).json({
                message: "Invalid Otp Or Expired"
            })
        }

        // create new user
        const newUser = new models.User({
            name: name,
            email: findAndValidateInTempuser.email,
            password: password,
        })



        // save
        await newUser.save();

        // delete temp user
        await models.TempUser.findOneAndDelete({ email });

        return res.status(201).json({
            message: "User register Success",
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}