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
// CORS (simple + correct)
// =====================
app.use(cors({
  origin: [
    'https://lms-full-stack2-seven.vercel.app',
    'https://lms-full-stack2-jb64ir4im-mansshiks-projects-c7d3b32f.vercel.app'
  ],
  credentials: true
}))

// =====================
// IMPORTANT ORDER
// =====================
app.use(express.json())
app.use(clerkMiddleware())

// =====================
// WEBHOOKS (raw first)
// =====================
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)
app.post('/clerk', express.json(), clerkWebhooks)

// =====================
// ROUTES
// =====================
app.get('/', (req, res) => {
  res.send("API Working")
})

app.use('/api/user', userRouter)
app.use('/api/course', courseRouter)
app.use('/api/educator', educatorRouter)

// =====================
// DB CONNECTION (SAFE FOR VERCEL)
// =====================
const init = async () => {
  try {
    await connectDB()
    await connectCloudinary()
    console.log("DB + Cloudinary connected")
  } catch (err) {
    console.log("Init error:", err.message)
  }
}

init()

// =====================
// EXPORT FOR VERCEL
// =====================
export default app