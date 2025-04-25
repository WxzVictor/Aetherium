// src/controllers/authController.mjs
export const login = (req, res) => {
    const { usuario, contraseña} = req.body;

    const usuarioValido = "dan";
    const contraseñaValida = "1234";

    if (usuario === usuarioValido && contraseña === contraseñaValida) {
        req.session.usuario = usuario;
        return res.status(200).json({ mensaje: "Inicio de sesion con exito"});
    }

    return res.status(401).json({ error: "Credenciales incorrectas"});
};

export const logout = (req, res) => {
    req.session.destroy(err => {
        if(err) 
            return res.status(500).json({ error: "Error al cerrar la sesión"});

        res.clearCookie("connect.sid");
        res.status(200).json({ mensaje: "Sesión cerrada"});
    });
};

export const verificarSesion = (req, res) => {
    if(req.session.usuario){
        res.status(200).json({ usuario: req.session.usuario});
    }else{
        res.status(400).json({ error: "No hay una sesión iniciada"});
    }
};