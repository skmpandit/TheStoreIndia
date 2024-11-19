import { Link } from "react-router-dom"
import Rating from '@mui/material/Rating';
// import { useEffect, useState } from "react";
import { MdAddShoppingCart } from "react-icons/md";
import { CartItem } from "../types/types";
import { server } from "../redux/store";

type ProductsProps = {
  productId: string;
  photos: string[];
  name: string;
  price: number;
  stock: number;
  ratings: number,
  handler: (cartItem: CartItem) => string | undefined;
};

const ProductCardDetails = ({ productId, photos, name, price, stock, handler, ratings }: ProductsProps) => {

  // const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const ratingContainerStyle = { width: '10px',  height: '10px' };

  const size = window.innerWidth < 600 ? 'small' : 'large';
  const options = {
    edit: false,
    size: size as 'small' | 'large',
    value: Number(ratings),
    max: 5,
    readOnly: true,
    precision: 0.5,
  }


  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setCurrentImageIndex(prevIndex => (prevIndex + 1) % photos.length)
  //   },3000)
  //   return () => clearInterval(intervalId);
  // },[photos.length]);
  
  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    handler({ name, price, productId, photos, quantity: 1, stock});
  };

  return (
    <Link to={`/product/${productId}`} className='productThumb'>
        <div className="imgWrapper">
            <img src={photos.length > 0 ? `${server}/${photos[0]}` : ""} alt="" />
        </div>
        <div className="info">
            <span className="stock">{stock > 0 ? "In Stock" : "Out Of Stock"}</span>
            <h4>{name.slice(0,35)}</h4>
            <Rating style={ratingContainerStyle} {...options}/>
            <div>
              <div>
                <span>₹{price}</span>
                <span>₹7000</span>
              </div>
              <button onClick={handleAddToCart}><MdAddShoppingCart/>Add</button>
            </div>
        </div>
    </Link>
  )
}

export default ProductCardDetails
