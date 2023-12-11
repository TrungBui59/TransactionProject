import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

function preventDefault(event) {
  event.preventDefault();
}

export default function Deposits(props) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.toLocaleString('default', { month: 'long'});
  const day = currentDate.getDate();
  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Total Transaction
      </Typography>
      <Typography component="p" variant="h4">
        ${props.total}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {`on ${day} ${month}, ${year}`}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link>
      </div>
    </React.Fragment>
  );
}