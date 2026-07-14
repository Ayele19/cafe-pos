import React from 'react';
import { 
  Box, Typography, FormControl, InputLabel, Select, MenuItem,
  Accordion, AccordionSummary, AccordionDetails 
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const PaymentSection = ({ orderData, setOrderData }) => {
  const handlePaymentChange = (field, value) => {
    setOrderData(prev => ({
      ...prev,
      paymentDetails: { ...prev.paymentDetails, [field]: value }
    }));
  };

  return (
    <Accordion sx={{ mt: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Payment Details</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Payment Mode</InputLabel>
            <Select
              value={orderData.paymentDetails.mode}
              label="Payment Mode"
              onChange={(e) => handlePaymentChange('mode', e.target.value)}
            >
              <MenuItem value="CASH">Cash</MenuItem>
              <MenuItem value="CARD">Card</MenuItem>
              <MenuItem value="MOBILE">Mobile</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Payment Term</InputLabel>
            <Select
              value={orderData.paymentDetails.paymentTerm}
              label="Payment Term"
              onChange={(e) => handlePaymentChange('paymentTerm', e.target.value)}
            >
              <MenuItem value="IMMEDIATE">Immediate</MenuItem>
              <MenuItem value="CREDIT">Credit</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default PaymentSection;
