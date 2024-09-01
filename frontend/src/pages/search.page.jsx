import { useParams } from "react-router-dom"
import { BlogPostCard, InPagenavigation, LoadMoreBlog, NoDataMessage, UserCard } from "../components";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import { AnimationWrapper } from "../common";
import axios from "axios";
import { filterPaginationData } from "../common/filter-pagination-data";


const SearchPage = () => {
    const { query } = useParams()

    const [searchBlogs, setSearchBlogs] = useState(null)
    const [users, setUsers] = useState(null)

    const FetchBlogBySearch = async ({ page = 1, create_new_arr = false }) => {

        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/blog/search-blogs', { query, page })
            .then(async ({ data: { blogs } }) => {

                let formatData = await filterPaginationData({
                    state: searchBlogs,
                    data: blogs,
                    page,
                    countRoute: '/blog/search-blogs-count',
                    data_to_send: { query },
                    create_new_arr
                })
                setSearchBlogs(formatData)
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    const FetchUserByQuery = async () => {

        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/user/search-users", { query })
            .then(({ data: { users } }) => {
                setUsers(users)
            })
            .catch(err => {
                console.log(err.message)
            })
    }


    const resetState = () => {
        setSearchBlogs(null);
        setUsers(null)
    }

    useEffect(() => {
        resetState();
        FetchUserByQuery()
        FetchBlogBySearch({ page: 1, create_new_arr: true })
    }, [query])


    const UserCardWrapper = () => {
        return (
            <>
                {
                    users == null ? <Loader /> :
                        users.length ?
                                users.map((user, i) => {
                                    return <AnimationWrapper key={i} transition={{duration:1,delay:i*0.08}} >
                                        <UserCard user={user}/>
                                    </AnimationWrapper>
                                })
                            :<NoDataMessage message={"No user found"}/>
                }
            </>
        )
    }


    return (
        <section
            className="h-cover flex justify-center gap-10 "
        >

            {/* left side of search page */}
            <div className="w-full">
                <InPagenavigation
                    routes={[`search results from "${query}"`, "Accounts Matched"]}
                    defaultHidden={["Accounts Matched"]}

                >
                    <>
                        {
                            searchBlogs == null ?
                                <Loader /> :
                                (searchBlogs.results.length ? searchBlogs.results.map((blog, i) => {
                                    return (
                                        <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                                            <BlogPostCard blog={blog} author={blog.author.personal_info} />
                                        </AnimationWrapper>
                                    )
                                }) : <NoDataMessage message={"No blogs published yet"} />)
                        }

                        <LoadMoreBlog state={searchBlogs} fetchDataFun={FetchBlogBySearch} />
                    </>

                    <UserCardWrapper />


                </InPagenavigation>
            </div>

            {/* right side of page */}
            <div
            className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden  "
            >
                <h1 className="font-medium text-dark-grey capitalize text-xl mb-8">
                    user related to search
                    <i className="fi fi-rr-user font-medium mt-1 ml-2"></i>
                </h1>

                <UserCardWrapper/>
                
            </div>
        </section>
    )
}

export default SearchPage;
