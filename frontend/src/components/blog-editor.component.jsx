import { Link } from "react-router-dom"
import logo from '../imgs/logo.png'
import { AnimationWrapper, UploadToCloudinary } from "../common"
import Banner from '../imgs/blog banner.png'
import { useState } from "react"



const BlogEditor = () => {
    const [bannerPreview, setBannerPreview] = useState();

    const handleBannerUplaod = async (e) => {

        let banner = e.target.files[0]

        await UploadToCloudinary(banner)
            .then(({ image_url }) => {
                setBannerPreview(image_url)
            })
            .catch((err) => {
                console.log(err.message)
            })
    }

    return (
        <>
            <nav className="navbar">

                <Link
                    to={'/'}
                    className="w-10 flex-none "
                >
                    <img src={logo} alt="" />
                </Link>

                <p className="max-md:hidden text-black line-clamp-1">
                    New Blog
                </p>

                <div className=" ml-auto flex gap-4 ">
                    <button className="btn-dark py-2">
                        Publish
                    </button>
                    <button className="btn-light py-2">
                        Save Draft
                    </button>
                </div>
            </nav>

            <AnimationWrapper >
                <section>
                    <div className="mx-auto max-w-[900px] w-full ">

                        <div
                            className="relative aspect-video bg-white 
                            border-4 border-grey hover:opacity-80"
                        >
                            <label
                                htmlFor="uploadBanner"
                            >
                                <img src={!bannerPreview ? Banner : bannerPreview} alt="" className="" />
                                <input
                                    type="file"
                                    id="uploadBanner"
                                    accept=".jpg,.png,.jpeg"
                                    hidden

                                    onChange={handleBannerUplaod}
                                />

                            </label>

                        </div>
                    </div>
                </section>


            </AnimationWrapper>
        </>
    )
}

export default BlogEditor