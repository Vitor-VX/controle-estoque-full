const scriptTodosProdutos = () => {

    const criarListaProdutosHTML = (produto, descricao, preco) => {
        const product_list = document.querySelector(".product-list")

        const li_produto_list = document.createElement("li")
        const h4_produto_list = document.createElement("h4")
        const p_produto_list = document.createElement("p")
        const span_produto_list = document.createElement("span")

        // Setar Textos
        h4_produto_list.textContent = produto
        p_produto_list.textContent = descricao
        span_produto_list.textContent = preco

        li_produto_list.appendChild(h4_produto_list)
        li_produto_list.appendChild(p_produto_list)
        li_produto_list.appendChild(span_produto_list)

        // Setar li no "PAI"
        product_list.appendChild(li_produto_list)
    }

    axios.get("http://localhost:3000/admin/produtos")
        .then(res => {
            const produtos = res.data.produto

            produtos.map(el => {
                criarListaProdutosHTML(el.nome, el.descricao, el.valor)
            })
        }).catch(err => {
            console.log(err);
        });
}