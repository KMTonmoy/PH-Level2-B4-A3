import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { UserRoutes } from './app/User/user.route';
import { BlogRoutes } from './app/Blog/blog.route';

const app: Application = express();

app.use(express.json());
app.use(cors());

app.use('/api', UserRoutes);
app.use('/api', BlogRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send(`Blogs are Running Here !!!`);
});

export default app;
