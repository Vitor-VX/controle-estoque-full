require("./connectDataBase").connectDataBase()
const mongoose = require("mongoose")

const modelAdminstrador = new mongoose.Schema({
    username: String,
    passoword: String,
    token: String
})

const modelLogsSites = new mongoose.Schema({
    produto_adicionado: String,
    produto_removido: String,
    produto_editado: String,
    categoria_produto: String,
    descricao_produto_log: String,
    data_expirar_log: Date,
    type_log: String
})

const modelProdutos = new mongoose.Schema({
    nome_produto: String,
    descricao_produto: String,
    valor_produto: Number,
    categoria_produto: String
})

const AdminstradorModel = mongoose.connection.useDb("controle-estoque").model("admin", modelAdminstrador)
const LogsSiteModel = mongoose.connection.useDb("controle-estoque").model("log", modelLogsSites)
const ProdutosModel = mongoose.connection.useDb("controle-estoque").model("produto", modelProdutos)

module.exports = {
    AdminstradorModel,
    LogsSiteModel,
    ProdutosModel
}