import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components";
import { Editor, HomePage, PageNotFound, ProiflePage, SearchPage, UserAuthForm } from "./pages";
import { createContext, useEffect, useState } from "react";
import { getSession } from "./common/session";


export const UserContext = createContext({});


const App = () => {

    const [userAuth, setUserAuth] = useState({});

    useEffect(() => {
        let token = getSession("user");
        token ? setUserAuth(JSON.parse(token)) : setUserAuth({ access_token: null })
    }, [])

    return (
        <UserContext.Provider value={{ userAuth, setUserAuth }}>
            <Routes>
                <Route path='/' element={<Navbar />}>
                    <Route index element={<HomePage />} />
                    <Route path='signin' element={<UserAuthForm type="sign-in" />} />
                    <Route path='signup' element={<UserAuthForm type="sign-up" />} />
                    <Route path="search/:query" element={<SearchPage/>}/>
                    <Route path="/user/:id" element={<ProiflePage/>}/>
                    <Route path="*" element={<PageNotFound/>}/>
                </Route>
                <Route path="/editor" element={<Editor />} />
            </Routes>
        </UserContext.Provider>
    )
}

export default App;