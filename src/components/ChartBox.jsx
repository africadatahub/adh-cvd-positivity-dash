import React, { useEffect, useState } from "react";
import ReactECharts from 'echarts-for-react';
import _ from 'lodash';


const ChartBox = ({ title, series, dates, min }) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
    



    useEffect(()=>{
    },[series])
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
                                        formatter: '{value}',
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
                        style={{ height: '360px' }}
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
                        Total number of tests that have been conducted to assess whether someone has COVID-19 or not. This is the cumulative value of all COVID-19 tests reported by the official health ministries from the start of the pandemic. The number of tests does not refer to the same in each country – one difference is that some countries report the number of people tested, while others report the number of tests performed (which can be higher if the same person is tested more than once). And other countries report their testing data in a way that leaves it unclear what the test count refers to exactly. Different countries include different types of tests in their reporting. For example, Zimbabwe reports on PCR and antigen COVID-19 tests while Senegal only reports on PCR testing.

                        <br/><br/>(This data is updated twice a week)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ChartBox;