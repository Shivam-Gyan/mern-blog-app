


// this component switches between the two component like home and trending section
// which take array of route as a prop to navigate for example-
// if we have to navigate between home and trending section se pass the prop ["home","trending"]

import { useEffect, useRef, useState } from "react"

export let activeNavPageRef;
export let activeTabRef;


const InPagenavigation = ({ routes,defaultHidden=[],defaultIndex=0,children }) => {

    activeNavPageRef=useRef();
    activeTabRef=useRef();

    const [pageNavIndex,setPageNavIndex]=useState(defaultIndex)

    const changePageState=(btn,i)=>{

        let {offsetWidth,offsetLeft}=btn

        activeNavPageRef.current.style.width=offsetWidth+"px"
        activeNavPageRef.current.style.left=offsetLeft+"px"
        setPageNavIndex(i)
    }

    useEffect(()=>{
        changePageState(activeTabRef.current,defaultIndex)
    },[])

    return (
        <>
            <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
                {routes.map((route, i) => {
                    return (
                        <button 
                        ref={i==defaultIndex?activeTabRef:null}
                        className={`p-4 px-5 capitalize ${pageNavIndex==i?" text-black":" text-dark-grey"}
                         ${defaultHidden.includes(route)?"md:hidden":""}`} 
                        key={i}

                        // when we click on button it tells the hr which button is active now 
                        onClick={(e)=>changePageState(e.target,i)}
                        >
                            {route}
                        </button>
                    )
                })}

                <hr  ref={activeNavPageRef} className="absolute bottom-0 duration-300"/>
            </div>

            {/* here children is array of tags(h1,h2,p etc.) and we checking the children have multiple tag or 
            not if yes then it is a array of tag and return  0 index element of children */}
            {Array.isArray(children)?children[pageNavIndex]:children}

        </>
    )
}

export default InPagenavigation