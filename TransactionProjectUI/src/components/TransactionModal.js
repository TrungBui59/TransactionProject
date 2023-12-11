import { 
  Modal, 
  Box, 
  Container, 
  CssBaseline, 
  Typography, 
  Grid, 
  TextField, 
  InputAdornment, 
  Button 
} from "@mui/material";

export default function TransactionModal(props) {
  const data = props.data;
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const value = form.get('value').trim();
    const destination = form.get('destination').trim();
    const note = form.get('note').trim();
    
    let suffix = '/'
    if (data !== null) {
      suffix += data.id;
      if (value == "" || value == null) {
        value = data.value;
      }
      if (destination == "" || destination == null) {
        return;
      }
    } else {
      if ((value == "" || value == null) || (destination == "" || destination == null)) {
        return;
      }
    }

    // Check email
    let exist = true;
    await fetch(`https://b1haq4df0d.execute-api.us-east-2.amazonaws.com/dev/people/${destination}`, {
      mode: 'cors'
    })
       .then((response) => response.json())
       .then((data) => {
          if (data.Response === null) {
            alert("User email not found! Please create a new one before!")
            exist = false;
          }
       })
       .catch((err) => {
          console.log(err.message);
       });
    if (!exist) {
      return;
    }

    await fetch(`https://b1haq4df0d.execute-api.us-east-2.amazonaws.com/dev/transaction${suffix}`, {
      method: data ? 'PUT' : 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value: value,
        destination: destination,
        note: note,
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
              {data ? 'Update Transaction' : 'Create Transaction'}
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    id="value"
                    name="value"
                    label="Transaction amount"
                    autoFocus
                    fullWidth
                    required
                    defaultValue={data ? data.value : ''}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="destination"
                    name="destination"
                    label="Receiver Email Address"
                    autoComplete="email"
                    fullWidth
                    defaultValue={data ? data.destination : ''}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="note"
                    name="note"
                    label="Note"
                    fullWidth
                    multiline
                    defaultValue={data ? data.note : ''}
                    rows={4}
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