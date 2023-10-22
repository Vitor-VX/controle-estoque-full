require("dotenv").config()

const express = require("express")
const app = express()

const porta = process.env.porta
const path = require("path")
const rotaAdmin = require("../routes/rotaAdmin")

app.use("/admin", rotaAdmin)
app.use(express.json())
app.use(express.static("public"))

app.listen(porta, () => console.log(`Servidor iniciado na porta: ${porta}`))