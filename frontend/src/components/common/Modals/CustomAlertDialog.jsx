import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import useAlertStore from '../../../store/alertStore';

export default function CustomAlertDialog() {
  const { isOpen, message, title, closeAlert } = useAlertStore();

  return (
    <Dialog
      open={isOpen}
      onClose={closeAlert}
      aria-labelledby="custom-alert-title"
      aria-describedby="custom-alert-description"
      PaperProps={{
        style: {
          borderRadius: 16,
          minWidth: 350,
          background: 'var(--modal-bg, #ffffff)'
        }
      }}
    >
      <DialogTitle id="custom-alert-title" sx={{ fontWeight: 'bold', color: 'var(--title, #111827)' }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="custom-alert-description" sx={{ color: 'var(--text-color, #4b5563)', mt: 1 }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ pr: 3, pb: 3 }}>
        <Button 
          onClick={closeAlert} 
          sx={{ 
            background: 'var(--submit-button-bg, #f97316)', 
            color: '#000', 
            fontWeight: 600,
            px: 4,
            '&:hover': { opacity: 0.9, background: 'var(--submit-button-bg, #f97316)' } 
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
