require('dotenv').config();
const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const DatabaseConnection = require('./Database/dbconnect')
const router = require('./Routes/expenseRoutes')


const app = express();
DatabaseConnection();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
app.use('/api/expense',router)

app.listen(process.env.PORT, ()=>{
    console.log(`server running on ${PORT}`);
})