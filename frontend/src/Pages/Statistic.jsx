import React, { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import timesNewRomanFont from '../font/TimesNewRoman';
import LineChartCustom from '../Components/LineChartCustom';
import LineChart from '../Components/LineChart';
import BarChart from '../Components/BarChart';
import GeoChart from '../Components/GeoChart';
import PieChart from '../Components/PieChart';

export default function Statistic() {

  const [arrDay, setArrDay] = useState({label:[], data:[]});
  const [arrMonth, setArrMonth] = useState({label:[], data:[]});
  const [traffic, setTraffic] = useState();

  const [statisticData, setStatisticData] = useState({});

  const [checkedItems, setCheckedItems] = useState([false, false, false, false]); // Mảng để lưu trạng thái checkbox

  const lineChartRef = useRef();
  const barChartRef = useRef();
  const pieChartRef = useRef();
  const geoChartRef = useRef();




  const handleToggle = (index) => {
    // Tạo một bản sao mới của mảng checkedItems và thay đổi trạng thái checkbox ở vị trí index
    const updatedCheckedItems = checkedItems.map((item, i) =>
      i === index ? !item : item // Đảo ngược giá trị chỉ của checkbox tại index
    );
    setCheckedItems(updatedCheckedItems); // Cập nhật trạng thái
  };

  // console.log(shortCodeData);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("link"))) {
      setStatisticData(JSON.parse(localStorage.getItem("link")))
    }
  }, [])

  useEffect(() => {
    console.log(statisticData);

    if (Cookies.get('token') && statisticData) {
      getArrMonth(Cookies.get('token'), statisticData.shortCode);
      getArrDay(Cookies.get('token'), statisticData.shortCode);
    }
    
  }, [statisticData])

  const getArrMonth = async (token, shortCode) => {       
    const extractDatesAndValues = (dataArray) => {
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
          return { dates: [], values: [] };
        }
        const dates = dataArray.map(item => item.name);
        const values = dataArray.map(item => item.data);
        return { dates, values };
    };
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
        const response = await fetch(
            `${process.env.GET_DATA_MONTH}`,
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                "shortCode":shortCode,
                "zoneId": timeZone,
                // "shortCode":"FjppMm",
            }),
            },
        );
    
        if (response.ok) {
            // Xử lý khi API trả về thành công
            const data = await response.json();
            // console.log("ngày trong tuần");
            // console.log(data.data);
            
            const extract = extractDatesAndValues(data.data.trafficData);
            // console.log(extract);

            setArrMonth({
                label: extract.dates,
                data: extract.values
            })
            
        } else {
                // Xử lý khi API trả về lỗi
                console.error("API call failed");
                return ;
        }
    } catch (error) {
        // Xử lý lỗi khi gọi API
        console.error("Error calling API:", error);
    }
}

const getArrDay = async (token, shortCode) => {
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng từ 0 đến 11
        const day = String(date.getDate()).padStart(2, '0'); // Ngày từ 1 đến 31
        return `${year}-${month}-${day}`;
    };
    const extractDatesAndValues = (dataArray) => {
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
          return { dates: [], values: [] };
        }
        const dates = dataArray.map(item => item.name);
        const values = dataArray.map(item => item.data);
        return { dates, values };
    };
    const today = new Date();
    const daysAgo = new Date();
    daysAgo.setDate(today.getDate() - 1);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
        const response = await fetch(
            `${process.env.GET_DATA_DAY}`,
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                // "shortCode":"FjppMm",
                "shortCode":shortCode,
                "fromDate": formatDate(today),
                "toDate": formatDate(today),
                "zoneId": timeZone,

            }),
            },
        );
    
        if (response.ok) {
            // Xử lý khi API trả về thành công
            const data = await response.json();
            console.log(data.data)
            const extract = extractDatesAndValues(data.data.click)
            console.log(extract);
            
            setArrDay({
                label: extract.dates,
                data: extract.values
            })

            setTraffic(data.data)
            
        } else {
            // Xử lý khi API trả về lỗi
            console.error("API call failed");
            return ;
        }
    } catch (error) {
        // Xử lý lỗi khi gọi API
        console.error("Error calling API:", error);
    }
}



