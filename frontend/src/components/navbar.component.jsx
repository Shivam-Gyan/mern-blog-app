import React from 'react'
import logo from '../imgs/logo.png'
import { Link } from 'react-router-dom'
const Navbar = () => {
    return (
        <nav className='navbar'>

            <Link to={'/'} className='flex-none w-10'>
                <img className='w-full' src={logo} alt="" />
            </Link>

            <div className=' absolute w-full left-0 py-4 px-[5vw] top-full mt-0.5 border-b border-grey '>
                <input 
                type="text"
                placeholder='Search'
                className='w-full bg-grey md:w-auto p-3 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey' />

                <i className='fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey'></i>
            </div>
        </nav>
    )
}

export default Navbar