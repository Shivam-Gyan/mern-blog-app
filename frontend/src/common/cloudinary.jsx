import axios from "axios"


export const UploadToCloudinary=async(image)=>{

    const response= await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/blog/get-image-url",
        {
            image
        })

    return response.data;
}
