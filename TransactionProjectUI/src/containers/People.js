import { useState, useEffect } from 'react';

import {
  Box,
  Button, 
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  List,
  ListItem,
  Divider,
  ListItemText,
} from '@mui/material/';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';
import UserModal from '../components/UserModal';

const People = () => {
  // Add Modal
  const [openAdd, setOpenAdd] = useState(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => {
    setOpenAdd(false);
  }

  // Update Modal
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const handleOpenUpdate = (entry) => {
    setSelectedEntry(entry);
    setOpenUpdate(true);
  }
  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  }

  // Data
  const [people, setPeople] = useState([]);
  const getPeople = () => {
    fetch('https://b1haq4df0d.execute-api.us-east-2.amazonaws.com/dev/people', {
      mode: 'cors'
    })
       .then((response) => response.json())
       .then((data) => {
          setPeople(data.Response);
       })
       .catch((err) => {
          console.log(err.message);
       });
  }
  useEffect(() => getPeople(), [openAdd, openUpdate]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'flex-end',
          paddingBottom: '10px',
        }}
      >
        <Button 
          variant="contained" 
          size="large" 
          onClick={handleOpenAdd}
          sx={{

          }}
        >
          Add a new user
        </Button>
      </Box>
      <Grid container spacing={4}>
        {people.map((person) => {
          // Random avatar background
          const R = Math.floor(Math.random() * 256);
          const G = Math.floor(Math.random() * 256);
          const B = Math.floor(Math.random() * 256);
          
          return (
            <Grid item key={person.email} xs={12} sm={6} md={4}>
              <Card
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "rgb(" + R + "," + G + "," + B + ")" }} aria-label="recipe">
                      {person.lastName[0]}
                    </Avatar>
                  }
                  sx={{ paddingBottom: 0 }}

                  title={`${person.firstName != null ? person.firstName : ""} ${person.middleName != null ? person.middleName : ""} ${person.lastName}`}
                  action={
                    <>
                    <IconButton 
                      aria-label="update" 
                      onClick={() => handleOpenUpdate(person)}
                    >
                      <UpdateIcon />
                    </IconButton>
                    <IconButton 
                      aria-label="delete"
                      onClick={async () => {
                        await fetch(`https://b1haq4df0d.execute-api.us-east-2.amazonaws.com/dev/people/${person.email}`, {
                          method: 'DELETE',
                          mode: 'cors',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                        });

                        getPeople();
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                  }
                >
                </CardHeader>
                <CardContent sx={{ flexGrow: 1 }}>
                  <List
                    sx={{
                      width: '100%',
                      maxWidth: 360,
                      paddingTop: 0,
                    }}
                  >
                    <ListItem>
                      <ListItemText primary="Email" secondary={person.email} />
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                      <ListItemText primary="Phone" secondary={person.phone} />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )})}
        </Grid>
        <UserModal
          data={null}
          isOpen={openAdd}
          handleClose={handleCloseAdd}
        />
        <UserModal 
          data={selectedEntry}
          isOpen={openUpdate}
          handleClose={handleCloseUpdate}
        />
    </Container>
  );
};

export default People;