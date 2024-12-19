import UserModel from './user.model';
import bcrypt from 'bcrypt';

const createUser = async (name: string, email: string, password: string, role: 'admin' | 'user' = 'user') => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            role,
            isBlocked: false,
        });
        const savedUser = await newUser.save();
        return savedUser;
    } catch (err) {
        console.error('Error creating user:', err);
        throw new Error('Failed to create user');
    }
};

const getAllUsersFromDB = async () => {
    try {
        const result = await UserModel.find();
        return result;
    } catch (err) {
        console.error('Error retrieving users:', err);
        throw new Error('Failed to retrieve users');
    }
};

export const UserServices = {
    createUser,
    getAllUsersFromDB,
};
