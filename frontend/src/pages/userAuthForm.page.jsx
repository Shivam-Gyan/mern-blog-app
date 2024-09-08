import { Link, Navigate } from "react-router-dom"
import { InputBox } from "../components"
import google from '../imgs/google.png'
import { AnimationWrapper } from "../common"
import { storeStorage } from "../common/session.jsx"
import { toast, Toaster } from 'react-hot-toast'
import axios from 'axios'
import { useContext } from "react"
import { UserContext } from "../App.jsx"


var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
var passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

const UserAuthForm = ({ type }) => {

    let { userAuth: { access_token }, setUserAuth } = useContext(UserContext);


    // server request handling function 
    const handleRequest = async (serverRoute, formData) => {
        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/auth" + serverRoute, formData, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" }
        })
            .then(({ data }) => {
                toast.success(data.message)
                storeStorage("user", JSON.stringify(data.user))
                setUserAuth(data.user);
            }).catch(({response:{data:{message}}}) => {
                toast.error(message)
            })
    }


    // form handling function

    const handleSubmit = (e) => {

        e.preventDefault();

        let formData = {}
        const form = new FormData(fromElement)
        for (let [key, value] of form.entries()) {
            formData[key] = value
        }


        const { fullname, email, password } = formData;

        if (!email || !password) {
            return toast.error("please fill the complete form")
        }

        if (fullname) {
            if (fullname.length < 3) {
                return toast.error("fullname must be atleast 3 letter long", 403)
            }
        }

        if (!email.length) {
            return toast.error("please enter an email", 403)
        }
        if (!emailRegex.test(email)) {
            return toast.error("invalid email", 403)
        }
        if (!passwordRegex.test(password)) {
            return toast.error("password should be 6 to 20 character long with a numeric,1 lowercase and 1 uppercase", 403)
        }

        let serverRoute = type == "sign-in" ? '/signin' : '/signup'


        // calling server handling function
        handleRequest(serverRoute, formData);

    }


    return (
        access_token ? <Navigate to={'/'} /> :
            <AnimationWrapper keyValue={type}>
                <section className="h-cover flex items-center justify-center">
                    <Toaster />
                    <form id="fromElement" className="w-[80%] max-w-[400px]" onSubmit={handleSubmit}>
                        <h1
                            className="text-3xl capitalize font-gelasio text-center mb-24">
                            {type == "sign-in" ? "welcome back" : "Join us today"}
                        </h1>

                        {/* for user signup show full name input field */}

                        {
                            type != "sign-in" &&
                            <InputBox
                                name="fullname"
                                type="text"
                                placeholder="full name"
                                icon="fi-rr-user"
                            />
                        }

                        <InputBox
                            name="email"
                            type="email"
                            placeholder="email"
                            icon="fi-rr-envelope"
                        />
                        <InputBox
                            name="password"
                            type="password"
                            placeholder="password"
                            icon="fi-rr-key"
                        />
                        <button
                            className="btn-dark center mt-14"
                            type="submit"
                        >
                            {
                                type.replace("-", " ")
                            }

                        </button>

                        <div className="relative w-full flex items-center 
                gap-2 my-10 opacity-10 uppercase text-black font-bold "
                        >
                            <hr className="w-1/2 border-black" />
                            <p className="">or</p>
                            <hr className="w-1/2 border-black" />

                        </div>

                        <button className="w-[90%] btn-dark flex items-center justify-center gap-4 center">
                            <img src={google} alt="google" className="w-6" />
                            continue with google
                        </button>

                        {
                            type == "sign-in" ?
                                <p className="mt-6 text-xl  text-dark-grey text-center">
                                    Don't have an account ?
                                    <Link to={'/signup'} className="underline text-xl ml-2 text-black">
                                        join us today.
                                    </Link>
                                </p> :
                                <p className="mt-6 text-xl text-dark-grey text-center">
                                    Already have an account ?
                                    <Link to={'/signin'} className="underline  text-xl ml-2 text-black">
                                        sign in here.
                                    </Link>
                                </p>
                        }

                    </form>


                </section>
            </AnimationWrapper>
    )
}


export default UserAuthForm