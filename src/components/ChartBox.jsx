import React, { useEffect, useState, useRef } from "react";
import ReactECharts from 'echarts-for-react';
import _ from 'lodash';
import { Modal } from 'bootstrap'


const ChartBox = ({ title, series, dates, min }) => {
    const echartRef = useRef();
    const [width, setWidth] = useState(window.innerWidth);
    const [labels, setLabels] = useState(dates)
    const [chart_series, setSeries] = useState(series)
    const handleWindowSizeChange = () => {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    const isMobile = width <= 768;

    const mobileFormatter = value => {
        let val = '';
        if (value >= 1000000) {
            val = value / 1000000 + 'm';
        } else if (value >= 1000) {
            val = value / 1000 + 'k';
        } else {
            val = value;
        }


        return val;
    }
    const desktopFormatter = value => {
        return value
    }

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const downloadChart = () => {
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

    const embeddedCode = () => {
        var url = window.location.href + '?embed_newcases';
        var div = document.createElement('textarea');
        var iframe = `<iframe width="700" height="400" src="${url}" frameBorder="0"></iframe>`;
        div.innerHTML = iframe;
        var element = document.getElementById('iframe');

        if (!element.hasChildNodes()) {
            // It has at least one
            element.appendChild(div);
        }

        var myModal = new Modal(document.getElementById('exampleModal'), {
            keyboard: false
        });
        myModal.show();
    }
    useEffect(() => {

        if (isMobile) {
            if (echartRef != null && echartRef != undefined) {
                const echartInstance = echartRef.current.getEchartsInstance();
                echartInstance.resize();
            }
        }
    }, [isMobile])

    useEffect(() => {
        setLabels(dates)
    }, [dates])

    useEffect(() => {
        const echartInstance = echartRef.current.getEchartsInstance();
        console.log(echartInstance)
        echartInstance.resize()
    }, [series])


    return (
        <div className="chart-box container">
            <div className="row">
                <div className="col-md-8 chart-wrapper">
                    <h3 className="chart-box--title">{title}</h3>
                    {
                        series ? 
                        <ReactECharts
                            ref={echartRef}
                            option={{
                                grid: isMobile ? { top: 20, bottom: 80, left: 60, right: 60 } : {},
                                legend: { icon: 'rect' },
                                yAxis: [
                                    {
    
                                        type: 'value',
                                        name: 'Total new tests conducted daily ',
                                        nameLocation: 'middle',
                                        nameGap: isMobile ? 40 : 60,
                                        nameTextStyle: {
                                            fontWeight: '500',
                                            fontFamily: 'Work Sans',
                                            fontSize: 12,
                                            color: '#000000'
                                        },
                                        axisLabel: {
                                            formatter: isMobile ? mobileFormatter : '{value}',
                                            fontWeight: '500',
                                            fontFamily: 'Work Sans',
                                            fontSize: 12,
                                            color: '#000000'
                                        }
                                    },
                                ],
                                xAxis: {
                                    type: 'category',
                                    name: 'Date',
                                    nameLocation: 'middle',
                                    nameGap: 40,
                                    nameTextStyle: {
                                        fontWeight: '500',
                                        fontFamily: 'Work Sans',
                                        fontSize: 12,
                                        color: '#000000'
                                    },
                                    axisLabel: {
                                        formatter: (function (value) {
                                            //value = value.split('T')[0];
                                            value = new Date(value)
                                            value = value.getDay() + 1 + " " + monthNames[value.getMonth()] + ", " + value.getFullYear()
                                            return value;
                                        }),
                                        fontWeight: '500',
                                        fontFamily: 'Work Sans',
                                        fontSize: 12,
                                        color: '#000000'
                                    },
                                    min: min,
                                    data: dates,
                                },
                                tooltip: {
                                    trigger: 'axis',
                                    formatter: function (params) {
                                        let date = params[0].axisValue.split('00:00:00 GM')[0]
                                        let label = '<strong>' + date + '</strong><hr/>';
                                        _.forEach(params, function (param) {
                                            //let value = (parseFloat(param.value)* 100).toFixed(0);
                                            let value = parseFloat(param.value)
                                            label += '<strong style="color: ' + param.color + '; text-transform: capitalize;">' + param.seriesName.replaceAll('_', ' ') + '</strong>: ' + value + '<br/>'
                                        })
    
                                        return label
                                    }
                                },
                                series: series
                            }}
                            style={{ height: '360px' }}
                        />:""
                    }
                    <div className="row">
                        <div className="col d-flex align-items-center">
                            <p className="source">Source: <a target="_blank" href="https://ourworldindata.org/">Our World in Data (OWID)</a></p>
                        </div>
                        <div className="col col-btns">
                            <a onClick={(e) => { e.preventDefault(); embeddedCode() }} className="share btn">Embed code</a>
                            <a target="_blank" href="https://ckandev.africadatahub.org/datastore/dump/214d4944-ee6f-42df-a44e-2efdb3259d98?bom=True" className="download-btn btn">Download data</a>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 text">
                    <h5>How to Read this Chart</h5>
                    <div className="text--box">
                        <p>
                        Number of tests that have been conducted daily to assess whether someone has COVID-19 or not. 
                        This is the value of all COVID-19 tests reported by the official health ministries daily from the start of the pandemic.
                         It is important to note that not every country shares their testing data daily. 

                            <br /><br />(This data is updated twice a week)
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="modal fade " id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Embed Code</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body" id="modal-body">
                            <div id="iframe"></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default ChartBox;