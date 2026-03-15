import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import DIS_loigo from '../assets/DIS_logo.png'
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import Drawer from '@mui/material/Drawer';

import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import FolderIcon from '@mui/icons-material/Folder';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import DraftsIcon from '@mui/icons-material/Drafts';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Avatar from '@mui/material/Avatar';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';




const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 8,
};


export default function ButtonAppBar() {


  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleNavigation = (text) => {
    const routes = {
      'Project List': '/',
      'Users list': '/users',
      'BIM Settings': '/BIM settings',
      'Drafts': '/drafts',
      'Project Data': '/project-data',
      'Tasks': '/Tasks'
    };
    navigate(routes[text]);
    setOpen(false);
  };

  const iconMap = {
    'Project List': <FolderIcon />,
    'Users list': <PeopleIcon />,
    'BIM Settings': <SettingsIcon />,
    'Drafts': <DraftsIcon />,
    'Project Dashboard': <DashboardIcon />,

  };



  const DrawerList = (
    <Box sx={{ width: 450 }} role="presentation">
      {/* Header section with logo and close button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
        <img src={DIS_loigo} className="logo" alt="DIS logo"
          style={{ mr: 8, width: '100px', height: '40px', objectFit: 'contain' }}
        />
        <IconButton onClick={(e) => { e.stopPropagation(); setOpen(false); }} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <List>
        {['Project List', 'Users list', 'BIM Settings', 'Drafts', 'Project Dashboard', 'Tasks'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => handleNavigation(text)}>
              <ListItemIcon>
                {iconMap[text]}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#fafafa' }}>

        <Toolbar sx={{ color: '#ffffff' }}>


          <IconButton size="large" edge="start" color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ mr: 8, backgroundColor: '#030303', '&:hover': { boxShadow: 8, transform: 'scale(1.09)' }, transition: 'all 0.2s ease', }}
          > <MenuIcon />

            <Drawer open={open}
              onClose={toggleDrawer(false)}>
              {DrawerList}

            </Drawer>
          </IconButton>


          <img src={DIS_loigo} className="logo" alt="DIS logo"
            style={{ width: '300px', height: '100px', objectFit: 'contain' }}
          />
          <Typography variant="h6" component="div" sx={{ mr: 8, flexGrow: 2, backgroundColor: '#ffffff', color: '#272727' }}> BIM Project viewer

          </Typography>



          <Box sx={{ alignItems: 'flex-start', marginLeft: 1, mr: 8, '&:hover': { boxShadow: 3, transform: 'scale(1.05)' }, transition: 'all 0.2s ease' }}>
            <Button sx={{
              backgroundColor: '#000000',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#b67171'
              }
            }} startIcon={<AccountCircleIcon />}
            >Login</Button>
          </Box>



          <Avatar onClick={handleOpen} sx={{
            backgroundColor: '#000000', border: '2px solid white', boxShadow: 2, border: '2px solid #1976d2',
            cursor: 'pointer', '&:hover': { boxShadow: 10, transform: 'scale(1.3)', border: '3px solid #1976d2' },
            transition: 'all 0.2s ease'
          }}
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: 1 }}>
            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.8rem' }}>
              Alex Lopez
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.7rem' }}>
              Admin
            </Typography>
          </Box>

          <Modal
            open={openModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Text in a modal
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </Typography>
            </Box>
          </Modal>


        </Toolbar>
      </AppBar>
    </Box>
  );
}