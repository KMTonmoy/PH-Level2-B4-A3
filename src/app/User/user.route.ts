import express, { Request, Response, NextFunction } from 'express';
import { userControllers } from './user.controller';

const router = express.Router();

router.post('/auth/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userControllers.createUser(req.body);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            statusCode: 201,
            data: {
                _id: user.id,
                name: user.name,
                email: user.email,
            },
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
            data: {
                token: loginResponse.data.token,
            },
        });
    } catch (err) {
        next(err);
    }
});

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err.message);
    res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: err.message || 'Internal Server Error',
    });
});

export const UserRoutes = router;
