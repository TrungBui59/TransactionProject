import { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper,
} from '@mui/material/';

import Chart from '../components/Chart';
import Deposits from '../components/Deposits';
import TransactionTable from '../components/TransactionTable';

export default function Home() {
  const [total, setTotal] = useState(0);

  // Data
  const [data, setData] = useState([]);
  const getTransactions = () => {
    fetch('https://b1haq4df0d.execute-api.us-east-2.amazonaws.com/dev/transaction', {
      mode: 'cors'
    })
       .then((response) => response.json())
       .then((data) => {
          setData(data.Response);
          let temp = 0;
          data.Response.forEach(element => {
            temp += element.value;
          });
          setTotal(temp);
       })
       .catch((err) => {
          console.log(err.message);
       });
  }
  useEffect(() => getTransactions(), []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Chart />
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Deposits total={total}/>
          </Paper>
        </Grid>
        {/* Transactions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <TransactionTable data={data} refresh={getTransactions}/>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}