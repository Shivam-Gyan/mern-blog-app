import axios from "axios"


export const UploadToCloudinary=async(image)=>{
    console.log("cloudinary",image)

    const response= await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/blog/get-image-url",
        {image},{
            headers:{
                'Content-Type': 'multipart/form-data'
            }
        })

    return response.data;
}


