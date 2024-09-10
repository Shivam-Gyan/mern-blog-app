import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import { useContext, useState } from "react";
import NotificationCommentField from "./notification-comment-field.component";
import { UserContext } from "../App";


const NotificationCard = ({ data, index, notificationState }) => {

    const [isReplying, setIsReplying] = useState(false)

    let { blog: { _id, blog_id, title }, user, user: { personal_info: { profile_img, username } }, type,reply, replied_on_comment, comment, createdAt, _id: notification_id } = data

    let{ userAuth:{profile_img:author_profile_img,username:author_username,access_token}}=useContext(UserContext)


    const handleReply = () => {
        setIsReplying(prev => !prev)
    }

    return (
        <>
            <div className="p-6 border-b border-grey ">
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
                                <div className="p-4 mt-3 border-r-[2px] border-r-black rounded-l-md bg-grey">
                                    <p >{replied_on_comment.comment}</p>
                                </div> :
                                <div className="p-4 mt-3 border-r-[2px] border-r-black rounded-l-md bg-grey">
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
                                <button onClick={handleReply} className="underline hover:text-black">Reply</button>
                                <button className="underline hover:text-black">Delete</button>
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
                    reply?
                    <div className="ml-20 p-5 mt-3 bg-grey border-r-[2px] border-r-black rounded-l-md ">
                        <div className="flex gap-2  mb-3">
                            <img src={author_profile_img} className="w-8 h-8 rounded-full object-cover" alt="" />
                            <div>
                                <Link to={`/user/${author_username}`} className="mx-1">
                                @ <span className="underline hover:text-black ">{author_username}</span>
                                </Link>
                            </div>

                            <span className=" text-dark-grey text-sm ">Replied to </span>
                        </div>
                        <h1 className=" ml-2 mt-3">
                            "{reply.comment}"
                        </h1>
                    </div>:""
                }

            </div>
        </>
    )
}

export default NotificationCard;