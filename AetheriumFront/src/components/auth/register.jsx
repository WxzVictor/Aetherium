import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import '../../styles/login&register.css';
import logo from '../../assets/images/logo2-removebg-preview.png';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const validarPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validarPassword(password)) {
      alert("❌ La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      alert("✅ Cuenta creada correctamente. Revisa tu correo para verificar la cuenta.");

      await updateProfile(user, { displayName: username });
      navigate('/login');
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("❌ El correo ya está registrado.");
      } else {
        alert("❌ Error al registrar: " + error.message);
      }
    }
  };

  return (
    <div className="background">
      <div className="login-container">
        <div className="logo">
          <img src={logo} alt="Aetherium Logo" />
        </div>
        <h2>REGISTRO</h2>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <input
              type="text"
              placeholder=" "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label>Nombre de usuario</label>
            <span className="icon">👤</span>
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Correo</label>
            <span className="icon">📧</span>
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Contraseña</label>
            <span className="icon">🔒</span>
          </div>
          <button type="submit">Registrarse</button>
        </form>
        <a href="/login" className="forgot">¿Ya tienes cuenta? Inicia sesión</a>
      </div>
    </div>
  );
};

export default Register;
