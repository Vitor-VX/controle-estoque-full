const scriptEditarProduto = () => {

    // Editar produtos
    const scriptClickProduto = () => {
        const icons = document.querySelectorAll(".icons span i")
        icons.forEach(el => {
            el.addEventListener("click", async evt => {
                evt.preventDefault()

                const verificarBtnClicado = el.classList.contains("bi-pencil") ? true : false

                const li_t = el.parentElement.parentElement.parentElement
                const edit_produto = Array.from(li_t.children)
                let valor_categoria = ""

                if (verificarBtnClicado) {
                    await Swal.fire({
                        title: `Edite o produto "${edit_produto[0].textContent}"`,
                        html: `<input id="swal-input1" placeholder="Novo nome" class="swal2-input">` + `<input id="swal-input2" placeholder="Nova descrição" class="swal2-input">` + `<input id="swal-input3" placeholder="Novo valor" type="number" class="swal2-input">`,

                        input: 'select',
                        inputOptions: {
                            'Categoria': {
                                Eletrônicos: 'Eletrônicos',
                                Roupas: 'Roupas',
                                Alimentos: 'Alimentos',
                                Móveis: 'Móveis',
                                Brinquedos: 'Brinquedos'
                            }
                        },

                        inputPlaceholder: 'Selecione a categoria',
                        inputValidator: (value) => {
                            valor_categoria = value
                        },

                        focusConfirm: false,

                        preConfirm: async () => {
                            const nome = document.querySelector("#swal-input1").value
                            const descricao = document.querySelector("#swal-input2").value
                            const valor = document.querySelector("#swal-input3").value

                            try {
                                const responseAtualizarProduto = await axios.patch(`http://localhost:3000/admin/atualizar-produtos?produto_atualizar=${edit_produto[0].textContent}&nome_produto_atualizado=${nome}&descricao_produto=${descricao}&valor_produto=${valor}&categoria_produto=${valor_categoria}`)

                                Swal.fire(responseAtualizarProduto.data.message, '', 'success')
                            } catch (error) {
                                Swal.fire({ icon: 'error', title: 'Oops...', text: error.response.data.message })
                            }
                        }
                    })
                } else {
                    const caixaDelete = await Swal.fire({
                        title: 'Confirmação de exclusão',
                        text: 'Tem certeza de que deseja continuar? Esta ação não pode ser desfeita.',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        cancelButtonText: 'Cancelar',
                        confirmButtonText: 'Sim, excluir'
                    })

                    if (caixaDelete.isConfirmed) {
                        const responseDeletarProduto = await axios.delete(`http://localhost:3000/admin/deletar-produtos?produto_deletar=${edit_produto[0].textContent}`)

                        Swal.fire('Deletado!', responseDeletarProduto.data.message, 'success')
                    }
                }
            })
        })
    }

    // Criar os Produtos dinamico
    const criarProdutosHTML = async (Produto) => {
        const ul_campo_Produto = document.querySelector(".campo-editar-produtos ul")

        const li_Produto = document.createElement("li")

        // Titulo Produto
        const span_Titulo_Produto = document.createElement("span")
        span_Titulo_Produto.textContent = Produto

        // icons
        const div_icons_Produto = document.createElement("div")
        div_icons_Produto.classList.add("icons")

        const span_Editar_Produto = document.createElement("span")
        span_Editar_Produto.innerHTML = `<i class="bi bi-pencil"></i>`

        const span_Apagar_Produto = document.createElement("span")
        span_Apagar_Produto.innerHTML = `<i class="bi bi-trash3-fill"></i>`

        div_icons_Produto.appendChild(span_Editar_Produto)
        div_icons_Produto.appendChild(span_Apagar_Produto)

        li_Produto.appendChild(span_Titulo_Produto)
        li_Produto.appendChild(div_icons_Produto)

        ul_campo_Produto.appendChild(li_Produto)
    }

    // Get Produtos
    axios.get("http://localhost:3000/admin/produtos")
        .then(result => {
            const res = result.data.produto
            res.map(el => {
                criarProdutosHTML(el.nome)
            })
            scriptClickProduto()
        })
        .catch(err => {
            console.log(err);
        })
}