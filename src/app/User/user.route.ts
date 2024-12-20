// import express, { Request, Response, NextFunction } from 'express';
// import { userControllers } from './user.controller';
// import jwt from 'jsonwebtoken';
// import UserModel from './user.model';

// const router = express.Router();

// interface JwtPayload {
//   role: string;
// }

// const isAdmin = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   if (!token) {
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
//     if (decoded.role !== 'admin') {
//       return res.status(403).json({ message: 'Access denied, admin only' });
//     }
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };

// router.post('/auth/register', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const user = await userControllers.createUser(req.body);
//         res.status(201).json({
//             success: true,
//             message: 'User registered successfully',
//             statusCode: 201,
//             data: {
//                 _id: user.id,
//                 name: user.name,
//                 email: user.email,
//             },
//         });
//     } catch (err) {
//         next(err);
//     }
// });

// router.post('/auth/login', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { email, password } = req.body;
//         const loginResponse = await userControllers.loginUser(email, password);

//         res.status(loginResponse.statusCode).json({
//             success: loginResponse.success,
//             message: loginResponse.message,
//             statusCode: loginResponse.statusCode,
//             data: {
//                 token: loginResponse.data.token,
//             },
//         });
//     } catch (err) {
//         next(err);
//     }
// });

// // Admin route to block a user
// router.patch('/api/admin/users/:userId/block', isAdmin, async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { userId } = req.params;
//         const blockResponse = await userControllers.blockUser(userId);

//         res.status(blockResponse.statusCode).json(blockResponse);
//     } catch (err) {
//         next(err);
//     }
// });

// router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     console.error('Error:', err.message);
//     res.status(500).json({
//         success: false,
//         message: 'Something went wrong',
//         error: err.message || 'Internal Server Error',
//     });
// });

// export const UserRoutes = router;


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
        console.log('Decoded JWT:', decoded); // Log the decoded JWT to verify contents

        const user = await UserModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Check if the decoded JWT contains the correct 'role' field
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
        console.log('Blocking user with ID:', userId); // Log userId for debugging
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
