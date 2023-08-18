import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// to allow CORS (Cross Origin Resource Sharing)
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to our Ecommerce Store');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
