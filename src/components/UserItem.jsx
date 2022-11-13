import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function UserItem({
  data
}){

return (
  <div className="userItemsTable">
  <TableContainer component={Paper}>
    <Table align="center" sx={{ maxWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Position</TableCell>                   
          <TableCell>Nombre</TableCell>          
          <TableCell>Points</TableCell>      
        </TableRow>
      </TableHead>
      <TableBody>
      {data.map((row, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >              
              <TableCell align="left">{index + 1}</TableCell>              
              <TableCell align="left">{row.data.name}</TableCell>
              <TableCell align="left">{row.data.points}</TableCell>
            </TableRow>
          ))}          
      </TableBody>
    </Table>
  </TableContainer>
  </div>
  
);
}