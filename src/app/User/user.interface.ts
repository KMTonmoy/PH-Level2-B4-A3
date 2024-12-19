export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    isBlocked: boolean;
    createdAt: string;
    updatedAt: string;
};
