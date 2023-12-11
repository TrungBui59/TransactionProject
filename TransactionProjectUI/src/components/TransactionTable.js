import { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell, 
  TableRow,
  TablePagination,
} from '@mui/material';
import TransactionModal from './TransactionModal';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/Update';

export default function TransactionTable(props) {
  // Add Modal
  const [openAdd, setOpenAdd] = useState(false);
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => {
    setOpenAdd(false);
    props.refresh();
  };

  // Update Modal
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const handleOpenUpdate = (entry) => {
    setSelectedEntry(entry);
    setOpenUpdate(true);
  };
  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    props.refresh();
  };

  // Pagnition
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.data.length) : 0;
  
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
        <Button variant="outlined" size="medium" onClick={handleOpenAdd}>Add a new transaction</Button>
      </Box>
      <Table 
        sx={{ minWidth: 750 }}
        size="medium"
      >
        <TableHead>
          <TableRow>
            <TableCell align='left'>ID</TableCell>
            <TableCell align='left'>To</TableCell>
            <TableCell align='left'>Note</TableCell>
            <TableCell align='right'>Value</TableCell>
            <TableCell align='right'></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data && (rowsPerPage > 0 ? props.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : props.data).map((entry, index) => (
            <TableRow key={entry.id}>
              <TableCell align='left'>{index + 1}</TableCell>
              <TableCell align='left'>{entry.destination}</TableCell>
              <TableCell align='left'>{entry.note}</TableCell>
              <TableCell align='right'>{`$${entry.value}`}</TableCell>
              <TableCell align='right'>
                {
                  <>
                    <IconButton 
                      aria-label="update" 
                      onClick={() => handleOpenUpdate(entry)}
                    >
                      <UpdateIcon />
                    </IconButton>
                    <IconButton 
                      aria-label="delete"
                      onClick={async () => {
                        await fetch(`https://b1haq4df0d.execute-api.us-east-2.amazonaws.com/dev/transaction/${entry.id}`, {
                          method: 'DELETE',
                          mode: 'cors',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                        });

                        props.refresh();
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={props.data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      <TransactionModal
        data={null}
        isOpen={openAdd}
        handleClose={handleCloseAdd}
      />
      <TransactionModal 
        data={selectedEntry}
        isOpen={openUpdate}
        handleClose={handleCloseUpdate}
      />
    </>
  );
}
