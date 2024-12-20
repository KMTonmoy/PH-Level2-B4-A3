import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import BlogModel from './blog.model';
import UserModel from '../User/user.model';

export const createBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as { id: string };
        const user = await UserModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.isBlocked) {
            return res.status(403).json({ message: 'Your account is blocked. You cannot create blogs.' });
        }
        const { title, content, isPublished = true } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }
        const blogPost = new BlogModel({
            title,
            content,
            author: user._id,
            isPublished,
        });
        await blogPost.save();
        return res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            statusCode: 201,
            data: {
                _id: blogPost._id,
                title: blogPost.title,
                content: blogPost.content,
                author: {
                    name: user.name,
                    email: user.email,
                },
            },
        });
    } catch (error) {
        return next(error);
    }
};

export const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as { id: string };
        const user = await UserModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.isBlocked) {
            return res.status(403).json({ message: 'Your account is blocked. You cannot update blogs.' });
        }
        const blogPost = await BlogModel.findById(id);
        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        if (blogPost.author.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this blog post' });
        }
        const { title, content, isPublished } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }
        blogPost.title = title;
        blogPost.content = content;
        blogPost.isPublished = isPublished ?? blogPost.isPublished;
        await blogPost.save();
        return res.status(200).json({
            success: true,
            message: 'Blog updated successfully',
            statusCode: 200,
            data: {
                _id: blogPost._id,
                title: blogPost.title,
                content: blogPost.content,
                author: {
                    name: user.name,
                    email: user.email,
                },
            },
        });
    } catch (error) {
        return next(error);
    }
};

export const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as { id: string };
        const user = await UserModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.isBlocked) {
            return res.status(403).json({ message: 'Your account is blocked. You cannot delete blogs.' });
        }
        const blogPost = await BlogModel.findById(id);
        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        if (blogPost.author.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this blog post' });
        }
        await blogPost.deleteOne();
        return res.status(200).json({
            success: true,
            message: 'Blog deleted successfully',
            statusCode: 200,
        });
    } catch (error) {
        return next(error);
    }
};

export const deleteBlogByAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as { id: string, role: string };
        const user = await UserModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied, admin only' });
        }
        if (user.isBlocked) {
            return res.status(403).json({ message: 'Your account is blocked. You cannot delete blogs.' });
        }
        const blogPost = await BlogModel.findById(id);
        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        await blogPost.deleteOne();
        return res.status(200).json({
            success: true,
            message: 'Blog deleted successfully by admin',
            statusCode: 200,
        });
    } catch (error) {
        return next(error);
    }
};

export const getAllBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search, sortBy = 'createdAt', sortOrder = 'desc', filter } = req.query;
        const searchFilter = search
            ? {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { content: { $regex: search, $options: 'i' } },
                ],
            }
            : {};
        const authorFilter = filter ? { author: filter } : {};
        const blogs = await BlogModel.find({
            ...searchFilter,
            ...authorFilter,
        })
            .sort({ [sortBy as string]: sortOrder === 'asc' ? 1 : -1 })
            .populate('author', 'name email');
        return res.status(200).json({
            success: true,
            message: 'Blogs fetched successfully',
            statusCode: 200,
            data: blogs,
        });
    } catch (error) {
        return next(error);
    }
};

export const BlogController = {
    createBlog,
    updateBlog,
    deleteBlog,
    deleteBlogByAdmin,
    getAllBlogs,
};
