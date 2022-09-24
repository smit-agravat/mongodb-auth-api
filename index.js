const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const cors = require('cors');

dotenv.config();

mongoose.connect(process.env.MONGODB_SEC_STRING
).then(() => console.log('Db Connection successful') )
.catch((err) => console.log(err) )

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoute),
app.use('/api/users', userRoute)

app.listen(process.env.PORT || 500, () => {
    console.log("Running")
})
