import React, { useState, useEffect } from "react";
import { Grid, Box } from "@mui/material";
import MenuSection from "../components/pos/MenuSection/MenuSection";
import OrderSection from "../components/pos/OrderSection/OrderSection";
import QuickActions from "../components/pos/QuickActions";

const POS = ({ invoiceCounter, setInvoiceCounter }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  const [vatRate, setVatRate] = useState(0);
  const [orderData, setOrderData] = useState({
    transactionType: "",
    paymentDetails: { mode: "", paymentTerm: "" },
    items: []
  });

  // Sync selectedItems with orderData
  useEffect(() => {
    setOrderData(prev => ({ ...prev, items: selectedItems }));
  }, [selectedItems]);

  // Sync selectedBuyer with orderData
  useEffect(() => {
    if (selectedBuyer) {
      setOrderData(prev => ({ ...prev, buyerInfo: selectedBuyer }));
    }
  }, [selectedBuyer]);

  // Transaction type handler
  const setTransactionType = type => {
    setOrderData(prev => ({ ...prev, transactionType: type }));
    setVatRate(type === "B2B" ? 15 : 0);
  };

  // Payment handler
  const setPaymentDetailsHandler = (field, value) => {
    setOrderData(prev => ({
      ...prev,
      paymentDetails: { ...prev.paymentDetails, [field]: value }
    }));
  };

  // VAT handler
  const setVatRateHandler = rate => setVatRate(rate);

  return (
    <Box sx={{ p: 2, height: "calc(100vh - 80px)" }}>
      <Grid container spacing={2} sx={{ height: "100%" }}>
        {/* Menu Section */}
        <Grid item xs={12} md={8} sx={{ height: "100%" }}>
          <MenuSection
            menuItems={menuItems}
            setMenuItems={setMenuItems}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        </Grid>

        {/* Order Section */}
        <Grid item xs={12} md={4} sx={{ height: "100%" }}>
          <OrderSection
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            selectedBuyer={selectedBuyer}
            setSelectedBuyer={setSelectedBuyer}
            buyers={buyers}
            setBuyers={setBuyers}
            vatRate={vatRate}
            setVatRate={setVatRateHandler}
            transactionType={orderData.transactionType}
            setTransactionType={setTransactionType}
            paymentDetails={orderData.paymentDetails}
            setPaymentDetails={setPaymentDetailsHandler}
            orderData={orderData}
            setOrderData={setOrderData}
            invoiceCounter={invoiceCounter}
            setInvoiceCounter={setInvoiceCounter}
          />
        </Grid>

        {/* Quick Actions */}
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
