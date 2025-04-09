const mongoose = require('mongoose')


const MongoDB_connection = async()=>{
      try{
         await mongoose.connect(process.env.MONGODB_URL)
         console.log("Database successfully connected")

      }catch(error){
         console.log(error);
         process.exit(1);
      }
}

module.exports = MongoDB_connection;