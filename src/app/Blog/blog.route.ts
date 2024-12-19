import express from 'express';
import { createBlog, updateBlog } from './blog.controller';
 
const router = express.Router();

 
router.post('/blogs', createBlog);
router.patch('/blogs/:id', updateBlog);

export const BlogRoutes = router;
 