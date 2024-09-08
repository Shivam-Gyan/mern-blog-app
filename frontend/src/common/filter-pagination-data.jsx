

// "state" previous data of latest blog fetching data
// "data" is newly fetched data
// "page" have page no. like (1 or 2  and so on)
// "data_to_send " have what data to send to countRoute

import axios from "axios";

export const filterPaginationData = async ({ create_new_arr = false, state, data, page, countRoute, data_to_send = {},user }) => {


    //  here obj object format the  fetchedblogs into   
    //  fetchedBlog={
    //     results:[],
    //     page,
    //     totalDocs
    //  }
    let obj;

    let headers={}

    if(user){
        headers.headers={
            withCredentials:true,
            "Authorization":`Bearer ${user}`
        }
    }

    /*
        in if condition checks if state==fetchedBlogs is not null then return the obj
     */

    if (state != null && !create_new_arr) {
        obj = { ...state, results: [...state.results, ...data], page: page }

    } 
    
    /*
        else if state is null the it request the server to provide the no. of blog in database the it set to the 
        state/fetchedBlog includes this variables
        fetchedBlog={
            results:[],
            page,
            totalDocs
        }
    */

    else {
        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + countRoute, data_to_send,headers)
            .then(({ data: { totalDocs } }) => {
                obj = { results: data, page: 1, totalDocs }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    return obj;
}