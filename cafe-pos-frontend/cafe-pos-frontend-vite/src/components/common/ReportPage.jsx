import React, { useState, useEffect } from "react";
import { reportService, branchService, orderService, auditService } from "../../services/api";
import "../../style/ReportPage.css";

const REPORT_TYPES = [
  { id: "earning",  label: "Earning Report",  icon: "💰" },
  { id: "order",    label: "Order Report",     icon: "📋" },
  { id: "sales",    label: "Sales Report",     icon: "📈" },
  { id: "customer", label: "Customer Report",  icon: "👤" },
  { id: "audit",    label: "Audit Logs",       icon: "🔍" },
];

const PAYMENT_MODES = ["ALL", "CASH", "CREDIT", "DEBIT"];

const STATUS_COLOR = {
  A: { bg: "#f0fdf4", text: "#16a34a", label: "Active" },
  F: { bg: "#fef2f2", text: "#dc2626", label: "Failed" },
  C: { bg: "#fff7ed", text: "#c2410c", label: "Cancelled" },
};

export default function ReportPage() {
  const [active, setActive] = useState("earning");
  const [orders, setOrders] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ startDate: "", endDate: "", paymentMode: "ALL", status: "ALL", branchId: "", cashierName: "" });

  useEffect(() => {
    branchService.getAll().then(r => setBranches(r.data)).catch(console.error);
    loadOrders();
    auditService.getLogs().then(r => setAuditLogs(r.data || [])).catch(console.error);
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try { const res = await orderService.getOrders(); setOrders(res.data || []); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const loadSummary = async () => {
    try {
      const params = {};
      if (filters.branchId) params.branchId = filters.branchId;
      if (filters.cashierName) params.cashierName = filters.cashierName;
      const res = await reportService.getSummary(params);
      setSummary(res.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { if (active === "sales") loadSummary(); }, [active]);

  const setF = (k, v) => setFilters(p => ({ ...p, [k]: v }));
  const reset = () => setFilters({ startDate: "", endDate: "", paymentMode: "ALL", status: "ALL", branchId: "", cashierName: "" });

  const filtered = orders.filter(o => {
    const date = o.documentDetails?.date?.substring(0, 10);
    const mode = o.paymentDetails?.paymentMode || o.paymentDetails?.mode;
    if (filters.startDate && date < filters.startDate) return false;
    if (filters.endDate   && date > filters.endDate)   return false;
    if (filters.paymentMode !== "ALL" && mode !== filters.paymentMode) return false;
    if (filters.status !== "ALL" && o.invoiceStatus !== filters.status) return false;
    return true;
  });

  const totalRevenue = filtered.filter(o => o.invoiceStatus !== "F").reduce((s, o) => s + (o.valueDetails?.totalValue || 0), 0);

  return (
    <div className="rp">
      <div className="rp__tabs">
        {REPORT_TYPES.map(r => (
          <button key={r.id} className={`rp__tab ${active === r.id ? "rp__tab--active" : "rp__tab--idle"}`} onClick={() => setActive(r.id)}>
            <span>{r.icon}</span><span>{r.label}</span>
          </button>
        ))}
      </div>

      <div className="rp__content">
        {active === "earning"  && <EarningReport  orders={filtered} filters={filters} setF={setF} reset={reset} loading={loading} totalRevenue={totalRevenue} />}
        {active === "order"    && <OrderReport    orders={filtered} filters={filters} setF={setF} reset={reset} loading={loading} />}
        {active === "sales"    && <SalesReport    summary={summary} loadSummary={loadSummary} />}
        {active === "customer" && <CustomerReport orders={orders}   loading={loading} />}
        {active === "audit"    && <AuditLogs      logs={auditLogs} />}
      </div>
    </div>
  );
}

function EarningReport({ orders, filters, setF, reset, loading, totalRevenue }) {
  const success = orders.filter(o => o.invoiceStatus !== "F").length;
  const failed  = orders.filter(o => o.invoiceStatus === "F").length;
  return (
    <div className="rp__section">
      <div className="rp__section-header">
        <h2 className="rp__title">💰 Earning Report</h2>
        <button className="rp__btn-reset" onClick={reset}>Reset filters</button>
      </div>
      <div className="rp__cards">
        <Card label="Total Revenue" value={`${totalRevenue.toFixed(2)} ETB`} color="#1b6375" icon="💵" />
        <Card label="Successful"    value={success}                           color="#16a34a" icon="✓" />
        <Card label="Failed"        value={failed}                            color="#dc2626" icon="✗" />
      </div>
      <div className="rp__filters">
        <FilterDate label="Start Date" value={filters.startDate} onChange={v => setF("startDate", v)} />
        <FilterDate label="End Date"   value={filters.endDate}   onChange={v => setF("endDate", v)} />
        <ChipGroup label="Payment" items={PAYMENT_MODES} active={filters.paymentMode} onChange={v => setF("paymentMode", v)} color="#059669" />
        <ChipGroup label="Status" items={["ALL","A","F","C"]} labels={{ ALL:"All", A:"Active", F:"Failed", C:"Cancelled" }} active={filters.status} onChange={v => setF("status", v)} color="#7c3aed" />
      </div>
      {loading ? <div className="rp__loader">Loading…</div> : (
        <table className="rp__table">
          <thead><tr>{["Date","Invoice #","Buyer","Payment Mode","Term","Total (ETB)","Status"].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {orders.length === 0 && <tr><td colSpan={7} className="rp__empty">No records found</td></tr>}
            {orders.map((o, i) => {
              const st = STATUS_COLOR[o.invoiceStatus] || { bg:"#f3f4f6", text:"#6b7280", label: o.invoiceStatus||"—" };
              return (
                <tr key={o.id||i}>
                  <td>{o.documentDetails?.date||"—"}</td>
                  <td className="rp__td-mono">{o.documentDetails?.documentNumber||o.documentNumber||"—"}</td>
                  <td>{o.buyerInfo?.legalName||"—"}</td>
                  <td>{o.paymentDetails?.paymentMode||o.paymentDetails?.mode||"—"}</td>
                  <td>{o.paymentDetails?.paymentTerm||"—"}</td>
                  <td className="rp__td-right rp__td-bold">{o.valueDetails?.totalValue!=null?Number(o.valueDetails.totalValue).toFixed(2):"—"}</td>
                  <td><span className="rp__badge" style={{background:st.bg,color:st.text}}>{st.label}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

function OrderReport({ orders, filters, setF, reset, loading }) {
  const sorted = [...orders].reverse();
  return (
    <div className="rp__section">
      <div className="rp__section-header">
        <h2 className="rp__title">📋 Order Report</h2>
        <button className="rp__btn-reset" onClick={reset}>Reset</button>
      </div>
      <div className="rp__filters">
        <FilterDate label="Start Date" value={filters.startDate} onChange={v => setF("startDate", v)} />
        <FilterDate label="End Date"   value={filters.endDate}   onChange={v => setF("endDate", v)} />
      </div>
      {loading ? <div className="rp__loader">Loading…</div> : (
        <table className="rp__table">
          <thead><tr>{["Invoice #","Date","Buyer","Seller","Items","Total (ETB)","Status"].map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {sorted.length === 0 && <tr><td colSpan={7} className="rp__empty">No records</td></tr>}
            {sorted.map((o, i) => {
              const st = STATUS_COLOR[o.invoiceStatus]||{bg:"#f3f4f6",text:"#6b7280",label:o.invoiceStatus||"—"};
              return (
                <tr key={o.id||i}>
                  <td className="rp__td-mono">{o.documentDetails?.documentNumber||o.documentNumber||"—"}</td>
                  <td>{o.documentDetails?.date||"—"}</td>
                  <td>{o.buyerInfo?.legalName||"—"}</td>
                  <td>{o.sellerInfo?.legalName||"—"}</td>
                  <td style={{textAlign:"center"}}>{(o.items||[]).length}</td>
                  <td className="rp__td-right rp__td-bold">{o.valueDetails?.totalValue!=null?Number(o.valueDetails.totalValue).toFixed(2):"—"}</td>
                  <td><span className="rp__badge" style={{background:st.bg,color:st.text}}>{st.label}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

function SalesReport({ summary, loadSummary }) {
  return (
    <div className="rp__section">
      <div className="rp__section-header">
        <h2 className="rp__title">📈 Sales Report</h2>
        <button className="rp__btn-refresh" onClick={loadSummary}>Refresh</button>
      </div>
      {!summary ? <div className="rp__loader">Loading…</div> : (
        <div>
          <div className="rp__cards rp__cards--2" style={{marginBottom:"20px"}}>
            <Card label="Total Orders"        value={summary.totalOrders}                     color="#1b6375" icon="📋" />
            <Card label="Total Revenue (ETB)" value={Number(summary.totalRevenue).toFixed(2)} color="#16a34a" icon="💵" />
          </div>
          <SubTable title="By Branch"  cols={["Branch","System #","Orders","Revenue (ETB)"]}  rows={summary.byBranch?.map(r=>[r.branchName||"—",r.systemNumber,r.orders,Number(r.revenue).toFixed(2)])} />
          <SubTable title="By Cashier" cols={["Cashier","Orders","Revenue (ETB)"]}             rows={summary.byCashier?.map(r=>[r.cashierName,r.orders,Number(r.revenue).toFixed(2)])} />
          <SubTable title="By Date"    cols={["Date","Orders","Revenue (ETB)"]}                rows={summary.byDate?.sort((a,b)=>b.date?.localeCompare(a.date)).map(r=>[r.date,r.orders,Number(r.revenue).toFixed(2)])} />
        </div>
      )}
    </div>
  );
}

function CustomerReport({ orders, loading }) {
  const byBuyer = {};
  orders.forEach(o => {
    const name = o.buyerInfo?.legalName || "Unknown";
    if (!byBuyer[name]) byBuyer[name] = { orders: 0, revenue: 0 };
    byBuyer[name].orders++;
    byBuyer[name].revenue += o.valueDetails?.totalValue || 0;
  });
  const rows = Object.entries(byBuyer).sort((a,b)=>b[1].revenue-a[1].revenue);
  return (
    <div className="rp__section">
      <h2 className="rp__title" style={{marginBottom:"16px"}}>👤 Customer Report</h2>
      {loading ? <div className="rp__loader">Loading…</div> : (
        <SubTable title={`${rows.length} customers`} cols={["Customer","Orders","Total Revenue (ETB)"]} rows={rows.map(([n,d])=>[n,d.orders,d.revenue.toFixed(2)])} />
      )}
    </div>
  );
}

function AuditLogs({ logs }) {
  return (
    <div className="rp__section">
      <h2 className="rp__title">🔍 Audit Logs</h2>
      <p className="rp__subtitle" style={{marginBottom:"16px"}}>User login and logout activity, most recent first</p>
      <table className="rp__table">
        <thead><tr>{["Time","Username","Action","Role(s)","IP Address"].map(h=><th key={h}>{h}</th>)}</tr></thead>
        <tbody>
          {logs.length === 0 && <tr><td colSpan={5} className="rp__empty">No activity recorded yet</td></tr>}
          {logs.map((log, i) => (
            <tr key={log.id||i}>
              <td style={{whiteSpace:"nowrap",fontSize:"12px"}}>{log.loggedAt?new Date(log.loggedAt).toLocaleString():"—"}</td>
              <td style={{fontWeight:"600"}}>{log.username}</td>
              <td>
                <span className={`rp__badge ${log.action==="LOGIN"?"rp__action-login":"rp__action-logout"}`}>
                  {log.action==="LOGIN"?"🔑 Login":"🚪 Logout"}
                </span>
              </td>
              <td style={{fontSize:"12px",color:"#6b7280"}}>{log.roles||"—"}</td>
              <td style={{fontSize:"12px",color:"#6b7280",fontFamily:"monospace"}}>{log.ipAddress||"—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Shared ── */
function Card({ label, value, color, icon }) {
  return (
    <div className="rp__card" style={{background:color}}>
      <div className="rp__card-label">{icon} {label}</div>
      <div className="rp__card-value">{value}</div>
    </div>
  );
}

function FilterDate({ label, value, onChange }) {
  return (
    <div>
      <div className="rp__filter-label">{label}</div>
      <input type="date" className="rp__filter-input" value={value} onChange={e=>onChange(e.target.value)} />
    </div>
  );
}

function ChipGroup({ label, items, labels={}, active, onChange, color }) {
  return (
    <div>
      <div className="rp__filter-label">{label}</div>
      <div className="rp__chips">
        {items.map(item => (
          <button key={item}
            className={`rp__chip ${active===item?"rp__chip--active":"rp__chip--idle"}`}
            style={active===item?{background:color,color:"#fff",border:`1.5px solid ${color}`}:{border:"1.5px solid #d1d5db"}}
            onClick={()=>onChange(item)}>
            {labels[item]||item}
          </button>
        ))}
      </div>
    </div>
  );
}

function SubTable({ title, cols, rows=[] }) {
  return (
    <div style={{marginBottom:"20px"}}>
      <div className="rp__sub-title">{title}</div>
      <table className="rp__table">
        <thead><tr>{cols.map(c=><th key={c}>{c}</th>)}</tr></thead>
        <tbody>
          {rows.length===0&&<tr><td colSpan={cols.length} className="rp__empty">No data</td></tr>}
          {rows.map((row,i)=>(
            <tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
