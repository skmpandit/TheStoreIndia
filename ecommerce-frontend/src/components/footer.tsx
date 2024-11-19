
import Icon1 from "../assets/images/icon-1.svg";
import Icon2 from '../assets/images/icon-2.svg';
import Icon3 from '../assets/images/icon-3.svg';
import Icon4 from '../assets/images/icon-4.svg';
import Icon5 from '../assets/images/icon-5.svg';
import Logo from '../assets/Logo.png';
import { Link } from 'react-router-dom';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import HeadphonesOutlinedIcon from '@mui/icons-material/HeadphonesOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import paymentImage from '../assets/images/payment-method.png';

import appStore from '../assets/images/app-store.jpg';
import googlePlay from '../assets/images/google-play.jpg';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import Newsletter from "./new_letter";
import NewsletterImg from '../assets/images/image-1.png';

const Footer = () => {
    return (
        <>

            <section className='newsLetterSection'>
                <div className='container-fluid'>
                    <div className='box'>
                        <div className='info'>
                            <h2>Stay home & get your all <br />needs from our shop</h2>
                            <p>Start Your Daily Shopping with The Store India</p>
                            <br /><br className='res-hide' />
                            <Newsletter />
                        </div>

                        <div className='img'>
                            <img src={NewsletterImg} className='w-100' />
                        </div>
                    </div>
                </div>
            </section>

            <div className='footerWrapper'>
                <div className='footerBoxes'>
                    <div className='containerBox'>
                        <div className='row'>
                            <div className='col'>
                                <div className='box'>
                                    <span><img src={Icon1} /></span>
                                    <div className='info'>
                                        <h4>Best prices & offers</h4>
                                        <p>Orders ₹500 or more</p>
                                    </div>
                                </div>
                            </div>

                            <div className='col'>
                                <div className='box d-flex align-items-center w-100'>
                                    <span><img src={Icon2} /></span>
                                    <div className='info'>
                                        <h4>Free delivery</h4>
                                        <p>Orders ₹5000 or more</p>
                                    </div>
                                </div>
                            </div>

                            <div className='col'>
                                <div className='box d-flex align-items-center w-100'>
                                    <span><img src={Icon3} /></span>
                                    <div className='info'>
                                        <h4>Great daily deal</h4>
                                        <p>Orders ₹500 or more</p>
                                    </div>
                                </div>
                            </div>


                            <div className='col'>
                                <div className='box d-flex align-items-center w-100'>
                                    <span><img src={Icon4} /></span>
                                    <div className='info'>
                                        <h4>Wide assortment</h4>
                                        <p>Orders ₹500 or more</p>
                                    </div>
                                </div>
                            </div>


                            <div className='col'>
                                <div className='box d-flex align-items-center w-100'>
                                    <span><img src={Icon5} /></span>
                                    <div className='info'>
                                        <h4>Easy returns</h4>
                                        <p>Orders ₹500 or more</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>


                <footer>
                    <div className='container-fluid'>
                    {/* <hr /> */}
                        <div className='row-items'>
                            <div className="part-1">
                                <div className="heading">
                                    <h4>Get To Now Us</h4>
                                </div>
                                <div className="item">
                                    <p className="item-hover"><Link to={"/"}>Contact Us</Link></p>
                                    <p className="item-hover"><Link to={"/"}>About Us</Link></p>
                                    <p className="item-hover"><Link to={"/"}>The Store India Story</Link></p>
                                    <p className="item-hover"><Link to={"/"}>Corporate Information</Link></p>
                                </div>
                            </div>
                            <div className="part-1">
                                <div className="heading">
                                    <h4>Help</h4>
                                </div>
                                <div className="item">
                                    <p className="item-hover"><Link to={"/"}>Paymets</Link></p>
                                    <p className="item-hover"><Link to={"/"}>Shipping</Link></p>
                                    <p className="item-hover"><Link to={"/"}>Cancellation & Returns</Link></p>
                                    <p className="item-hover"><Link to={"/"}>FAQ</Link></p>
                                </div>
                            </div>
                            <div className="part-1">
                                <div className="heading">
                                    <h4>Cunsumer Policy</h4>
                                </div>
                                <div className="item">
                                    <p className="item-hover"><Link to={"/"}>Cancellation & Returns</Link></p>
                                    <p className="item-hover"><Link to={"/"}>Terms Of Use</Link></p>
                                    <p className="item-hover"><Link to={"/"}>Security</Link></p>
                                    <p className="item-hover"><Link to={"/"}>Privacy</Link></p>
                                </div>
                            </div>
                            <div className='part-1'>
                                <div className="heading">
                                    <h4>Awesome shoping store website</h4>
                                </div>
                                <div className="item">
                                    <p className="item-addresss"><LocationOnOutlinedIcon /> <strong>Address</strong>: 11/A Ranglal Street, Khidirpur Kolkata, West Bengal - 700023</p>
                                    <p className="item-addresss"><HeadphonesOutlinedIcon /> <strong>Call Us:</strong> (+91) - 540-025-124553 </p>
                                    <p className="item-addresss"><EmailOutlinedIcon /> <strong>Email:</strong> sale@Nest.com</p>
                                    <p className="item-addresss"><WatchLaterOutlinedIcon /> <strong>Hours:</strong> 10:00 - 18:00, Mon - Sat</p>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className='row lastStrip'>
                            <div className='col-md-3 part_1'>
                                <p>© 2022, The Store India -
                                    All rights reserved</p>
                            </div>

                            <div className='part_2'>
                                <div>
                                    <div>
                                        <span><HeadphonesOutlinedIcon /></span>
                                        <div className='info ml-3'>
                                            <h3 className='text-g mb-0'>1900 - 888</h3>
                                            <p className='mb-0'>24/7 Support Center</p>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className='col-md-3 part3  part_3'>
                                <div className='d-flex align-items-center'>
                                    <h5>Follow Us</h5>
                                    <ul className='list list-inline'>
                                        <li className='list-inline-item'>
                                            <Link to={''}><FacebookOutlinedIcon /></Link>
                                        </li>
                                        <li className='list-inline-item'>
                                            <Link to={''}><TwitterIcon /></Link>
                                        </li>
                                        <li className='list-inline-item'>
                                            <Link to={''}><InstagramIcon /></Link>
                                        </li>
                                        <li className='list-inline-item'>
                                            <Link to={''}><YouTubeIcon /></Link>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </footer>
            </div>
        </>
    )
}

export default Footer;