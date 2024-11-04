import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

function Popup({ isOpen, onClose, title, link}) {

  const [timeExpired, setTimeExpired] = useState("null");
  const [password, setPassword] = useState("null");
  const [maxUsage, setMaxUsage] = useState(0);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleUpdateShortLinkWithToken = async (token) => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
      
      const response = await fetch(
        `${process.env.UPDATE_URL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
	          zoneId: timeZone,
            shortCode: link.shortCode,
            timeExpired: timeExpired,
            password: password,
            maxUsage: maxUsage,
            active: true
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        toast.info('Cập nhật đường dẫn thành công.');
        onClose();
      } else {    
        toast.error('Cập nhật đường dẫn thất bại. Vui lòng thử lại sau.');
        console.error("API call failed");
        return ;
      }
    } catch (error) {
      navigate("/");
      console.error("Error calling API:", error);
    }

  }


  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-4xl w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">&times;</button>

        <h2 className="text-xl font-bold mb-4">{title} <span className='text-blue-500'>{`${process.env.HOST_PAGE}` + "/" + link.shortCode}</span></h2>
        {/* <div>{JSON.stringify(link)}</div> */}

        <div className='flex items-center justify-between p-2 mt-3'>
          <div className='flex-col'>
            <p className='font-semibold px-2'> Giới hạn truy cập </p>
            <p className='text-sm font-thin px-2'> Mặc định, hệ thống sẽ tạo link không có giới hạn truy cập. Bạn có thể đặt giới hạn đó. </p>
            <input onChange={(e) => setMaxUsage(e.target.value)}  type="number" className='w-[80%] border rounded focus:outline-none p-1 m-2 bg-white' placeholder='Giới hạn truy cập'/>
          </div>
          <div className='flex-col'>
            <p className='font-semibold px-2'> Thời gian hiệu lực </p>
            <p className='text-sm font-thin px-2'> Sau 00:00 phút của ngày được chọn, link sẽ không còn hiệu lực. Để trống nếu giữ vĩnh viễn link. </p>
            <input onChange={(e) => {setTimeExpired(e.target.value+"T00:00:00Z"); console.log(e.target.value+timeExpired);}}  type="date" min={minDate} className='w-[80%] border rounded focus:outline-none p-1 m-2 bg-white' placeholder='MM/DD/YYYY'/>
          </div>
          <div className='flex-col'>
            <p className='font-semibold px-2'> Mật khẩu bảo vệ </p>
            <p className='text-sm font-thin px-2'> Đặt mật khẩu để bảo vệ link rút gọn. Để trống nếu bạn không muốn đặt mật khẩu.</p>
            <input onChange={(e) => setPassword(e.target.value)}  type="text" className='w-[80%] border rounded focus:outline-none p-1 m-2 bg-white' placeholder='Mật khẩu bảo vệ'/>
          </div>
        </div>
        <div className='flex items-center justify-between p-2 mt-3'>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Đóng</button>
          <button onClick={()=>handleUpdateShortLinkWithToken(Cookies.get("token"))} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Cập nhật</button>
        </div>
      </div>
    </div>
  );
}

export default Popup;