import { useContext, useEffect } from "react";
import { BlogContext } from "../pages/blog.page";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";


const BlogInteraction = () => {


    let {
        fetchedBlog,
        fetchedBlog:
        {
            _id,
            title,
            blog_id,
            activity: { total_likes, total_parent_comments },
            activity,
            author: {
                personal_info: {
                    username: author_username
                }
            }
        }, setFetchedBlog, isLikedByUser, setIsLikedByUser, setCommentWrapper
    } = useContext(BlogContext);

    const { userAuth: { username, access_token } } = useContext(UserContext)

    const handleLikeFun = async () => {

        if (!access_token) {
            return toast.error("In order to like please login")
        }


        setIsLikedByUser(prev => !prev)

        !isLikedByUser ? total_likes++ : total_likes--
        setFetchedBlog({ ...fetchedBlog, activity: { ...activity, total_likes } })

        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/blog/like-blog", { _id, isLikedByUser },
            {
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${access_token}`
                }
            }).then(({ data }) => {
                setIsLikedByUser(data.liked_by_user)
            }).catch((err) => {
                console.log(err.message)
            })
    }

    async function checkUserLiked() {
        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/blog/isliked-by-user', { _id }, {
            withCredentials: true,
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        }).then(({ data: { result } }) => {
            setIsLikedByUser(result)
        }).catch((err) => {
            console.log(err.message)
        })
    }

    useEffect(() => {

        if (access_token) {
            checkUserLiked()
        }

        reset()

    }, [access_token])

    const reset = () => {
        setIsLikedByUser(false)

    }

    return (
        <>
            <Toaster />
            <hr className="border-grey my-2" />

            <div className="flex gap-6 justify-between">
                <div className="flex gap-3 items-center">
                    <button
                        onClick={handleLikeFun}
                        className={` w-10 h-10 rounded-full flex items-center justify-center ${isLikedByUser ? "text-red bg-red/20" : "bg-grey/80"} `}
                    >
                        <i className={`fi ${isLikedByUser ? "fi-sr-heart" : "fi-rr-heart"}`}></i>
                    </button>
                    <p className="text-xl text-dark-grey">{total_likes}</p>


                    <button
                        onClick={() => {
                            setCommentWrapper(prev => !prev)
                        }}
                        className=" w-10 h-10 rounded-full flex items-center justify-center bg-grey/80"
                    >
                        <i className="fi fi-rs-comment"></i>
                    </button>
                    <p className="text-xl text-dark-grey">{total_parent_comments}</p>
                </div>

                <div className="flex gap-6 items-center ">

                    {
                        username == author_username ?
                            <Link to={`/editor/${blog_id}`} className="underline hover:text-purple">Edit</Link> : ""
                    }
                    <Link
                        to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}
                    ><i className="fi fi-brands-twitter text-xl hover:text-twitter"></i></Link>
                </div>
            </div>

            <hr className="border-grey my-2" />
        </>
    )
}

export default BlogInteraction;