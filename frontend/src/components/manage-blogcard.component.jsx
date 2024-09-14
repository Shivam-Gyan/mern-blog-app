import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import { useState } from "react";



const BlogStat = ({ stats }) => {

    return (

        <div className="flex gap-1 max-lg:mb-6 max-lg:pb-6 border-grey max-lg:border-b">

            {/* object something like this where stats is activity */}
            {/* activity:{
                "total_likes":0,
                "total_comments":0,
                "total_reads":0,
                "total_parent_comments":0
            } */}

            {
                Object.keys(stats).map((key,i)=>{
                    return (
                        // removing the total_parent_comment 
                       !key.includes("parent")?<div key={i} className={"flex flex-col items-center w-full h-full justify-center p-4 px-6 "+(i!=0 ?"border-grey border-l":"")}>
                       <h1>{stats[key].toLocaleString()}</h1>
                       <p className="max-lg:text-dark-grey capitalize">{key.split("_")[1]}</p>
                   </div>:""
                    )
                })
            }

        </div>
    )
}


const ManagePublishBlogCard = ({ blog }) => {

    let { banner, blog_id, title, publishedAt, activity } = blog;

    const [showStat, setShowStat] = useState(false)


    return (
        <>
            <div className="flex gap-10 border-b mb-6  max-md:px-4 border-grey pb-6 items-center">

                <img src={banner} alt="" className="max-md:hidden lg:hidden xl:block w-28 h-28 flex-none bg-grey object-cover" />

                <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">

                    <div>
                        <Link to={`/blog/${blog_id}`} className="blog-title mb-4 hover:underline">
                            {title}
                        </Link>
                        <p className="line-clamp-1">Published on {getDay(publishedAt)}</p>
                    </div>

                    <div className="flex items-center gap-6 mt-3">
                        <Link to={`/editor/${blog_id}`} className=" bg-grey px-4 py-1 hover:bg-dark-grey/10 rounded-md">
                            Edit
                        </Link>

                        <button onClick={() => setShowStat(prev => !prev)} className="lg:hidden border-grey p-1 px-2 rounded-md bg-grey ">Stats</button>

                        <button className="border-grey p-1 px-2 rounded-md bg-grey">
                            <i className="fi fi-rr-trash pointer-events-none"></i>
                        </button>

                    </div>


                </div>


                <div className="max-lg:hidden">
                    <BlogStat stats={activity} />
                </div>

            </div>


            {
                showStat ?
                    <div className="lg:hidden">
                        <BlogStat stats={activity} />
                    </div> : ""
            }


        </>
    )

}

export default ManagePublishBlogCard;