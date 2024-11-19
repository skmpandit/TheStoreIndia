import { Link } from 'react-router-dom'
// import ProductCard from '../components/product_card'
// import  img  from "../assets/images/heads.png"
import { useLatestProductsQuery } from '../redux/api/productAPI'
import toast from 'react-hot-toast';
import { Skeleton } from '../components/loader';
import { CartItem } from '../types/types';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/reducer/cartReducer';
import Slider from '../components/Slider';
import ProductCardDetails from '../components/product_card_details';
// import HomeSlider from '../components/home_slider';


const Home = () => {

  const { data, isLoading, isError } = useLatestProductsQuery("");
  const dispatch = useDispatch();

  if(isError) {
    toast.error("Can not Fetch the Products");
  }
  const addToCartHandler = (cartItem: CartItem) => {
    if(cartItem.stock < 1) {
      return toast.error("Out Of Stock");
    }
    dispatch(addToCart(cartItem));
    toast.success("Added To Cart")
  }

  return (
    <div className="containerHome">
      <div className='home'>
          <Slider/>
          <h1>
            Leatest Products
            <Link to="/search" className='findmore'>More</Link>
          </h1>
      </div>
      <div className="productRow">
        <div className="item">
          {isLoading ? <Skeleton width='84vw'/> : data?.products.map((i) => (
            <ProductCardDetails
              key={i._id}
              productId= {i._id}
              name={i.name}
              price={i.price}
              stock={i.stock}
              handler={addToCartHandler}
              photos={i.photos}
              ratings={i.ratings}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home



 

