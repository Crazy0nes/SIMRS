import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function DokterDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dokter/dashboard.php');
      if (response.data.status === 'success') {
        setData(response.data.data);
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err.response?.status === 403) navigate('/');
      else setError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handlePeriksa = async (antrean_id) => {
    try {
      const response = await api.post('/dokter/dashboard.php', { 
        action: 'periksa', 
        antrean_id 
      });
      if (response.data.status === 'success') {
        fetchDashboardData(); // Refresh list
        // Jika ada halaman EMR, navigate. Untuk saat ini tidak ada.
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      alert('Gagal merubah status: ' + err.message);
    }
  };

  const handleLogout = () => {
    api.get('/auth/logout.php').finally(() => navigate('/'));
  };

  if (loading) return <div className="dashboard-layout"><div className="main-content">Loading...</div></div>;

  return (
    <div className="dashboard-layout">
        <aside className="sidebar">
            <div className="sidebar-title">RS Sehat Bahagia<br/><span style={{ fontSize: "14px", fontWeight: "400", color: "#c8e6c9" }}>Portal Dokter</span></div>
            <ul className="sidebar-menu">
                <li><Link to="/dokter" className="active">Daftar Antrean</Link></li>
                <li><Link to="#">Riwayat EMR</Link></li>
                <li style={{ marginTop: "auto" }}><button onClick={handleLogout} style={{ background: "rgba(255,0,0,0.2)", color: "#ffdddd", width: "100%", textAlign: "left", padding: "0.75rem 1rem", border: "none", borderRadius: "var(--radius-md)", cursor: "pointer" }}>Logout Keluar</button></li>
            </ul>
        </aside>

        <main className="main-content">
            <div className="topbar">
                <h2>Dashboard Antrean Pasien</h2>
                <div style={{ fontWeight: "500" }}>{new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
            </div>

            <div className="card">
                <h3>Daftar Pasien Menunggu Hari Ini</h3>
                
                {data.length > 0 ? (
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
                    <thead>
                        <tr>
                            <th style={{ padding: "12px", borderBottom: "1px solid var(--border-color)", textAlign: "left", background: "var(--primary-bg)", color: "var(--primary-color)" }}>No Antrean</th>
                            <th style={{ padding: "12px", borderBottom: "1px solid var(--border-color)", textAlign: "left", background: "var(--primary-bg)", color: "var(--primary-color)" }}>ID Pasien</th>
                            <th style={{ padding: "12px", borderBottom: "1px solid var(--border-color)", textAlign: "left", background: "var(--primary-bg)", color: "var(--primary-color)" }}>Nama Pasien</th>
                            <th style={{ padding: "12px", borderBottom: "1px solid var(--border-color)", textAlign: "left", background: "var(--primary-bg)", color: "var(--primary-color)" }}>Status</th>
                            <th style={{ padding: "12px", borderBottom: "1px solid var(--border-color)", textAlign: "left", background: "var(--primary-bg)", color: "var(--primary-color)" }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => (
                        <tr key={row.antrean_id}>
                            <td style={{ padding: "12px", borderBottom: "1px solid var(--border-color)", textAlign: "left" }}><strong>{String(row.no_antrean).padStart(3, '0')}</strong></td>
                            <td style={{ padding: "12px", borderBottom: "1px solid var(--border-color)", textAlign: "left" }}>PSN-{String(row.patient_id).padStart(4, '0')}</td>
                            <td style={{ padding: "12px", borderBottom: "1px solid var(--border-color)", textAlign: "left" }}>{row.nama_lengkap}</td>
                            <td style={{ padding: "12px", borderBottom: "1px solid var(--border-color)", textAlign: "left" }}>
                                <span style={{ display:"inline-block", padding: "4px 10px", borderRadius: "99px", fontSize: "12px", fontWeight:"600",
                                    ...(row.status === 'menunggu' ? { background: "#fff3e0", color: "#e65100" } : { background: "#e8f5e9", color: "#1b5e20" })
                                }}>
                                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                                </span>
                            </td>
                            <td style={{ padding: "12px", borderBottom: "1px solid var(--border-color)", textAlign: "left" }}>
                                {row.status === 'menunggu' ? (
                                    <button onClick={() => handlePeriksa(row.antrean_id)} className="btn btn-primary" style={{ padding:"6px 12px", fontSize:"14px", border: "none" }}>Periksa Pasien</button>
                                ) : (
                                    <button className="btn btn-outline" style={{ padding:"6px 12px", fontSize:"14px" }}>Lanjut EMR</button>
                                )}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                ) : (
                <div className="alert alert-success mt-4">Semua antrean hari ini telah terlayani!</div>
                )}
            </div>
        </main>
    </div>
  );
}

export default DokterDashboard;
