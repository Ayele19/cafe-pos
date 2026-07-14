import React from 'react';
import { Box, Typography, Button, Paper, Divider } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { orderService } from '../../../services/api'; // ✅ make sure this exists

const defaultSellerInfo = {
  city: "101",
  email: "ayele.a@insa.gov.et",
  houseNumber: "101",
  legalName: "Ayel Asmamaw",
  phone: "0939019257",
  region: "1",
  tin: "0090004390",
  vatNumber: "43256663343256663322",
  wereda: "13"
};

const OrderSummary = ({ orderData, setOrderData }) => {
  // ✅ Calculate totals
  const subtotal = orderData.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const vatAmount = orderData.items.reduce((sum, item) => sum + item.taxAmount, 0);
  const total = subtotal + vatAmount;

  const handleSaveOrder = async () => {
    try {
      const payload = {
        buyerInfo: orderData.buyerInfo, // from frontend (filled by user)
        sellerInfo: defaultSellerInfo,  // fixed seller info (your default)
        orderDetails: orderData.items.map(item => ({
          itemName: item.productDescription || item.name,
          quantity: item.quantity,
          price: item.unitPrice,
          total: item.unitPrice * item.quantity
        })),
        sourceSystem: {
          systemType: "POS",
          systemNumber: "SYS-001",
          cashierName: "Bruno",
          salesPersonName: "Bruno",
          invoiceCounter: orderData.invoiceCounter || 1
        },
        documentDetails: {
          subTotal: subtotal,
          vatTotal: vatAmount,
          grandTotal: total,
          currency: "ETB"
        }
      };

      console.log("📦 Sending order:", payload);

      // ✅ Post to backend
      const response = await orderService.saveOrder(payload);

      console.log("✅ Order saved:", response.data);
      alert("Order saved successfully!");

      // Reset order after saving
      setOrderData(prev => ({
        ...prev,
        items: [],
      }));
    } catch (error) {
      console.error("❌ Failed to save order:", error);
      alert("Failed to save order. Check console for details.");
    }
  };

  return (
    <Paper sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Subtotal:</Typography>
          <Typography>{subtotal.toFixed(2)} Birr</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>VAT:</Typography>
          <Typography>{vatAmount.toFixed(2)} Birr</Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">Total:</Typography>
          <Typography variant="h6" fontWeight="bold" color="primary">
            {total.toFixed(2)} Birr
          </Typography>
        </Box>
      </Box>

      <Button
        variant="contained"
        fullWidth
        size="large"
        startIcon={<SaveIcon />}
        onClick={handleSaveOrder}
        disabled={orderData.items.length === 0}
        sx={{
          py: 1.5,
          backgroundColor: '#28c76f',
          '&:hover': { backgroundColor: '#24b464' },
        }}
      >
        Save Order
      </Button>
    </Paper>
  );
};

export default OrderSummary;
