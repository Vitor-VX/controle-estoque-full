const criarLogHTML = (nome, descricao, type) => {
    const div_log_produto = document.querySelector(".conteiner-logs")

    const div_log_conteiner = document.createElement("div")

    const paragrafo_log_tipoProduto = document.createElement("p")
    const paragrafo_log_descricaoProduto = document.createElement("p")

    switch (type) {
        case "Adicionado":
            div_log_conteiner.classList.add("log-added")
            paragrafo_log_tipoProduto.textContent = `Produto adicionado: ${nome.produto_adicionado}`
            paragrafo_log_descricaoProduto.textContent = `Descrição: ${descricao.descricao_produto_log}`
            break;
        case "Editado":
            div_log_conteiner.classList.add("log-edited")
            paragrafo_log_tipoProduto.textContent = `Produto editado: ${nome.produto_editado}`
            paragrafo_log_descricaoProduto.textContent = `Descrição: ${descricao.descricao_produto_log}`
            break;
        case "Removido":
            div_log_conteiner.classList.add("log-removed")
            paragrafo_log_tipoProduto.textContent = `Produto removido: ${nome.produto_removido}`
            paragrafo_log_descricaoProduto.textContent = `Descrição: ${descricao.descricao_produto_log}`
            break;
    }

    div_log_conteiner.appendChild(paragrafo_log_tipoProduto)
    div_log_conteiner.appendChild(paragrafo_log_descricaoProduto)

    div_log_produto.appendChild(div_log_conteiner)
}

const scriptLogsProdutos = async () => {
    try {
        const responseLogs = await axios.get("http://localhost:3000/admin/logs-produtos")
        const data = responseLogs.data.logsProdutos

        data.map(element => {
            criarLogHTML(element, element, element.type_log)
        })
    } catch (err) {

    }
}