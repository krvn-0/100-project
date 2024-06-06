import './CartCard.css';


const CartCard = ({ product, handleRemoveClick }) => {
    return (
        <div className="cart-card">
            {/* <div className="cart-card-image">
                <img src={product.image} alt={product.name} />
            </div> */}
            <div className="cart-card-info">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p>${product.price}</p>
                <button onClick={handleRemoveClick}>Remove</button>
            </div>
        </div>
    )
}

export default CartCard;