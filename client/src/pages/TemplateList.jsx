import { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, MenuItem, Select, FormControl,
  InputLabel, Grid, Card, CardContent, Fade, CircularProgress,
  IconButton, Tooltip, Button, Skeleton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { useNavigate } from 'react-router-dom';
import { fetchTemplates, deleteTemplate } from '../api';

const glassCard = {
  background: 'rgba(255,255,255,0.6)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.8)',
  borderRadius: '18px',
  boxShadow: '0 4px 24px rgba(150,57,145,0.08)',
  transition: 'transform 0.2s, box-shadow 0.2s',
};

const COLORS = [
  { bg: 'rgba(150,57,145,0.08)', border: 'rgba(150,57,145,0.2)', icon: '#963991' },
  { bg: 'rgba(124,58,237,0.08)', border: 'rgba(124,58,237,0.2)', icon: '#7c3aed' },
  { bg: 'rgba(8,145,178,0.08)', border: 'rgba(8,145,178,0.2)', icon: '#0891b2' },
  { bg: 'rgba(5,150,105,0.08)', border: 'rgba(5,150,105,0.2)', icon: '#059669' },
];

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates()
      .then(({ data }) => setTemplates(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load templates.'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this template?')) return;
    try {
      await deleteTemplate(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert('Failed to delete template.');
    }
  };

  const filteredTemplates = templates
    .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.created_at) - new Date(a.created_at);
      if (sort === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <Box sx={{
      minHeight: '100vh', p: { xs: 3, md: 4 },
      background: 'linear-gradient(145deg, #faf5ff 0%, #fdf4ff 50%, #f3e8ff 100%)',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography sx={{ fontSize: '0.82rem', color: '#963991', fontWeight: 600, letterSpacing: '0.5px', mb: 0.5 }}>
            YOUR WORKSPACE
          </Typography>
          <Typography sx={{ fontSize: '1.9rem', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.5px' }}>
            My Templates
          </Typography>
          <Typography sx={{ color: '#999', mt: 0.5, fontSize: '0.88rem' }}>
            {loading ? '' : `${templates.length} template${templates.length !== 1 ? 's' : ''} total`}
          </Typography>
        </Box>
        <Button
          startIcon={<AddIcon />}
          onClick={() => navigate('/editor')}
          sx={{
            background: 'linear-gradient(135deg, #963991, #b84db3)',
            color: 'white', fontWeight: 700, fontSize: '0.88rem',
            borderRadius: '12px', px: 2.5, py: 1.2, textTransform: 'none',
            boxShadow: '0 4px 16px rgba(150,57,145,0.3)',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(150,57,145,0.4)' },
            transition: 'all 0.2s',
          }}
        >
          New Template
        </Button>
      </Box>

      <Box sx={{
        display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap',
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.8)',
        borderRadius: '16px',
        p: 2,
        boxShadow: '0 2px 12px rgba(150,57,145,0.06)',
      }}>
        <TextField
          placeholder="Search templates..."
          size="small"
          sx={{
            flexGrow: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.7)',
              '& fieldset': { borderColor: 'rgba(150,57,145,0.18)' },
              '&:hover fieldset': { borderColor: 'rgba(150,57,145,0.35)' },
              '&.Mui-focused fieldset': { borderColor: '#963991' },
            },
          }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: '#963991', fontSize: 20 }} /> }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sort} label="Sort By"
            onChange={(e) => setSort(e.target.value)}
            sx={{
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.7)',
              '& fieldset': { borderColor: 'rgba(150,57,145,0.18)' },
            }}
          >
            <MenuItem value="newest">Recent First</MenuItem>
            <MenuItem value="name">A–Z Name</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading && (
        <Grid container spacing={2.5}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} sm={6} lg={4} key={i}>
              <Box sx={{ ...glassCard, p: 3 }}>
                <Skeleton variant="rounded" width={40} height={40} sx={{ borderRadius: '12px', mb: 2 }} />
                <Skeleton width="70%" height={20} />
                <Skeleton width="45%" height={16} sx={{ mt: 1 }} />
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && error && (
        <Box sx={{ textAlign: 'center', mt: 10 }}>
          <Typography sx={{ color: '#dc2626', fontWeight: 600 }}>{error}</Typography>
        </Box>
      )}

      {!loading && !error && filteredTemplates.length === 0 && (
        <Box sx={{
          textAlign: 'center', mt: 8, py: 6,
          background: 'rgba(255,255,255,0.5)',
          backdropFilter: 'blur(12px)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.8)',
        }}>
          <LibraryBooksIcon sx={{ fontSize: 48, color: '#963991', opacity: 0.3, mb: 2 }} />
          <Typography sx={{ fontWeight: 700, color: '#444', mb: 0.5 }}>
            {search ? 'No templates match your search' : 'No templates yet'}
          </Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#aaa', mb: 3 }}>
            {search ? 'Try a different keyword.' : 'Create your first template to get started.'}
          </Typography>
          {!search && (
            <Button
              startIcon={<AddIcon />}
              onClick={() => navigate('/editor')}
              sx={{
                background: 'linear-gradient(135deg, #963991, #b84db3)',
                color: 'white', fontWeight: 700, borderRadius: '10px',
                px: 2.5, textTransform: 'none',
                boxShadow: '0 4px 14px rgba(150,57,145,0.25)',
              }}
            >
              Create Template
            </Button>
          )}
        </Box>
      )}

      <Grid container spacing={2.5}>
        {filteredTemplates.map((t, i) => {
          const color = COLORS[i % COLORS.length];
          return (
            <Grid item xs={12} sm={6} lg={4} key={t.id}>
              <Fade in timeout={200 + i * 60}>
                <Card
                  elevation={0}
                  sx={{
                    ...glassCard,
                    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 40px rgba(150,57,145,0.14)' },
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/editor?id=${t.id}`)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1, overflow: 'hidden' }}>
                        <Box sx={{
                          width: 42, height: 42, borderRadius: '12px', flexShrink: 0,
                          background: color.bg, border: `1px solid ${color.border}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <LibraryBooksIcon sx={{ fontSize: 18, color: color.icon }} />
                        </Box>
                        <Box sx={{ overflow: 'hidden' }}>
                          <Typography sx={{
                            fontWeight: 700, fontSize: '0.92rem', color: '#1a1a2e',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>
                            {t.name}
                          </Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: '#aaa', mt: 0.3 }}>
                            {new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', flexShrink: 0, ml: 1 }} onClick={(e) => e.stopPropagation()}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/editor?id=${t.id}`)}
                            sx={{ color: '#963991', '&:hover': { background: 'rgba(150,57,145,0.08)' } }}
                          >
                            <EditIcon sx={{ fontSize: 17 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(t.id)}
                            sx={{ color: '#d32f2f', '&:hover': { background: 'rgba(211,47,47,0.08)' } }}
                          >
                            <DeleteIcon sx={{ fontSize: 17 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default TemplateList;