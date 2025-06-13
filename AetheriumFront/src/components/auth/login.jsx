import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../services/firebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import '../../styles/login-register.css';
import '../../styles/cloud.css';
import logo from '../../assets/images/logo2-removebg-preview.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        alert('Tu correo no ha sido verificado. Por favor revisa tu bandeja de entrada.');
        return;
      }

      const response = await fetch(`http://localhost:5120/api/user/byfirebase/${user.uid}`);
      if (response.ok) {
        const userData = await response.json();
        console.log("userData recibido del backend:", userData);
        const userId = userData.userId;
        localStorage.setItem('userId', userId);
      }else {
        alert("No se pudo obtener el usuario de la base de datos.");
        return;
      }

      setUserLoggedIn(true);

    } catch (error) {
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        alert("Correo o contraseña incorrectos.");
      } else {
        alert("Error al iniciar sesión: " + error.message);
      }
    }
  };

  useEffect(() => {
    if (userLoggedIn) {
      const from = location.state?.from || '/flights';
      const restoreState = {
        vuelos: location.state?.vuelos,
        pasajeros: location.state?.pasajeros
      };
      navigate(from, { state: restoreState });
    }
  }, [userLoggedIn]);

  const handleForgotPassword = async () => {
    const emailPrompt = prompt("Introduce tu correo electrónico para recuperar la contraseña:");
    if (emailPrompt) {
      try {
        await sendPasswordResetEmail(auth, emailPrompt.trim());
        alert("Si el correo está registrado, recibirás un mensaje para restablecer tu contraseña.");
      } catch (error) {
        alert("Error al enviar el correo de recuperación: " + error.message);
      }
    }
  };

  return (
    <div className="login-page">
      <div id="clouds">
        {[...Array(7)].map((_, i) => (
          <div key={i} className={`cloud x${i + 1}`}></div>
        ))}
      </div>

      <div className="background">
        <div className="login-container">
          <div className="logo">
            <img src={logo} alt="Aetherium Logo" />
          </div>
          <h2>LOG IN</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Email</label>
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
              <label>Password</label>
              <span className="icon">🔒</span>
            </div>
            <div className="options">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember"> Remember me </label>
            </div>
            <button type="submit" className="bt_subreg">Login</button>
          </form>
          <a href="#" onClick={handleForgotPassword} className="forgot">Forgot Password?</a>
          <a href="/register" className="forgot">Aren't you register yet?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;