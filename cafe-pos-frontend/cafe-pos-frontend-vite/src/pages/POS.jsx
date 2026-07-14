import React, { useState, useEffect } from 'react';
import { Grid, Box } from '@mui/material';
import MenuSection from '../components/pos/MenuSection/MenuSection';
import OrderSection from '../components/pos/OrderSection/OrderSection';
import QuickActions from '../components/pos/QuickActions';

const POS = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [vatRate, setVatRate] = useState(0); // Start with 0%

  // SINGLE SOURCE OF TRUTH - ALL user-selectable fields start empty
  const [orderData, setOrderData] = useState({
    transactionType: '', // ✅ EMPTY - user selects from dropdown
    version: '1',
    buyerInfo: {
      legalName: '', email: '', phone: '', houseNumber: '', 
      city: '', region: '', zone: '', kebele: '', wereda: '',
      tin: '', vatNumber: '', idNumber: '', idType: '', country: ''
    },
    sellerInfo: {
      legalName: 'Ayel Asmamaw', email: 'ayele.a@insa.gov.et', 
      phone: '0939019257', houseNumber: '101', city: '101',
      region: '1', wereda: '13', tin: '0090004390', 
      vatNumber: '43256663343256663322'
    },
    paymentDetails: { 
      mode: '',        // ✅ EMPTY - user selects from dropdown
      paymentTerm: ''  // ✅ EMPTY - user selects from dropdown
    },
    documentDetails: { documentNumber: '', date: '', type: 'INV' },
    referenceDetails: { previousIrn: '', relatedDocument: null },
    sourceSystem: {
      cashierName: 'Current User', invoiceCounter: '', 
      salesPersonName: 'Current User', systemNumber: 'POS001', systemType: 'POS'
    },
    valueDetails: {
      discount: 0, exciseValue: 0, incomeWithholdValue: 0,
      taxValue: 0, totalValue: 0, transactionWithholdValue: 0, invoiceCurrency: 'ETB'
    },
    items: []
  });

  // Update selectedItems in orderData
  useEffect(() => {
    setOrderData(prev => ({
      ...prev,
      items: selectedItems
    }));
  }, [selectedItems]);

  // Update selectedBuyer in orderData
  useEffect(() => {
    if (selectedBuyer) {
      setOrderData(prev => ({
        ...prev,
        buyerInfo: selectedBuyer
      }));
    }
  }, [selectedBuyer]);

  // Helper function to update transaction type
  const setTransactionType = (type) => {
    setOrderData(prev => ({
      ...prev,
      transactionType: type
    }));
    
    // Auto-set VAT rate based on transaction type
    if (type === 'B2C') {
      setVatRate(0); // B2C often has 0% VAT for end consumers
    } else if (type === 'B2B') {
      setVatRate(15); // B2B typically has 15% VAT
    }
  };

  // Helper function to update payment details
  const setPaymentDetails = (field, value) => {
    setOrderData(prev => ({
      ...prev,
      paymentDetails: {
        ...prev.paymentDetails,
        [field]: value
      }
    }));
  };

  // Helper function to update VAT rate
  const setVatRateHandler = (rate) => {
    setVatRate(rate);
    setOrderData(prev => ({
      ...prev,
      valueDetails: {
        ...prev.valueDetails,
        taxValue: calculateTaxValue(selectedItems, rate)
      }
    }));
  };

  // Calculate tax value for orderData
  const calculateTaxValue = (items, rate) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return parseFloat((subtotal * (rate / 100)).toFixed(2));
  };

  // Fetch initial data
  useEffect(() => {
    // These would come from your API services
    // menuService.getMenuItems().then(res => setMenuItems(res.data))
    // buyerService.getBuyers().then(res => setBuyers(res.data))
    // sellerService.getSellers().then(res => setSellers(res.data))
  }, []);

  return (
    <Box sx={{ p: 2, height: 'calc(100vh - 80px)' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* Menu Section - Left (70%) */}
        <Grid item xs={12} md={8} sx={{ height: '100%' }}>
          <MenuSection
            menuItems={menuItems}
            setMenuItems={setMenuItems}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        </Grid>
        
        {/* Order Section - Right (30%) */}
        <Grid item xs={12} md={4} sx={{ height: '100%' }}>
          <OrderSection
            // Order items
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            
            // Buyer information
            selectedBuyer={selectedBuyer}
            setSelectedBuyer={setSelectedBuyer}
            buyers={buyers}
            setBuyers={setBuyers}
            
            // Seller information  
            selectedSeller={selectedSeller}
            setSelectedSeller={setSelectedSeller}
            sellers={sellers}
            setSellers={setSellers}
            
            // Tax and payments
            vatRate={vatRate}
            setVatRate={setVatRateHandler}
            
            // Transaction and payment (ALL USER-SELECTABLE)
            transactionType={orderData.transactionType}
            setTransactionType={setTransactionType}
            paymentDetails={orderData.paymentDetails}
            setPaymentDetails={setPaymentDetails}
            
            // Complete order data for submission
            orderData={orderData}
            setOrderData={setOrderData}
          />
        </Grid>
        
        {/* Quick Actions - Bottom */}
        <Grid item xs={12}>
          <QuickActions 
            orderData={orderData}
            setOrderData={setOrderData}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default POS;