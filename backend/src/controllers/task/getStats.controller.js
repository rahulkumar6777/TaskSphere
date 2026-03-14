import { models } from '../../models/index.js';


export const getStats = async (req, res) => {
    try {
        const stats = await models.Task.aggregate([
            { $match: { user: req.user._id } },
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);

        const counts = { todo: 0, 'in-progress': 0, completed: 0, cancelled: 0, total: 0 };
        stats.forEach(({ _id, count }) => {
            counts[_id] = count;
            counts.total += count;
        });

        res.json({ success: true, data: { stats: counts } });
    } catch (err) {
        return res.status(500).json({
            error: "internal server Error"
        })
    }
};