const handleExportPDF = async () => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Hàm phụ để kiểm tra và thêm hình ảnh vào PDF
  const addChartToPDF = async (chartRef) => {
    if (chartRef?.current) {
      const chartCanvas = await html2canvas(chartRef.current);
      const chartImgData = chartCanvas.toDataURL('image/png');
      pdf.addImage(
        chartImgData, 
        'PNG', 
        0, 
        0, 
        pageWidth, 
        (chartCanvas.height * pageWidth) / chartCanvas.width
      );
      pdf.addPage(); // Tạo trang mới nếu có biểu đồ tiếp theo
    }
  };

  // Thêm biểu đồ vào PDF nếu tồn tại
  await addChartToPDF(lineChartRef);
  await addChartToPDF(barChartRef);
  await addChartToPDF(pieChartRef);
  await addChartToPDF(geoChartRef);

  // Xóa trang trống cuối cùng nếu không có biểu đồ nào khác sau GeoChart
  if (pdf.getNumberOfPages() > 1) pdf.deletePage(pdf.getNumberOfPages());

  // Lưu PDF
  pdf.save('statistics-report.pdf');
};






  
  
  return (
    <div className='flex bg-gray-100 h-screen'>
      <div className='w-[25%]'>
        <ul className='flex flex-col items-center justify-center p-2 my-5 space-y-2 bg-white rounded-lg py-5'>
          <li className='flex items-center p-2 w-[80%] rounded-md m-1 font-semibold text-lg'>Lựa chọn nội dung báo cáo</li>
          {['Nội dung thống kê theo giờ', 'Nội dung phát triển theo ngày', 'Nội dung chi tiết truy cập', 'Nội dung về khu vực truy cập'].map((item, index) => (
            <li
              key={index}
              className='flex items-center hover:bg-gray-200 hover:font-bold cursor-pointer p-2 w-[80%] rounded-md m-1'
              onClick={() => handleToggle(index)} // Cập nhật trạng thái checkbox khi nhấp vào
            >
              <input
                type="checkbox"
                checked={checkedItems[index]} // Gán giá trị checked từ trạng thái
                readOnly // Ngăn người dùng tương tác trực tiếp
                className="mr-2"
              />
              {item}
            </li>
          ))}
        </ul>

        <div>
          <button onClick={handleExportPDF} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Xuất các thống kê</button>
        </div>
      </div>
      <div className='w-[75%] overflow-auto'>
        <div className='flex flex-col items-center justify-center border rounded-lg p-5 m-5'>
          <div className='w-[794px] flex flex-col bg-white rounded-lg p-20 py-20'>
            <div className='hover:bg-gray-100 text-center font-bold text-xl my-1'>
              <h1>Báo cáo thống kê cho đường dẫn</h1>
            </div>

            <div className='hover:bg-gray-100 my-1'>
              <h4 className='text-lg'>Báo cáo thống kê cho đường dẫn</h4>
              <p className=''>Đường dẫn Gốc: {statisticData.originalUrl}</p>
              <p className=''>Đường dẫn rút gọn: {`${process.env.HOST_PAGE}` + "/" + statisticData.shortCode}</p>
            </div>

            {checkedItems[0] && <div className='hover:bg-gray-100 my-2' ref={barChartRef}>
              <h4 className='text-lg'>Nội dung thống kê theo giờ</h4>
              <BarChart label="Biểu đồ theo giờ" labels={arrDay.label} data={arrDay.data} width={68}/>
              
            </div>}

            {checkedItems[1] && <div className='hover:bg-gray-100 my-2' ref={lineChartRef} >
              <h4 className='text-lg'>Nội dung phát triển theo ngày</h4>
              <LineChart label="Biểu đồ theo ngày" labels={arrMonth.label} data={arrMonth.data} width={68} />
              
            </div>}

            {checkedItems[2] && <div className='hover:bg-gray-100 my-2' ref={pieChartRef}>
              <h4 className='text-lg'>Nội dung chi tiết truy cập</h4>
              <div className='flex'>
                {traffic && (<div className='w-72 h-80 bg-white m-2 rounded-lg border'>
                  <PieChart 
                      label="Biểu đồ các thiết bị truy cập" 
                      labels={traffic.deviceTypes.map(item => item.name || "Không xác định")} 
                      data={traffic.deviceTypes.map(item => item.data)} 
                  />
                </div>)}

                {traffic && (<div className='w-72 h-80 bg-white m-2 rounded-lg border'>
                  <PieChart 
                      label="Biểu đồ khu vực truy cập" 
                      labels={traffic.zoneIds.map(item => item.name || "Không xác định")} 
                      data={traffic.zoneIds.map(item => item.data)} 
                  />
                </div>)}

                
              </div>
              <div className='flex'>
                {traffic && (<div className='w-72 h-80 bg-white m-2 rounded-lg border'>
                  <PieChart 
                    label="Biểu đồ trình duyệt truy cập" 
                    labels={traffic.browsers.map(item => item.name || "Không xác định")} 
                    data={traffic.browsers.map(item => item.data)} 
                  />
                </div>)}
              </div>
            </div>}

            {checkedItems[3] && <div className='hover:bg-gray-100 my-2' ref={geoChartRef}>
              <h4 className='text-lg my-2'>Nội dung về khu vực truy cập</h4>
              <GeoChart label="Biểu đồ theo giờ" labels={arrDay.label} data={traffic.zoneIds} width={68}/>
            </div>}

          </div>
        </div>
      </div>
        
    </div>
  )
}
