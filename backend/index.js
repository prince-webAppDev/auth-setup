import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth/auth.route.js';

dotenv.config();





const app = express();




app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use("/api/auth", authRoutes);


const port = process.env.PORT 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})