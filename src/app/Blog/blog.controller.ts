import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import BlogPostModel from './blog.model';
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

        const { title, content, isPublished = true } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        const blogPost = new BlogPostModel({
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
        console.error('Error creating blog post:', error);
        return next(error);
    }
};

export const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
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

        const { id } = req.params;
        const { title, content } = req.body;

        const blogPost = await BlogPostModel.findById(id);
        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        if (blogPost.author.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'You can only update your own blog post' });
        }

        if (!title && !content) {
            return res.status(400).json({ message: 'Title or content is required to update the blog' });
        }

        blogPost.title = title || blogPost.title;
        blogPost.content = content || blogPost.content;

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
        console.error('Error updating blog post:', error);
        return next(error);
    }
};
