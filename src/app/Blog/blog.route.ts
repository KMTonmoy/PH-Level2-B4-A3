import express, { Request, Response, NextFunction } from 'express';
import { blogControllers } from './blog.controller';


const router = express.Router();


router.post('/blogs', blogControllers.getAllBlogs);



router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: err.message || 'Internal Server Error',
    });
});

export const BicycleRoutes = router;