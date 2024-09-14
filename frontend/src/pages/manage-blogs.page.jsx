import { useContext, useEffect, useState } from "react";
import axios from 'axios'

import { UserContext } from '../App'
import { filterPaginationData } from "../common/filter-pagination-data";
import { toast } from "react-hot-toast";
import { InPagenavigation, ManagePublishBlogCard, NoDataMessage } from "../components";
import Loader from "../components/loader.component";
import { AnimationWrapper } from "../common";


const ManageBlogs = () => {

    const { userAuth: { access_token } } = useContext(UserContext);

    const [userBlogs, setUserBlogs] = useState(null);
    const [drafts, setDrafts] = useState(null)
    const [query, setQuery] = useState("");


    const fetchBlogs = async ({ page, draft, deletedDocCount = 0 }) => {

        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/user/user-blogs", {
            page, draft, query, deletedDocCount
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`

            }
        })
            .then(async ({ data: { message, docs } }) => {

                let formatData = await filterPaginationData({
                    state: draft ? drafts : userBlogs,
                    data: docs,
                    page,
                    countRoute: '/user/count-user-blogs',
                    data_to_send: { draft, query },
                    user: access_token
                })
                if (draft) {
                    setDrafts(formatData)
                } else {
                    setUserBlogs(formatData)
                }
            }).catch(({ response: { data: { message } } }) => {
                toast.error(message)
            })
    }

    useEffect(() => {

        if (access_token) {
            if (userBlogs == null) {
                fetchBlogs({ page: 1, draft: false })
            }
            if (drafts == null) {
                fetchBlogs({ page: 1, draft: true })
            }
        }

    }, [access_token, userBlogs, drafts, query])

    return (
        <>
            <h1 className="max-md:hidden">Manage Blogs</h1>

            <div className=" relative max-md:mt-5 md:mt-8 mb-10">
                <input
                    type="search"
                    className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
                    placeholder="Search Blogs"
                    onKeyDown={(e) => {
                        let searchQuery = e.target.value
                        setQuery(searchQuery)

                        if (e.keyCode == 13 && searchQuery.length) {
                            console.log(query)
                            setDrafts(null)
                            setUserBlogs(null)
                        }
                    }}
                    onChange={(e) => {
                        if (!e.target.value.length) {
                            // console.log(e.target.value)
                            setQuery("")
                            setDrafts(null)
                            setUserBlogs(null)
                        }
                    }}
                />
                <i className='fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey'></i>
            </div>

            <InPagenavigation routes={["Published Blogs", "Drafts"]}>

                {
                    // published blogs

                    userBlogs == null ? <Loader /> :
                        userBlogs.results.length ?
                            <>
                                {
                                    userBlogs.results.map((blog, i) => {
                                        return (
                                            <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                                                <ManagePublishBlogCard blog={blog}/>
                                            </AnimationWrapper>
                                        )
                                    })
                                }
                            </>
                            : <NoDataMessage message={"No blogs published yet"} />

                }
                <h1>This is Drafts Blogs</h1>

            </InPagenavigation>


        </>
    )

}

export default ManageBlogs;