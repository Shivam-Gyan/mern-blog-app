import { Link } from "react-router-dom"
import { InputBox } from "../components"

import google from '../imgs/google.png'
import { AnimationWrapper } from "../common"

const UserAuthForm = ({ type }) => {
    return (
        <AnimationWrapper keyValue={type}>
            <section className="h-cover flex items-center justify-center">
                <form className="w-[80%] max-w-[400px]">
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
                    type=="sign-in"?
                    <p className="mt-6 text-xl  text-dark-grey text-center">
                        Don't have an account ?
                        <Link to={'/signup'} className="underline text-xl ml-2 text-black">
                            join us today.
                        </Link>
                    </p>:
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