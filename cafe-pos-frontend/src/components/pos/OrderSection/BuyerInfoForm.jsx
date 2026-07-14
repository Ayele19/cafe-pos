import React from 'react';
import { 
  Box, Typography, TextField, FormControl, InputLabel, 
  Select, MenuItem, Accordion, AccordionSummary, AccordionDetails 
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const BuyerInfoForm = ({ orderData, setOrderData }) => {
  const handleBuyerChange = (field, value) => {
    setOrderData(prev => ({
      ...prev,
      buyerInfo: { ...prev.buyerInfo, [field]: value }
    }));
  };

  return (
    <Accordion sx={{ mt: 2 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Buyer Information</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Legal Name"
            value={orderData.buyerInfo.legalName}
            onChange={(e) => handleBuyerChange('legalName', e.target.value)}
            fullWidth
          />
          <TextField
            label="Phone"
            value={orderData.buyerInfo.phone}
            onChange={(e) => handleBuyerChange('phone', e.target.value)}
            fullWidth
          />
          <TextField
            label="Email"
            value={orderData.buyerInfo.email}
            onChange={(e) => handleBuyerChange('email', e.target.value)}
            fullWidth
          />
          <TextField
            label="TIN"
            value={orderData.buyerInfo.tin}
            onChange={(e) => handleBuyerChange('tin', e.target.value)}
            fullWidth
          />
          <TextField
            label="VAT Number"
            value={orderData.buyerInfo.vatNumber}
            onChange={(e) => handleBuyerChange('vatNumber', e.target.value)}
            fullWidth
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default BuyerInfoForm;
