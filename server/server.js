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

app.use(cors({
  origin: 'https://lms-full-stack2-seven.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.options('*', cors())

app.use(clerkMiddleware())

app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)
app.post('/clerk', express.json(), clerkWebhooks)

app.use(express.json())

app.get('/', (req, res) => {
  res.send("API Working")
})

app.use('/api/educator', educatorRouter)
app.use('/api/course', courseRouter)
app.use('/api/user', userRouter)

// ✅ IMPORTANT (NO FUNCTION)
await connectDB()
await connectCloudinary()

export default app