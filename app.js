
const { configDotenv } = require('dotenv');
const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express()
const userRoutes = require('./routes/user.route');
const policyRoutes = require('./routes/policy.route')
const claimRoutes = require('./routes/claim.route')
const quoteRoutes = require('./routes/quote.route')
const supportRoutes = require('./routes/support.route')
const cookieParser = require('cookie-parser');
const cors = require('cors');
configDotenv()
const PORT = 3002

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB is connected Successfully"))
  .catch((err) => console.log("MongoError:", err))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
const urlOrigin = {
  origin: "http://localhost:4200",
  credentials: true
}

app.use(cors(urlOrigin))

app.use('/users', userRoutes)
app.use('/policies', policyRoutes)
app.use('/claims', claimRoutes)
app.use('/quotes', quoteRoutes)
app.use('/supports', supportRoutes)



app.listen(process.env.PORT, () => {
  console.log("I am listening", process.env.PORT);

})