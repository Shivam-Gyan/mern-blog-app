import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components";


const App = () => {
    return (
        <Routes>
            <Route path='/' element={<Navbar/>} />
            <Route path='/signin' element={<h1>signin page</h1>} />
            <Route path='/signup' element={<h1>signup page</h1>} />
        </Routes>
    )
}

export default App;