
import { createContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { AnimationWrapper } from '../common'
import Loader from '../components/loader.component'
import { getDay } from '../common/date'
import { BlogContent, BlogInteraction, BlogPostCard, CommentConatiner } from '../components'
import { fetchComment } from '../components/comments.component'

export const blogDataStructure = {
    title: "",
    banner: "",
    des: "",
    content: [],
    author: { personal_info: {} },
    publishedAt: ""
}

export const BlogContext = createContext({});

const BlogPage = () => {

    let { blog_id } = useParams()

    const [fetchedBlog, setFetchedBlog] = useState(blogDataStructure)
    const [similarBlog, setSimilarBlog] = useState(null)

    const [loading, setLoading] = useState(true);
    const [isLikedByUser, setIsLikedByUser] = useState(false)
    const [commentWrapper, setCommentWrapper] = useState(false)
    const [parentCommentLoad, setParentCommentLoad] = useState(0)

    let { title, banner, tags, des, content, author: { personal_info: { fullname, username: author_username, profile_img } }, publishedAt } = fetchedBlog

    const fetchBlogByBlogId = async () => {
        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/blog/get-blog', { blog_id })
            .then(async ({ data }) => {

                data.comments = await fetchComment({ blog_id: data._id, setParentCommentCountFun: setParentCommentLoad })

                setFetchedBlog(data)
                await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/blog/search-blogs", {
                    tag: data.tags[0], limit: 5, eliminate_blog: blog_id
                })
                    .then(({ data }) => {
                        setSimilarBlog(data.blogs)
                    })
                setLoading(false)
            }).catch((err) => {
                console.log(err.message)
                setLoading(false)
            })
    }

    useEffect(() => {
        reset()
        fetchBlogByBlogId();

    }, [blog_id])

    const reset = () => {
        setFetchedBlog(blogDataStructure)
        setSimilarBlog(null)
        setLoading(true)
    }

    return (
        <AnimationWrapper>
            {
                loading ?
                    <Loader /> :
                    <BlogContext.Provider value={{ fetchedBlog, setFetchedBlog, isLikedByUser, setIsLikedByUser, commentWrapper, setCommentWrapper, parentCommentLoad, setParentCommentLoad }}>

                        <CommentConatiner />
                        <div
                            className='max-w-[900px] center py-10 max-lg:px-[5vw]'
                        >
                            <img src={banner} alt="" className='aspect-video' />

                            <div
                                className='mt-12'
                            >
                                <h2>{title}</h2>
                                <div className='flex max-sm:flex-col justify-between my-8'>
                                    <div className='flex gap-5 items-start'>
                                        <img src={profile_img} alt="" className='w-12 h-12 rounded-full ' />
                                        <p className='capitalize'>
                                            {fullname}
                                            <br />
                                            @<Link to={`/user/${author_username}`} className='underline'>{author_username}</Link>
                                        </p>
                                    </div>
                                    <p className='text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5'>published on {getDay(publishedAt)}</p>
                                </div>

                            </div>

                            <BlogInteraction />
                            {/* blog content here */}

                            <div className='my-12 font-gelasio blog-page-content'>
                                {
                                    content[0].blocks.map((block, i) => {
                                        return <div className='my-4 md:my-8' key={i}>
                                            <BlogContent block={block} />
                                        </div>
                                    })

                                }

                            </div>

                            <BlogInteraction />

                            {
                                similarBlog != null && similarBlog.length ?
                                    <>
                                        <h1 className='text-2xl text-center btn-light mt-14 mb-10 font-medium'>Similar Blogs.</h1>

                                        {
                                            similarBlog.map((blog, i) => {
                                                let { author: { personal_info } } = blog
                                                return (
                                                    <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.08 }}>
                                                        <BlogPostCard blog={blog} author={personal_info} />
                                                    </AnimationWrapper>)
                                            })
                                        }
                                    </> : ""
                            }

                        </div>
                    </BlogContext.Provider>
            }

        </AnimationWrapper>
    )
}

export default BlogPage;