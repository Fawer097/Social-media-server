import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import postRouter from './router/postRouter.js';
import authRouter from './router/authRouter.js';
import userRouter from './router/userRouter.js';
import friendsRouter from './router/friendsRouter.js';
import messagerRouter from './router/messagerRouter.js';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', friendsRouter);
app.use('/api', messagerRouter);
app.use('/api', postRouter);

const start = () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
