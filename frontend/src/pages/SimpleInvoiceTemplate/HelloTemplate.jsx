import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./HelloTemplate.css";

const HelloTemplate = () => {
  const invoiceRef = useRef(null);
  const [invoiceData, setInvoiceData] = useState({
    company: {
      name: "Your Company Name",
      address: "123 Business Street, City, Country",
      email: "info@company.com",
      phone: "+123 456 7890",
    },
    invoiceNumber: "001",
    date: new Date().toISOString().split("T")[0],
    customer: "",
    items: [{ description: "", quantity: 1, price: "" }],
    gst: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isGenerateEnabled, setIsGenerateEnabled] = useState(false);
  const [gstFieldVisible, setGstFieldVisible] = useState(false);

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: "", quantity: 1, price: "" }],
    });
  };

  const removeItem = (index) => {
    const updatedItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, items: updatedItems });
  };

  const handleChange = (index, field, value) => {
    const updatedItems = [...invoiceData.items];
    updatedItems[index][field] = value;
    setInvoiceData({ ...invoiceData, items: updatedItems });
  };

  const subtotal = invoiceData.items.reduce(
    (sum, item) => sum + (item.quantity * Number(item.price) || 0),
    0
  );

  const gstAmount = (subtotal * (invoiceData.gst / 100)) || 0;
  const total = subtotal + gstAmount;

  useEffect(() => {
    const isAllFieldsFilled =
      invoiceData.customer !== "" &&
      invoiceData.items.every((item) => item.description && item.price);
    setIsGenerateEnabled(isAllFieldsFilled);
  }, [invoiceData]);

  const handleDownloadPDF = () => {
    setIsLoading(true);
    const input = invoiceRef.current;

    // Hide GST Section and Add Item Button to make the PDF cleaner
    const gstSection = input.querySelector(".gst-section");
    const addItemButton = input.querySelector(".add-item-btn");
    const inputs = input.querySelectorAll("input");

    if (gstSection) gstSection.style.display = "none";
    if (addItemButton) addItemButton.style.display = "none";
    inputs.forEach((input) => input.classList.add("no-border"));

    html2canvas(input, { scale: 1.5 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

      // Add the image to the PDF
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("invoice.pdf"); // This will trigger the download

      // Restore hidden sections
      if (gstSection) gstSection.style.display = "block";
      if (addItemButton) addItemButton.style.display = "inline-block";
      setIsLoading(false);

      // Restore input borders
      inputs.forEach((input) => input.classList.remove("no-border"));
    }).catch((error) => {
      console.error("Error during PDF generation:", error);
      setIsLoading(false);
    });
  };

  const handleGenerateInvoice = () => {
    console.log("Invoice Data:", invoiceData);
  };

  const handleToggleGST = () => {
    setGstFieldVisible((prevState) => !prevState);
  };

  return (
    <div className="invoice-container">
      <div className="invoice" ref={invoiceRef}>
        <header>
          <div className="company-details">
            <h2>{invoiceData.company.name}</h2>
            <p>{invoiceData.company.address}</p>
            <p>Email: {invoiceData.company.email} | Phone: {invoiceData.company.phone}</p>
          </div>
          <div className="invoice-details">
            <h3>INVOICE</h3>
            <p><strong>Date:</strong> {invoiceData.date}</p>
            <p><strong>Invoice #:</strong> {invoiceData.invoiceNumber}</p>
          </div>
        </header>

        <div className="customer-section">
          <h3>Bill To:</h3>
          <input
            type="text"
            placeholder="Customer Name"
            value={invoiceData.customer}
            onChange={(e) => setInvoiceData({ ...invoiceData, customer: e.target.value })}
          />
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price ($)</th>
              <th>Total ($)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) => handleChange(index, "description", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleChange(index, "quantity", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) => handleChange(index, "price", e.target.value)}
                  />
                </td>
                <td>${(item.quantity * (item.price || 0)).toFixed(2)}</td>
                <td>{index > 0 && <button onClick={() => removeItem(index)}>❌</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="add-item-btn" onClick={addItem}>➕ Add Item</button>

        <div className="add-gst-button">
          <button onClick={handleToggleGST}>{gstFieldVisible ? "Remove GST" : "Add GST"}</button>
        </div>

        {gstFieldVisible && (
          <div className="gst-section">
            <label>GST (%)</label>
            <input
              type="number"
              value={invoiceData.gst}
              onChange={(e) => setInvoiceData({ ...invoiceData, gst: e.target.value })}
              placeholder="Enter GST percentage"
            />
          </div>
        )}

        <div className="summary">
          <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
          {gstFieldVisible && (
            <p><strong>GST ({invoiceData.gst}%):</strong> ${gstAmount.toFixed(2)}</p>
          )}
          <p className="total"><strong>Grand Total:</strong> ${total.toFixed(2)}</p>
        </div>

        <footer>
          <p>Payment is due within 15 days.</p>
          <p>Thank you for your business!</p>
          <p>_________________________</p>
          <p>Authorized Signature</p>
        </footer>
      </div>

      {isLoading && <div className="loading-spinner">Loading...</div>}

      <div className="buttons-container">
        <button className="download-btn" onClick={handleDownloadPDF} disabled={isLoading || !isGenerateEnabled}>
          📥 Download PDF
        </button>

        <button
          className="generate-btn"
          onClick={handleGenerateInvoice}
          disabled={!isGenerateEnabled}
        >
          Generate Invoice
        </button>
      </div>
    </div>
  );
};

export default HelloTemplate;
