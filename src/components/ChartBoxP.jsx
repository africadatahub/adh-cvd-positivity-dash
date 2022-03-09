import React, { useEffect, useState } from "react";
import ReactECharts from 'echarts-for-react';
import _ from 'lodash';


const ChartBox = ({ title, series, dates, min }) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
    



    // useEffect(()=>{
    // },[])
    return (
        <div className="chart-box container">
            <div className="row">
                <div className="col-md-9">
                    <h3 className="chart-box--title">{title}</h3>
                    <ReactECharts
                        option={{
                            legend: {},
                            yAxis: [
                                {
                                        
                                    type: 'value',
                                    name: 'Value',
                                    nameLocation : 'middle',
                                    position: 'left',
                                    nameGap: 80,
                                    offset: 0,
                                    axisLabel: {
                                        formatter: '{value}'
                                    }
                                },
                            ],
                            xAxis: {
                                type: 'category', 
                                name: 'Date',
                                nameLocation : 'middle',
                                nameGap: 50,
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
                        style={{ height: '360px', width:"100%" }}
                    />
                    <div className="row">
                        <div className="col d-flex align-items-center">
                            <p className="source">Source: <a href="/#">Our World in Data (OWID)</a></p>
                        </div>
                        <div className="col col-btns">
                            <a href="" className="download-btn btn">Download data</a>
                            <a href="" className="share btn">Share</a>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 text">
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