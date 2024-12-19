import { Schema, model, Document } from 'mongoose';

export interface IBlogPost extends Document {
    title: string;
    content: string;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    isPublished: { type: Boolean, default: true },
}, {
    timestamps: true,
});

const BlogPostModel = model<IBlogPost>('BlogPost', blogPostSchema);

export default BlogPostModel;
