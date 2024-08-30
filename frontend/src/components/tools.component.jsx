import Embed from '@editorjs/embed';
import List from '@editorjs/list'
import Image from '@editorjs/image'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import InlineCode from '@editorjs/inline-code'
import Link from '@editorjs/link'
import { UploadToCloudinary } from '../common';



const uploadImageByFile = async(e) => {
    return await UploadToCloudinary(e).then(({ image_url }) => {
        // EditorJS accept only url variable
        let url=image_url
        if (url) {
            return {
                success: 1,
                file: { url }
            }
        }
    })
}

const uploadImageByURL = async(e) => {
    let link = new Promise((res, rej) => {
        try {
            res(e)
        } catch (err) {
            rej(err)
        }
    })

    return await link.then(url => {
        return {
            success: 1,
            file: { url }
        }
    })
}


export const tools = {
    embed: Embed,
    list: {
        class: List,
        inlineToolbar: true
    },
    image: {
        class: Image,
        config: {
            uploader: {
                uploadByUrl: uploadImageByURL,
                uploadByFile: uploadImageByFile
            }
        }
    },
    header: {
        class: Header,
        config: {
            placeholder: 'Type Heading...',
            levels: [2, 3, 4],
        }
    },
    quote: {
        class: Quote,
        inlineToolbar: true
    },
    marker: Marker,
    inlinecode: InlineCode,
    link: Link
}