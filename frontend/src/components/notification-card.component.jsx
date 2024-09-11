import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import { useContext, useState } from "react";
import NotificationCommentField from "./notification-comment-field.component";
import { UserContext } from "../App";
import axios from "axios";
import { toast } from "react-hot-toast";


const NotificationCard = ({ data, index, notificationState }) => {

    const [isReplying, setIsReplying] = useState(false)

    let { blog: { _id, blog_id, title }, user, user: { personal_info: { profile_img, username } },seen, type, reply, replied_on_comment, comment, createdAt, _id: notification_id } = data

    let { userAuth: { profile_img: author_profile_img, username: author_username, access_token } } = useContext(UserContext)

    let {notifications,notifications:{results,totalDocs},setNotifications}=notificationState


    const handleReply = () => {
        setIsReplying(prev => !prev)
    }


    const handleDelete = async (comment_id, type, target) => {

        target.setAttribute("disabled", true)


        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/comment/delete-comment", {
            _id:comment_id
        }, {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        }).then(({data:{message}})=>{
            if(type=='comment'){
                results.splice(index,1)
            }else{
                delete results[index].reply
            }
            toast.success(message)
            target.removeAttribute("disabled")
            
            setNotifications({...notifications,results,totalDocs:totalDocs-1,deletedDocCount:notifications.deletedDocCount+1})
            
            
        }).catch(({response:{data}})=>{
            toast.error(data.message)
            target.removeAttribute("disabled")

        })

    }

    return (
        <>
            <div className= {`p-6 border-b  border-grey ${!seen?"border-l-black border-l-2":""}`}>
                <div className="flex gap-5 mb-3">
                    <img src={profile_img} alt="" className="flex-none w-12 h-12 rounded-full object-cover" />

                    <div className="w-full">
                        <h1 className=" line-clamp-1">
                            <Link to={`/user/${username}`} className="">
                                @<span className="underline mr-2 text-black ">{username}</span></Link>
                            <span className=" ml-2 font-normal text-dark-grey text-sm">
                                {
                                    type == 'like' ? "liked your blog" :
                                        type == 'comment' ? "commented on" : "replied on"
                                }
                            </span>
                        </h1>
                        {
                            type == 'reply' ?
                                <div className="p-4 mt-3  rounded-md bg-grey">
                                    <p >{replied_on_comment.comment}</p>
                                </div> :
                                <div className="p-4 mt-3 rounded-md bg-grey">
                                    <Link
                                        to={`/blog/${blog_id}`}
                                        className="text-dark-grey cursor-pointer hover:underline line-clamp-1 font-medium"

                                    >"{title}"</Link>
                                </div>
                        }
                    </div>
                </div>

                {
                    type != "like" ?
                        <p className="ml-14 p-2 flex items-center bg-grey/20 text-black pl-5 my-2 text-lg">
                            {
                                type == 'comment' ? <span className="inline-block mr-4 ">Comment </span>
                                    : <span className="inline-block mr-4 ">Reply </span>
                            }<span className="line-clamp-2 md:line-clamp-1">"{comment.comment}"</span>
                        </p> : ""
                }

                <div className="ml-14 mt-3 pl-5 text-dark-grey flex items-center gap-8">
                    <p className="">{getDay(createdAt)}</p>

                    {
                        type != 'like' ?
                            <>
                                {
                                    !reply ? <button onClick={handleReply} className="underline hover:text-black">Reply</button> : ""

                                }
                                <button onClick={(e) => handleDelete(comment._id, "comment", e.target)} className="underline hover:text-black">delete</button>
                            </> : ''
                    }
                </div>

                {
                    isReplying ?
                        <div className="mt-8">
                            <NotificationCommentField _id={_id}
                                blog_author={user}
                                index={index}
                                replyingTo={comment._id}
                                setReplying={setIsReplying}
                                notification_id={notification_id}
                                notification_data={notificationState} />
                        </div> : ""
                }

                {
                    reply ?
                        <div className="ml-20 p-5 mt-3 bg-grey rounded-md ">
                            <div className="flex gap-2  mb-3">
                                <img src={author_profile_img} className="w-8 h-8 rounded-full object-cover" alt="" />
                                <div>
                                    <Link to={`/user/${author_username}`} className="mx-1">
                                        @ <span className="underline hover:text-black ">{author_username}</span>
                                    </Link>
                                </div>

                                <span className=" text-dark-grey text-sm ">Replied to </span>
                            </div>
                            <h1 className=" ml-10 mt-3">
                                "{reply.comment}"
                            </h1>

                            <button
                                onClick={(e) => handleDelete(reply._id, "reply", e.target)}
                                className="underline hover:text-black ml-10 mt-4">delete</button>
                        </div> : ""
                }

            </div>
        </>
    )
}

export default NotificationCard;