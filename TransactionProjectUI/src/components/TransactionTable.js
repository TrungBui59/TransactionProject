import { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell, 
  TableRow,
} from '@mui/material';
import TransactionModal from './TransactionModal';

export default function TransactionTable() {
  // Modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmit = async (event) => {
    console.log("POST transaction!")
    event.preventDefault();
    
    const data = new FormData(event.currentTarget);
    const value = data.get('value');
    const destination = data.get('destination');
    const note = data.get('note');
    if ((value == "" || value == null) || (destination == "" || destination == null)) {
      return;
    }

    fetch('https://b1haq4df0d.execute-api.us-east-2.amazonaws.com/dev/transaction', {
      method: 'POST',
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
    console.log(rows);
    getTransactions();
    console.log(rows);
    handleClose();
  };
  
  // Data
  const [rows, setRows] = useState([]);
  const getTransactions = () => {
    console.log("GET Transaction!")
    fetch('https://b1haq4df0d.execute-api.us-east-2.amazonaws.com/dev', {
      mode: 'cors'
    })
       .then((response) => response.json())
       .then((data) => {
          setRows(data.Response);
       })
       .catch((err) => {
          console.log(err.message);
       });
  }
  useEffect(() => getTransactions(), []);
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Transactions
      </Typography>
        <Button variant="outlined" size="medium" onClick={handleOpen}>Add a new transaction</Button>
      </Box>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Note</TableCell>
            <TableCell align="right">Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.destination}</TableCell>
              <TableCell>{row.note}</TableCell>
              <TableCell align="right">{`$${row.value}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TransactionModal 
        isOpen={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
      />
    </>
  );
}
