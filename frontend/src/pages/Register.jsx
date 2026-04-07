import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nama_lengkap: '',
    nik: '',
    no_bpjs: ''
  });
  const [files, setFiles] = useState({
    dokumen_ktp: null,
    dokumen_bpjs: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (files.dokumen_ktp) data.append('dokumen_ktp', files.dokumen_ktp);
      if (files.dokumen_bpjs) data.append('dokumen_bpjs', files.dokumen_bpjs);

      const response = await api.post('/auth/register.php', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.status === 'success') {
        setSuccess(response.data.message);
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError(response.data.message || 'Pendaftaran gagal!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan pada server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80') no-repeat center center/cover", minHeight: '100vh' }}>
      <div className="auth-wrapper" style={{ background: "rgba(46,125,50,0.3)", backdropFilter: "blur(5px)", padding: "2rem 0" }}>
        <div className="auth-card animate-fade-in glass" style={{ maxWidth: '600px', padding: '2rem' }}>
          <h1 className="auth-title">Daftar Pasien Baru</h1>
          <p className="auth-subtitle">Daftarkan diri Anda untuk pelayanan online terpadu</p>
          
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success} <br/><Link to="/">Kembali ke halaman login</Link></div>}

          {!success && (
            <form onSubmit={handleRegister}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="username">Username Aplikasi <span style={{color:'red'}}>*</span></label>
                  <input type="text" id="username" name="username" className="form-control" required onChange={handleInputChange} />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="password">Password <span style={{color:'red'}}>*</span></label>
                  <input type="password" id="password" name="password" className="form-control" required onChange={handleInputChange} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="nama_lengkap">Nama Lengkap (Sesuai KTP) <span style={{color:'red'}}>*</span></label>
                <input type="text" id="nama_lengkap" name="nama_lengkap" className="form-control" required onChange={handleInputChange} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="nik">Nomor NIK <span style={{color:'red'}}>*</span></label>
                  <input type="number" id="nik" name="nik" className="form-control" required onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="no_bpjs">Nomor BPJS (Opsional)</label>
                  <input type="number" id="no_bpjs" name="no_bpjs" className="form-control" onChange={handleInputChange} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="dokumen_ktp">Upload KTP <span style={{color:'red'}}>*</span></label>
                  <input type="file" id="dokumen_ktp" name="dokumen_ktp" className="form-control" required accept="image/*,application/pdf" onChange={handleFileChange} />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="dokumen_bpjs">Upload BPJS</label>
                  <input type="file" id="dokumen_bpjs" name="dokumen_bpjs" className="form-control" accept="image/*,application/pdf" onChange={handleFileChange} />
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary btn-block my-4" disabled={loading}>
                {loading ? 'Memproses...' : 'Daftar Sekarang'}
              </button>
            </form>
          )}
          
          {!success && (
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
              Sudah punya akun? <Link to="/" style={{ color: "var(--primary-color)", fontWeight: "600", textDecoration: "none" }}>Login di sini</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
