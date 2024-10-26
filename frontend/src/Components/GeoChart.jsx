import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";



const timezoneToCountryCode = {
  "Asia/Saigon": "VN",       // Việt Nam
  "Pacific/Honolulu": "US",   // Hoa Kỳ (Hawaii)
  "Australia/Sydney": "AU",   // Úc
  "Asia/Seoul": "KR",         // Hàn Quốc
  "Europe/Paris": "FR",       // Pháp
  "America/Sao_Paulo": "BR",  // Brazil
  "Asia/Shanghai": "CN",      // Trung Quốc
};

const GeoChart = ({ label, data, labels, width }) => {

    const [timezoneData, setTimezoneData] = useState([
      ["Country", "Popularity"],
    ]);

    useEffect(() => {
      if (data) {
        const chartData = data.map(zone => [
          timezoneToCountryCode[zone.name] || "Unknown",
          parseInt(zone.data, 10),
        ]);
        setTimezoneData(prevData => [...prevData, ...chartData]);
      }
    }, [data]);



    // const data1 = [
    //     ["Country", "Popularity"],
    //     ["Germany", 2],
    //     ["United States", 16],
    //     ["Brazil", 12],
    //     ["Canada", 6],
    //     ["France", 4],
    //     ...data.map(item => [item.name, parseInt(item.data)])
    // ];

    console.log(timezoneData);
    console.log(data);
    

  return (
    <div className="flex justify-center items-center">
        {/* <div className={`w-[${width}rem] h-96`}> */}
        <div style={{ width: `${width}rem`, height: "24rem" }}>
            <Chart chartType="GeoChart" width="100%" height="100%" data={timezoneData}/>
        </div>
    </div>
  );
};

export default GeoChart;
