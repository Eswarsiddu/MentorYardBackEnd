const express = require('express');
const dotenv = require('dotenv');
// const cors = require('cors')
const { mongoConnect } = require('./app/Services/mongo_connector')
// const mentorRouter = require('./app/Routers/familyRouter');
// const studentRouter = require('./app/Routers/studentRouter');

const app = express();
dotenv.config()
const port = process.env.PORT
mongoConnect()


app.use(express.json())
// app.use(cors())


// app.use('/mentor', mentorRouter)
// app.use('/student', studentRouter)

app.listen(port, () => console.log(`server started at http://localhost:${port}`))
