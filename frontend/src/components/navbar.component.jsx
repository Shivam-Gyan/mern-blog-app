import React, { useState } from 'react'
import logo from '../imgs/logo.png'
import { Link } from 'react-router-dom'
const Navbar = () => {

    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);

    return (
        <nav className='navbar'>

            <Link to={'/'} className='flex-none w-10'>
                <img className='w-full' src={logo} alt="" />
            </Link>

            <div className={`absolute w-full md:w-auto  left-0 py-4 px-[5vw] top-full mt-0.5 border-b border-grey md:border-0  md:block md:relative md:inset-0 md:p-0 md:show ${searchBoxVisibility ? 'show' : 'hide'}`}>
                <input
                    type="text"
                    placeholder='Search'
                    className='w-full  bg-grey md:w-auto p-3 md:pl-12  pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey' />

                <i className='fi fi-rr-search absolute  right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey'></i>
            </div>


            <div className='flex items-center gap-3 md:gap-6 ml-auto'>
                <button onClick={() => setSearchBoxVisibility(prev => !prev)} className={`md:hidden w-12 h-12 rounded-full bg-grey flex items-center justify-center `}>
                    <i className='fi fi-rr-search text-xl '></i>
                </button>

                <Link className='hidden md:flex gap-2 link'>
                    <i className='fi fi-rr-file-edit'></i>
                    <p>Write</p>
                </Link>

                <Link to={'/signin'} className='btn-dark py-2 '>
                Sign In 
                </Link>
                <Link to={'/signup'} className='btn-light py-2 hidden md:block'>
                Sign Up 
                </Link>
            </div>
        </nav>
    )
}

export default Navbar