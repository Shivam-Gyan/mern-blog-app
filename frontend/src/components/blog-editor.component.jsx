import { Link, useNavigate, useParams } from "react-router-dom"
import logo from '../imgs/logo.png'
import { AnimationWrapper, UploadToCloudinary } from "../common"
import defaultBanner from '../imgs/blog banner.png'
import { useContext, useEffect, useState } from "react"
import { Toaster, toast } from "react-hot-toast"
import { EditorContext } from "../pages/editor.pages.jsx"
import EditorJS from '@editorjs/editorjs'
import { tools } from "./tools.component.jsx"
import axios from "axios"
import { UserContext } from "../App.jsx"




const BlogEditor = () => {
    let { blog, blog: { title, banner, content, tags, author, des }, setBlog, setEditorState, textEditor, setTextEditor } = useContext(EditorContext)
    let {userAuth:{access_token}}=useContext(UserContext);
    const navigate=useNavigate();

    const {blog_id}=useParams()

    const handleBannerUplaod = async (e) => {

        let banner = e.target.files[0]
        let UploadingBanner = toast.loading("Uploading...")

        if (banner) {
            await UploadToCloudinary(banner)
                .then(({ image_url }) => {
                    // bannerRef.current.src = image_url
                    setBlog({ ...blog, banner: image_url })
                    toast.dismiss(UploadingBanner)
                })
                .catch(({response:{data}}) => {
                    toast.dismiss(UploadingBanner)
                    toast.error(data.message)
                })
        }
        // toast.dismiss(UploadingBanner)
    }

    const handlePublish = () => {
        if (!banner.length) {
            return toast.error("upload banner to publish it")
        }
        if (!title.length) {
            return toast.error("Add blog title to publish it")
        }

        if (textEditor.isReady) {
            // saving the textEditor data 
            textEditor.save()
                .then(data => {
                    if (data.blocks.length) {
                        setBlog({ ...blog, content: data })
                        setEditorState("publish")
                    } else {
                        return toast.error("write something in blog to publish it")
                    }
                }).catch(({response:{data}}) => {
                    toast.error(data.message)
                })
        }
    }

    const handleSaveDraft=(e)=>{
        if (e.target.className.includes("disable")) {
            return;
        }

        if (!title.length) {
            return toast.error("Add blog title to save it")
        }

        let loading = toast.loading("Saving...")

        e.target.classList.add("disable")

        if(textEditor.isReady){
            textEditor.save().then( async (content)=>{

                let blogObj = {
                    title,banner, des, content, tags, draft: true
                }
        
                await axios.post(
                    import.meta.env.VITE_SERVER_DOMAIN + "/blog/create-blog",
                    {...blogObj,id:blog_id},
                    {
                        headers: {
                            'Authorization': `Bearer ${access_token}`
                        }
                    }
                ).then(data => {
                    // handle the data
                    console.log(data)
                    e.target.classList.remove("disable")
                    toast.dismiss(loading)
                    toast.success("Saved to Draft 👍")
        
                    setTimeout(() => {
                        navigate('/dashboard/blogs?tab=draft')
                    }, 500)
                }).catch(({response:{data}}) => {
                    toast.dismiss(loading)
                    toast.error(data.message)
                })
            })
        } 
    }

    useEffect(() => {

        if (!textEditor.isReady) {
            setTextEditor(new EditorJS({
                holder: "textEditor",
                data:Array.isArray(content)?content[0]:content,
                tools: tools,
                placeholder: "Let's write an Awesome story",

            }))
        }


    }, [])

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
                    {
                        title
                    }
                </p>

                <div className=" ml-auto flex gap-4 ">
                    <button
                        className="btn-dark py-2"
                        onClick={handlePublish}
                    >
                        Publish
                    </button>

                    <button
                        className="btn-light py-2"
                        onClick={handleSaveDraft}
                    >
                        Save Draft
                    </button>
                </div>
            </nav>

            <AnimationWrapper >
                <Toaster />
                <section>
                    <div className="mx-auto max-w-[900px] w-full ">
                        <div
                            className="relative aspect-video bg-white 
                            border-4 border-grey hover:opacity-90"
                        >
                            <label
                                htmlFor="uploadBanner"
                            >
                                <img
                                    src={banner ? banner : defaultBanner}
                                    alt=""
                                    className=""
                                />
                                <input
                                    type="file"
                                    id="uploadBanner"
                                    accept=".jpg,.png,.jpeg"
                                    hidden
                                    onChange={handleBannerUplaod}
                                />

                            </label>
                        </div>

                        <textarea
                            value={title}
                            placeholder="Blog Title"
                            className=" text-3xl md:text-4xl w-full h-20 outline-none font-medium resize-none mt-10"

                            // this functionality handle the enter key behaviour
                            onKeyDown={(e) => {

                                // enter button on keyboard has keyCode==13
                                if (e.keyCode == 13) {
                                    e.preventDefault();
                                }
                            }}

                            // this function handle the auto height of textarea
                            onChange={(e) => {
                                let input = e.target
                                input.style.height = "auto";
                                input.style.height = input.scrollHeight + "px";
                                setBlog({ ...blog, title: input.value })
                            }}

                        >
                        </textarea>


                        <hr className="w-full opacity-10 my-5" />

                        <div id="textEditor" className="font-gelasio"></div>
                    </div>
                </section>


            </AnimationWrapper>
        </>
    )
}

export default BlogEditor