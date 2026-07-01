import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from './configs/mongodb.js'
import connectCloudinary from './configs/cloudinary.js'

import userRouter from './routes/userRoutes.js'
import educatorRouter from './routes/educatorRoutes.js'
import courseRouter from './routes/courseRoute.js'

import { clerkMiddleware } from '@clerk/express'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'

const app = express()

// =====================
// CORS (FIXED)
// =====================
app.use(cors({
  origin: 'https://lms-full-stack2-seven.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.options('*', cors())

// =====================
// Middlewares
// =====================
app.use(clerkMiddleware())

// IMPORTANT: raw routes first
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)
app.post('/clerk', express.json(), clerkWebhooks)

// JSON routes
app.use(express.json())

// =====================
// Routes
// =====================
app.get('/', (req, res) => {
  res.send("API Working")
})

app.use('/api/educator', educatorRouter)
app.use('/api/course', courseRouter)
app.use('/api/user', userRouter)

// =====================
// DB INIT (NO app.listen)
// =====================
const startServer = async () => {
  try {
    await connectDB()
    await connectCloudinary()
    console.log("DB + Cloudinary connected")
  } catch (error) {
    console.log("Server Init Error:", error)
  }
}

startServer()

// =====================
// EXPORT FOR VERCEL
// =====================
export default app