const mongoose = require("mongoose")
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            /* useNewUrlParser: true, */
            /* useUnifiedTopology: true */
        })
    } catch (err) {
        console.error(err)
    }
}
module.exports = connectDB

//its in the dbCoons.js the code I've commented out that the teacher was using was old and not implemented in the current mongDB