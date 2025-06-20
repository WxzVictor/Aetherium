import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import '../../styles/login-register.css';
import '../../styles/cloud.css';
import logo from '../../assets/images/logo2-removebg-preview.png';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
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
      await updateProfile(user, { displayName: firstName });

      // Registro en tu base de datos
      await fetch("http://localhost:5120/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: user.uid,
          firstName: firstName,
          lastName: lastName,
          email: user.email,
          age: parseInt(age, 10),
          signUpDate: new Date().toISOString()
        })
      });

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
    <div className="login-page">
      <div id="clouds">
        <div className="cloud x1"></div>
        <div className="cloud x2"></div>
        <div className="cloud x3"></div>
        <div className="cloud x4"></div>
        <div className="cloud x5"></div>
        <div className="cloud x6"></div>
        <div className="cloud x7"></div>
      </div>

      <div className="background">
        <div className="login-container">
          <div className="logo">
            <img src={logo} alt="Aetherium Logo" />
          </div>
          <h2>REGISTER</h2>
          <form onSubmit={handleRegister}>
            <div className="input-group">
              <input
                type="text"
                placeholder=" "
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <label>First Name</label>
              <span className="icon">👤</span>
            </div>
            <div className="input-group">
              <input
                type="text"
                placeholder=" "
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <label>Last Name</label>
              <span className="icon">👤</span>
            </div>
            <div className="input-group">
              <input
                type="number"
                placeholder=" "
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min={0}
                required
              />
              <label>Age</label>
              <span className="icon">🎂</span>
            </div>
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
            <button type="submit" className='bt_subreg'>Create account</button>
          </form>
          <a href="/login" className="forgot">Already have an account? Sign in</a>
        </div>
      </div>
    </div>
  );
};

export default Register;