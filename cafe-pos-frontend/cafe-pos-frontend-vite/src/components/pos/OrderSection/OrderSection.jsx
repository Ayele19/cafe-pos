import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { buyerService, sellerService } from "../../../services/api";
import { orderService } from "../../../services/orderservice";
import SellerSection from "./SellerSection";
import BuyerSection from "./BuyerSection";
import OrderList from "./OrderList";
import Totals from "./Totals";
import Payment from "./Payment";
import ActionButtons from "./ActionButtons";
import ToastMessage from "./ToastMessage";
import "../../../style/OrderSection.css";

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

// Walking customer — used for B2C cash sales with no registered buyer
const WALKING_CUSTOMER = {
  id: "walking",
  legalName: "Walking Customer",
  phone: "0000000000",
  email: "isatelar437@gmail.com",
  tin: null,
  vatNumber: null,
  houseNumber: "N/A",
  city: "0",
  region: "0",
  zone: "N/A",
  kebele: "N/A",
  wereda: "N/A",
  idNumber: "00000000000000",
  idType: "KID",
  country: "70"
};

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

function OrderSection({ selectedItems, setSelectedItems, vatRate, setVatRate, paymentDetails, setPaymentDetails, assignedBranch }) {
  const [selectedBuyer, setSelectedBuyer] = useState(WALKING_CUSTOMER);
  const [buyers, setBuyers] = useState([]);
  const [showBuyerForm, setShowBuyerForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [morResponse, setMorResponse] = useState(null);
  const [isSavingBuyer, setIsSavingBuyer] = useState(false);
  const [sellerInfo, setSellerInfo] = useState(sellersList[0] || {});
  const [transactionType, setTransactionType] = useState("B2C");

  // When assigned branch loads, use its seller
  useEffect(() => {
    if (assignedBranch?.seller) {
      setSellerInfo({
        id: assignedBranch.seller.id,
        legalName: assignedBranch.seller.legalName,
        tin: assignedBranch.seller.tin,
        vatNumber: assignedBranch.seller.vatNumber || "",
        email: assignedBranch.seller.email || "",
        phone: assignedBranch.seller.phone || "",
        region: assignedBranch.seller.region || "",
        wereda: assignedBranch.seller.wereda || "",
        city: assignedBranch.seller.city || "",
        houseNumber: assignedBranch.seller.houseNumber || "",
        subCity: assignedBranch.seller.subCity || null,
        locality: assignedBranch.seller.locality || null,
      });
    } else if (!assignedBranch) {
      // Fallback: load sellers from API for admin
      sellerService.getSellers().then(res => {
        if (res.data?.length > 0) setSellerInfo(res.data[0]);
      }).catch(() => {});
    }
  }, [assignedBranch]);

  const { mode: paymentMode, paymentTerm } = paymentDetails;
  const navigate = useNavigate();

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
  if (!selectedBuyer?.legalName) return showMessage("error", "Please select or add a buyer");  if (selectedItems.length === 0) return showMessage("error", "Please add items to the order");

  if (!transactionType || !["B2B", "B2C", "B2G"].includes(transactionType)) {
    return showMessage("error", "Invalid transaction type");
  }

  if ((transactionType === "B2B" || transactionType === "B2G") && (!selectedBuyer?.tin || !selectedBuyer?.vatNumber)) {
    return showMessage("error", "TIN and VAT Number required for B2B/B2G");
  }
  if (transactionType === "B2C" && (!selectedBuyer?.legalName || !selectedBuyer?.phone)) {
    return showMessage("error", "Name and Phone required for B2C");
  }

  const requiredSellerFields = ["legalName", "tin", "vatNumber", "region", "wereda"];
  const missingSellerField = requiredSellerFields.find(field => !sellerInfo[field]);
  if (missingSellerField) return showMessage("error", `Seller ${missingSellerField} required`);

  setLoading(true);

  try {
    // -------------------- Prepare ItemList --------------------
    // Backend manages document number & invoice counter — no need to pre-fetch
    const morItems = selectedItems.map((item, index) => ({
      menuItemId: item.id,
      itemCode: item.code || `ITEM${item.id}`,
      productDescription: item.name,
      unitPrice: item.price,
      preTaxValue: parseFloat((item.price * item.quantity).toFixed(2)),
      taxAmount: parseFloat(((item.price * item.quantity * vatRate) / 100).toFixed(2)),
      totalLineAmount: parseFloat((item.price * item.quantity * (1 + vatRate / 100)).toFixed(2)),
      taxCode: vatRate === 15 ? "VAT15" : vatRate === 0 ? "VAT0" : vatRate === 10 ? "TOT10" : "VAT15",
      discount: 0,
      natureOfSupplies: "goods",
      exciseTaxValue: 0,
      harmonizationCode: null,
      unit: "PCS",
      quantity: item.quantity,
      lineNumber: index + 1
    }));

    // -------------------- Prepare Payload --------------------
    // Field names must match OrderRequestDTO @JsonProperty annotations (PascalCase)
    const requestData = {
      TransactionType: transactionType,
      Version: "1",
      // Tell backend which branch to use (backend resolves from cashier record first, this is fallback for admin)
      sourceSystemId: assignedBranch?.id || null,
      BuyerDetails: {
        legalName: selectedBuyer.legalName,
        phone: selectedBuyer.phone || "",
        email: selectedBuyer.email || "",
        tin: selectedBuyer.tin || null,
        vatNumber: selectedBuyer.vatNumber || null,
        houseNumber: selectedBuyer.houseNumber || "NEW",
        city: selectedBuyer.city || "0",
        region: selectedBuyer.region || "0",
        zone: selectedBuyer.zone || "",
        kebele: selectedBuyer.kebele || "",
        wereda: selectedBuyer.wereda || "",
        idNumber: selectedBuyer.idNumber || null,
        idType: selectedBuyer.idType || null,
        country: selectedBuyer.country || "70"
      },
      SellerDetails: {
        legalName: sellerInfo.legalName,
        tin: sellerInfo.tin,
        vatNumber: sellerInfo.vatNumber,
        email: sellerInfo.email || "",
        phone: sellerInfo.phone || "",
        houseNumber: sellerInfo.houseNumber || null,
        city: sellerInfo.city || null,
        region: sellerInfo.region,
        subCity: sellerInfo.subCity || null,
        wereda: sellerInfo.wereda,
        locality: sellerInfo.locality || null
      },
      // DocumentDetails: backend generates documentNumber & date — send type only
      DocumentDetails: {
        type: "INV"
      },
      ItemList: morItems,
      PaymentDetails: {
        paymentMode: paymentDetails.mode,
        paymentTerm: paymentDetails.paymentTerm
      },
      ReferenceDetails: {
        previousIrn: "",
        relatedDocument: null
      },
      ValueDetails: {
        discount: null,
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

    if (response?.success === false) {
      const errorMsg = response.message || "MOR registration failed";
      setMorResponse({ status: "error", message: errorMsg, timestamp });
      showMessage("error", errorMsg);
      return;
    }

    const irnFromResponse = response?.irn || null;
    const invoiceNumber = response?.documentNumber || "";

    setMorResponse({ status: "success", message: "Invoice registered successfully", reference: irnFromResponse || invoiceNumber, timestamp });
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
    setSelectedBuyer(WALKING_CUSTOMER);
    setSellerInfo(sellersList[0] || {});
    setVatRate(15);
    setPaymentDetails({ mode: "CASH", paymentTerm: "IMMEDIATE" });
    setTransactionType("B2C");

  } catch (err) {
    console.error("Failed to save order:", err);
    const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Connection error";
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
    <div className="os">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <ToastMessage toast={toast} />

      {morResponse && (
        <div className={`os__banner os__banner--${morResponse.status}`}>
          <div>
            <span className={`os__banner-title os__banner-title--${morResponse.status}`}>
              {morResponse.status === "success" ? "✓ Invoice Registered" : "✗ Failed"}
            </span>
            <div className="os__banner-msg">{morResponse.message}</div>
          </div>
          <div className="os__banner-actions">
            {morResponse.status === "error" && (
              <button className="os__btn-retry" onClick={saveOrder}>Retry →</button>
            )}
            <button className="os__btn-close" onClick={() => setMorResponse(null)}>×</button>
          </div>
        </div>
      )}

      <div className="os__row">
        <SellerSection sellerInfo={sellerInfo} setSellerInfo={setSellerInfo} sellersList={sellersList} />
      </div>
      <div className="os__row">
        <BuyerSection
          selectedBuyer={selectedBuyer}
          setSelectedBuyer={setSelectedBuyer}
          buyers={buyers}
          showBuyerForm={showBuyerForm}
          setShowBuyerForm={setShowBuyerForm}
          saveBuyer={saveBuyer}
          isSavingBuyer={isSavingBuyer}
          initialBuyer={initialBuyer}
          walkingCustomer={WALKING_CUSTOMER}
          setTransactionType={setTransactionType}
          transactionType={transactionType}
        />
      </div>

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