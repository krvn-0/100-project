import {useState} from "react"; // for use state
import { XCircleFill } from 'react-bootstrap-icons';
import PersistentGet from "../http_methods/getter_persistent";

export default function OrderList(props) {
    const orders = props.list;
    
    // const [items, setItems] = useState([]);
    // const [orders, setOrders] = useState([]);

    // PersistentGet(`http://localhost:3001/transactions/${user.id}`, setOrders);
    // PersistentGet('http://localhost:3001/products', setItems)

    const [isHovered, setIsHovered] = useState(null);
    const statusMapping = {
        "-1": "cancelled",
        "0": "pending",
        "1": "completed"
    }

    const handleOrderCancel = (order) => {
        props.setStatus(order.transactID, -1)
        props.handleItemQuantity(order.product_id, -order.quantity);
    }

    return (
        <div className="order">
            <div className="sticky_placeholder" />
            <div className="order_header sticky">
                <p id="order_title">Orders</p>
                <p id="num_orders">Order Count: {orders.length}</p>
            </div>
            {orders.length === 0 ? (
                <div id="emptyOrders">
                    Checkout Items
                </div>
            ) : (
                <div className="order_body">
                    <div className="order_transactions">
                        {/* maps each item of the order */}
                        {orders.map(order => (
                            <div key={order.transactID} 
                                className={[
                                    'order_item',
                                    isHovered === order.transactID ? 'hovered' : '',
                                    order.status === -1 ? 'cancelled' : '',
                                    order.status === 1 ? 'completed' : ''
                                ].join(' ')}>
                                <button
                                    className={[
                                        'cancelOrder',
                                        order.status === -1 ? 'cancelled' : '',
                                        order.status === 1 ? 'completed' : ''
                                    ].join(' ')}
                                    onClick={() => handleOrderCancel(order)}
                                    onMouseEnter={() =>setIsHovered(order.transactID)
                                    }
                                    onMouseLeave={() => setIsHovered(null)}
                                    disabled={order.status !== 0}>
                                    <XCircleFill />
                                </button>
                                <div className="order_status">
                                    Status: {statusMapping[order.status.toString()]}
                                </div>
                                <div className="qty">
                                    <p id="order_qty">
                                    Quantity: {order.quantity}
                                    </p>
                                </div>
                                <div className="date_time">
                                    <label htmlFor="date_time_val" id="date_time_label">
                                        Order made on:
                                    </label>
                                    <div id="date_time_val">
                                        {order.date} - {order.time}
                                    </div>
                                </div>
                                <div id="order_product">
                                    {order.product}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};