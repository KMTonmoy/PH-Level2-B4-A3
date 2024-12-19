import mongoose from 'mongoose';
import app from './app';

async function main() {
    try {
        await mongoose.connect('mongodb+srv://tonmoyahamed2009:PHLevel2B4A3@cluster0.uumxt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

        app.listen(5000, () => {
            console.log(`App is listening on port 8000`);
        });
    } catch (err) {
        console.log(err);
    }
}

main();