import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import { useState } from "react";
import {CommentField} from './index'

const CommentCard = ({ index, leftVal, comment }) => {

    let { commented_by: { personal_info },commentedAt,comment:commentText} = comment
    let { username: author_username, fullname, profile_img } = personal_info;

    const [isReplying,setIsReplying]=useState(false)

    return (
        <div
            className="w-full"
            style={{ paddingLeft: `${leftVal * 10}px` }}
        >
            <div className="my-5 p-6 rounded-md border border-grey">
                <div className="flex gap-3 items-center mb-8 ">
                    <img className="w-8 h-8 rounded-full object-cover" src={profile_img} alt="" />

                    <p className="line-clamp-1 text-dark-grey text-md">
                        @<Link to={`/user/${author_username}`} className="text-md underline">{author_username}</Link>
                    </p>
                    <p className="text-md min-w-fit">{getDay(commentedAt)}</p>
                </div>

                <p className="font-gelasio text-lg ml-3">{commentText}</p>
                <div className="flex items-center mt-5">
                    <button onClick={()=>setIsReplying(prev=>!prev)} className="underline text-md"> 
                        Reply
                    </button>
                </div>
                {
                    isReplying?
                    <div className="mt-8">
                        <CommentField action="Reply" />
                    </div>:""
                }

            </div>

        </div>

    )

}

export default CommentCard;