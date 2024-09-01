
import { Link } from 'react-router-dom';
import pageNotFoundImage from '../imgs/404.png'


const PageNotFound=()=>{


    return(
<section
 className="h-cover relative p-10 flex flex-col items-center gap-20 text-center"
>

    <img src={pageNotFoundImage} alt="" className=' w-72 select-none border-2 border-grey aspect-square object-cover' />

    <h1 className=' capitalize text-4xl font-gelasio leading-7'>Page not found</h1>
    <p className='text-dark-grey text-xl leading-7'>The page are you looking for does not exists. Head back to <Link to={'/'} className=' text-black text-xl font-medium underline'>home page</Link> </p>


</section>
    )
}

export default PageNotFound;