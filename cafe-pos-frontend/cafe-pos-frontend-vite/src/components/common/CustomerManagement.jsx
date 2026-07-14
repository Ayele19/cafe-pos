import React, { useState, useEffect } from "react";
import { buyerService } from "../../services/api";

function CustomerManagement() {
  const [buyers, setBuyers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState({ id: null, legalName: "", phone: "", email: "" });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const res = await buyerService.getBuyers();
        setBuyers(res.data || []);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load buyers");
      }
    };
    fetchBuyers();
  }, []);

  const handleSave = async () => {
    if (!selectedBuyer.legalName) {
      setMessage("Name required");
      return;
    }
    try {
      let res;
      if (selectedBuyer.id) {
        res = await buyerService.updateBuyer(selectedBuyer.id, selectedBuyer);
        setBuyers((prev) => prev.map((b) => (b.id === res.data.id ? res.data : b)));
      } else {
        res = await buyerService.saveBuyer(selectedBuyer);
        setBuyers((prev) => [...prev, res.data]);
      }
      setSelectedBuyer({ id: null, legalName: "", phone: "", email: "" });
      setMessage("Buyer saved!");
      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to save buyer");
    }
  };

  const handleEdit = (buyer) => setSelectedBuyer(buyer);

  const handleDelete = async (id) => {
    try {
      await buyerService.deleteBuyer(id);
      setBuyers((prev) => prev.filter((b) => b.id !== id));
      setMessage("Buyer deleted");
      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete buyer");
    }
  };

  return (
    <div className="p-4">
      {message && <div className="toast mb-2">{message}</div>}

      <h3 className="mb-2 font-bold">Customer Management</h3>
      <div className="mb-4 flex gap-2">
        <input
          placeholder="Name"
          value={selectedBuyer.legalName}
          onChange={(e) => setSelectedBuyer({ ...selectedBuyer, legalName: e.target.value })}
        />
        <input
          placeholder="Phone"
          value={selectedBuyer.phone}
          onChange={(e) => setSelectedBuyer({ ...selectedBuyer, phone: e.target.value })}
        />
        <input
          placeholder="Email"
          value={selectedBuyer.email}
          onChange={(e) => setSelectedBuyer({ ...selectedBuyer, email: e.target.value })}
        />
        <button onClick={handleSave} className="bg-green-500 text-white px-2 py-1 rounded">
          {selectedBuyer.id ? "Update" : "Add"}
        </button>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Phone</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {buyers.map((b) => (
            <tr key={b.id} className="text-center">
              <td className="border px-2 py-1">{b.legalName}</td>
              <td className="border px-2 py-1">{b.phone}</td>
              <td className="border px-2 py-1">{b.email}</td>
              <td className="border px-2 py-1 space-x-1">
                <button onClick={() => handleEdit(b)} className="px-2 py-0.5 border rounded">Edit</button>
                <button onClick={() => handleDelete(b.id)} className="px-2 py-0.5 border rounded text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerManagement;
