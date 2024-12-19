import UserModel from './user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

const loginUser = async (email: string, password: string) => {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1h' }
        );

        return {
            success: true,
            message: 'Login successful',
            statusCode: 200,
            data: { token },
        };
    } catch (err) {
        console.error('Error logging in user:', err);
        throw new Error('Login failed');
    }
};

export const UserServices = {
    createUser,
    getAllUsersFromDB,
    loginUser,
};
