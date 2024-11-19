import { useState } from 'react'
import { FaSearch, FaShoppingBag, /*FaSignInAlt, {FaSignOutAlt} FaUser*/ } from 'react-icons/fa'
import { ImUserMinus, ImUserPlus, ImUserCheck } from 'react-icons/im'
import { Link } from 'react-router-dom'
import { User } from '../types/types'
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import toast from 'react-hot-toast';

// const user = { _id : "", role: ""}
interface PropsType {
    user: User | null;
}

const Header = ({user} : PropsType) => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const logOutHandler = async() => {
        try {
            await signOut(auth);
            toast.success("Sign Out Successfully");
            setIsOpen(false);
        } catch (error) {
            toast.error("Sing Out Fail");
        }
    }

  return (
    <nav className='header'>
      <Link onClick={() => setIsOpen(false)} to={"/"}>HOME</Link>
      <Link onClick={() => setIsOpen(false)} to={"/search"}><FaSearch/></Link>
      <Link onClick={() => setIsOpen(false)} to={"/cart"}><FaShoppingBag/></Link>
      {user?._id ? (
            <>
                <button onClick={() => setIsOpen((prev) => !prev)}><ImUserPlus/></button>
                <dialog open={isOpen}>
                    <div>
                        {user?.role === "admin" && (
                            <Link onClick={() => setIsOpen(false)} to={"/admin/dashboard"}>Admin</Link>
                        )}
                        <Link onClick={() => setIsOpen(false)} to={"/orders"}>Orders</Link>
                        <button onClick={logOutHandler}>
                            <ImUserMinus/>
                        </button>
                    </div>
                </dialog>
            </>) 
        : (
            <Link to={"/login"}><ImUserCheck/></Link>
        )}
    </nav>
  )
}

export default Header