
import { useState } from "react";

const InputBox = ({ name, type, id, placeholder, value, icon,disabled=false }) => {

    const [passwordVisible, setPasswordVissible] = useState(false)
    return (
        <>
            <div className="relative w-[100%] mb-4">
                <input
                    name={name}
                    placeholder={placeholder}
                    type={
                        type == "password" ? passwordVisible ? "text" : "password" : type
                    }
                    id={id}
                    defaultValue={value}
                    className="input-box"
                    disabled={disabled}
                />
                <i className={`fi ${icon} input-icon`}></i>

                {
                    type == "password" &&

                    <i className={`fi fi-rr-eye${passwordVisible?"":"-crossed"} input-icon left-[auto] right-4 cursor-pointer text-xl`}
                        onClick={() => setPasswordVissible(prev => !prev)}
                    ></i>
                }

            </div>
        </>
    )
}

export default InputBox;