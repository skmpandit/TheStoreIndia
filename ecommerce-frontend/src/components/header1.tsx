// import React from 'react'
import Logo from "../assets/Logo.png"
import { IoIosSearch } from "react-icons/io";
import { CiHeart } from "react-icons/ci";
import { IoCartOutline, IoLogInOutline } from "react-icons/io5";
import { TfiLocationPin } from "react-icons/tfi";
import { GrUserAdmin } from "react-icons/gr";
import { LuUser } from "react-icons/lu";
import { Link } from "react-router-dom";
import { User } from "../types/types";
import { useState } from "react";
import { ImUserMinus } from "react-icons/im";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import { useCategoriesQuery, useSearchProductsQuery } from "../redux/api/productAPI";
// import { IoEllipsisVerticalSharp } from "react-icons/io5";
// import { useState } from "react";
interface PropsType {
  user: User | null;
}

const header1 = ({user} : PropsType) => {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [categoryIsOpen, setCategoryIsOpen] = useState<boolean>(false);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");


  const { data: categoriesResponse } = useCategoriesQuery("");
  const { data: searchedData, isLoading: loadingCategories } = useSearchProductsQuery({ search, category, price: 0,  page: 1, sort: ""});

  const logOutHandler = async() => {
    try {
      await signOut(auth);
      toast.success("Sign Out Successfully");
      setIsOpen(false);
    } catch (error) {
      toast.error("Sign Out Fail");
    }
  }
  return (
    <>
      <header>
        <div className="container">
            <div className="row">
                <Link to={"/"} className="col-sm">
                    <img src={Logo} alt="Logo" />
                </Link>
                <div className="col-sm-5">
                    <div className="headerSearch">
                        <div className="searchWrapper">
                          <div className="selectorDrop" onClick={() => setCategoryIsOpen((prev) => !prev)}>
                            {category ? category : "All Category"}
                          </div>
                          <dialog className="dialogBox" open={categoryIsOpen}>
                            <div className="customs_select">
                              <select value={category} onChange={(e) => {setCategory(e.target.value), setCategoryIsOpen(false)}}>
                                <option value="">All Category</option>
                                {!loadingCategories && categoriesResponse?.categories.map((i) => (
                                  <option key={i} value={i}>{i}</option> 
                                ))}
                              </select>
                            </div>
                          </dialog>
                          <div className="search">
                            <input type='text' placeholder='Search for items...' value={search} onChange={(e) => setSearch(e.target.value)}/>
                            <IoIosSearch className='searchIcon'/>
                          </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-1">
                  <div className="menuWrapper">
                  {/* <IoEllipsisVerticalSharp className="menuToggle" onClick={() => setShowMenu(!showMenu)} /> */}
                    <ul>
                      <li>
                        <Link to={"/wishlist"}>
                          <CiHeart/>
                          Wishlist
                        </Link>
                      </li>
                      <li>
                        <Link to={"/cart"}>
                          <IoCartOutline/>
                          Cart
                        </Link>
                      </li>
                      <li>
                        {user?._id ? (
                            <>
                              <button onClick={() => setIsOpen((prev)=> !prev)}>
                                <LuUser/>
                                Account
                              </button>
                              <dialog open={isOpen}>
                                <div>
                                  {user.role === "admin" && (
                                    <Link onClick={() => setIsOpen(false)} to={"/admin/dashboard"}>
                                      <GrUserAdmin/>
                                      Admin
                                    </Link>
                                  )}
                                  <Link onClick={() => setIsOpen(false)} to={"/orders"}>
                                    <TfiLocationPin/>
                                    Orders
                                  </Link>
                                  <button onClick={logOutHandler}>
                                    <ImUserMinus/>
                                    Sign Out
                                  </button>
                                </div>
                              </dialog>
                            </>
                          ) : (
                            <Link to={"/login"}>
                              <IoLogInOutline/>
                              Login
                            </Link>
                          )}
                      </li>
                    </ul>
                  </div>
                </div>
            </div>
        </div>
      </header>
    </>
  )
}

export default header1
