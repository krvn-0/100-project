import './CartCard.css';


const CartCard = ({ product, handleRemoveClick, handleOrderClick }) => {
    return (
        <div className={`cart-card ${product.type === 1 ? 'crops' : 'poultry' }`}>
            <div className="cart-card-info">
                <h2 className='product-name'>{product.name}</h2>
                <p className='product-price'>Unit Price: P{product.unitPrice}</p>
                <p className='product-amount'>Quantity: {product.quantity}</p>
                <p className='product-total'>Total: P{product.unitPrice * product.quantity}</p>
                <div className='button-holder'>
                    <button className='order-btn' onClick={handleOrderClick}>Order</button>
                    <button className='remove-btn' onClick={handleRemoveClick}>Remove</button>
                </div>
            </div>
        </div>
    )
}

export default CartCard;