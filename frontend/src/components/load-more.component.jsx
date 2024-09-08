

const LoadMoreBlog = ({ state, fetchDataFun,additionalParam }) => {

    // here we have to check two condition 

    /* condition :1  [ state is null or not if null then there is not blog in database
     because intially data fetched by home page useEffect() ]
    */

    /*condition :2  [ state.results.length not greater then total blogs in database 
    if state.results.length <totalDocs then load more button call the fetching of latest blog 
    function fetchLatestBlogs() otherwise pagination not work and not load more 
    ] 
    */

    if (state != null && state.results.length < state.totalDocs) {
        return (
            <button
                onClick={() => fetchDataFun({...additionalParam, page: state.page + 1 })}
                className="text-darkgrey p-2 px-3 hover:bg-grey/50 rounded-md flex items-center gap-2"
            >
                Load More
            </button>
        )
    }

}

export default LoadMoreBlog;