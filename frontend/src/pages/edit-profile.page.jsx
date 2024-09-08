import { useContext, useEffect, useRef, useState } from "react";
import { AnimationWrapper, UploadToCloudinary } from "../common";
import { UserContext } from "../App";
import { toast } from "react-hot-toast";
import axios from "axios";
import { profileDataStructure } from "./profile.page";
import Loader from "../components/loader.component";
import { InputBox } from "../components";
import { Link } from "react-router-dom";
import { storeStorage } from "../common/session";


const EditProfile = () => {

    const { userAuth, userAuth: { access_token }, setUserAuth } = useContext(UserContext);

    let bioLimit = 200;

    const [characterLeftInBio, setCharacterLeftInBio] = useState(bioLimit);

    const [profile, setProfile] = useState(profileDataStructure);
    let { personal_info, social_links, personal_info: { profile_img, email, bio, fullname: profile_fullname, username: profile_username } } = profile

    const [loading, setLoading] = useState(true);
    const [updatedProfileImg, setUpdatedProfileImg] = useState(null);

    let profileImgRef = useRef()
    let FormRef = useRef();


    const handleImagePreview = (e) => {

        let profileImg = e.target.files[0]

        profileImgRef.current.src = URL.createObjectURL(profileImg)
        setUpdatedProfileImg(profileImg)


    }

    const handleProfileImgUplaod = async (e) => {
        e.preventDefault();

        if (updatedProfileImg == null) {
            return toast.error("please uplaod an image")
        }

        e.target.setAttribute("disabled", true)
        let UplaodingProfileImg = toast.loading("Uploading...")
        await UploadToCloudinary(updatedProfileImg)
            .then(async ({ image_url }) => {

                if (image_url) {
                    await axios.patch(import.meta.env.VITE_SERVER_DOMAIN + '/auth/upload-image', {
                        image_url
                    }, {
                        withCredentials: true,
                        headers: {
                            "Authorization": `Bearer ${access_token}`
                        }
                    }).then(({ data: { message } }) => {

                        let newUserAuth = { ...userAuth, profile_img: image_url }

                        // updating the session
                        storeStorage("user", JSON.stringify(newUserAuth))

                        // updating the userrAuth
                        setUserAuth(newUserAuth)

                        // setting the state to null 
                        setUpdatedProfileImg(null)

                        // removing the disable attribute from button
                        e.target.removeAttribute("disabled")
                        toast.dismiss(UplaodingProfileImg)
                        toast.success(message)

                    }).catch(({ response: { data: { message } } }) => {

                        e.target.removeAttribute("disabled")
                        toast.dismiss(UplaodingProfileImg)
                        toast.error(message)
                    })
                }



            })
            .catch(({ response: { data: { message } } }) => {
                e.target.removeAttribute("disabled")
                toast.dismiss(UplaodingProfileImg)
                toast.error(message)
            })

    }

    const handleSubmitForm = async (e) => {

        e.preventDefault()

        e.target.setAttribute("disabled", true);

        let form = new FormData(FormRef.current)
        let formdata = {}

        for (let [key, value] of form.entries()) {

            formdata[key] = value
        }

        let {
            bio,
            facebook,
            github,
            instagram,
            twitter,
            username,
            website,
            youtube
        } = formdata

        if (bio.length > bioLimit) {
            return toast.error(`bio must be ${bioLimit} characters long`)
        }

        if (username.length < 3) {
            return toast.error("username must be atleast 3 charcter long")
        }
        let updatingprofile = toast.loading("Updating...")
        await axios.patch(import.meta.env.VITE_SERVER_DOMAIN + "/auth/update-profile",
            {
                username,
                bio,
                social_links: {
                    facebook,
                    twitter,
                    youtube,
                    instagram,
                    website,
                    github
                }
            }, {
            withCredentials: true,
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        }
        ).then(({ data: { message, username } }) => {
            
            if (username != userAuth.username) {
                let newUserAuth = { ...userAuth, username: username }

                storeStorage("user", JSON.stringify(newUserAuth))
                setUserAuth(newUserAuth)
            }
            e.target.removeAttribute("disabled")
            toast.dismiss(updatingprofile)
            toast.success(message)

        }).catch(({response:{data:{message}}})=>{

            e.target.removeAttribute("disabled")
            toast.dismiss(updatingprofile)
            toast.error(message)
        })






    }


    useEffect(() => {

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/auth/get-profile", { username: userAuth.username })
            .then(({ data }) => {
                setProfile(data)
                setLoading(false)
            }).catch(({ response: { data: { message } } }) => {
                toast.error(message)
            })

    }, [access_token])

    return (

        <AnimationWrapper>
            {loading ?
                <Loader /> :
                <form ref={FormRef}>
                    <h1 className="max-md:hidden text-dark-grey text-xl">Edit Profile</h1>
                    <div
                        className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10"
                    >
                        <div className="max-lg:center mb-5">
                            <label htmlFor="uploadImg" id="profileImgLabel"
                                className="relative block w-48 h-48 bg-grey rounded-full overflow-hidden">
                                <div
                                    className="w-full h-full text-white absolute top-0 left-0 flex items-center 
                                justify-center bg-black/30 opacity-0 hover:opacity-100 cursor-pointer">Upload Image</div>

                                <img ref={profileImgRef} src={profile_img} alt="" />

                            </label>
                            <input
                                onChange={handleImagePreview}
                                type="file"
                                accept=".jpg,.png,.jpeg"
                                hidden id="uploadImg" />

                            <button
                                onClick={handleProfileImgUplaod}
                                className="btn-light px-10 mt-5 max-lg:center lg:w-full"
                            >Upload</button>
                        </div>
                        <div className="w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                                <div>
                                    <InputBox
                                        name='fullname'
                                        type='text'
                                        value={profile_fullname}
                                        placeholder='fullname'
                                        icon='fi-rr-user'
                                        disabled={true} />
                                </div>
                                <div>
                                    <InputBox
                                        name={'email'}
                                        type='email'
                                        value={email}
                                        placeholder={'email'}
                                        icon='fi-rr-envelope'
                                        disabled={true} />
                                </div>

                            </div>
                            <InputBox
                                name={'username'}
                                type='text'
                                value={profile_username}
                                placeholder={'username'}
                                icon='fi-rr-at'
                            />
                            <p className="text-dark-grey text-sm -mt-2 mb-6"><span className="text-red">*</span>Username will use to search user and will be visible to all user</p>

                            <div className="relative">
                                <textarea
                                    onChange={(e) => {
                                        setCharacterLeftInBio(bioLimit - e.target.value.length)
                                    }}
                                    className=" input-box h-64 lg:h-40 resize-none leading-7 pl-5"
                                    name="bio" maxLength={bioLimit}
                                    defaultValue={bio}
                                    placeholder="bio..."
                                ></textarea>

                                <p className="text-dark-grey text-md -mb-6 absolute bottom-0 right-0 ">{characterLeftInBio}<span className="text-purple">*</span> characters left</p>
                            </div>

                            <p className="text-dark-grey my-7 text-xl">
                                Add your social handles below
                            </p>
                            <div className="md:grid md:grid-cols-2 gap-x-6">
                                {
                                    Object.keys(social_links).map((key, i) => {
                                        let link = social_links[key]
                                        return <InputBox
                                            key={i}
                                            name={key}
                                            type='text'
                                            value={link}
                                            placeholder={'https://'}
                                            icon={key != 'website' ? "fi-brands-" + key : "fi-rr-globe"}
                                        />

                                    })
                                }
                            </div>
                            <button onClick={handleSubmitForm} className="btn-dark px-10 w-auto">Update</button>
                        </div>
                    </div>
                </form>
            }
        </AnimationWrapper>
    )
}

export default EditProfile;
