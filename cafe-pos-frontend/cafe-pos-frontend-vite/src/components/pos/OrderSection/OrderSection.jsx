import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { buyerService } from "../../../services/api";
import { orderService } from "../../../services/orderservice";
import SellerSection from "./SellerSection";
import BuyerSection from "./BuyerSection";
import OrderList from "./OrderList";
import Totals from "./Totals";
import Payment from "./Payment";
import ActionButtons from "./ActionButtons";
import ToastMessage from "./ToastMessage";

// Sample sellers
const sellersList = [
  {
    id: 1,
    legalName: "Ayel Asmamaw",
    tin: "0090004390",
    vatNumber: "43256663343256663322",
    city: "101",
    region: "1",
    wereda: "13",
    email: "ayele.a@insa.gov.et",
    phone: "0939019257",
    houseNumber: "101"
  }
];

// Initial empty buyer template
const initialBuyer = {
  id: null,
  legalName: "",
  phone: "",
  email: "",
  tin: "",
  vatNumber: "",
  houseNumber: "",
  city: "",
  region: "",
  zone: "",
  kebele: "",
  wereda: "",
  idNumber: "",
  idType: "",
  country: ""
};

function OrderSection({ selectedItems, setSelectedItems, vatRate, setVatRate, paymentDetails, setPaymentDetails }) {
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [buyers, setBuyers] = useState([]);
  const [showBuyerForm, setShowBuyerForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [morResponse, setMorResponse] = useState(null);
  const [isSavingBuyer, setIsSavingBuyer] = useState(false);
  const [sellerInfo, setSellerInfo] = useState(sellersList[0] || {});
  const [transactionType, setTransactionType] = useState("B2B");

  const { mode: paymentMode, paymentTerm } = paymentDetails;
  const navigate = useNavigate();

  // -------------------- Date Function --------------------
 const getMorDate = () => {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${day}-${month}-${year}T${hours}:${minutes}:${seconds}`;
};
  // -------------------- Toast Message --------------------
  const showMessage = useCallback((type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // -------------------- Fetch Buyers --------------------
  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const res = await buyerService.getBuyers();
        if (Array.isArray(res.data)) setBuyers(res.data);
      } catch (err) {
        console.error("Failed to fetch buyers:", err);
        showMessage("error", "Failed to load buyers");
      }
    };
    fetchBuyers();
  }, [showMessage]);

  // -------------------- Initialize Selected Buyer --------------------
  useEffect(() => {
    if (!selectedBuyer) setSelectedBuyer(buyers[0] || initialBuyer);
  }, [buyers]);

  // -------------------- Save Buyer --------------------
  const saveBuyer = async () => {
    const requiredFields = ['legalName', 'tin', 'vatNumber'];
    const missingFields = requiredFields.filter(field => !selectedBuyer[field]);
    if (missingFields.length > 0) return showMessage("error", `Missing fields: ${missingFields.join(", ")}`);

    setIsSavingBuyer(true);
    try {
      let savedBuyer;
      if (!selectedBuyer.id) {
        const res = await buyerService.saveBuyer(selectedBuyer);
        savedBuyer = res.data;
        setBuyers(prev => [...prev, savedBuyer]);
      } else {
        const res = await buyerService.updateBuyer(selectedBuyer.id, selectedBuyer);
        savedBuyer = res.data;
        setBuyers(prev => prev.map(b => (b.id === savedBuyer.id ? savedBuyer : b)));
      }
      setSelectedBuyer(savedBuyer);
      setShowBuyerForm(false);
      showMessage("success", "Buyer saved successfully!");
    } catch (err) {
      console.error("Failed to save buyer:", err);
      showMessage("error", err.response?.data?.message || "Failed to save buyer");
    } finally {
      setIsSavingBuyer(false);
    }
  };

  // -------------------- Adjust Quantity --------------------
  const adjustQuantity = useCallback((id, delta) => {
    setSelectedItems(prev =>
      prev
        .map(item => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item))
        .filter(item => item.quantity > 0)
    );
  }, [setSelectedItems]);

  // -------------------- Totals Calculation --------------------
  const { subtotal, vatAmount, totalPrice } = useMemo(() => {
    const sub = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const vat = parseFloat(((sub * vatRate) / 100).toFixed(2));
    return { subtotal: parseFloat(sub.toFixed(2)), vatAmount: vat, totalPrice: parseFloat((sub + vat).toFixed(2)) };
  }, [selectedItems, vatRate]);

  // -------------------- Save Order --------------------
 const saveOrder = async () => {
  setMorResponse(null);

  // -------------------- Validation --------------------
  if (!selectedBuyer?.legalName) return showMessage("error", "Please select or add a buyer");
  if (selectedItems.length === 0) return showMessage("error", "Please add items to the order");

  // Transaction type validation
  if (!transactionType || !["B2B", "B2C", "B2G"].includes(transactionType)) {
    return showMessage("error", "Invalid transaction type");
  }

  // Buyer validation based on transaction type
  if ((transactionType === "B2B" || transactionType === "B2G") && (!selectedBuyer?.tin || !selectedBuyer?.vatNumber)) {
    return showMessage("error", "TIN and VAT Number required for B2B/B2G");
  }
  if (transactionType === "B2C" && (!selectedBuyer?.legalName || !selectedBuyer?.phone)) {
    return showMessage("error", "Name and Phone required for B2C");
  }

  // Seller validation
  const requiredSellerFields = ["legalName", "tin", "vatNumber", "region", "wereda"];
  const missingSellerField = requiredSellerFields.find(field => !sellerInfo[field]);
  if (missingSellerField) return showMessage("error", `Seller ${missingSellerField} required`);

  setLoading(true);

  try {
    // -------------------- Fetch next invoice counter --------------------
    const counterRes = await fetch("http://localhost:8080/api/system/invoiceCounter");
    if (!counterRes.ok) throw new Error("Failed to fetch invoice counter");
    const counterData = await counterRes.json();
    const nextCounter = counterData.counter;

    // -------------------- Prepare ItemList --------------------
    const morItems = selectedItems.map((item, index) => ({
      menuItemId: item.id,
      itemCode: item.code || `ITEM${item.id}`,
      productDescription: item.name,
      unitPrice: item.price,
      preTaxValue: item.price * item.quantity,
      taxAmount: parseFloat(((item.price * item.quantity * vatRate) / 100).toFixed(2)),
      totalLineAmount: parseFloat((item.price * item.quantity * (1 + vatRate / 100)).toFixed(2)),
      taxCode: `VAT${vatRate}`,
      discount: 0,
      natureOfSupplies: "goods",
      exciseTaxValue: 0,
      harmonizationCode: null,
      unit: "PCS",
      quantity: item.quantity,
      lineNumber: index + 1
    }));

    // -------------------- Prepare MOR Payload --------------------
    const requestData = {
      TransactionType: transactionType,
      Version: "1",
      BuyerDetails: { ...selectedBuyer, id: undefined },
      SellerDetails: sellerInfo,
      DocumentDetails: {
        DocumentNumber: nextCounter.toString(),
        Date: getMorDate(),
        type: "INV"
      },
      ItemList: morItems,
      PaymentDetails: { mode: paymentDetails.mode, paymentTerm: paymentDetails.paymentTerm },
      ReferenceDetails: { previousIrn: "", relatedDocument: null },
      SourceSystem: {
        cashierName: "CurrentUser",
        invoiceCounter: nextCounter,
        salesPersonName: "CurrentUser",
        systemNumber: "4249E11DD6",
        systemType: "POS"
      },
      ValueDetails: {
        discount: 0,
        exciseValue: 0,
        incomeWithholdValue: 0,
        taxValue: vatAmount,
        totalValue: totalPrice,
        transactionWithholdValue: 0,
        invoiceCurrency: "ETB"
      }
    };

    // -------------------- Send to Backend --------------------
    const res = await orderService.saveOrder(requestData);
    const response = res.data;
    const timestamp = new Date().toLocaleString();

    const irnFromResponse = response?.irn || response?.data?.irn || null;
    const invoiceNumber = response?.DocumentNumber || response?.data?.DocumentNumber || nextCounter.toString();

    setMorResponse({ status: "success", message: "Invoice registered", reference: irnFromResponse || invoiceNumber, timestamp });
    showMessage("success", `Invoice ${invoiceNumber} registered`);

    // -------------------- Navigate to Receipt --------------------
    navigate("/receipt", {
      state: {
        items: morItems,
        buyer: selectedBuyer,
        seller: sellerInfo,
        subtotal,
        vatAmount,
        totalPrice,
        payment: paymentDetails,
        irn: irnFromResponse,
        invoiceNumber,
        timestamp,
        morResponse: response,
        signedQR: response?.signedQR || response?.body?.signedQR || null
      }
    });

    // -------------------- Reset Form --------------------
    setSelectedItems([]);
    setSelectedBuyer(buyers[0] || initialBuyer);
    setSellerInfo(sellersList[0] || {});
    setVatRate(15);
    setPaymentDetails({ mode: "CASH", paymentTerm: "IMMEDIATE" });
    setTransactionType("B2B");

  } catch (err) {
    console.error("Failed to save order:", err);
    const errorMessage = err.response?.data?.message || err.message || "Connection error";
    setMorResponse({ status: "error", message: errorMessage, timestamp: new Date().toLocaleTimeString() });
    showMessage("error", "Failed to save order");
  } finally {
    setLoading(false);
  }
};
  // -------------------- Cancel Order --------------------
  const handleCancelOrder = () => {
    setSelectedItems([]);
    setMorResponse(null);
    showMessage("info", "Order cleared");
  };

  return (
    <div className="order-section p-4 bg-white rounded-lg shadow-md space-y-3 overflow-auto max-h-screen">
      <ToastMessage toast={toast} />

      {morResponse && (
        <div className={`rounded border p-3 ${morResponse.status === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
          <div className="flex justify-between">
            <span className={`font-medium ${morResponse.status === "success" ? "text-green-700" : "text-red-700"}`}>
              {morResponse.status === "success" ? "✓ Registered" : "✗ Failed"}
            </span>
            <button onClick={() => setMorResponse(null)} className="text-gray-400 hover:text-gray-600">×</button>
          </div>
          <div className="text-sm text-gray-700 mt-1">{morResponse.message}</div>
          {morResponse.status === "error" && (
            <button onClick={saveOrder} className="mt-2 text-sm text-blue-600 hover:text-blue-800">Try again →</button>
          )}
        </div>
      )}

      <SellerSection sellerInfo={sellerInfo} setSellerInfo={setSellerInfo} sellersList={sellersList} />
      <BuyerSection
        selectedBuyer={selectedBuyer}
        setSelectedBuyer={setSelectedBuyer}
        buyers={buyers}
        showBuyerForm={showBuyerForm}
        setShowBuyerForm={setShowBuyerForm}
        saveBuyer={saveBuyer}
        isSavingBuyer={isSavingBuyer}
        initialBuyer={initialBuyer}
      />
      <OrderList selectedItems={selectedItems} adjustQuantity={adjustQuantity} />
      <Totals subtotal={subtotal} vatAmount={vatAmount} totalPrice={totalPrice} vatRate={vatRate} />
      <Payment
        paymentDetails={paymentDetails}
        setPaymentDetails={setPaymentDetails}
        vatRate={vatRate}
        setVatRate={setVatRate}
        transactionType={transactionType}
        setTransactionType={setTransactionType}
      />
      <ActionButtons onSave={saveOrder} onCancel={handleCancelOrder} loading={loading} disabled={selectedItems.length === 0} />
    </div>
  );
}

export default OrderSection;