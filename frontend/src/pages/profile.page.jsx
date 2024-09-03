import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import axios from 'axios'
import Loader from '../components/loader.component.jsx'
import { UserContext } from '../App.jsx'
import AnimationWrapper from "../common/page-animation.jsx"
import AboutUser from "../components/about.component.jsx"
import { filterPaginationData } from "../common/filter-pagination-data.jsx"
import InPagenavigation from "../components/inpage-navigation.component.jsx"
import NoDataMessage from "../components/nodata.component.jsx"
import BlogPostCard from "../components/blog-post.component.jsx"
import LoadMoreBlog from "../components/load-more.component.jsx"
import PageNotFound from "./404.page.jsx"

const profileDataStructure = {
    "personal_info": {
        "fullname": "",
        "email": "",
        "username": "",
        "bio": "",
        "profile_img": ""
    },
    "social_links": {
        "youtube": "",
        "instagram": "",
        "facebook": "",
        "twitter": "",
        "github": "",
        "website": ""
    },
    "account_info": {
        "total_posts": 0,
        "total_reads": 0
    },
}

const ProiflePage = () => {

    // here if we not use profileDataStructure instead use null then we cannot destructure data of user from profile state 
    const [profile, setProfile] = useState(profileDataStructure)

    let { userAuth: { username } } = useContext(UserContext)

    let { personal_info: { fullname, username: profile_username, profile_img, bio }, account_info: { total_posts, total_reads }, social_links, joinedAt } = profile

    const [loading, setLoading] = useState(false)
    const [blogOfProfile, setBlogOfProfile] = useState(null)

    let [profileLoaded,setProfileLoaded]=useState("")

    const { id } = useParams();

    const fetchUserProfile = async () => {

        setLoading(true)
        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/auth/get-profile", { username: id })
            .then(({ data: user }) => {
                if(user!=null){
                    setProfile(user)
                }

                //setLoadedprofile() stores the id (which is username of author)
                setProfileLoaded(id)

                getBlogRelatedToProfile({ page: 1, user_id: user._id })
                setLoading(false)
            })
            .catch((err) => {
                console.log(err.message)
                setLoading(false)
            })
    }


    const getBlogRelatedToProfile = async ({ page = 1, user_id }) => {
        user_id = user_id == undefined ? blogOfProfile.user_id : user_id;

        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/blog/search-blogs", {
            author: user_id,
            page
        }).then(async ({ data }) => {
            let formatData = await filterPaginationData({
                state: blogOfProfile,
                data: data.blogs,
                page,
                countRoute: "/blog/search-blogs-count",
                data_to_send: { author: user_id }
            })
            formatData.user_id = user_id
            setBlogOfProfile(formatData)
        })
    }

    useEffect(() => {
        if(id!=profileLoaded){
            setBlogOfProfile(null)
        }

        if(blogOfProfile==null){
            resetState()
            fetchUserProfile()
        }
    }, [id,blogOfProfile])

    const resetState = () => {
        setProfile(profileDataStructure)
        setProfileLoaded("")
        setLoading(true)
    }

    return (

        <AnimationWrapper>
            {
                loading ?
                    <Loader /> :
                    profile_username.length?
                    <section
                        className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12"
                    >

                        <div
                            className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10 "
                        >

                            <img
                                src={profile_img}
                                className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"
                                alt=""
                            />

                            <h1 className="text-2xl font-medium ">@{profile_username}</h1>
                            <p className="text-xl capitalize h-6">{fullname}</p>

                            <p>{total_posts.toLocaleString()} Blogs - {total_reads.toLocaleString()} Reads</p>


                            {/* only when 
                            show for your account id come from params which is username */}
                            <div className="flex gap-4 mt-2">
                                {id == username ?

                                    <Link
                                        to={'/setting/edit-profile'}
                                        className="btn-light rounded-md"
                                    >
                                        Edit Profile
                                    </Link>
                                    : ""
                                }
                            </div>

                            <AboutUser className="max-md:hidden" bio={bio} social_links={social_links} joinedAt={joinedAt} />

                        </div>

                        <div className="max-md:mt-12 w-full ">

                            <InPagenavigation

                                routes={["Blogs Published", "About"]}
                                defaultHidden={["About"]}
                            >
                                <>
                                    {
                                        blogOfProfile == null ?
                                            <Loader /> :
                                            (blogOfProfile.results.length ? blogOfProfile.results.map((blog, i) => {
                                                return (
                                                    <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                                                        <BlogPostCard blog={blog} author={blog.author.personal_info} />
                                                    </AnimationWrapper>
                                                )
                                            }) : <NoDataMessage message={"No blogs published yet"} />)
                                    }

                                    <LoadMoreBlog state={blogOfProfile} fetchDataFun={getBlogRelatedToProfile} />
                                </>

                                <AboutUser className="" bio={bio} social_links={social_links} joinedAt={joinedAt} />

                            </InPagenavigation>
                        </div>
                    </section>
                    :<PageNotFound/>
            }
        </AnimationWrapper>
    )
}

export default ProiflePage;
