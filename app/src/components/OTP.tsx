
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function Login() {
  return (
    
        <><div> Enter your OTP:
        </div>
    <Box
          component="form"
          sx={{
              '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
      >
          <TextField fullWidth label="OTP" id=" OTP" />
      </Box></>
  );
}