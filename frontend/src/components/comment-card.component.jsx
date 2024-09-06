import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import { useContext, useState } from "react";
import { CommentField } from './index'
import { BlogContext } from "../pages/blog.page";
import axios from "axios";
import { UserContext } from "../App";

const CommentCard = ({ index, leftVal, commentData }) => {

    let { commented_by: { personal_info }, commentedAt, comment: commentText, _id, children } = commentData
    let { username: commented_by_username, profile_img } = personal_info;
    let { fetchedBlog, fetchedBlog: {comments, comments: { results: commentArr},author:{personal_info:{username:blog_author_username}} }, setFetchedBlog } = useContext(BlogContext)
    
    let {userAuth:{username:logged_in_username,access_token}}=useContext(UserContext)
    
    const [isReplying, setIsReplying] = useState(false)
    
    const removeCommentCard = (startingIndex) => {
        if (commentArr[startingIndex]) {

            while (commentArr[startingIndex].childrenLevel > commentData.childrenLevel) {
                commentArr.splice(startingIndex, 1)

                if (!commentArr[startingIndex]) {
                    break
                }
            }
        }

        setFetchedBlog({ ...fetchedBlog, comments: { results: commentArr } })

    }

    const HideReplies = () => {
        commentData.isReplyLoaded = false;
        removeCommentCard(index + 1)
    }

    const LoadReplies=async({skip=0})=>{

        if(children.length){
            HideReplies();
        }

        await axios.post(import.meta.env.VITE_SERVER_DOMAIN +"/blog/get-replies",{_id,skip},{
            withCredentials:true
        }).then(({data:{replies}})=>{


            commentData.isReplyLoaded=true;

            for(let i =0; i<replies.length;i++){
                replies[i].childrenLevel=commentData.childrenLevel+1
                commentArr.splice(index+1+i+skip,0,replies[i])
            }

            setFetchedBlog({...fetchedBlog,comments:{...comments,results:commentArr}})

        }).catch(err=>{
            console.log(err)
        })
    }


    const deleteComment=async(e)=>{

        e.target.setAttribute('disable',true)

        await axios.post(import.meta.env.VITE_SERVER_DOMAIN+"/blog/delete-comment",{_id},{
            withCredentials:true,
            headers:{
                "Authorization":`Bearer ${access_token}`
            }
        }).then(({res})=>{
            console.log(res)
        }).catch(err=>{
            console.log(err)
        })
    }

    return (
        <div
            className="w-full"
            style={{ paddingLeft: `${leftVal * 10}px` }}
        >
            <div className="my-5 p-6 rounded-md border border-grey">
                <div className="flex gap-3 items-center mb-8 ">
                    <img className="w-8 h-8 rounded-full object-cover" src={profile_img} alt="" />

                    <p className="line-clamp-1 text-dark-grey text-md">
                        @<Link to={`/user/${commented_by_username}`} className="text-md underline">{commented_by_username}</Link>
                    </p>
                    <p className="text-md min-w-fit">{getDay(commentedAt)}</p>
                </div>

                <p className="font-gelasio text-lg ml-3">{commentText}</p>

                <div className="flex gap-5 items-center mt-5">

                    {
                        commentData.isReplyLoaded ?
                            <button
                                className="text-md text-dark-grey hover:bg-grey/30 rounded-md flex gap-2 items-center p-2 px-3"
                                onClick={HideReplies}
                            >
                                <i className="fi fi-rs-comment-dots"></i>
                                Hide Reply
                            </button> :
                            <button
                                className="text-md text-dark-grey hover:bg-grey/30 rounded-md flex gap-2 items-center p-2 px-3"
                                onClick={LoadReplies }
                            >
                                <i className="fi fi-rs-comment-dots"></i>
                                {children.length} Reply

                            </button>
                    }
                    <button onClick={() => setIsReplying(prev => !prev)} className="underline text-md">
                        Reply
                    </button>

                    {
                        logged_in_username==commented_by_username || logged_in_username==blog_author_username?
                        <button 
                        className="p-2 px-3 rounded-md border border-grey ml-auto hover:text-red flex items-center"
                        onClick={deleteComment}
                        >
                            <i className="fi fi-rr-trash pointer-events-none"></i>
                        </button>:""
                    }
                </div>


                {
                    isReplying ?
                        <div className="mt-8">
                            <CommentField action="Reply" index={index} replyingTo={_id} setReplying={setIsReplying} />
                        </div> : ""
                }

            </div>

        </div>

    )

}

export default CommentCard;