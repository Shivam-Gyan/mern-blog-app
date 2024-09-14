import React, { useContext, useEffect, useState } from 'react'
import logo from '../imgs/logo.png'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { UserNavigationPanel } from '../components'
import { UserContext } from '../App';
import axios from 'axios';


const Navbar = () => {

    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
    const [navPanel, setNavPanel] = useState(false)
    const navigate = useNavigate()
    const { userAuth, userAuth: { access_token, profile_img, new_notification }, setUserAuth } = useContext(UserContext);


    const handleSearch = (e) => {
        let query = e.target.value;

        if (e.keyCode == 13 && query.length) {
            setSearchBoxVisibility(false)
            navigate(`/search/${query}`);
        }
    }

    async function fetchNewNotification() {

        await axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/user/new-notification", {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        }).then(({ data }) => {
            setUserAuth({ ...userAuth, ...data })
        }).catch(({ response: { data: { message } } }) => {
            console.log(message)
        })
    }

    useEffect(() => {
        if (access_token) {
            fetchNewNotification();
        }
    }, [access_token])

    return (
        <>
            <nav className='navbar z-50'>

                <Link to={'/'} className='flex-none w-10'>
                    <img className='w-full' src={logo} alt="" />
                </Link>

                <div
                    className={`absolute w-full md:w-auto  left-0 py-4 px-[5vw] top-full mt-0.5 border-b border-grey md:border-0  md:block md:relative md:inset-0 md:p-0 md:show ${searchBoxVisibility ? 'show' : 'hide'}`}
                >
                    <input
                        type="text"
                        onKeyDown={handleSearch}
                        onBlur={() => {
                            setSearchBoxVisibility(false)
                        }}
                        placeholder='Search'
                        className='w-full  bg-grey md:w-auto p-3 md:pl-12  pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey' />

                    <i className='fi fi-rr-search absolute  right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey'></i>
                </div>


                <div className='flex items-center gap-3 md:gap-6 ml-auto'>
                    <button
                        onClick={() => setSearchBoxVisibility(prev => !prev)}
                        className={`md:hidden w-12 h-12 rounded-full bg-grey flex items-center justify-center `}
                    >
                        <i className='fi fi-rr-search text-xl '></i>
                    </button>

                    <Link to={'/editor'} className='hidden md:flex gap-2 link'>
                        <i className='fi fi-rr-file-edit'></i>
                        <p>Write</p>
                    </Link>


                    {/* conditional rendering of signin and profile */}

                    {
                        access_token ?
                            <>
                                <Link to={"/dashboard/notifications"}>
                                    <button className=' w-12 h-12 rounded-full bg-grey relative hover:bg-black/10'>
                                        <i className='fi fi-rr-bell text-xl block mt-1'></i>
                                        {new_notification ? <span className='absolute w-[10px] h-[10px] bg-red rounded-full top-2 right-2'></span> : ""}
                                    </button>
                                </Link>

                                <div
                                    className='relative'
                                    onClick={() => setNavPanel(prev => !prev)}
                                    onBlur={() => {
                                        setTimeout(() => {
                                            setNavPanel(false)
                                        }, 200)
                                    }}
                                >
                                    <button className='w-12 h-12 mt-1 ' >
                                        <img src={profile_img} alt="" className='w-full h-full object-cover rounded-full' />
                                    </button>

                                    {navPanel ?
                                        <UserNavigationPanel /> : ""
                                    }

                                </div>

                            </> :

                            <>
                                <Link to={'/signin'} className='btn-dark py-2 '>
                                    Sign In
                                </Link>
                                <Link to={'/signup'} className='btn-light py-2 hidden md:block'>
                                    Sign Up
                                </Link>
                            </>
                    }


                </div>
            </nav>

            <Outlet />

        </>
    )
}

export default Navbar