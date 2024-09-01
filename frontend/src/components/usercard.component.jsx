import { Link } from "react-router-dom"


const UserCard=({user})=>{

    const {profile_img,fullname,username}=user.personal_info

    return (
        <Link
        to={`/user/${username}`}
        className="flex gap-5 py-3 items-center mb-5 border-b border-grey/60"

        >

            <img src={profile_img} alt="" className=" w-14 h-14 rounded-full object-cover" />

            <div>
                <h1 className="font-medium text-xl line-clamp-2">{fullname}</h1>
                <p className="text-dark-grey">@{username}</p>
            </div>
        
        
        </Link>
    )
}

export default UserCard