import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { server } from "../redux/store";
import { CartItem as CartItemType } from "../types/types";

type cartItemProps = {
    cartItem: CartItemType;
    incrementHandler: (cartItem: CartItemType) => void;
    decrementHandler: (cartItem: CartItemType) => void; 
    removeHandler: (id: string) => void;
}

const CartItem = ({ cartItem, incrementHandler, decrementHandler, removeHandler }: cartItemProps) => {
    const {productId,photos,name,price,quantity} = cartItem;
  return (
    <div className="cart-Item">
      <img src={`${server}/${photos[0]}`} alt="name" />
      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>₹{price}</span>
      </article>
      <div>
        <button onClick={() => decrementHandler(cartItem)}>-</button>
        <button>{quantity}</button>
        <button onClick={() => incrementHandler(cartItem)}>+</button>
      </div>
      <button onClick={() => removeHandler(productId)}>
        <FaTrash/>
      </button>
    </div>
  )
}

export default CartItem;
