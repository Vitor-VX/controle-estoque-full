require("dotenv").config()
const jwt = require("jsonwebtoken")

const checarTokenUsuario = async (req, res, next) => {
    const { AdminstradorModel, LogsSiteModel } = require("../database/model")

    const username = req.cookies.username_auth
    const verificarClienteExiste = await AdminstradorModel.findOne({ username })

    if (username !== null && username !== undefined && verificarClienteExiste !== null) {
        const token = verificarClienteExiste.token

        if (!token) {
            res.status(401).json({ message: "Acesso negado." })
            return;
        }

        try {
            const verificarUsuario = jwt.verify(token, process.env.SECRET)

            next()
        } catch (err) {
            res.status(401).json({ message: "Token inválido." })
        }
    } else {
        res.redirect("/admin/login");
        return;
    }
}

// Funções de Log

const logProdutoAdicionado = async (produto, categoria, LogsSiteModel) => {
    try {
        const data = new Date()
        const tempo_excluir = new Date(data.getTime() + 40000)

        const result = await LogsSiteModel.create({
            produto_adicionado: produto, categoria_produto: categoria, descricao_produto_log: `${produto} adicionado(a)!`, data_expirar_log: tempo_excluir, type_log: "Adicionado"
        })

        return;
    } catch (error) {
        console.log(error);
    }
}

const logProdutoRemovido = async (produto, LogsSiteModel) => {
    try {
        const data = new Date()
        const tempo_excluir = new Date(data.getTime() + 3600000)

        const result = await LogsSiteModel.create({
            produto_removido: produto, descricao_produto_log: `${produto} removido!`, data_expirar_log: tempo_excluir, type_log: "Removido"
        })

        return;
    } catch (error) {
        console.log(error);
    }
}

const logProdutoEditado = async (produto_antigo, produto_novo, categoria, LogsSiteModel) => {
    try {
        const data = new Date()
        const tempo_excluir = data.setSeconds(data.getSeconds() + 40)

        const result = await LogsSiteModel.create({
            produto_editado: produto_novo,
            categoria_produto: categoria,
            descricao_produto_log: `"${produto_antigo}" editado para o novo nome: "${produto_novo}"`,
            data_expirar_log: tempo_excluir,
            type_log: "Editado"
        })

        return;
    } catch (error) {
        console.log(error);
    }
}

const verificarDataExpiracao_Log = async (LogsSiteModel) => {
    try {
        const verificarData = (timeDataBase, timeExpire) => {
            const date = new Date()
            const timeHorarioDataBase = new Date(timeDataBase)

            const diferenca_Milissegundos = date - timeHorarioDataBase
            const diferenca_Segundos = Math.floor(diferenca_Milissegundos / 1000);
            return diferenca_Segundos > timeExpire ? true : false
        }

        const logsFind = await LogsSiteModel.find();
        logsFind.map(async el => {
            if (!verificarData(el.data_expirar_log, 3600)) return

            await LogsSiteModel.deleteOne({
                _id: el._id
            })

            return;
        })
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    checarTokenUsuario,
    logProdutoAdicionado,
    logProdutoRemovido,
    logProdutoEditado,
    verificarDataExpiracao_Log
}