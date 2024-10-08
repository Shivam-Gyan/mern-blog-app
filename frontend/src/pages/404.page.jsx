
import { Link } from 'react-router-dom';
import pageNotFoundImage from '../imgs/404.png'
import logo from '../imgs/logo.png'


const PageNotFound = () => {


    return (
        <section
            className="h-cover relative p-10 flex flex-col items-center gap-20 text-center"
        >

            <img src={pageNotFoundImage} alt="" className=' w-72 select-none border-2 border-grey aspect-square object-cover' />

            <h1 className=' capitalize text-4xl font-gelasio leading-7'>Page not found</h1>
            <p className='text-dark-grey text-xl leading-5'>The page are you looking for does not exists. Head back to <Link to={'/'} className=' text-black text-xl font-medium underline'>home page</Link> </p>


            {/* full logo of website */}
            <div className=' mt-auto '>
                <div className='flex gap-1 items-center justify-center h-12 '>
                    <img src={logo} alt="" className='h-12 w-12 aspect-square  object-contain' />
                    <p className='text-black font-semibold font-sans mt-1 text-2xl'>Feather Fables</p>
                </div>

                <p className='text-dark-grey mt-3'>Read millions of stories around the world</p>

            </div>


        </section>
    )
}

export default PageNotFound;