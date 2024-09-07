import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import { useContext, useState } from "react";
import { CommentField } from './index'
import { BlogContext } from "../pages/blog.page";
import axios from "axios";
import { UserContext } from "../App";
import { toast } from "react-hot-toast";

const CommentCard = ({ index, leftVal, commentData }) => {

    let { commented_by: { personal_info }, commentedAt, comment: commentText, _id, children } = commentData
    let { username: commented_by_username, profile_img } = personal_info;
    let { fetchedBlog, fetchedBlog: { activity, activity: { total_parent_comments }, comments, comments: { results: commentArr }, author: { personal_info: { username: blog_author_username } } }, setFetchedBlog, setParentCommentLoad } = useContext(BlogContext)

    let { userAuth: { username: logged_in_username, access_token } } = useContext(UserContext)

    const [isReplying, setIsReplying] = useState(false)

    const getParentIndex = () => {
        let startingPoint = index - 1;

        try {
            while (commentArr[startingPoint].childrenLevel >= commentData.childrenLevel) {
                startingPoint--;
            }

        } catch {
            startingPoint = undefined
        }

        return startingPoint;
    }

    const removeCommentCard = (startingIndex, isDelete = false) => {
        if (commentArr[startingIndex]) {

            while (commentArr[startingIndex].childrenLevel > commentData.childrenLevel) {
                commentArr.splice(startingIndex, 1)

                if (!commentArr[startingIndex]) {
                    break
                }
            }
        }

        if (isDelete) {
            let parentIndex = getParentIndex();

            if (parentIndex != undefined) {

                // if the parentIndex is not undefined the this is reply of comment 
                // thus we have to filter out the this reply from commetArr children and 
                // store the rest of reply into commentArr 
                commentArr[parentIndex].children = commentArr[parentIndex].children.filter(child => child != _id)

                // if deleted reply is last reply then set the isReplyLoaded=false due to no reply is there

                if (!commentArr[parentIndex].children.length) {
                    commentArr[parentIndex].isReplyLoaded = false
                }
            }

            // spice use to remove the index from commentArr if parentIndex is undefined
            commentArr.splice(index, 1)
        }

        // if comment is parent comment the we have to update the total_parent_comments in activity of fetchedBlog
        // using setParentCommentLoad() which set the no. of parent comment
        if (commentData.childrenLevel == 0 && isDelete) {
            setParentCommentLoad(prev => prev - 1)
        }

        setFetchedBlog({ ...fetchedBlog, comments: { results: commentArr }, activity: { ...activity, total_parent_comments: total_parent_comments - (commentData.childrenLevel == 0 && isDelete ? 1 : 0) } })

    }

    const HideReplies = () => {
        commentData.isReplyLoaded = false;
        removeCommentCard(index + 1)
    }

    const LoadReplies = async ({ skip = 0, currentIndex = index }) => {

        if (commentArr[currentIndex].children.length) {
            HideReplies();

            await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/comment/get-replies", { _id: commentArr[currentIndex]._id, skip }, {
                withCredentials: true
            }).then(({ data: { replies } }) => {

                commentArr[currentIndex].isReplyLoaded = true;

                for (let i = 0; i < replies.length; i++) {
                    replies[i].childrenLevel = commentArr[currentIndex].childrenLevel + 1
                    commentArr.splice((currentIndex + 1 + i + skip), 0, replies[i])
                }

                setFetchedBlog({ ...fetchedBlog, comments: { ...comments, results: commentArr } })

            }).catch(err => {
                console.log(err)
            })
        }
    }


    const deleteComment = async (e) => {

        e.target.setAttribute('disable', true)

        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/comment/delete-comment", { _id }, {
            withCredentials: true,
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        }).then(({ data }) => {

            e.target.removeAttribute("disable")
            removeCommentCard(index + 1, true)
            toast.success(data.message)

        }).catch((err) => {
            // toast.error(`(success - ${success})  `+message)
            console.log(err)
        })
    }

    const LoadMoreReplies = () => {
        let parentIndex = getParentIndex()

        let button = <button onClick={() => {
            LoadReplies({ skip: index - parentIndex, currentIndex: parentIndex })
        }} className="p-2 px-3 text-dark-grey hover:bg-grey/30 flex items-center gap-2 rounded-md">Load More Replies</button>

        if (commentArr[index + 1]) {
            if (commentArr[index + 1].childrenLevel < commentArr[index].childrenLevel) {

                if ((index - parentIndex) < commentArr[parentIndex].children.length) {
                    return button;
                }
            }

        } else {
            if (parentIndex) {
                if ((index - parentIndex) < commentArr[parentIndex].children.length) {
                    return button;
                }
            }
        }

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
                                onClick={LoadReplies}
                            >
                                <i className="fi fi-rs-comment-dots"></i>
                                {children.length} Reply

                            </button>
                    }
                    <button onClick={() => setIsReplying(prev => !prev)} className="underline text-md">
                        Reply
                    </button>

                    {
                        logged_in_username == commented_by_username || logged_in_username == blog_author_username ?
                            <button
                                className="p-2 px-3 rounded-md border border-grey ml-auto hover:text-red flex items-center"
                                onClick={deleteComment}
                            >
                                <i className="fi fi-rr-trash pointer-events-none"></i>
                            </button> : ""
                    }
                </div>


                {
                    isReplying ?
                        <div className="mt-8">
                            <CommentField action="Reply" index={index} replyingTo={_id} setReplying={setIsReplying} />
                        </div> : ""
                }

            </div>
            <LoadMoreReplies />

        </div>

    )

}

export default CommentCard;