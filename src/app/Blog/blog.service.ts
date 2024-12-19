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

const getAllBlogs = async (query: any) => {
    try {
        const { search, sortBy = 'createdAt', sortOrder = 'desc', filter } = query;

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
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .populate('author', 'name email');

        return blogs;
    } catch (error) {
        console.error('Error fetching blogs:', error);
        throw new Error('Failed to fetch blogs');
    }
};

export const BlogServices = {
    createBlog,
    getAllBlogs,
};
