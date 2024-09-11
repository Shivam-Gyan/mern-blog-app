import { createContext, useContext, useEffect, useState } from "react"
import { UserContext } from "../App"
import { Navigate, useParams } from "react-router-dom"
import { BlogEditor, PublishFromPanel } from "../components"
import Loader from "../components/loader.component"
import axios from "axios"

const blogStructure = {
    title: "",
    banner: "",
    content: [],
    tags: [],
    des: "",
    auther: { personal_info: {} }
}

export const EditorContext = createContext({});

const Editor = () => {

    let { blog_id } = useParams();

    let { userAuth, userAuth: { access_token } } = useContext(UserContext)

    // we using two component in sample component thats why we use state to manage editor and publish form component
    const [editorState, setEditorState] = useState("editor")

    const [blog, setBlog] = useState(blogStructure);
    const [textEditor, setTextEditor] = useState({ isReady: false });
    const [loading, setLoading] = useState(true)

    async function fetchBlogByBlogId() {
        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/blog/get-blog", { blog_id, draft: true, mode: 'edit' })
            .then(({ data }) => {
                console.log(data)
                setBlog(data)
                setLoading(false)
            }).catch((err) => {
                console.log(err.message)
            })
    }

    useEffect(() => {

        if (!blog_id) {
            return setLoading(false)
        }

        fetchBlogByBlogId();


    }, [])

    return (
        <EditorContext.Provider value={{ blog, setBlog, editorState, setEditorState, textEditor, setTextEditor }}>
            {
                access_token == null ?
                    <Navigate to={'/signin'} /> :
                    loading ? <Loader /> : editorState == "editor" ? <BlogEditor /> : <PublishFromPanel />

            }
        </EditorContext.Provider>

    )

}

export default Editor