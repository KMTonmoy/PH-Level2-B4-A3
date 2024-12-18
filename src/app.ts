import cors from 'cors';
import express, { Application, Request, Response } from 'express';



const app: Application = express();


app.use(express.json());
app.use(cors());


// app.use('/api',);


app.get('/', (req: Request, res: Response) => {
    res.send(`Blogs are Running Here !!!`);
});

export default app;