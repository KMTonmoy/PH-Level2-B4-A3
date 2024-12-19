import express from 'express';
import { createBlog } from './blog.controller';
 
const router = express.Router();

 
router.post('/blogs', createBlog);

export const BlogRoutes = router;
