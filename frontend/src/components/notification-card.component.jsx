import { Link } from "react-router-dom";
import { getDay } from "../common/date";


const NotificationCard = ({ data, index, notificationState }) => {

    let { blog: { blog_id, title }, user: { personal_info: { profile_img, username } }, type, replied_on_comment, comment,createdAt } = data

    return (
        <>
            <div className="p-6 border-b border-grey border-l-black">
                <div className="flex gap-5 mb-3">
                    <img src={profile_img} alt="" className="flex-none w-12 h-12 rounded-full object-cover" />

                    <div className="w-full">
                        <h1 className=" line-clamp-1">
                            <Link to={`/user/${username}`} className="">
                                @<span className="underline mr-2 text-black ">{username}</span></Link>
                            <span className="font-normal text-md">
                                {
                                    type == 'like' ? "liked your blog" :
                                        type == 'comment' ? "commented on" : "replied on"
                                }
                            </span>
                        </h1>
                        {
                            type == 'reply' ?
                                <div className="p-4 mt-3 border-r-[1px] border-r-black rounded-l-md bg-grey">
                                    <p >{replied_on_comment.comment}</p>
                                </div> :
                                <div className="p-4 mt-3 border-r-[1px] border-r-black rounded-l-md bg-grey">
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
                        type!='like'?
                        <>
                            <button  className="underline hover:text-black">Reply</button>
                            <button  className="underline hover:text-black">Delete</button>
                        </>:''
                    }
                </div>

            </div>
        </>
    )
}

export default NotificationCard;