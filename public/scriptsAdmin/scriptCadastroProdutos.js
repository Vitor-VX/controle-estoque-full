const scriptCadastroProdutos = () => {
    const nome_produto_id = document.querySelector("#nome_produto_id")
    const descricao_produto_id = document.querySelector("#descricao_produto_id")
    const preco_produto_id = document.querySelector("#preco_produto_id")
    const selected = document.querySelector(".selected")
    const btn_aplicar_produtos = document.querySelector("#btn_aplicar_produtos")

    // Script do menu
    scriptDropdown()

    btn_aplicar_produtos.addEventListener("click", async (evt) => {
        evt.preventDefault()

        try {
            const responseCadastroProduto = await axios.post("http://localhost:3000/admin/cadastrar-produtos", {
                nome_produto: nome_produto_id.value,
                descricao_produto: descricao_produto_id.value,
                valor_produto: preco_produto_id.value,
                categoria_produto: selected.textContent
            })

            const message = responseCadastroProduto.data.message

            Swal.fire(
                message,
                '',
                'success'
            )
        } catch (err) {
            const msgErro = err.response.data.message

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: msgErro
            })
        }
    })
}

const scriptDropdown = () => {
    const dropdown = document.querySelectorAll(".dropdown");
    dropdown.forEach(el => {
        const select = el.querySelector(".select");
        const caret = el.querySelector(".caret");
        const menu = el.querySelector(".menu");
        const options = Array.from(el.querySelectorAll(".menu li"));
        const selected = el.querySelector(".selected");

        select.addEventListener("click", evt => {
            evt.preventDefault();

            select.classList.toggle("select-clicked");
            caret.classList.toggle("caret-rotate");
            menu.classList.toggle("menu-open");
        });

        options.forEach(opt => {
            opt.addEventListener("click", evt => {
                evt.preventDefault();

                selected.innerHTML = opt.innerHTML;
                select.classList.remove("select-clicked");
                caret.classList.remove("caret-rotate");
                menu.classList.remove("menu-open");

                options.forEach(option => {
                    option.classList.remove("active");
                });

                opt.classList.add("active");
            });
        });
    });
}