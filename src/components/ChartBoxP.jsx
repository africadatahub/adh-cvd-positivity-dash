import React, { useEffect, useState, useRef } from "react";
import ReactECharts from 'echarts-for-react';
import _ from 'lodash';


const ChartBox = ({ title, series, dates, min }) => {
    const echartRef = useRef();
    const [width, setWidth] = useState(window.innerWidth);
    const handleWindowSizeChange =()=>{
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);
    
    const isMobile = width <= 768;

    const mobileFormatter = value =>{
        let val = '';
        if(value >= 1000000) {
            val = value / 1000000 + 'm';
        } else if(value >= 1000) {
            val = value / 1000 + 'k';
        } else {
            val = value;
        } 


        return val;
    }
    const desktopFormatter = value =>{
        return value
    }

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const downloadChart = ()=>{
        const echartInstance = echartRef.current.getEchartsInstance();
        echartInstance.setOption({
            graphic: [
                { 
                    type: 'image',
                    left: 'center', 
                    top: '0%',  
                    style: {
                        image: '/adh-logo.svg',
                        width: 150,
                        opacity: 0.3
                    }
                }
            ]    
        })
        var a = document.createElement("a");
        a.href = echartInstance.getDataURL({
            pixelRatio: 2,
            backgroundColor: '#fff'
        });
        a.download = true
        a.click();
    }

    useEffect(()=>{
        
        if(isMobile){
            if(echartRef != null && echartRef != undefined){
                const echartInstance = echartRef.current.getEchartsInstance();
                echartInstance.resize();
            }
        }
    },[isMobile])

    useEffect(()=>{
        console.log(echartRef.current.getEchartsInstance())
    },[series])
    return (
        <div className="chart-box container">
            <div className="row">
                <div className="col-md-8 chart-wrapper">
                    <h3 className="chart-box--title">{title}</h3>
                    <ReactECharts
                    ref={echartRef}
                        option={{
                            grid: isMobile ? { top:20, bottom: 80, left: 60, right: 60} : {},
                            legend: {},
                            yAxis: [
                                {
                                        
                                    type: 'value',
                                    name: 'Value',
                                    nameLocation : 'middle',
                                    nameGap: 40,
                                    nameTextStyle : {
                                        fontWeight: '500',
                                        fontFamily : 'Work Sans',
                                        fontSize: 12,
                                        color:'#000000'
                                    },
                                    axisLabel: {
                                        formatter: isMobile ? mobileFormatter : '{value}',
                                        fontWeight: '500',
                                        fontFamily : 'Work Sans',
                                        fontSize: 12,
                                        color:'#000000'
                                    }
                                },
                            ],
                            xAxis: {
                                type: 'category', 
                                name: 'Date',
                                nameLocation : 'middle',
                                nameGap: 40,
                                nameTextStyle : {
                                    fontWeight: '500',
                                    fontFamily : 'Work Sans',
                                    fontSize: 12,
                                    color:'#000000'
                                },
                                axisLabel: { 
                                    formatter: (function(value){
                                        value = value.split('T')[0];
                                        value = new Date(value)
                                        value = value.getDay() + 1 + " "+ monthNames[value.getMonth()] + ", "+ value.getFullYear()
                                        return value;
                                    }),
                                    fontWeight: '500',
                                    fontFamily : 'Work Sans',
                                    fontSize: 12,
                                    color:'#000000'
                                },
                                min: min,
                                data: dates,
                            },
                            tooltip: {
                                trigger: 'axis',
                                formatter: function (params) {
                                    let newValue = params[0].axisValue.split('T')[0]
                                    newValue = new Date(newValue)
                                    newValue = newValue.getDay() + 1 + " "+ monthNames[newValue.getMonth()] + ", "+ newValue.getFullYear()
                                    let label = '<strong>' + newValue + '</strong><hr/>';
                                    _.forEach(params, function(param) {
                                        let value = Math.round(param.value);
                                        if(param.seriesName == 'positive_rate') {
                                            value = (Math.round(param.value * 100) / 100) + '%';
                                        }
                                        if(param.seriesName == 'reproduction_rate') {
                                            value = Math.round(param.value * 100) / 100;
                                        }
                                        label += '<strong style="color: ' + param.color + '; text-transform: capitalize;">' + param.seriesName.replaceAll('_',' ') + '</strong>: ' + value + '<br/>'
                                    })
                      
                                    return label
                                }
                            },
                            series: series
                        }}
                        style={{ height: '360px' }}
                    />
                    <div className="row">
                        <div className="col d-flex align-items-center">
                            <p className="source">Source: <a href="/#">Our World in Data (OWID)</a></p>
                        </div>
                        <div className="col col-btns">
                            <a href="" className="share btn">Share</a>
                            <a onClick={(e)=>{e.preventDefault(); downloadChart()}} className="download-btn btn">Download data</a>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 text">
                    <h5>How to Read this Chart</h5>
                    <div className="text--box">
                        <p>
                        Not every COVID-19 test yields a positive result. The positivity rate compares the volume of new confirmed cases with the number of tests undertaken. An increase in positivity rate could therefore signal a potential resurgence in COVID-19 infections if testing remains constant. If testing does not keep up with rising numbers of new cases, there is a risk that many people may have COVID-19 without knowing it and without isolating from others. It is therefore important for us to know how the rate of testing compares to the number of positive COVID-19 cases. According to the World Health Organisation (WHO) (May 2020), a positivity rate of less than 5% for two weeks is one indicator that the pandemic is under control in a country. 
*This value is given as a rolling 7-day average which takes data from the last 7 days, adds it
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ChartBox;