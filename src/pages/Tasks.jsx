import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ButtonAppBar from '../components/ButtonAppBar';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';

import { ref, get } from 'firebase/database';
import { db } from '../util/firebase';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));

function BIMLeadCard({ user }) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">{user.Name ? user.Name.charAt(0) : 'U'}</Avatar>}
        action={<IconButton aria-label="settings"> <MoreVertIcon /></IconButton>}
        title={user || 'Unknown Name'}
        subheader={user.id}
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          BIM Lead Details
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        
    
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {Object.entries(user).map(([key, value]) => (
            <Typography key={key} paragraph>
              <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}
            </Typography>
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default function Tasks() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
        setLoading(true);
        const usersRef = ref(db, 'BIMLeads');
        get(usersRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const usersData = snapshot.val();

                    const usersArray = Object.entries(usersData).map(([id, user]) => ({ id, ...user }));

                    console.log('Fetched users:', usersData);
                    setUsers(usersData);
                    setError(null);
                } else {
                    setError('No users found');
                }
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);


  return (
    <>
    <ButtonAppBar />
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, p: 3 }}>
        {loading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        {users.map((user) => (
            <BIMLeadCard key={user.id} user={user} />
        ))}
    </Box>
    </>
    
   
  );
}