import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, IconButton, Tooltip, Box, Typography, Avatar
} from '@mui/material';
import {
  Dashboard as DashboardIcon, LibraryBooks as TemplatesIcon,
  AddBox as CreateIcon, ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon, Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from './../../context/AuthContext';

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon fontSize="small" />, path: '/dashboard' },
    { text: 'My Templates', icon: <TemplatesIcon fontSize="small" />, path: '/templates' },
    { text: 'Create New', icon: <CreateIcon fontSize="small" />, path: '/editor' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? 240 : 68,
        flexShrink: 0,
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        '& .MuiDrawer-paper': {
          width: open ? 240 : 68,
          transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
          overflowX: 'hidden',
          border: 'none',
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(150,57,145,0.1)',
          boxShadow: '4px 0 24px rgba(150,57,145,0.07)',
        },
      }}
    >
      <Box sx={{
        display: 'flex', alignItems: 'center',
        justifyContent: open ? 'space-between' : 'center',
        px: open ? 2.5 : 1, py: 2.5, minHeight: 72,
        borderBottom: '1px solid rgba(150,57,145,0.08)',
      }}>
        {open && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Box sx={{
              width: 32, height: 32, borderRadius: '9px',
              background: 'linear-gradient(135deg, #963991, #c060bb)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 3px 10px rgba(150,57,145,0.3)',
              flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="3" />
                <path d="m22 7-10 7L2 7" />
              </svg>
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#1a1a2e', letterSpacing: '0.3px' }}>
              BUILDER
            </Typography>
          </Box>
        )}
        <IconButton
          onClick={() => setOpen(!open)}
          size="small"
          sx={{
            color: '#963991',
            background: 'rgba(150,57,145,0.07)',
            borderRadius: '8px',
            '&:hover': { background: 'rgba(150,57,145,0.14)' },
          }}
        >
          {open ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
        </IconButton>
      </Box>

      {open && user && (
        <Box sx={{
          mx: 2, mt: 2, mb: 1, p: 1.5, borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(150,57,145,0.08), rgba(150,57,145,0.04))',
          border: '1px solid rgba(150,57,145,0.1)',
          display: 'flex', alignItems: 'center', gap: 1.5,
        }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: '#963991', fontSize: '0.8rem', fontWeight: 700 }}>
            {user.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#1a1a2e', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.name}
            </Typography>
            <Typography sx={{ fontSize: '0.72rem', color: '#963991', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.email}
            </Typography>
          </Box>
        </Box>
      )}

      {!open && user && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 1 }}>
          <Tooltip title={user.name} placement="right">
            <Avatar sx={{ width: 34, height: 34, bgcolor: '#963991', fontSize: '0.8rem', fontWeight: 700 }}>
              {user.name?.charAt(0).toUpperCase()}
            </Avatar>
          </Tooltip>
        </Box>
      )}

      <List sx={{ px: 1.2, mt: 1, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Tooltip title={!open ? item.text : ''} placement="right" key={item.text}>
              <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: 44,
                    borderRadius: '11px',
                    justifyContent: open ? 'initial' : 'center',
                    px: open ? 1.8 : 1.2,
                    background: active
                      ? 'linear-gradient(135deg, rgba(150,57,145,0.15), rgba(150,57,145,0.08))'
                      : 'transparent',
                    border: active ? '1px solid rgba(150,57,145,0.18)' : '1px solid transparent',
                    '&:hover': {
                      background: active
                        ? 'linear-gradient(135deg, rgba(150,57,145,0.2), rgba(150,57,145,0.12))'
                        : 'rgba(150,57,145,0.06)',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <ListItemIcon sx={{
                    minWidth: 0,
                    mr: open ? 1.5 : 'auto',
                    color: active ? '#963991' : '#888',
                    transition: 'color 0.2s',
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.88rem',
                      fontWeight: active ? 700 : 500,
                      color: active ? '#963991' : '#444',
                    }}
                    sx={{ opacity: open ? 1 : 0, transition: 'opacity 0.2s' }}
                  />
                </ListItemButton>
              </ListItem>
            </Tooltip>
          );
        })}
      </List>

      <Box sx={{ p: 1.5, borderTop: '1px solid rgba(150,57,145,0.08)' }}>
        <Tooltip title={!open ? 'Logout' : ''} placement="right">
          <ListItemButton
            onClick={logout}
            sx={{
              borderRadius: '11px',
              justifyContent: open ? 'initial' : 'center',
              px: open ? 1.8 : 1.2,
              minHeight: 44,
              border: '1px solid rgba(150,57,145,0.12)',
              '&:hover': { background: 'rgba(220,38,38,0.06)', borderColor: 'rgba(220,38,38,0.2)' },
              transition: 'all 0.2s',
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 1.5 : 'auto', color: '#cc4444' }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: 600, color: '#cc4444' }}
              sx={{ opacity: open ? 1 : 0, transition: 'opacity 0.2s' }}
            />
          </ListItemButton>
        </Tooltip>
      </Box>
    </Drawer>
  );
};

export default Sidebar;