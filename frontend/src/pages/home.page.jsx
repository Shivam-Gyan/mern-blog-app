import axios from "axios";
import { AnimationWrapper } from "../common";
import { InPagenavigation, BlogPostCard, MinimalBlogPost } from "../components";
import { useEffect, useState } from "react";
import Loader from '../components/loader.component'



const HomePage = () => {

    const [fetchBlogs, setFetchBlogs] = useState(null)
    const [trendingBlogs, setTrendingBlogs] = useState(null)

    const categories = ["programming", "hollywood", "cooking", "tech", "finances", "social media", "travel"]

    const fetchLatestBlogs = async () => {
        await axios.get(import.meta.env.VITE_SERVER_DOMAIN + 'blog/latest-blogs')
            .then(({ data: { blogs } }) => {
                setFetchBlogs(blogs)
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    const fetchTrendingBlog = async () => {
        await axios.get(import.meta.env.VITE_SERVER_DOMAIN + 'blog/trending-blogs')
            .then(({ data: { blogs } }) => {
                setTrendingBlogs(blogs)
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    useEffect(() => {
        fetchLatestBlogs()
        fetchTrendingBlog()
    }, [])



    return (
        <AnimationWrapper>

            {/* h-cover is custom class setting the height of screen with subtracting the navbar height */}
            <section className="h-cover flex justify-center gap-10">

                {/* latest blog */}
                <div className="w-full">

                    <InPagenavigation
                        routes={["home", "trending blogs"]}
                        defaultHidden={["trending blogs"]}
                    >
                        <>
                            {
                                fetchBlogs == null ?
                                    <Loader /> :
                                    fetchBlogs.map((blog, i) => {
                                        return (
                                            <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                                                <BlogPostCard blog={blog} author={blog.author.personal_info} />
                                            </AnimationWrapper>
                                        )
                                    })
                            }
                        </>
                        {
                            trendingBlogs == null ?
                                <Loader /> :
                                trendingBlogs.map((blog, i) => {
                                    return (
                                        <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                                            <MinimalBlogPost blog={blog} index={i} />
                                        </AnimationWrapper>
                                    )
                                })
                        }

                    </InPagenavigation>
                </div>

                {/* filter and trending blogs */}
                <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">

                    <div className="flex flex-col gap-10">
                        <div>
                            <h1 className="font-medium text-xl mb-4">Stories from all interest</h1>
                            <div className=" flex gap-3 flex-wrap">
                                {
                                    categories.map((category, i) => {
                                        return (
                                            <button key={i} className="tag">
                                                {category}
                                            </button>
                                        )
                                    })
                                }

                            </div>
                        </div>



                        {/* trending full screen view */}
                        <div>
                            <h1 className="font-medium text-xl mb-8 flex items-center">Trending <i className="fi fi-rr-arrow-trend-up ml-2"></i></h1>
                            {
                                trendingBlogs == null ?
                                    <Loader /> :
                                    trendingBlogs.map((blog, i) => {
                                        return (
                                            <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                                                <MinimalBlogPost blog={blog} index={i} />
                                            </AnimationWrapper>
                                        )
                                    })
                            }

                        </div>
                    </div>

                </div>

            </section>
        </AnimationWrapper>
    )
}

export default HomePage;