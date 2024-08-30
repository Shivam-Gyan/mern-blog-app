import { createContext, useContext, useState } from "react"
import { UserContext } from "../App"
import { Navigate } from "react-router-dom"
import { BlogEditor,PublishFromPanel } from "../components"

const blogStructure = {
    title: "",
    banner: "",
    conent: [],
    tags: [],
    des: "",
    auther: { personal_info: {} }
}

export const EditorContext = createContext({});

const Editor = () => {
    
    let { userAuth, userAuth: { access_token } } = useContext(UserContext)
    
    // we using two component in sample component thats why we use state to manage editor and publish form component
    const [editorState, setEditorState] = useState("editor")

    const [blog,setBlog]=useState(blogStructure);
    const [textEditor,setTextEditor]=useState({isReady:false});

    return (
        <EditorContext.Provider value={{blog,setBlog,editorState,setEditorState,textEditor,setTextEditor}}>
            {
                access_token == null ?
                    <Navigate to={'/signin'} /> :
                    editorState == "editor" ? <BlogEditor /> : <PublishFromPanel/>

            }
        </EditorContext.Provider>

    )

}

export default Editor