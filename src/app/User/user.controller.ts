import UserModel from './user.model';
import jwt from 'jsonwebtoken';

async function createUser(data: { name: string; email: string; password: string }) {
    try {
        const { name, email, password } = data;
        const user = await UserModel.create({ name, email, password, role: 'user' });
        return user;
    } catch (error) {
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
    } catch (error) {
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

        // Ensure that the role is included in the JWT payload
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role }, 
            'your_jwt_secret', 
            { expiresIn: '1y' }
        );

        return {
            success: true,
            message: 'Login successful',
            statusCode: 200,
            data: { token },
        };
    } catch (err) {
        throw new Error('Invalid credentials');
    }
}



async function blockUser(userId: string, adminToken: string) {
    try {
        const decoded = jwt.verify(adminToken, 'your_jwt_secret') as { role: string };
        if (decoded.role !== 'admin') {
            throw new Error('Access denied, admin only');
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        console.log('User found:', user); // Log the user found in the database
        user.isBlocked = true;
        
        const savedUser = await user.save();
        console.log('User blocked successfully:', savedUser); // Log after saving the user

        return {
            success: true,
            message: 'User blocked successfully',
            statusCode: 200,
        };
    } catch (error) {
        console.error('Error blocking user:', error); // Log the error
        throw new Error('Error blocking user');
    }
}


export const userControllers = {
    createUser,
    verifyPassword,
    loginUser,
    blockUser,
};
