import { BlogModel } from './blog.model';

const getAllBlogsFromDB = async () => {
    try {
        const result = await BlogModel.find();
        return result;
    } catch (err) {
        console.error('Error retrieving blogs:', err);
        throw new Error('Failed to retrieve blogs');
    }
};

export const BlogServices = {
    getAllBlogsFromDB,
};
