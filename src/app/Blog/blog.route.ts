import express, { Request, Response, NextFunction } from 'express';
import { createBlog, deleteBlog, updateBlog, getAllBlogs, deleteBlogByAdmin } from './blog.controller';
import jwt from 'jsonwebtoken';
import UserModel from '../User/user.model';

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

router.post('/blogs', createBlog);
router.patch('/blogs/:id', updateBlog);
router.delete('/blogs/:id', deleteBlog);
router.delete('/admin/blogs/:id', isAdmin, deleteBlogByAdmin);
router.get('/blogs', getAllBlogs);

router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: err.message || 'Internal Server Error',
    });
});

export const BlogRoutes = router;
