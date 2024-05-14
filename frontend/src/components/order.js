import {useState} from "react"; // for use state
import { XCircleFill } from 'react-bootstrap-icons';

export default function OrderList(props) {
    const orders = props.list;
    const [isHovered, setIsHovered] = useState(null);
    const statusMapping = {
        "-1": "cancelled",
        "0": "pending",
        "1": "completed"
    }

    return (
        <div className="order">
            <div className="order_header">
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
                                    // onClick={() =>}
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