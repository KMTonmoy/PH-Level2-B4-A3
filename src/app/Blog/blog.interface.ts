import { ObjectId } from 'mongoose';

export type Blog = {
    id: string;
    title: string;
    content: string;
    author: ObjectId;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
};
