import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth/auth.route.js';
import connectDB from './db/connectiondb.js';

dotenv.config();





const app = express();
app.use(express.json());




app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use("/api/auth", authRoutes);


const port = process.env.PORT 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB()
})