import app from "./index.js";


const PORT = process.env.PORT;


// routes
import authRoutes from "./src/routes/auth.routes.js";
import taskRoutes from "./src/routes/task.routes.js";


app.use('/api/auth',  authRoutes);
app.use('/api/tasks', taskRoutes);


// Health Check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'TaskFlow API is running', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})