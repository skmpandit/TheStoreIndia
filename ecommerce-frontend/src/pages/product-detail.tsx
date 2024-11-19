import { Link, useParams, useNavigate } from "react-router-dom"
import { useCategoriesQuery, useProductDetailsQuery } from "../redux/api/productAPI";
import { Rating } from "@mui/material";
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import InnerImageZoom from 'react-inner-image-zoom';
import { server } from "../redux/store";
import Loader from "../components/loader";
import { SetStateAction, useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { LuMinus } from "react-icons/lu";
import { CiHeart } from "react-icons/ci";
import { MdOutlineShoppingCart } from "react-icons/md";
import toast from "react-hot-toast";
import { addToCart } from "../redux/reducer/cartReducer";
import { useDispatch } from "react-redux";


const ProductDetail = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: categoriesResponse, isLoading: loadingCategories  } = useCategoriesQuery("");


  const [currentIndex, setCurrentIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [photos, setPhotos] = useState<{photo: string}[]>([]);
  const [category, setCategory] = useState("");

  console.log(category);

  const { id } = useParams<{id: string }>();
  const { data: productData, isLoading } = useProductDetailsQuery(id||"");
  const { product} = productData || {};



  useEffect(() => {
    if (productData && product?.photos) {
      const photoObject = product.photos.map((photo) => ({
        photo
      }))
      setPhotos(photoObject);
    }
  }, [productData]);


  const ratingContainerStyle = { width: '10px',  height: '10px' };
  const size = window.innerWidth < 600 ? 'small' : 'large';
  const options = {
    edit: false,
    size: size as 'small' | 'large',
    value: Number(product?.ratings),
    max: 5,
    readOnly: true,
    precision: 0.5,
  }

  const HandleImageIndex = (index: SetStateAction<number>) => {
    setCurrentIndex(index)
  }

  const incrementHandler = () => {
    if(product && product.stock !== undefined) {
      if(quantity >= product.stock) {
        return
      } else {
        setQuantity(prevQuantity => prevQuantity + 1);
      }
    }
  }

  const decrementHandler = () => {
    if(product && product.stock !== undefined) {
      if(quantity <= 1) {
        return
      } else {
        setQuantity(prevQuantity => prevQuantity - 1);
      }
    }
  }

  const addToCarthandler = () => {
    if(product?.stock && product.stock < 1) {
      return toast.error("Out Of Stock");
    } else {
      const cartItem = {
        productId: product?._id || "",
        photos: product?.photos || [],
        name: product?.name || "",
        price: product?.price || 0,
        quantity: quantity || 1,
        stock: product?.stock || 0,
      };
      dispatch(addToCart(cartItem));
      toast.success("Added to cart");
    }

  }

  const handlerItem = (category: string) => {
    const url = `/search?category=${category}`;
    navigate(url);
  }

  return (
    <>
      {isLoading ? <Loader/> : (
        <section className="productDetails">
        <div className="productContainer">
          <div className="productRow">
            <div className="product-col-md">
              <div className="row-cld">
                <div className="productImg">
                  <div className="productSmImg">
                      <div>
                        {photos.map((photo, index) => (
                          <img key={index} src={`${server}/${photo.photo}`} alt={`photo-${index}`} onClick={() => HandleImageIndex(index)} className={`${currentIndex === index ? "active": ""}`} />
                        ))}
                      </div>
                  </div>
                  <div className="productZoom">
                    <InnerImageZoom zoomType="hover" zoomScale={2} src={`${server}/${photos[currentIndex]?.photo}`}/>
                  </div>
                </div>
                <div className="productInfo">
                  <h1>{product?.name}</h1>
                  <div>
                    <div className="ratings-item">
                      <Rating style={ratingContainerStyle} {...options}/>
                      <span className="totalreview">({product?.numOfReviews}<span style={{paddingLeft: "2px"}}>reviews</span>)</span>
                      <div>
                        <span>|</span>
                        <Link to={"/search"}>View All Products</Link>
                      </div>
                    </div>
                    <div className="price">
                      <div className="with-tax">
                        <div className="price_main">
                          <span>₹</span>
                          <span>{product?.price}</span>
                          <span>00</span>
                        </div>
                        <div className="price_off">
                          <span>25% Off</span>
                          <span>2000</span>
                        </div>
                      </div>
                      <div className="price_tax">
                        Including all taxes
                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat et suscipit ut. Accusantium culpa a velit, id amet error expedita molestias veniam. Similique sit ea nobis porro molestias, aut pariatur?</div>
                      </div>
                    </div>
                    <div className="QuntitySelector">
                      <div className="inputBox">
                        <button onClick={decrementHandler} ><LuMinus/></button>
                        <input readOnly type="text" value={quantity} />
                        <button onClick={incrementHandler} ><GoPlus/></button>
                      </div>
                      <div className="addToCartItem" onClick={addToCarthandler}>
                        <button><MdOutlineShoppingCart/>Add To Cart</button>
                        <button><CiHeart/></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="allCategory" id="AllCategoryCustomized">
                  <h4>Category</h4>
                  <span/>
                  <div id="AllCategoryCustomized">
                    {!loadingCategories && categoriesResponse?.categories.map((i) => (
                      <div key={i} onClick={() => {setCategory(i); handlerItem(i)}}>{i.toUpperCase()}</div> 
                    ))}
                  </div>
                </div>
            </div>
          </div>
        </div>
      </section>
      )}
    </>
  )
}

export default ProductDetail
