import { useContext } from "react"
import { BlogContext } from "../pages/blog.page"
// import CommentField from "./comment-field.component"
import axios from "axios"
// import NoDataMessage from "./nodata.component"
import { CommentCard, CommentField, NoDataMessage } from './index'
import { AnimationWrapper } from "../common"


export const fetchComment = async ({ skip = 0, blog_id, setParentCommentCountFun, comment_array = null }) => {
    let res;
    await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/blog/get-blog-comments", { blog_id, skip }, {
        withCredentials: true
    }).then(({ data }) => {

        data.map(comment => {
            comment.childrenLevel = 0
        })

        setParentCommentCountFun(value => value + data.length)

        if (comment_array == null) {
            res = { results: data }
        } else {
            res = { results: [...comment_array,...data] }
        }

    })
    return res;
}

const CommentConatiner = () => {

    let {fetchedBlog, fetchedBlog: { _id, title, comments: { results: comments_array }, activity: { total_parent_comments } }, commentWrapper, setCommentWrapper, parentCommentLoad, setParentCommentLoad,setFetchedBlog } = useContext(BlogContext)


    const handleLoadMore = async () => {
        let newCommentArr = await fetchComment({
            skip: parentCommentLoad,
            blog_id: _id,
            setParentCommentCountFun: setParentCommentLoad,
            comment_array: comments_array
        })

        setFetchedBlog({ ...fetchedBlog, comments: newCommentArr })

    }

    return (
        <div className={`max-sm:w-full fixed ${commentWrapper ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]"} max-sm:right-0 sm:top-0 duration-700 w-[30%] min-w-[350px] h-full bg-white z-50 p-8 px-16 overflow-y-auto overflow-x-hidden shadow-2xl`}>

            <div className="relative">

                <h1 className="text-2xl font-medium">Comments</h1>
                <p className="text-lg w-[90%] line-clamp-2 text-dark-grey mt-4">{title}</p>
                <button
                    onClick={() => setCommentWrapper(prev => !prev)}
                    className="absolute right-0 top-0 w-10 h-10 bg-grey rounded-full flex items-center justify-center "><i className="fi fi-br-cross mt-1"></i></button>

            </div>
            <hr className="my-8 w-[120%] border-1 border-grey -ml-10" />
            <CommentField />

            {
                comments_array && comments_array.length ?
                    comments_array.map((comment, i) => {
                        return <AnimationWrapper key={i}>
                            <CommentCard index={i} leftVal={comment.childrenLevel * 4} commentData={comment} />
                        </AnimationWrapper>
                    })
                    : <NoDataMessage message={"no comment yet"} />
            }

            {
                total_parent_comments > parentCommentLoad ?
                    <button

                        onClick={handleLoadMore}

                        className="text-dark-grey p-2 px-3 hover:bg-grey-30 rounded-md flex items-center gap-2">
                        Load More
                    </button> : ""
            }




        </div>
    )
}

export default CommentConatiner;