const user_admin = document.querySelector("#user_admin")
const password_admin = document.querySelector("#password_admin")
const btn_entrar = document.querySelector(".btn-entrar")

btn_entrar.addEventListener("click", async (evt) => {
    evt.preventDefault()

    const [username, password] = [user_admin.value, password_admin.value]
    try {
        const responseLogin = await axios.post("http://localhost:3000/admin/login", {
            username, password
        })

        const data = responseLogin.data

        if (responseLogin) {
            Swal.fire(data.message, '', 'success')
            setTimeout(() => window.location.href = data.url, 2500)
        }
    } catch (err) {
        Swal.fire({
            icon: 'error', title: 'Oops...', text: err.response.data.message
        })
    }
})