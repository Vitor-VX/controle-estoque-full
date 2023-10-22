const express = require("express")
const router = express.Router();
const path = require("path")
const jwt = require("jsonwebtoken")
const cookieParser = require('cookie-parser');
const { AdminstradorModel, ProdutosModel, LogsSiteModel } = require("../src/database/model")
const { checarTokenUsuario, logProdutoAdicionado, logProdutoRemovido, logProdutoEditado, verificarDataExpiracao_Log } = require("../src/utils/utilsAdmin");

router.use(express.json())
router.use(cookieParser())

router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/paginaLoginAdmin.html"))
    return;
})

router.post("/login", async (req, res) => {
    const { username, password } = req.body

    try {
        const verificarUsuarioAdmin = await AdminstradorModel.findOne({ username, password })
        if (!verificarUsuarioAdmin) {
            res.status(401).json({ message: "Usúario ou senha incorretos." })
            return;
        }

        const Usuario = verificarUsuarioAdmin.username
        const token = jwt.sign({
            username: Usuario
        },
            process.env.SECRET
        )

        if (token) {
            verificarUsuarioAdmin.token = token
            await verificarUsuarioAdmin.save();
        }

        res.cookie("username_auth", Usuario, { maxAge: 500000, httpOnly: true })
        res.status(200).json({ message: "Login efetuado!", url: "/admin/dashboard" })
        return;
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Erro interno no servidor." })
        return;
    }
})

router.post("/cadastrar-produtos", checarTokenUsuario, async (req, res) => {
    const {
        nome_produto,
        descricao_produto,
        valor_produto,
        categoria_produto
    } = req.body

    if (!nome_produto || !descricao_produto || !valor_produto || !categoria_produto) {
        res.status(422).json({ message: "Todos os campos devem ser preechidos!" })
        return;
    }

    try {
        const verificarProdutoExiste = await ProdutosModel.findOne({ nome_produto })

        if (verificarProdutoExiste !== null) {
            res.status(501).json({ message: "O produto já existe!" })
            return;
        }

        await ProdutosModel.create({
            nome_produto,
            descricao_produto,
            valor_produto,
            categoria_produto
        })

        logProdutoAdicionado(nome_produto, categoria_produto, LogsSiteModel)
        res.status(200).json({ message: "Produto cadastrado!" })
        return;
    } catch (err) {
        res.status(500).json({ message: "Erro interno no servidor." })
    }
})

router.get("/produtos", checarTokenUsuario, async (req, res) => {
    try {
        const produtos = async () => {
            const produtos = await ProdutosModel.find();
            const response = produtos.map(el => {
                return {
                    nome: el.nome_produto,
                    descricao: el.descricao_produto,
                    valor: el.valor_produto,
                    categoria: el.categoria_produto
                }
            })

            return response
        }

        const produto = await produtos()

        res.status(200).json({ produto });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Erro interno no servidor." });
    }
});

router.patch("/atualizar-produtos", checarTokenUsuario, async (req, res) => {
    try {
        const { produto_atualizar, nome_produto_atualizado, descricao_produto, valor_produto, categoria_produto } = req.query

        const verificarProdutoExiste = await ProdutosModel.findOne({ nome_produto: produto_atualizar })
        if (!verificarProdutoExiste) {
            res.status(422).json({ message: "O produto não existe!" })
            return;
        }

        if (nome_produto_atualizado) {
            verificarProdutoExiste.nome_produto = nome_produto_atualizado;
        }
        if (descricao_produto) {
            verificarProdutoExiste.descricao_produto = descricao_produto;
        }
        if (valor_produto) {
            verificarProdutoExiste.valor_produto = valor_produto;
        }
        if (categoria_produto) {
            verificarProdutoExiste.categoria_produto = categoria_produto;
        }

        await verificarProdutoExiste.save();

        logProdutoEditado(produto_atualizar, nome_produto_atualizado, categoria_produto, LogsSiteModel)
        res.status(201).json({ message: "Produto atualizado com sucesso!" })
    } catch (error) {
        res.status(500).json({ message: "Erro interno no servidor." })
    }
})

router.delete("/deletar-produtos", checarTokenUsuario, async (req, res) => {
    try {
        const { produto_deletar } = req.query

        const verificarProdutoExiste = await ProdutosModel.findOne({ nome_produto: produto_deletar })
        if (!verificarProdutoExiste) {
            res.status(422).json({ message: "Erro o produto não existe!" })
            return;
        }

        await verificarProdutoExiste.deleteOne({
            nome_produto: produto_deletar
        })

        logProdutoRemovido(produto_deletar, LogsSiteModel)
        res.status(200).json({ message: "Produto deletado com sucesso." })
    } catch (error) {
        res.status(500).json({ message: "Erro interno no servidor." })
    }
})

router.get("/logs-produtos", checarTokenUsuario, async (req, res) => {
    try {
        const logsProduto = async () => {
            const logs = await LogsSiteModel.find();
            const response = logs.map(el => {
                return {
                    produto_adicionado: el.produto_adicionado,
                    produto_removido: el.produto_removido,
                    produto_editado: el.produto_editado,
                    categoria_produto: el.categoria_produto,
                    descricao_produto_log: el.descricao_produto_log,
                    type_log: el.type_log
                }
            })

            return response
        }

        const logsProdutos = await logsProduto()

        res.status(200).json({ logsProdutos })
    } catch (error) {
        res.status(500).json({ message: "Erro interno no servidor." })
    }
})

// Get's paginas HTML

router.get("/dashboard", checarTokenUsuario, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/painelAdmin.html"))
    verificarDataExpiracao_Log(LogsSiteModel)
    return;
})

router.get("/home", checarTokenUsuario, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/home.html"))
    return;
})

router.get("/cadastro-produtos", checarTokenUsuario, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/cadastroProdutos.html"))
    return;
})

router.get("/todos-produtos", checarTokenUsuario, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/todosProdutos.html"))
    return;
})

router.get("/editar-produtos", checarTokenUsuario, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/editarProdutos.html"))
    return;
})

router.get("/logs-painel", checarTokenUsuario, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/logsProdutos.html"))
    return;
})

module.exports = router