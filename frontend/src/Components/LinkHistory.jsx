import React, { useState } from 'react'
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import Popup from './Popup';

export default function LinkHistory({link, onDelete, updateStatus }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }).format(date);
    };

    const handleClick = () => {
        navigate('/link/detailLink', { state: { link } });
    };

    

  return (
    <div className='flex justify-center'>
        <div className='w-[74rem] flex justify-between items-center p-2 hover:bg-slate-100 border'>
            
            <div className='flex-col'>
                <a href={link.originalUrl}><p className='truncate w-80'>{link.originalUrl}</p></a>
                <a href={`${process.env.HOST_PAGE}` + "/" + link.shortCode}><p className='truncate w-80'>{`${process.env.HOST_PAGE}` + "/" + link.shortCode}</p></a>     
            </div>
            
            
            <div className=''>
                <p>{formatDate(link.trafficDate)}</p>
            </div>

            <div className=''>
                <p>{link.isUsingPassword?"Có":"Không"}</p>
            </div>

            <div className=''>
                {link.active && (
                    <p className='text-green-500 rounded-full p-2'>Còn hoạt động</p>
                )}
                {!link.active && (
                    <p className='text-red-500 rounded-full p-2'>Không hoạt động</p>
                )}
            </div>

            <div className='r'>
                <p>{link.maxUsage==="0"?"Vô hạn":link.maxUsage}</p>
            </div>
            
            <div className='cursor-pointer hover:text-blue-500' onClick={handleClick}>
                <p>{link.traffic} Click</p>
            </div>

            <div onClick={() => setDropdownOpen(!dropdownOpen)} className="pr-10">
                <div className="cursor-pointer relative">
                    <FontAwesomeIcon icon={faEllipsisVertical} className="flex items-center hover:font-bold cursor-pointer "/>
                </div>

                <div onMouseLeave={() => setDropdownOpen(!dropdownOpen)}>
                    {dropdownOpen && (
                        <ul className="absolute right-0 mt-2 w-42 bg-white shadow-lg rounded-lg z-10">
                            <li className="block px-4 py-2 text-gray-800 hover:bg-slate-400 rounded-lg">
                                <div onClick={updateStatus}>Thay đổi trạng thái</div>
                            </li>

                            <li className="block px-4 py-2 text-gray-800 hover:bg-slate-400 rounded-lg">
                                <div onClick={openPopup}>Cập nhật đường dẫn</div>
                            </li>

                            <li className="block px-4 py-2 text-gray-800 hover:bg-slate-400 rounded-lg">
                                <div onClick={onDelete}>Xóa link</div>
                            </li>
                        </ul>
                    )}
                </div>
            </div>

            <Popup isOpen={isPopupOpen} onClose={closePopup} title="Cập nhật cho đường dẫn" link={link}/>

            
        </div>
    </div>
  )
}
