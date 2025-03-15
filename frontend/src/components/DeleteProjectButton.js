// src/components/DeleteProjectButton.js
import React, { useState } from 'react';
import { 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText,
  DialogActions, 
  Button 
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const DeleteProjectButton = ({ projectId, onDelete }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmDelete = () => {
    onDelete(projectId);
    setOpen(false);
  };

  return (
    <>
      <IconButton 
        color="error" 
        onClick={handleOpen} 
        size="small"
        aria-label="delete project"
      >
        <DeleteIcon />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete Project
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this project? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteProjectButton;