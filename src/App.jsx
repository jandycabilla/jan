import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Textbox from "./components/textbox/textbox";
import Dropdown from "./components/dropdown/dropdown";
import CustomButton from "./components/button/button";
import "./App.css";

function App() {
  // Retrieve data from localStorage (cartItems, selectedTown, selectedPaymentMethod)
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem("cartItems");
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });

  const [txtName, setTxtName] = useState("");
  const [textPrice, setTextPrice] = useState("");
  const [textQuantity, setTextQuantity] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  const [selectedTown, setSelectedTown] = useState(() => {
    const savedTown = localStorage.getItem("selectedTown");
    return savedTown || "tubigon";
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(() => {
    const savedPaymentMethod = localStorage.getItem("selectedPaymentMethod");
    return savedPaymentMethod || "";
  });

  const [subtotal, setSubtotal] = useState(0); 
  const [shippingFee, setShippingFee] = useState(0); 
  const [grandTotal, setGrandTotal] = useState(0); 

  useEffect(() => {
    calculateSubtotal();
  }, [cartItems]);

  useEffect(() => {
    calculateGrandTotal();
  }, [subtotal, shippingFee]);

  // Save cartItems, selectedTown, and selectedPaymentMethod to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("selectedTown", selectedTown);
  }, [selectedTown]);

  useEffect(() => {
    localStorage.setItem("selectedPaymentMethod", selectedPaymentMethod);
  }, [selectedPaymentMethod]);

  const onChange = (e) => {
    const { id, value } = e.target;
    if (id === "txtName") setTxtName(value);
    if (id === "txtPrice") setTextPrice(value);
    if (id === "txtQuantity") setTextQuantity(value);
  };

  const addToCart = () => {
    if (txtName && textPrice && textQuantity) {
      const item = {
        name: txtName,
        price: parseFloat(textPrice),
        quantity: parseInt(textQuantity, 10),
      };

      setCartItems((prevItems) => {
        if (editingIndex !== null) {
          const updatedItems = [...prevItems];
          updatedItems[editingIndex] = item;
          return updatedItems;
        } else {
          return [...prevItems, item];
        }
      });

      clearForm();
    }
  };

  const deleteItem = (itemIndex) => {
    setCartItems((prevItems) => prevItems.filter((_, index) => index !== itemIndex));
  };

  const editItem = (itemIndex) => {
    const item = cartItems[itemIndex];
    setTxtName(item.name);
    setTextPrice(item.price.toFixed(2));
    setTextQuantity(item.quantity.toString());
    setEditingIndex(itemIndex);
  };

  const clearForm = () => {
    setTxtName("");
    setTextPrice("");
    setTextQuantity("");
    setEditingIndex(null);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const formatCurrency = (value) => `₱${value.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const calculateSubtotal = () => {
    const newSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setSubtotal(newSubtotal);
  };

  const handleTownChange = (e) => {
    const selected = e.target.value;
    setSelectedTown(selected);
    setShippingFee(selected === "tubigon" ? 100 : selected === "calape" ? 150 : 0);
  };

  const handlePaymentChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  const calculateGrandTotal = () => {
    setGrandTotal(subtotal + shippingFee);
  };

  return (
    <div className="main-container">
      <div className="sub-container">
        <Textbox id="txtName" label="Item Name" value={txtName} containerClass="p-3" onTextChange={onChange} />
        <Textbox id="txtPrice" label="Item Price" type="number" value={textPrice} containerClass="p-3" onTextChange={onChange} />
        <Textbox id="txtQuantity" label="Quantity" type="number" value={textQuantity} containerClass="p-3" onTextChange={onChange} />
        <div className="d-flex justify-content-center py-2">
          <CustomButton label={editingIndex !== null ? "Update Cart" : "Add to Cart"} onClick={addToCart} variant="primary" />
        </div>
      </div>

      {cartItems.length > 0 && (
        <div className="item-container my-5">
          <h3 className="text-center py-3">CART ITEMS</h3>

          <div className="d-flex justify-content-end my-3">
          <CustomButton label="Clear" onClick={clearCart} variant="info" className="mb-2" />
          </div>
          <Table striped bordered>
            <thead>
              <tr className="text-capitalize">
                <th>Item#</th>
                <th>Item Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <td>Actions</td>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{formatCurrency(item.price)}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.price * item.quantity)}</td>
                  <td className="text-center" width={200}>
                    <CustomButton label="Edit" variant="success" innerClass="m-1" onClick={() => editItem(index)} />
                    <CustomButton label="Delete" variant="danger" innerClass="m-1" onClick={() => deleteItem(index)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex">
            <Dropdown id="drpTown" label="Town" options={["tubigon", "calape"]} containerClass="p-3" value={selectedTown} onSelectChange={handleTownChange} />
            <Dropdown name="drpPayment" label="Payment Method" options={["Gcash", "Creditcard"]} containerClass="p-3" value={selectedPaymentMethod} onSelectChange={handlePaymentChange} />
          </div>
          <div className="summary-container p-3">
            <h3>Subtotal: {formatCurrency(subtotal)}</h3>
            <h3>Shipping Fee: {formatCurrency(shippingFee)}</h3>
            <h3>Grand Total: {formatCurrency(grandTotal)}</h3>
            <h3>Payment Method: {selectedPaymentMethod}</h3>
          </div>
          
        </div>
      )}
    </div>
  );
}

export default App;
