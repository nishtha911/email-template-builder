import { Box, Typography, Button, Container, Stack, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Email as EmailIcon, AutoAwesome as SparklesIcon,
  DragIndicator, TextFields, Image as ImageIcon, SmartButton
} from '@mui/icons-material';

const features = [
  { icon: <DragIndicator />, title: 'Drag & Drop', desc: 'Visually build layouts with an intuitive canvas editor.' },
  { icon: <TextFields />, title: 'Rich Content', desc: 'Add text, images, buttons and dividers with ease.' },
  { icon: <ImageIcon />, title: 'Media Library', desc: 'Upload and reuse image assets across all templates.' },
  { icon: <SmartButton />, title: 'HTML Export', desc: 'Download clean production-ready HTML in one click.' },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', background: 'var(--bg-body)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Nav */}
      <Box sx={{
        py: 2, px: { xs: 3, md: 5 },
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(var(--bg-paper-rgb),0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            p: 1, borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--primary-main), var(--primary-light))',
            color: 'white', display: 'flex', alignItems: 'center',
            boxShadow: '0 4px 12px rgba(var(--primary-rgb),0.35)',
          }}>
            <EmailIcon fontSize="small" />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', letterSpacing: '1px' }}>
            TEMPLATE BUILDER
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            sx={{ color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'none', borderRadius: '8px', '&:hover': { color: 'var(--primary-main)', background: 'rgba(var(--primary-rgb),0.06)' } }}
            onClick={() => navigate('/login')}
          >
            Log In
          </Button>
          <Button
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, var(--primary-main), var(--primary-light-alt))',
              textTransform: 'none', fontWeight: 700, borderRadius: '10px', px: 3,
              boxShadow: '0 4px 14px rgba(var(--primary-rgb),0.35)',
              '&:hover': { boxShadow: '0 6px 20px rgba(var(--primary-rgb),0.45)' },
            }}
            onClick={() => navigate('/register')}
          >
            Get Started Free
          </Button>
        </Stack>
      </Box>

      {/* Hero */}
      <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: { xs: 8, md: 12 }, position: 'relative' }}>
        {/* Background Orbs */}
        <Box sx={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--primary-rgb),0.1) 0%, transparent 70%)', top: -80, right: -100, pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--primary-rgb),0.07) 0%, transparent 70%)', bottom: 0, left: -80, pointerEvents: 'none' }} />

        <Box sx={{ textAlign: 'center', maxWidth: 760, position: 'relative', zIndex: 1 }}>
          <Chip
            icon={<SparklesIcon sx={{ fontSize: '16px !important', color: 'var(--primary-main) !important' }} />}
            label="Designed for teams & freelancers"
            sx={{
              mb: 4, bgcolor: 'rgba(var(--primary-rgb),0.1)', color: 'var(--primary-main)',
              fontWeight: 700, fontSize: '0.83rem', border: '1px solid rgba(var(--primary-rgb),0.2)',
              '& .MuiChip-icon': { ml: 1 }, px: 1
            }}
          />

          <Typography variant="h1" sx={{
            fontWeight: 900, color: 'var(--text-primary)',
            fontSize: { xs: '2.4rem', md: '3.6rem' },
            letterSpacing: '-1.5px', lineHeight: 1.08, mb: 3,
          }}>
            Build&nbsp;
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, var(--primary-main), var(--primary-light))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              stunning emails
            </Box>
            &nbsp;without code
          </Typography>

          <Typography sx={{ fontSize: { xs: '1rem', md: '1.15rem' }, color: 'var(--text-secondary)', mb: 5, maxWidth: 560, mx: 'auto', lineHeight: 1.75 }}>
            Our drag-and-drop editor makes it effortless to create, customise, and export professional email templates in minutes.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                py: 1.6, px: 4.5, borderRadius: '14px', fontSize: '1rem', fontWeight: 700, textTransform: 'none',
                background: 'linear-gradient(135deg, var(--primary-main), var(--primary-light))',
                boxShadow: '0 8px 24px rgba(var(--primary-rgb),0.35)',
                '&:hover': { boxShadow: '0 10px 32px rgba(var(--primary-rgb),0.45)', transform: 'translateY(-1px)' },
                transition: 'all 0.2s',
              }}
            >
              Start for Free →
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                py: 1.6, px: 4.5, borderRadius: '14px', fontSize: '1rem', fontWeight: 700, textTransform: 'none',
                borderColor: 'rgba(var(--primary-rgb),0.3)', color: 'var(--primary-main)',
                backdropFilter: 'blur(8px)',
                '&:hover': { background: 'rgba(var(--primary-rgb),0.07)', borderColor: 'var(--primary-main)' }
              }}
            >
              Sign In
            </Button>
          </Stack>
          <Typography sx={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>No credit card required · Free forever</Typography>
        </Box>
      </Container>

      {/* Features */}
      <Box sx={{ background: 'rgba(var(--bg-paper-rgb),0.5)', borderTop: '1px solid var(--border-subtle)', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Typography sx={{ textAlign: 'center', fontWeight: 800, fontSize: '1.4rem', color: 'var(--text-primary)', mb: 1 }}>
            Everything you need
          </Typography>
          <Typography sx={{ textAlign: 'center', color: 'var(--text-secondary)', mb: 6, fontSize: '0.95rem' }}>
            A complete toolkit for building email templates
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} flexWrap="wrap" justifyContent="center">
            {features.map((f, i) => (
              <Box key={i} sx={{
                flex: '1 1 200px', maxWidth: 260, p: 3, borderRadius: '16px',
                background: 'rgba(var(--bg-paper-rgb),0.7)',
                border: '1px solid var(--border-subtle)',
                backdropFilter: 'blur(12px)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 'var(--shadow-md)' },
              }}>
                <Box sx={{
                  width: 44, height: 44, borderRadius: '12px', mb: 2,
                  background: 'rgba(var(--primary-rgb),0.1)', border: '1px solid rgba(var(--primary-rgb),0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--primary-main)',
                }}>
                  {f.icon}
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', mb: 0.5 }}>{f.title}</Typography>
                <Typography sx={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</Typography>
              </Box>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 3, textAlign: 'center', borderTop: '1px solid var(--border-subtle)' }}>
        <Typography sx={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          © 2026 Template Builder
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
