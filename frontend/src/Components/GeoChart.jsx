import React from "react";
import { Chart } from "react-google-charts";


const GeoChart = ({ label, data, labels, width }) => {

    const data1 = [
        ["Country", "Popularity"],
        ["Germany", 2],
        ["United States", 16],
        ["Brazil", 12],
        ["Canada", 6],
        ["France", 4],
        ...data.map(item => [item.name, parseInt(item.data)])
    ];

    console.log(data);
    

  return (
    <div className="flex justify-center items-center">
        <div className={`w-[${width}rem] h-96`}>
            <Chart chartType="GeoChart" width="100%" height="100%" data={data1}/>
        </div>
    </div>
  );
};

export default GeoChart;
