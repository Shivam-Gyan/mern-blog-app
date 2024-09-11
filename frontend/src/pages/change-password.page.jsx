import { useContext, useRef } from "react";
import { AnimationWrapper } from "../common";
import { InputBox } from "../components";
import { toast } from 'react-hot-toast'
import axios from "axios";
import { UserContext } from "../App";


const ChangePassword = () => {

    let { userAuth: { access_token } } = useContext(UserContext)

    let changePasswordFormRef = useRef();
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    const handleChangePassword = async (e) => {
        e.preventDefault();

        e.target.setAttribute("disabled", true)
        let form = new FormData(changePasswordFormRef.current)

        let formData = {}

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { currentPassword, newPassword } = formData;

        if (!currentPassword.length || !newPassword.length) {
            return toast.error("fill the form")
        }
        if (!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)) {
            return toast.error("password should be atleast 6 to 20 character long and include 1 numeric and 1 uppercase letter")
        }

        let loading = toast.loading("updating....")
        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/auth/change-password', { currentPassword, newPassword }, {

            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        }).then(({ data: { message } }) => {
            toast.dismiss(loading)
            e.target.removeAttribute("disabled")
            return toast.success(message)
        }).catch(({ response: { data: { message } } }) => {
            toast.dismiss(loading)
            e.target.removeAttribute("disabled")
            return toast.error(message)
        })
    }

    return (

        <AnimationWrapper>
            <form ref={changePasswordFormRef}>

                <h1 className="text-2xl text-dark-grey max-md:hidden">Change Password</h1>
                <div className=" py-10 w-full md:max-w-[400px]">

                    <InputBox
                        name="currentPassword"
                        type="password"
                        placeholder="current password"
                        icon="fi-rr-unlock" />

                    <InputBox
                        name="newPassword"
                        type="password"
                        placeholder="new password"
                        icon="fi-rr-unlock" />


                    <button
                        className="btn-dark px-8 mt-10"
                        onClick={handleChangePassword}
                        type="submit"
                    >Change</button>
                </div>
            </form>
        </AnimationWrapper>
    )


}

export default ChangePassword;
