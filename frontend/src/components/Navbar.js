import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem, Divider, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, useMediaQuery, useTheme } from '@mui/material';
import { Dashboard as DashboardIcon, Inventory as InventoryIcon, Logout as LogoutIcon, Warning as WarningIcon, Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const MENU_ITEMS = [
  { text: 'Dashboard', icon: DashboardIcon, path: '/' },
  { text: 'Inventory', icon: InventoryIcon, path: '/inventory' },
  { text: 'Low Stock', icon: WarningIcon, path: '/low-stock' },
];

const BUTTON_STYLES = {
  borderRadius: 2,
  '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' },
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    setAnchorEl(null);
    setMobileOpen(false);
    logout();
    navigate('/login');
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <>
      <AppBar position="static" sx={{ mb: { xs: 2, sm: 3, md: 4 }, borderRadius: 0 }}>
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            {isMobile ? 'IMS' : 'Inventory Management System'}
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {MENU_ITEMS.map(({ text, icon: Icon, path }) => (
                <Button
                  key={path}
                  color="inherit"
                  component={Link}
                  to={path}
                  startIcon={<Icon />}
                  sx={{
                    ...BUTTON_STYLES,
                    backgroundColor: isActive(path) ? 'rgba(255,255,255,0.2)' : 'transparent',
                  }}
                >
                  {text}
                </Button>
              ))}

              <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: 'rgba(255,255,255,0.3)' }} />

              <Button
                color="inherit"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                startIcon={<Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.3)' }}>
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>}
                sx={BUTTON_STYLES}
              >
                {user?.username}
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{ sx: { mt: 1, minWidth: 200, borderRadius: 2 } }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" fontWeight="bold">{user?.username}</Typography>
                  <Typography variant="caption" color="textSecondary">{user?.role || 'User'}</Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                  <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
      >
        <Box sx={{ width: 280, height: '100%', bgcolor: 'primary.main' }}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
            <Typography variant="h6" color="white" fontWeight="bold">Menu</Typography>
            <IconButton onClick={() => setMobileOpen(false)} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ pt: 2 }}>
            {MENU_ITEMS.map(({ text, icon: Icon, path }) => (
              <ListItem key={path} disablePadding>
                <ListItemButton
                  onClick={() => handleNavClick(path)}
                  sx={{
                    py: 1.5,
                    px: 3,
                    backgroundColor: isActive(path) ? 'rgba(255,255,255,0.2)' : 'transparent',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    sx={{ color: 'white' }}
                    primaryTypographyProps={{ fontWeight: isActive(path) ? 700 : 500 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', my: 2 }} />
          
          <Box sx={{ px: 3, pb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.3)' }}>
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body2" color="white" fontWeight="bold">{user?.username}</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>{user?.role || 'User'}</Typography>
              </Box>
            </Box>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ py: 1.5 }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
