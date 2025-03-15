import React from 'react';
import { Alert } from '@mui/material';

const Message = ({ severity, children }) => {
  return <Alert severity={severity || 'info'}>{children}</Alert>;
};

export default Message;