
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function Login() {
  return (
    
        <><div> Enter the first 6 digits of your Aadhaar: </div>
    <Box
          component="form"
          sx={{
              '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
      >
          <TextField fullWidth label="Aadhaar" id=" First 6 digits" />
      </Box></>
  );
}