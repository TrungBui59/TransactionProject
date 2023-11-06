import { useState, useEffect } from 'react';

import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CardHeader,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  Divider,
  ListItemText,
} from '@mui/material/';

const People = () => {
  // Data
  const [people, setPeople] = useState([]);
  const getPeople = () => {
    console.log("GET people!")
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
    // fetch('https://jia31dggl2.execute-api.us-east-2.amazonaws.com/dev/read_input', {
    //   mode: 'cors',
    //   'x-apiKey': 'lT4w53R8HB9AkUgPJ2Nhw8e7OLEF6sfg9t8x8HbL'
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //     console.log(data.products);
    //   })
    //   .catch((err) => {
    //     console.log(err.message);
    //   });
  }
  useEffect(() => getPeople(), []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
                {}
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "rgb(" + R + "," + G + "," + B + ")" }} aria-label="recipe">
                      {person.lastName[0]}
                    </Avatar>
                  }
                  sx={{ paddingBottom: 0 }}

                  title={`${person.firstName != null ? person.firstName : ""} ${person.middleName != null ? person.middleName : ""} ${person.lastName}`}
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
    </Container>
  );
};

export default People;