import { Route, Routes } from "react-router-dom";
import { Navbar, SideNavbar } from "./components";
import { Editor, HomePage, PageNotFound, ProiflePage, SearchPage,BlogPage, UserAuthForm, ChangePassword } from "./pages";
import { createContext, useEffect, useState } from "react";
import { getSession } from "./common/session";
import { Toaster } from "react-hot-toast";

export const UserContext = createContext({});


const App = () => {

    const [userAuth, setUserAuth] = useState({});

    useEffect(() => {
        let token = getSession("user");
        token ? setUserAuth(JSON.parse(token)) : setUserAuth({ access_token: null })
    }, [])

    return (
        <UserContext.Provider value={{ userAuth, setUserAuth }}>
            <Toaster/>
            <Routes>
                <Route path='/' element={<Navbar />}>
                    <Route index element={<HomePage />} />
                    <Route path="settings" element={<SideNavbar/>}>
                        <Route path="edit-profile" element={<h1>edit profile</h1>}/>
                        <Route path="change-password" element={<ChangePassword/>}/>
                    </Route>
                    <Route path='signin' element={<UserAuthForm type="sign-in" />} />
                    <Route path='signup' element={<UserAuthForm type="sign-up" />} />
                    <Route path="search/:query" element={<SearchPage/>}/>
                    <Route path="user/:id" element={<ProiflePage/>}/>
                    <Route path="blog/:blog_id" element={<BlogPage /> }/>
                    <Route path="*" element={<PageNotFound/>}/>
                </Route>
                <Route path="/editor" element={<Editor />} />
                <Route path="/editor/:blog_id" element={<Editor />} />
            </Routes>
        </UserContext.Provider>
    )
}

export default App;