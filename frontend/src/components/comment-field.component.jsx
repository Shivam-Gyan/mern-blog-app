import { useContext, useState } from "react";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BlogContext } from "../pages/blog.page";


const CommentField = ({ action = "comment" }) => {

    const [comment, setComment] = useState("")
    const navigate = useNavigate()

    let { userAuth: { access_token } } = useContext(UserContext);
    let { fetchedBlog: { _id, author, author: { _id: blog_author } } } = useContext(BlogContext)

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
        console.log(author)

        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/blog/create-comment", { _id, comment, blog_author }, {
            withCredentials: true,
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        }).then(({ data }) => {
            console.log(data)
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

            <button onClick={handleAction} className="btn-dark mt-5 px-10">{action}</button>
        </div>
    )
}

export default CommentField;