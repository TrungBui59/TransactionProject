import { 
  Modal, 
  Box, 
  Container, 
  CssBaseline, 
  Typography, 
  Grid, 
  TextField, 
  Button 
} from "@mui/material";

export default function UserModal(props) {
  const data = props.data;
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const email = form.get('email').trim();
    const lastName = form.get('lastName').trim();
    const middleName = form.get('middleName').trim();
    const firstName = form.get('firstName').trim();
    const phone = form.get('phone').trim();
    
    let suffix = '/'
    
    // Update
    if (data !== null) {
      suffix += data.email;
    } 
    
    // Add
    else {
      if ((email == "" || email == null) || (lastName == "" || lastName == null)) {
        return;
      }
    }

    await fetch(`https://b1haq4df0d.execute-api.us-east-2.amazonaws.com/dev/people${suffix}`, {
      method: data ? 'PUT' : 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        lastName: lastName,
        middleName: middleName,
        firstName: firstName,
        phone: phone,
      })
    })
    .catch((error) => console.log(`Error: ${error}`));

    props.handleClose();
  };

  return (
    <Modal
      data={props.data}
      open={props.isOpen}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={
        {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }
      }>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              {data ? 'Update User' : 'Create User'}
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    id="email"
                    name="email"
                    label="Email"
                    autoFocus
                    fullWidth
                    required
                    defaultValue={data ? data.email : ''}
                    disabled={data ? true : false}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    fullWidth
                    defaultValue={data ? data.lastName : ''}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="middleName"
                    name="middleName"
                    label="Middle Name"
                    fullWidth
                    defaultValue={data ? data.middleName : ''}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    fullWidth
                    defaultValue={data ? data.firstName : ''}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="phone"
                    name="phone"
                    label="Phone number"
                    fullWidth
                    defaultValue={data ? data.phone : ''}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {data ? 'Update' : 'Add'}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Modal>
  );
}