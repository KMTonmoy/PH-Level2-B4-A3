import { Request, Response } from 'express';
import { BlogServices } from './blog.service';

const getAllBlogs = async (req: Request, res: Response) => {
    try {
        const result = await BlogServices.getAllBlogsFromDB();

        res.status(200).json({
            success: true,
            message: 'Blogs retrieved successfully',
            data: result,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve blogs',
        });
    }
};

export const blogControllers = {
    getAllBlogs,
};
