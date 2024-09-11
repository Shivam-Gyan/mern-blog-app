import axios from "axios";
import { AnimationWrapper } from "../common";
import { InPagenavigation, BlogPostCard, MinimalBlogPost, NoDataMessage, LoadMoreBlog } from "../components";
import { useEffect, useState } from "react";
import Loader from '../components/loader.component'
import { activeTabRef } from "../components/inpage-navigation.component";
import { filterPaginationData } from "../common/filter-pagination-data";



const HomePage = () => {

    const [fetchBlogs, setFetchBlogs] = useState(null)
    const [trendingBlogs, setTrendingBlogs] = useState(null)
    const [pageState, setPageState] = useState("home")

    const categories = ["programming", "hollywood", "cooking", "tech", "finances", "social media", "travel"]


    const fetchLatestBlogs = async ({ page = 1 }) => {
        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/blog/latest-blogs', { page },{
            headers:{
                "Content-Type":"application/json"
            }
        })
            .then(async ({ data: { blogs } }) => {

                let formatData = await filterPaginationData({
                    state: fetchBlogs,
                    data: blogs,
                    page,
                    countRoute: '/blog/all-latest-blogs-count'
                })
                setFetchBlogs(formatData)
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    const fetchTrendingBlog = async () => {
        await axios.get(import.meta.env.VITE_SERVER_DOMAIN + '/blog/trending-blogs',{
            headers:{
                "Content-Type":"application/json"
            }
        })
            .then(({ data: { blogs } }) => {
                setTrendingBlogs(blogs)
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    const fetchBlogByCategory = async ({ page = 1 }) => {
        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/blog/search-blogs', { tag: pageState, page },{
            headers:{
                "Content-Type":"application/json"
            }
        })
            .then(async ({ data: { blogs } }) => {
                let formatData = await filterPaginationData({
                    state: fetchBlogs,
                    data: blogs,
                    page,
                    countRoute: '/blog/search-blogs-count',
                    data_to_send:{tag:pageState}
                })
                setFetchBlogs(formatData)
            })
            .catch(err => {
                console.log(err.message)
            })
    }


    // this functionality used to get the innnertext of tag who clicked and then store in the pageState

    const getBlogByCategory = (e) => {
        let category = e.target.innerText.toLowerCase()
        setFetchBlogs(null)

        if (pageState == category) {
            setPageState("home")
            return;
        }
        setPageState(category)
    }


    useEffect(() => {

        activeTabRef.current.click()

        if (pageState == "home") {
            fetchLatestBlogs({ page: 1 })
        } else {
            fetchBlogByCategory({page:1})
        }
        if (!trendingBlogs) {
            fetchTrendingBlog()
        }

    }, [pageState])



    return (
        <AnimationWrapper>

            {/* h-cover is custom class setting the height of screen with subtracting the navbar height */}
            <section className="h-cover flex justify-center gap-10">

                {/* latest blog */}
                <div className="w-full">

                    <InPagenavigation

                        routes={[pageState, "trending blogs"]}
                        defaultHidden={["trending blogs"]}
                    >
                        <>
                            {
                                fetchBlogs == null ?
                                    <Loader /> :
                                    (fetchBlogs.results.length ? fetchBlogs.results.map((blog, i) => {
                                        return (
                                            <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                                                <BlogPostCard blog={blog} author={blog.author.personal_info} />
                                            </AnimationWrapper>
                                        )
                                    }) : <NoDataMessage message={"No blogs published yet"} />)
                            }

                            <LoadMoreBlog state={fetchBlogs} fetchDataFun={pageState=="home"?fetchLatestBlogs:fetchBlogByCategory} />
                        </>
                        {
                            trendingBlogs == null ?
                                <Loader /> :
                                (trendingBlogs.length ? trendingBlogs.map((blog, i) => {
                                    return (
                                        <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                                            <MinimalBlogPost blog={blog} index={i} />
                                        </AnimationWrapper>
                                    )
                                }) : <NoDataMessage message={"No trending blogs"} />)
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
                                            <button onClick={getBlogByCategory} key={i} className={`tag ${pageState == category ? " text-white bg-black" : " "}`}>
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
                                    (trendingBlogs.length ?
                                        trendingBlogs.map((blog, i) => {
                                            return (
                                                <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                                                    <MinimalBlogPost blog={blog} index={i} />
                                                </AnimationWrapper>
                                            )
                                        }) : <NoDataMessage message={"No trending blogs"} />)
                            }

                        </div>
                    </div>

                </div>

            </section>
        </AnimationWrapper>
    )
}

export default HomePage;