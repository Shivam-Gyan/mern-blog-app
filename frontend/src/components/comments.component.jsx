import { useContext } from "react"
import { BlogContext } from "../pages/blog.page"
import CommentField from "./comment-field.component"


const CommentConatiner=()=>{

    let {fetchedBlog:{title},commentWrapper,setCommentWrapper,parentCommentLoad,setParentCommentLoad}=useContext(BlogContext)

    return(
        <div className={`max-sm:w-full fixed ${commentWrapper?"top-0 sm:right-0":"top-[100%] sm:right-[-100%]"} max-sm:right-0 sm:top-0 duration-700 w-[30%] min-w-[350px] h-full bg-white z-50 p-8 px-16 overflow-y-auto overflow-x-hidden shadow-2xl`}>

        <div className="relative">

            <h1 className="text-2xl font-medium">Comments</h1>
            <p className="text-lg w-[90%] line-clamp-2 text-dark-grey mt-4">{title}</p>
            <button 
            onClick={()=>setCommentWrapper(prev=>!prev)}
            className="absolute right-0 top-0 w-10 h-10 bg-grey rounded-full flex items-center justify-center "><i className="fi fi-br-cross mt-1"></i></button>

        </div>
        <hr  className="my-8 w-[120%] border-1 border-grey -ml-10"/>
        <CommentField  />




        </div>
    )
}

export default CommentConatiner;