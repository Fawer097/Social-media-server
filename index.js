import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import signUpRouter from './routes/signUp.js';
import firestoreRouter from './routes/firestore.js';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use(signUpRouter);
app.use(firestoreRouter);

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
