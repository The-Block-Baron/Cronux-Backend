import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import authRouter from "./routes/authRoutes.js";
import projectRouter from './routes/projectRoutes.js'
import taskRouter from './routes/taskRoutes.js'

dotenv.config();

const app = express();


app.use(helmet());


app.use(cors());


app.use(morgan('combined'));


app.use(express.json());


app.use(express.urlencoded({ extended: true }));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use('/auth', authRouter)
app.use('/api/projects', projectRouter)
app.use('/api/projects', taskRouter)

const port = process.env.PORT || 8000;

const connection = async () => {
    try {
      await mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.log('Failed to connect to MongoDB:', error.message);
      throw error;
    }
};

const runServer = async () => {
    try {
        await connection();
        app.listen(port, () => {
            console.log(`Server running on port ${port} 🔥🔥`);
        });
    } catch (error) {
        console.error('Failed to start server due to database connection error');
        process.exit(1);
    }
};

runServer();
