document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("formLogin");
    const usuario = document.getElementById("usuario");
    const contrasena = document.getElementById("clave");
    const rolSelec = document.getElementById("rol");
    const btnIngresar = document.getElementById("btnIngresar");
    const mensaje = document.getElementById("mensaje");
    const errUsuario = document.getElementById("errUsuario");
    const errCons = document.getElementById("errClave");

    if (!loginForm) return;

    function errores() {
        errUsuario.hidden = true;
        errCons.hidden = true;
        mensaje.hidden = true;
        mensaje.textContent = "";
    }

    function mostrarAlerta(text) {
        mensaje.textContent = text;
        mensaje.hidden = false;
    }

    usuario.addEventListener("input", function() {
        if (usuario.value.trim()) {
            errUsuario.hidden = true;
        }
    });

    contrasena.addEventListener("input", function() {
        if (contrasena.value.trim()) {
            errCons.hidden = true;
        }
    });

    formLogin.addEventListener("submit", function(event) {
        event.preventDefault();
        errores();

        const user = usuario.value.trim();
        const contra = contrasena.value;
        const rol = rolSelec.value;

        let valido = true;

        if (!user) {
            errUsuario.hidden = false;
            valido = false;
        }

        if (!contra) {
            errCons.hidden = false;
            valido = false;
        }

        if (!valido) {
            return;
        }

        btnIngresar.disabled = true;
        btnIngresar.textContent = "Ingresando...";

        fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ usuario: user, contrasena: contra, rol })
        })
        .then(async function(response) {
            const data = await response.json().catch(function() {
                return {};
            });

            if (!response.ok) {
                throw new Error(data.mensaje || data.message || "El usuario, contraseña o rol son incorrectos.");
            }

            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            const destino = data.redirectUrl || data.redictUrl;
            if (destino) {
                window.location.href = destino;
                return;
            }

            const rutasPorRol = {
                Admin: "/admin/AdminPrincipal.html",
                Medico: "/medico/MedicoPrincipal.html",
                Paciente: "/paciente/PacientePrincipal.html"
            };

            window.location.href = rutasPorRol[rol] || "/admin/AdminPrincipal.html";
        })
        .catch(function(error) {
            mostrarAlerta(error.message || "No se pudo iniciar sesión.");
        })
        .finally(function() {
            btnIngresar.disabled = false;
            btnIngresar.textContent = "Ingresar";
        });
    });
});