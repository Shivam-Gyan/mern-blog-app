import { Link } from "react-router-dom"
import { deleteBlog } from "../pages/manage-blogs.page"
import { useContext } from "react"
import { UserContext } from "../App"


const ManageDraftBlogCard = ({ blog}) => {

    const { title, des, blog_id,index } = blog

    const {userAuth:{access_token}}=useContext(UserContext)

    

   const handleDelete=(e)=>{
    deleteBlog(blog,access_token,e.target)
    }

    return (

        <div className="flex gap-5 lg:gap-10 pb-6 border-b mb-5 border-grey">

            <h1 className="blog-index text-center pl-4 md:pl-6 flex-none ">{index < 10 ? "0" + (index+1) : (index+1)}</h1>
            <div>
                <h1 className="blog-title mb-3">{title}</h1>
                <p className="line-clamp-2 font-gelasio">{des.length ? des : "No Description"}</p>

                <div className="flex items-center gap-6 mt-3">
                    <Link to={`/editor/${blog_id}`} className=" bg-grey px-4 py-1 hover:bg-dark-grey/10 rounded-md">
                        Edit
                    </Link>

                    <button onClick={handleDelete} className="border-grey p-1 px-2 rounded-md bg-grey">
                        <i className="fi fi-rr-trash pointer-events-none"></i>
                    </button>
                </div>
            </div>

        </div>
    )
}

export default ManageDraftBlogCard