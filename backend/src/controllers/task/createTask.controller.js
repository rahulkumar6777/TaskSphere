import { decrypt, encrypt } from "../../utils/encryption.js";
import { models } from '../../models/index.js';


const decryptTask = (task) => {
    const obj = task.toObject ? task.toObject() : { ...task };
    if (obj.description) {
        obj.description = decrypt(obj.description);
    }
    return obj;
};

export const createTask = async (req, res, next) => {
    try {
        const { title, description, status, priority, dueDate, tags } = req.body;


        const encryptedDescription = description ? encrypt(description) : '';

        const raw = await models.Task.create({
            user: req.user._id,
            title,
            description: encryptedDescription,
            status,
            priority,
            dueDate: dueDate || null,
            tags: tags || [],
        });

        const task = decryptTask(raw);
        res.status(201).json({ success: true, message: 'Task created', data: { task } });
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            error: "internal server Error"
        })
    }
};