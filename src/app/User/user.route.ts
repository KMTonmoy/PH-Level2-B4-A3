
import express, { Request, Response, NextFunction } from 'express';
import { userControllers } from './user.controller';
import jwt from 'jsonwebtoken';
import UserModel from './user.model';

const router = express.Router();

interface JwtPayload {
    id: string;
    email: string;
    role: string;
}

const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret') as JwtPayload;
        console.log('Decoded JWT:', decoded);

        const user = await UserModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }


        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied, admin only' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};


router.post('/auth/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userControllers.createUser(req.body);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            statusCode: 201,
            data: { _id: user.id, name: user.name, email: user.email },
        });
    } catch (err) {
        next(err);
    }
});

router.post('/auth/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const loginResponse = await userControllers.loginUser(email, password);

        res.status(loginResponse.statusCode).json({
            success: loginResponse.success,
            message: loginResponse.message,
            statusCode: loginResponse.statusCode,
            data: { token: loginResponse.data.token },
        });
    } catch (err) {
        next(err);
    }
});

router.patch('/admin/users/:userId/block', isAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        console.log('Blocking user with ID:', userId);
        const blockResponse = await userControllers.blockUser(userId, req.header('Authorization')?.replace('Bearer ', '') as string);
        res.status(blockResponse.statusCode).json(blockResponse);
    } catch (err) {
        next(err);
    }
});


router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: err.message || 'Internal Server Error',
    });
});

export const UserRoutes = router;
