import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema: Schema<IBlogPost> = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const BlogPostModel: Model<IBlogPost> = mongoose.model<IBlogPost>('BlogPost', blogPostSchema);

export default BlogPostModel;
