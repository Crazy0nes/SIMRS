import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login.php', {
        username,
        password
      });

      if (response.data.status === 'success') {
        const { role } = response.data.user;
        navigate(`/${role}`);
      } else {
        setError(response.data.message || 'Login gagal!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan pada server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80') no-repeat center center/cover", minHeight: '100vh' }}>
      <div className="auth-wrapper" style={{ background: "rgba(46,125,50,0.3)", backdropFilter: "blur(5px)" }}>
        <div className="auth-card animate-fade-in glass">
          <div className="auth-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </div>
          <h1 className="auth-title">RS Tentara P. Siantar</h1>
          <p className="auth-subtitle">Portal Informasi Pelayanan & Manajemen Terpadu</p>
          
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username" 
                className="form-control" 
                required 
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                className="form-control" 
                required 
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button type="submit" className="btn btn-primary btn-block mb-4" disabled={loading}>
              {loading ? 'Memproses...' : 'Masuk / Login'}
            </button>
          </form>
          
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "20px" }}>
            Belum punya akun Pasien? <br />
            <Link to="/register" style={{ color: "var(--primary-color)", fontWeight: "600", textDecoration: "none" }}>
              Daftar sebagai Pasien Baru
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
