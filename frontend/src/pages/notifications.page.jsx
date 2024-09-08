import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { filterPaginationData } from "../common/filter-pagination-data";
import Loader from "../components/loader.component";
import { AnimationWrapper } from "../common";
import { LoadMoreBlog, NoDataMessage, NotificationCard } from "../components";


const NotificationPage = () => {

    const [filter, setFilter] = useState("all");

    let { userAuth: { access_token } } = useContext(UserContext);


    const [notifications, setNotifications] = useState(null)

    const filters = ["all", "like", "reply", "comment"]


    async function fetchNotificationByFilter({ page, deletedDocCount = 0 }) {

        await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/user/get-filter-notification", {
            page, filter, deletedDocCount
        }, {
            withCredentials: true,
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        }).then(async ({ data: { notifications: data } }) => {

            let formatData = await filterPaginationData({
                state: notifications,
                data: data,
                page: page,
                countRoute: '/user/count-notifications',
                data_to_send: { filter },
                user: access_token
            })


            setNotifications(formatData)
            //setUserAuth({...userAuth,...data})
        }).catch((err) => {
            console.log(err)
        })
    }

    useEffect(() => {
        if (access_token) {
            fetchNotificationByFilter({ page: 1 })
        }
    }, [access_token, filter])

    return (


        <div>
            <h1 className="max-md:hidden text-dark-grey text-xl ">Recent Notification</h1>

            <div className="flex gap-6 my-8 ">
                {
                    filters.map((filtername, i) => {
                        return (
                            <button
                                key={i}
                                onClick={(e) => { setFilter(e.target.innerText.toLowerCase()); setNotifications(null) }}
                                className={`p-2 px-4 ${filter == filtername ? "btn-dark" : "btn-light"} capitalize`}
                            >
                                {filtername}
                            </button>
                        )
                    })
                }
            </div>

            {
                notifications==null?<Loader/>:
                <>
                {
                    notifications.results.length?
                    notifications.results.map((notification,i)=>{
                        return (
                            <AnimationWrapper key={i} transition={{delay:i*0.08}}>
                                <NotificationCard data={notification} index={i} notificationState={{notifications,setNotifications}} />
                            </AnimationWrapper>
                        )
                    }):<NoDataMessage message={`not any ${filter} available`}/>
                }

                {/* more data loader function button */}
                <LoadMoreBlog state={notifications} fetchDataFun={fetchNotificationByFilter} additionalParam={{deletedDocCount:notifications.deletedDocCount}}/>
                </>
            }
        </div>
    )
}

export default NotificationPage