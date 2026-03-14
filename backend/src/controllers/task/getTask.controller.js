import { decrypt } from "../../utils/encryption.js";
import { models } from '../../models/index.js';


const decryptTask = (task) => {
    const obj = task.toObject ? task.toObject() : { ...task };
    if (obj.description) {
        obj.description = decrypt(obj.description);
    }
    return obj;
};

export const getTask = async (req, res) => {
    try {
        const raw = await models._idTask.findOne({ _id: req.params.id, user: req.user._id });
        if (!raw) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        const task = decryptTask(raw);
        res.json({ success: true, data: { task } });
    } catch (err) {
        return res.status(500).json({
            error: "internal server Error"
        })
    }
};