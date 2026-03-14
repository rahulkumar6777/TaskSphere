import { models } from '../../models/index.js';


export const deleteTask = async (req, res, next) => {
    try {
        const task = await models.Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        res.json({ success: true, message: 'Task deleted' });
    } catch (err) {
        return res.status(500).json({
            error: "internal server Error"
        })
    }
};