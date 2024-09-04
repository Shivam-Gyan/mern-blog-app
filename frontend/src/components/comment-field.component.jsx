import { useContext, useState } from "react";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BlogContext } from "../pages/blog.page";


const CommentField = ({ action = "comment" }) => {

    const [comment, setComment] = useState("")
    const navigate = useNavigate()

    let { userAuth: { access_token,fullname,profile_img,username } } = useContext(UserContext);
    let {fetchedBlog, fetchedBlog: { _id,activity,activity:{total_comments,total_parent_comments}, author,comments,comments:{results:commentsArr}, author: { _id: blog_author } } ,setFetchedBlog,setParentCommentLoad} = useContext(BlogContext)

    const handleAction = async () => {
        if (!access_token) {
            toast.error("redirecting to login page")
            setTimeout(() => {
                navigate('/signin')
            }, 1000)
        }
        if (!comment.length) {
            return toast.error("Write something to leave comment...")
        }

        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/blog/create-comment", { _id, comment, blog_author }, {
            withCredentials: true,
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        }).then(({ data }) => {

            setComment("")
            data.commented_by={personal_info:{username,fullname,profile_img}};


            let newCommentArray;

            data.childrenLevel=0;
            
            // appending the new data with previous comments arr
            newCommentArray=[data,...commentsArr]

            let parentCommentIncrementVal=1;

            setFetchedBlog({...fetchedBlog,comments:{...comments,results:newCommentArray},activity:{...activity,total_comments:total_comments +1,total_parent_comments:total_parent_comments+parentCommentIncrementVal}})

            setParentCommentLoad(prev=>prev+1)
            

        }).catch(err => {
            console.log(err.message)
        })
    }

    return (
        <div>
            <Toaster />
            <textarea
                value={comment}

                onChange={(e) => {
                    setComment(e.target.value)
                }}

                placeholder="Leave a comment..."
                className="input-box placeholder:text-dark-grey pl-6 resize-none h-[150px] overflow-auto"
            ></textarea>

            <button onClick={handleAction} className="btn-dark py-2 mt-5 px-8 text-lg">{action}</button>
        </div>
    )
}

export default CommentField;