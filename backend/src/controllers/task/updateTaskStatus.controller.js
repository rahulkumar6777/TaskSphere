import { decrypt } from "../../utils/encryption.js";
import { models } from '../../models/index.js';


const decryptTask = (task) => {
    const obj = task.toObject ? task.toObject() : { ...task };
    if (obj.description) {
        obj.description = decrypt(obj.description);
    }
    return obj;
};


export const updateTaskStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const raw = await models.Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { status },
            { new: true, runValidators: true }
        );
        if (!raw) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        const task = decryptTask(raw);
        res.json({ success: true, message: 'Status updated', data: { task } });
    } catch (err) {
        return res.status(500).json({
            error: "internal server Error"
        })
    }
};