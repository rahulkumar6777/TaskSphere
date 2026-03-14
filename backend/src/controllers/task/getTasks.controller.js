import { decrypt } from "../../utils/encryption.js";
import { models } from '../../models/index.js';


const decryptTask = (task) => {
    const obj = task.toObject ? task.toObject() : { ...task };
    if (obj.description) {
        obj.description = decrypt(obj.description);
    }
    return obj;
};


export const getTasks = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            priority,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = req.query;

        const filter = { user: req.user._id };

        if (status && status !== 'all') filter.status = status;
        if (priority && priority !== 'all') filter.priority = priority;
        if (search) {
            const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            filter.title = { $regex: escaped, $options: 'i' };
        }

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        const sortDir = sortOrder === 'asc' ? 1 : -1;
        const allowedSortFields = ['createdAt', 'updatedAt', 'title', 'dueDate', 'priority', 'status'];
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

        const [rawTasks, total] = await Promise.all([
            models.Task.find(filter).sort({ [sortField]: sortDir }).skip(skip).limit(limitNum).lean(),
            models.Task.countDocuments(filter),
        ]);
        const tasks = rawTasks.map(decryptTask);

        const totalPages = Math.ceil(total / limitNum);

        res.json({
            success: true,
            data: {
                tasks,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages,
                    hasNextPage: pageNum < totalPages,
                    hasPrevPage: pageNum > 1,
                },
            },
        });
    } catch (err) {
        return res.status(500).json({
            error: "internal server Error"
        })
    }
};