import { models } from "../../models/index.js";

const getMe = async (req, res) => {
    try {
        const user = await models.User.findById(req.user._id);
        res.json({ success: true, data: { user } });
    } catch (err) {
        return res.status(500).json({
            error: "Internal Servver Error"
        })
    }
};

export { getMe }