const campo_main = document.querySelector("main")
const btn_voltar_home = document.querySelector("#btn_voltar_home")

const carregarPaginaHtml = async (rota, scriptPagina) => {
    try {
        rota = rota.replace("#", "")
        const responsePagina = await axios.get(`http://localhost:3000/admin/${rota}`)
        if (responsePagina) {
            campo_main.innerHTML = responsePagina.data
            scriptPagina()
        }
    } catch (err) {
        console.log(err)
    }
}

const scriptHome = () => {
    const container_info = document.querySelectorAll(".container-info a")

    container_info.forEach(el => {
        el.addEventListener("click", evt => {
            evt.preventDefault()

            const rota = el.getAttribute("href")
            switch (rota) {
                case "#cadastro-produtos":
                    carregarPaginaHtml(rota, scriptCadastroProdutos)
                    scriptBtnVoltaar()
                    break;
                case "#todos-produtos":
                    carregarPaginaHtml(rota, scriptTodosProdutos)
                    scriptBtnVoltaar()
                    break;
                case '#editar-produtos':
                    carregarPaginaHtml(rota, scriptEditarProduto)
                    scriptBtnVoltaar()
                    break;
                case '#logs-painel':
                    carregarPaginaHtml(rota, scriptLogsProdutos)
                    scriptBtnVoltaar()
                    break;
            }
        })
    })
}

const scriptBtnVoltaar = () => {
    btn_voltar_home.style.display = "block"
    btn_voltar_home.addEventListener("click", evt => {
        evt.preventDefault()
        carregarPaginaHtml("#home", scriptHome)
        btn_voltar_home.style.display = "none"
    })
}

carregarPaginaHtml("#home", scriptHome)