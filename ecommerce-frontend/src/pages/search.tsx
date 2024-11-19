import { useEffect, useState } from "react"
import { useCategoriesQuery, useSearchProductsQuery } from "../redux/api/productAPI";
import { CustomError } from "../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../components/loader";
import { CartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
import ProductCardDetails from "../components/product_card_details";


const Search = () => {

  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromUrl = queryParams.get("category") || "";


  const { data: categoriesResponse, isLoading: loadingCategories, isError, error} = useCategoriesQuery("");
  

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const { isLoading: productLoading, data: searchedData, isError: productIsError, error: productError } = useSearchProductsQuery({ search, sort, category, page, price: maxPrice });
  
  const addToCartHandler = (cartItem: CartItem) => {
    if(cartItem.stock < 1) {
      return toast.error("Out Of Stock");
    }
    dispatch(addToCart(cartItem));
    toast.success("Added To Cart");
  }

  const isNextPage = page < 4;
  const isPrevPage = page > 1;

  if(isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  if(productIsError) {
    const err = productError as CustomError;
    toast.error(err.data.message);
  }

  useEffect(() => {
    if(categoryFromUrl) {
      setCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <div>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">None</option>
              <option value="asc">Price (Low To High)</option>
              <option value="dsc">Price (High To Low)</option>
            </select>
          </div>
        </div>
        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <div>
            <input type="range" value={maxPrice} min={100} max={100000} onChange={(e) => setMaxPrice(Number(e.target.value))} />
          </div>
        </div>
        <div>
          <h4>Category</h4>
          <div>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">ALL</option>
              {!loadingCategories && categoriesResponse?.categories.map((i) => (
                <option key={i} value={i}>{i.toUpperCase()}</option> 
              ))}
            </select>
          </div>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input type="text" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} />
        {productLoading ? ( <Skeleton length={10}/> ) : (
          <div className="search-product-list">
            {searchedData?.products.map((i) => (
              <ProductCardDetails 
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                handler={addToCartHandler} 
                photos= {i.photos}
                ratings={i.ratings}
              />
            ))}
          </div>
        )}
        {searchedData && searchedData?.totalPage > 1 && (
          <article>
            <button disabled={!isPrevPage} onClick={() => setPage((prev) => prev - 1)}>Prev</button>
            <span>{page} of {searchedData.totalPage}</span>
            <button disabled={!isNextPage} onClick={() => setPage((prev) => prev + 1)}>Next</button>
        </article>
        )}
      </main>
    </div>
  )
}

export default Search
