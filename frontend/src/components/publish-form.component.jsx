import { Toaster, toast } from "react-hot-toast"
import { AnimationWrapper } from "../common"
import { EditorContext } from "../pages/editor.pages"
import { useContext } from "react"
import { Tag } from './index'


const PublishFromPanel = () => {

    let { blog, blog: { title, banner, des, tags }, setBlog, editorState, setEditorState, textEditor, setTextEditor } = useContext(EditorContext)

    let characterLimit = 200;
    let tagLimit = 10;

    return (
        <AnimationWrapper>

            <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
                <Toaster />
                <button
                    className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:[top-10%]  "
                    onClick={() => setEditorState("editor")}
                >
                    <i className="fi fi-br-cross"></i>
                </button>


                <div className="max-w-[550px] center">
                    <p className="text-dark-grey mb-1">Preview</p>

                    <div className=" w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
                        <img src={banner} alt="" />
                    </div>

                    <h1
                        className="text-4xl font-medium mt-2 leading-tight line-clamp-2"
                    >{title}
                    </h1>

                    <p className="font-gelasio line-clamp-2  text-xl leading-7 mt-4">
                        {des}
                    </p>

                </div>

                <div className="border-grey lg:border-1 lg:pl-8">

                    <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
                    <input
                        type="text"
                        placeholder="Blog Title"
                        className="input-box"
                        defaultValue={title}
                        onChange={(e) => {
                            setBlog({ ...blog, title: e.target.value })
                        }}
                    />
                    <p className="text-dark-grey mb-2 mt-9">Short description about your blog </p>

                    <textarea

                        maxLength={characterLimit}
                        defaultValue={des}
                        className="h-40  resize-none leading-7 input-box pl-4"
                        onChange={(e) => {
                            setBlog({ ...blog, des: e.target.value })
                        }}

                        onKeyDown={(e) => {
                            // enter button on keyboard has keyCode==13
                            if (e.keyCode == 13) {
                                e.preventDefault();
                            }
                        }}
                    >

                    </textarea>
                    <p className="mt-2 text-dark-grey text-sm text-right">{characterLimit - des.length} charcters left</p>

                    <p
                        className="mb-2 text-dark-grey mt-9"
                    >
                        Topics-(Helps in searching and ranking your blog post)</p>


                    <div className="relative input-box pl-2 py-2 pb-4">
                        <input
                            type="text"
                            placeholder="Topic"
                            className="sticky input-box bg-white focus:bg-white top-0 left-0 pl-4 mb-3"
                            onKeyDown={(e) => {

                                if (e.keyCode == 13 || e.keyCode == 188) {
                                    e.preventDefault()
                                    let tag = e.target.value

                                    if (tags.length < tagLimit) {
                                        if (!tags.includes(tag) && tag.length) {
                                            setBlog({ ...blog, tags: [...tags, tag] })
                                        } else {
                                            toast.error("Tag already included")
                                        }
                                    } else {
                                        toast.error("Reached your tag limit " + (tagLimit))
                                    }
                                }
                            }}
                        />

                        {tags.map((tag, index) => {
                            return <Tag key={index} tagIndex={index} tag={tag} />
                        })}
                    </div>
                    <p className="mt-4 text-dark-grey text-sm text-right">{tagLimit - tags.length} Tags left</p>

                    <button
                        className="btn-dark"
                    >
                        Publish
                    </button>

                </div>
            </section>

        </AnimationWrapper>
    )
}

export default PublishFromPanel