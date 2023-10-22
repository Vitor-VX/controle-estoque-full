require("dotenv").config()
const mongoose = require("mongoose")

async function connectDataBase() {
    try {
        mongoose.connect(`mongodb+srv://${process.env.USERNAME_DATA_BASE}:${process.env.PASSWORD_DATA_BASE}@bancodedadosvitor-vx.6awlvqi.mongodb.net/?retryWrites=true&w=majority`)
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    connectDataBase
}