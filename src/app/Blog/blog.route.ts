import express from 'express';
import { createBlog, deleteBlog, updateBlog, getAllBlogs } from './blog.controller';

const router = express.Router();

router.post('/blogs', createBlog);
router.patch('/blogs/:id', updateBlog);
router.delete('/blogs/:id', deleteBlog);
router.get('/blogs', getAllBlogs);

export const BlogRoutes = router;
