
'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from './UserContext';
import http_request from "../../../http-request"

import {   Logout, MarkChatRead, NotificationsNone, Payment, Person, Report, ReportOff, RequestPage, Settings, Summarize, Support, SupportAgent, UsbRounded, VerifiedUserRounded, Visibility, Wallet, Warning, Work } from '@mui/icons-material';
 
 

export default function SidebarHeader( ) {
  
  const [expanded, setExpanded] = useState(false);
 
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const [notifications, setNotifications] = useState([]);

  const [value, setValue] = useState(null);
  const [data, setData] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [notificationsPerPage] = useState(5);

  const { user } = useUser()


  useEffect(() => {
    if (user) {
      setValue(user);
      getAllNotification();
      if (user?.user?.role === "EMPLOYEE") {
        getAllEmpDashboard();
      } else {
        getAllDashboard();
      }
    }
  }, [user]);

  const getAllDashboard = async () => {
    try {
      const endPoint =
        user?.user.role === "ADMIN" ? "/dashboardDetails"
          : user?.user.role === "DEALER" ? `/dashboardDetailsByDealerId/${user?.user?._id}`
            : user?.user.role === "BRAND" ? `/dashboardDetailsByBrandId/${user?.user?._id}`
              : user?.user.role === "BRAND EMPLOYEE" ? `/dashboardDetailsByBrandId/${user?.user?.brandId}`
                : user?.user.role === "USER" ? `/dashboardDetailsByUserId/${user?.user?._id}`
                  : user?.user.role === "TECHNICIAN" ? `/dashboardDetailsByTechnicianId/${user?.user?._id}`
                    : user?.user.role === "SERVICE" ? `/dashboardDetailsBySeviceCenterId/${user?.user?._id}`
                      : "";

      const { data } = await http_request.get(endPoint);
      setData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const getAllEmpDashboard = async () => {
    try {
      const { data } = await http_request.post(
        "/dashboardDetailsByEmployeeStateZone",
        { stateZone: user?.user?.stateZone, brand: user?.user?.brand }
      );
      setData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const getAllNotification = async () => {
    try {
      const endPoint =
        user?.user?.role === "ADMIN" ? `/getAllNotification`
          : user?.user?.role === "USER" ? `/getNotificationByUserId/${user?.user?._id}`
            : user?.user?.role === "BRAND" ? `/getNotificationByBrandId/${user?.user?._id}`
              : user?.user?.role === "SERVICE" ? `/getNotificationByServiceCenterId/${user?.user?._id}`
                : user?.user?.role === "TECHNICIAN" ? `/getNotificationByTechnicianId/${user?.user?._id}`
                  : user?.user?.role === "DEALER" ? `/getNotificationByDealerId/${user?.user?._id}`
                    : "";

      const { data } = await http_request.get(endPoint);
      setNotifications(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleReadMark = async (id) => {
    try {
      const status =
        user?.user?.role === "ADMIN" ? { adminStatus: "READ" }
          : user?.user?.role === "USER" ? { userStatus: "READ" }
            : user?.user?.role === "BRAND" ? { brandStatus: "READ" }
              : user?.user?.role === "SERVICE" ? { serviceCenterStatus: "READ" }
                : user?.user?.role === "TECHNICIAN" ? { technicianStatus: "READ" }
                  : user?.user?.role === "DEALER" ? { dealerStatus: "READ" }
                    : {};

      const { data } = await http_request.patch(`/editNotification/${id}`, status);
      setRefresh(data);
    } catch (err) {
      console.log(err);
    }
  };

  const indexOfLastNotification = (currentPage + 1) * notificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
  const currentNotifications = notifications.slice(indexOfFirstNotification, indexOfLastNotification);

  const unreadNoti =
    value?.user?.role === "ADMIN" ? notifications?.filter((n) => n.adminStatus === "UNREAD")
      : value?.user?.role === "BRAND" ? notifications?.filter((n) => n.brandStatus === "UNREAD")
        : value?.user?.role === "SERVICE" ? notifications?.filter((n) => n.serviceCenterStatus === "UNREAD")
          : value?.user?.role === "TECHNICIAN" ? notifications?.filter((n) => n.technicianStatus === "UNREAD")
            : value?.user?.role === "USER" ? notifications?.filter((n) => n.userStatus === "UNREAD")
              : value?.user?.role === "DEALER" ? notifications?.filter((n) => n.userStatus === "UNREAD")
                : [];

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/sign_in")

  }

  return (
    <div className="flex-1 flex flex-col transition-all duration-300 overflow-x-auto" style={{ marginLeft: expanded ? '15rem' : '4rem' }}>
     
    
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* Topbar - fixed at the top */}
        {/* <header
          className="fixed top-0 right-0 z-40 h-14 bg-white shadow flex items-center justify-between px-4 transition-all duration-300"
          style={{ left: expanded ? '15rem' : '4rem' }} // 15rem = 240px (w-60), 4rem = 64px (w-16)
        > */}
        <header className="fixed md:px-6 px-4 top-0 left-0 right-0 z-40 h-14 bg-white shadow flex items-center justify-between transition-all duration-300">
          {/* Left: Logo */}
          <div className="flex items-center space-x-2">
            <img src="/Logo.png" alt="Logo" className="w-[6rem] h-auto" />
            {/* <span className="text-lg font-semibold">Your Brand</span> */}
          </div>

          {/* Center (Optional controls can go here) */}
          <div className="flex items-center space-x-2">

          {/* Right side: Notifications and Profile */}
           <div className='flex items-center'>
                   <div className='font-semibold md:text-xl text-sm md:block hidden'>{value?.user?.role === "SERVICE" ? (value?.user?.serviceCenterName) : value?.user?.role === "BRAND" ? (value?.user?.brandName) : value?.user?.name}</div>
                    <div onClick={() => {
                     router.push(`/profile/${value?.user?._id}`)
                   }}
                     className='ms-5 w-[30px] h-[30px] bg-blue-600 flex justify-center items-center  text-white  font-bold cursor-pointer rounded-full'>
                      <Person />
                    </div>
                    </div>
          <div className="flex items-center   relative">
            {/* Notification */}
            
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative ">
              
              <NotificationsNone className="cursor-pointer w-[30px] h-[30px] bg-yellow-600 rounded-full text-gray-600 hover:text-black text-xl" />
              {unreadNoti.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {unreadNoti.length > 9 ? "9+" : unreadNoti.length}
                </span>
              )}
            </button>
  

            {/* Notification Dropdown */}
            {showNotifications && (
              <div
                ref={notificationRef}
                className="absolute right-0 top-10 bg-white border shadow-md md:w-[500px] w-[300px] max-h-96 overflow-y-auto z-50 rounded-md"
              >
                {currentNotifications.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500">No notifications</p>
                ) : (
                  currentNotifications.map((notification, i) => (
                    <div key={notification?._id} className='p-2 text-black border-b flex justify-left items-center'>
                      <div className='  me-3'>
                        <div className=' flex justify-center items-center bg-[#3f89aa]  rounded-full w-[30px] h-[30px] text-white'>
                          {i + 1 + currentPage * notificationsPerPage}
                        </div>
                      </div>
                      <div className='flex items-center '>                                   <div>
                        {`${notification?.message}  Complaint_Id : ${notification?.compId || 'NA'}`}
                      </div>
                        {notification?.compId &&
                          <button onClick={() => {
                            handleReadMark(notification?._id);
                            router.push(`/complaint/details/${notification?.complaintId}`);
                          }} className=" rounded-md p-2 cursor-pointer bg-[#3f89aa] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black">
                            <Visibility />
                          </button>
                        }
                        {(value?.user?.role === "ADMIN" ? notification?.adminStatus === "UNREAD"
                          : value?.user?.role === "BRAND" ? notification?.brandStatus === "UNREAD"
                            : value?.user?.role === "USER" ? notification?.userStatus === "UNREAD"
                              : value?.user?.role === "SERVICE" ? notification?.serviceCenterStatus === "UNREAD"
                                : value?.user?.role === "TECHNICIAN" ? notification?.technicianStatus === "UNREAD"
                                  : value?.user?.role === "DEALER" ? notification?.userStatus === "UNREAD"
                                    : ""
                        ) && (
                            <div className='flex items-center'>

                              <button onClick={() => handleReadMark(notification?._id)} className="ms-2 rounded-md p-2 cursor-pointer bg-[#3f89aa] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black">
                                <MarkChatRead />
                              </button>
                            </div>
                          )}
                      </div>
                    </div>
                  ))
                )}

                {/* Pagination */}
                <div className="flex justify-between items-center p-2 text-sm">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="text-blue-600 disabled:text-gray-400"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) =>
                        (p + 1) * notificationsPerPage < notifications.length ? p + 1 : p
                      )
                    }
                    disabled={(currentPage + 1) * notificationsPerPage >= notifications.length}
                    className="text-blue-600 disabled:text-gray-400"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}


            {/* Profile */}
            <div className="flex items-center space-x-2">
              <div onClick={handleLogout} className='ms-2 w-[30px] h-[30px] bg-red-600 flex justify-center items-center  text-white  font-bold cursor-pointer rounded-full'>
                <Logout fontSize='large' className='pl-2' />
              </div>
            </div>
          </div>
          </div>
        </header>

       
      </div>

    </div>
  );
}
