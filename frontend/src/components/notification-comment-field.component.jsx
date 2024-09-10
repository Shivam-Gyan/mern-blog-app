import { useContext, useState } from "react";

import {UserContext} from '../App'
import axios from "axios";
import {toast} from "react-hot-toast";
import NoDataMessage from "./nodata.component";



const NotificationCommentField=({_id,blog_author,index=undefined,replyingTo=undefined,setReplying,notification_id,notification_data})=>{

    const [comment,setComment]=useState('')

    let {_id:user_id}=blog_author

    let {userAuth:{access_token}}=useContext(UserContext);

    // in this notification all the data which is fetched notification from server stored it has {page,results(array of data),totalDoc}
    let {notifications,notifications:{results},setNotifications}=notification_data

    // console.log({
    //     message:"notfication inntial data",
    //     notifications
    // })

    const handleAction = async () => {


        if (!access_token) {
           return toast.error("redirecting to login page")
        }
        if (!comment.length) {
            return toast.error("Write something to leave comment...")
        }


        let loading=toast.loading("replying...")
        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/comment/create-comment", { _id, comment, blog_author:user_id,replying_to:replyingTo,notification_id }, {
            withCredentials: true,
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        }).then(({ data }) => {
            toast.dismiss(loading)
            setReplying(false)
            toast.success("replied ")
            results[index].reply={comment,_id:data._id}
            setNotifications({...notifications,results})


        }).catch(({response:{data:{message}}}) => {
            toast.dismiss(loading)
            setReplying(false)
            toast.error(message)
        })
    }

    return (
        <div>
            <textarea
                value={comment}

                onChange={(e) => {
                    setComment(e.target.value)
                }}

                placeholder="Leave a comment..."
                className="input-box placeholder:text-dark-grey pl-6 resize-none h-[150px] overflow-auto"
            ></textarea>

            <button onClick={handleAction} className="btn-dark py-2 mt-5 px-8 text-lg">Reply</button>
        </div>
    )

}

export default NotificationCommentField;