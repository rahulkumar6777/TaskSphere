import express from 'express';
import { contollers } from '../controllers/index.js';
import { verifyJWT } from '../middlewares/Auth.js';

const authRouter = express.Router();


// auth routes
authRouter.post('/register/init', contollers.Auth.Register.init);
authRouter.post('/register/verify', contollers.Auth.Register.verify);
authRouter.post('/login', contollers.Auth.Login);
authRouter.post('/refresh/refreshtoken', contollers.Auth.RefreshToken);
authRouter.post('/logout', verifyJWT, contollers.Auth.Logout);
authRouter.get('/me', verifyJWT, contollers.Auth.getMe);


export default authRouter;