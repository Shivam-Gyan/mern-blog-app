import { useContext, useState } from "react"
import { UserContext } from "../App"
import { Navigate } from "react-router-dom"


const Editor = () => {
    let { userAuth, userAuth: { access_token } } = useContext(UserContext)
    const [editorState, setEditorState] = useState("editor")

    return (
        access_token == null ?
            <Navigate to={'/signin'} /> :
            editorState=="editor"?<h1>Editor frame</h1>:<h1>Publish frame</h1>
)

}

export default Editor