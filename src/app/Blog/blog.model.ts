import { Schema, model, Types } from 'mongoose';
import { Blog } from './blog.interface';

const blogSchema = new Schema<Blog>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    author: {
      type: Types.ObjectId,
      ref: 'User', 
      required: [true, 'Author is required'],
    },
    isPublished: {
      type: Boolean,
      default: true, 
    },
  },
  {
    timestamps: true,  
  }
);

export const BlogModel = model<Blog>('Blog', blogSchema);
