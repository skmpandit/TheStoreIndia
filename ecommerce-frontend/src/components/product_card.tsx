import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";
import { CartItem } from "../types/types";

type ProductsProps = {
    productId: string;
    photos: string[];
    name: string; 
    price: number;
    stock: number;
    handler: (cartItem: CartItem) => string | undefined;
};


const ProductCard = ({productId, photos, name, price, stock, handler}: ProductsProps) => {
  return (
    <div className="product_card">
      <img src={`${photos.length > 0 ? `${server}/${photos[1]}` : ''}`} alt={name} />
      <p>{name}</p>
      <span>{price}</span>
      <div>
        <button onClick={() => handler({ name, price, productId, photos, quantity: 1, stock})}>
            <FaPlus/>
        </button>
      </div>
    </div>
  )
}

export default ProductCard
