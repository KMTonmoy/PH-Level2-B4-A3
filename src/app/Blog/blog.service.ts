import BlogModel from './blog.model';

const createBlog = async (title: string, content: string, authorId: string) => {
    try {
        const newBlog = new BlogModel({
            title,
            content,
            author: authorId,
        });

        const savedBlog = await newBlog.save();
        return savedBlog;
    } catch (error) {
        console.error('Error creating blog:', error);
        throw new Error('Failed to create blog');
    }
};

export const BlogServices = {
    createBlog,
};
