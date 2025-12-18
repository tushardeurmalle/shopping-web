import "./Card.css";

export default function Card({ card, onRemove }) {
  const total = card.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  return (
    <div className="card-main">
      <h2 className="card-title">🛒 Your Cart</h2>

      <div className="card-list">
        {card.length === 0 ? (
          <p className="empty-cart">Your cart is empty</p>
        ) : (
          card.map((c, i) => (
            <div className="card-item" key={c.product._id}>
              <div className="card-details">
                <img src={c.product.image} alt={c.product.name} className="card-image" />
                <span className="card-name">{c.product.name}</span>
                <span className="card-qty">Qty: {c.qty}</span>
                <span className="card-price">₹{c.product.price * c.qty}</span>
              </div>
              <button className="remove-btn" onClick={() => onRemove(c.product._id)}>
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <h3 className="card-total">Total: ₹{total}</h3>
      {card.length > 0 && (
        <button className="checkout-btn" onClick={() => alert("Checkout successful ✅")}>
          CHECKOUT
        </button>
      )}
    </div>
  );
}
