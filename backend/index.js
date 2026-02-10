import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth/auth.route.js';
import connectDB from './db/connectiondb.js';
import cookies from "cookie-parser"
import cors from "cors"

dotenv.config();






const app = express();
app.use(express.json());
app.use(cookies())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use("/api/auth", authRoutes);


const port = process.env.PORT 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB()
})