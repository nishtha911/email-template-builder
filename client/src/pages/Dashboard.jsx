import { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button,
  CircularProgress, Skeleton, Chip
} from '@mui/material';
import {
  LibraryBooks as TemplatesIcon,
  AddBox as CreateIcon,
  TrendingUp as TrendingIcon,
  Schedule as RecentIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchTemplates } from '../api';

const glassCard = {
  background: 'rgba(255,255,255,0.6)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.8)',
  borderRadius: '18px',
  boxShadow: '0 4px 24px rgba(150,57,145,0.08)',
  transition: 'transform 0.2s, box-shadow 0.2s',
};

const StatCard = ({ icon, label, value, color, loading }) => (
  <Card elevation={0} sx={{ ...glassCard, '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 32px rgba(150,57,145,0.14)' } }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{
          width: 44, height: 44, borderRadius: '12px',
          background: `linear-gradient(135deg, ${color}22, ${color}11)`,
          border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: color,
        }}>
          {icon}
        </Box>
        <Chip label="All time" size="small" sx={{ fontSize: '0.7rem', height: 22, bgcolor: 'rgba(0,0,0,0.04)', color: '#999' }} />
      </Box>
      {loading ? (
        <Skeleton width={40} height={36} />
      ) : (
        <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#1a1a2e', lineHeight: 1 }}>{value}</Typography>
      )}
      <Typography sx={{ fontSize: '0.82rem', color: '#888', mt: 0.5, fontWeight: 500 }}>{label}</Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates()
      .then(({ data }) => setTemplates(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const recentTemplates = templates.slice(0, 3);
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Box sx={{
      minHeight: '100vh', p: { xs: 3, md: 4 },
      background: 'linear-gradient(145deg, #faf5ff 0%, #fdf4ff 50%, #f3e8ff 100%)',
    }}>
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ fontSize: '0.85rem', color: '#963991', fontWeight: 600, letterSpacing: '0.5px', mb: 0.5 }}>
          {greeting()},
        </Typography>
        <Typography sx={{ fontSize: '1.9rem', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
          {user?.name || 'Designer'} 
        </Typography>
        <Typography sx={{ color: '#999', mt: 0.5, fontSize: '0.9rem' }}>
          Here's what's happening with your templates today.
        </Typography>
      </Box>

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<TemplatesIcon fontSize="small" />}
            label="Total Templates"
            value={templates.length}
            color="#963991"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<TrendingIcon fontSize="small" />}
            label="This Month"
            value={templates.filter(t => {
              const d = new Date(t.created_at);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length}
            color="#7c3aed"
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<RecentIcon fontSize="small" />}
            label="Last 7 Days"
            value={templates.filter(t => {
              const d = new Date(t.created_at);
              return (Date.now() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
            }).length}
            color="#0891b2"
            loading={loading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={7}>
          <Card elevation={0} sx={glassCard}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#1a1a2e' }}>Recent Templates</Typography>
                <Button
                  endIcon={<ArrowIcon fontSize="small" />}
                  size="small"
                  onClick={() => navigate('/templates')}
                  sx={{ color: '#963991', fontWeight: 700, fontSize: '0.78rem', textTransform: 'none' }}
                >
                  View all
                </Button>
              </Box>

              {loading && (
                <Box>
                  {[1, 2, 3].map((i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <Skeleton variant="rounded" width={36} height={36} sx={{ mr: 2, borderRadius: '10px' }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Skeleton width="60%" height={16} />
                        <Skeleton width="40%" height={13} sx={{ mt: 0.5 }} />
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

              {!loading && recentTemplates.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4, opacity: 0.4 }}>
                  <TemplatesIcon sx={{ fontSize: 36, color: '#963991', mb: 1 }} />
                  <Typography variant="body2" fontWeight={600}>No templates yet</Typography>
                  <Typography variant="caption" color="textSecondary">Create your first template to see it here.</Typography>
                </Box>
              )}

              {!loading && recentTemplates.map((t, i) => (
                <Box
                  key={t.id}
                  sx={{
                    display: 'flex', alignItems: 'center', py: 1.8,
                    borderBottom: i < recentTemplates.length - 1 ? '1px solid rgba(150,57,145,0.07)' : 'none',
                    cursor: 'pointer',
                    borderRadius: '10px',
                    px: 1,
                    '&:hover': { background: 'rgba(150,57,145,0.04)' },
                    transition: 'background 0.15s',
                  }}
                  onClick={() => navigate(`/editor?id=${t.id}`)}
                >
                  <Box sx={{
                    width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
                    background: `hsl(${(i * 80 + 280) % 360}, 60%, 94%)`,
                    border: `1px solid hsl(${(i * 80 + 280) % 360}, 60%, 85%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mr: 2,
                  }}>
                    <TemplatesIcon sx={{ fontSize: 16, color: `hsl(${(i * 80 + 280) % 360}, 55%, 45%)` }} />
                  </Box>
                  <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#1a1a2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {t.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: '#aaa' }}>
                      {new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Typography>
                  </Box>
                  <ArrowIcon sx={{ fontSize: 16, color: '#ccc' }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card elevation={0} sx={{ ...glassCard, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#1a1a2e', mb: 2.5 }}>Quick Actions</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button
                  fullWidth
                  startIcon={<CreateIcon />}
                  onClick={() => navigate('/editor')}
                  sx={{
                    justifyContent: 'flex-start', py: 1.8, px: 2.5, borderRadius: '12px',
                    background: 'linear-gradient(135deg, #963991, #b84db3)',
                    color: 'white', fontWeight: 700, fontSize: '0.88rem', textTransform: 'none',
                    boxShadow: '0 4px 16px rgba(150,57,145,0.3)',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(150,57,145,0.4)' },
                    transition: 'all 0.2s',
                  }}
                >
                  Create New Template
                </Button>
                <Button
                  fullWidth
                  startIcon={<TemplatesIcon />}
                  onClick={() => navigate('/templates')}
                  sx={{
                    justifyContent: 'flex-start', py: 1.8, px: 2.5, borderRadius: '12px',
                    background: 'rgba(150,57,145,0.07)',
                    border: '1px solid rgba(150,57,145,0.15)',
                    color: '#963991', fontWeight: 700, fontSize: '0.88rem', textTransform: 'none',
                    '&:hover': { background: 'rgba(150,57,145,0.12)' },
                    transition: 'all 0.2s',
                  }}
                >
                  Browse Templates
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;