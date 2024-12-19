import UserModel from "./user.model";

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

export const userControllers = {
    createUser,
    verifyPassword,
};
