import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useAuth } from '../context/AuthContext';

const settings = ['Profile', 'Dashboard', 'Logout'];

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { user, logout } = useAuth();

  // Show all links regardless of role, but "Add Problem" only appears for admins
  const pages = [
    { name: 'Problems', path: '/all-problems' },
    { name: 'Contests', path: '/contest' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'About', path: '/about' },
    { name: 'Add Problem', path: '/add-problem', adminOnly: true },
  ];

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#1c1c1c', // greyish tone
        boxShadow: 'none',
        borderBottom: '0.5px solid #facc15',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Typography
            variant="h6"
            onClick={() => navigate('/')}
            sx={{
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'white',
              cursor: 'pointer',
              display: { xs: 'none', md: 'flex' },
              mr: 3,
            }}
          >
            Algo-U
          </Typography>

          {/* Left-aligned nav links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}>
            {pages.map((page) => {
              // Hide admin-only links if not admin
              if (page.adminOnly && user?.role !== 'admin') return (
                <Box key={page.name} sx={{ width: '105px' }} /> // ⬅ placeholder to preserve spacing
              );

              return (
                <Button
                  key={page.name}
                  onClick={() => navigate(page.path)}
                  sx={{
                    color: 'white',
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                    mr: 1.5,
                    '&:hover': {
                      color: '#facc15', // yellow-400
                      backgroundColor: 'transparent',
                    }
                  }}
                >
                  {page.name}
                </Button>
              );
            })}
          </Box>

          {/* Mobile Menu (hamburger) */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorElNav} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu}>
              {pages.map((page) => {
                if (page.adminOnly && user?.role !== 'admin') return null;
                return (
                  <MenuItem
                    key={page.name}
                    onClick={() => {
                      handleCloseNavMenu();
                      navigate(page.path);
                    }}
                  >
                    <Typography>{page.name}</Typography>
                  </MenuItem>
                );
              })}
            </Menu>
          </Box>

          {/* Right side: avatar or sign-in */}
          <Box>
            {user ? (
              <>
                <Tooltip title="Account settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user.fullName || 'User'} />
                  </IconButton>
                </Tooltip>
                <Menu anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() => {
                        handleCloseUserMenu();
                        if (setting === 'Logout') logout();
                        if (setting === 'Profile') navigate('/personal');
                      }}
                    >
                      <Typography>{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Button
                variant="outlined"
                onClick={() => navigate('/signin')}
                sx={{
                  borderColor: '#888',
                  color: '#ccc',
                  fontWeight: 500,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#333',
                    color: '#facc15',
                    borderColor: '#facc15',
                  },
                }}
              >
                Sign in
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
