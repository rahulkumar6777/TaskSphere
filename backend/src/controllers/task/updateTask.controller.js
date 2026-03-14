import { decrypt, encrypt } from "../../utils/encryption.js";
import { models } from '../../models/index.js';


const decryptTask = (task) => {
    const obj = task.toObject ? task.toObject() : { ...task };
    if (obj.description) {
        obj.description = decrypt(obj.description);
    }
    return obj;
};



export const updateTask = async (req, res, next) => {
    try {
        const { title, description, status, priority, dueDate, tags } = req.body;
        const encryptedDescription = description ? encrypt(description) : '';

        const raw = await models.Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            {
                title,
                description: encryptedDescription,
                status,
                priority,
                dueDate: dueDate || null,
                tags: tags || [],
            },
            { new: true, runValidators: true }
        );

        if (!raw) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        const task = decryptTask(raw);
        res.json({ success: true, message: 'Task updated', data: { task } });
    } catch (err) {
        return res.status(500).json({
            error: "internal server Error"
        })
    }
};