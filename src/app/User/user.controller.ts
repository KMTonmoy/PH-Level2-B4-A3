import UserModel from "./user.model";
import jwt from 'jsonwebtoken';

async function createUser(data: { name: string; email: string; password: string }) {
    try {
        const { name, email, password } = data;

        const user = await UserModel.create({
            name,
            email,
            password,
            role: 'user',
        });

        console.log('User created:', user);
        return user;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

async function verifyPassword(userId: string, password: string) {
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await user.isPasswordMatch(password);
        console.log('Password match:', isMatch);
    } catch (error) {
        console.error('Error verifying password:', error);
        throw error;
    }
}

async function loginUser(email: string, password: string) {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await user.isPasswordMatch(password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ id: user._id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });

        return {
            success: true,
            message: 'Login successful',
            statusCode: 200,
            data: {
                token,
            },
        };
    } catch (err) {
        console.error('Error logging in:', err);
        throw new Error('Invalid credentials');
    }
}

export const userControllers = {
    createUser,
    verifyPassword,
    loginUser,
};
