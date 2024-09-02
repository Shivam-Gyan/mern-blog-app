import { Link } from "react-router-dom";
import { AnimationWrapper } from "../common";
import { getFullDay } from "../common/date";


const AboutUser = ({ className, bio, social_links, joinedAt }) => {


    return (

        <AnimationWrapper>
            <div
                className={`md:w-[90%] md:mt-7 ${className}`}
            >
                <h1 className=" text-xl leading-7">
                    {
                        bio.length ? bio : "Nothing to read "
                    }
                </h1>

                <div
                    className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey"
                >

                    {

                        //  Object.keys(social_links) coonvert the key of all social_link in array ["youtube","instagram"] like this
                        Object.keys(social_links).map((key, i) => {
                            let link = social_links[key]

                            if (link) {
                                return link ?
                                    <Link
                                        target="_blank"
                                        key={i}
                                        to={link}
                                    >
                                        <i
                                            className={`fi ${key != 'website' ? "fi-brands-" + key : "fi-rr-globe"} `}
                                        ></i>
                                    </Link> : ""
                            }
                        })
                    }

                </div>

                <p className="text-xl text-dark-grey">Joined on {getFullDay(joinedAt)}</p>
            </div>
        </AnimationWrapper>

    )
}

export default AboutUser;