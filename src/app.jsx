import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { parse } from 'papaparse';
import _ from 'lodash';
import './app.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Row, Col } from "react-bootstrap";
import { faTimes, faExclamationTriangle, faRedo, faPlay, faPause, faArrowLeft, faStepForward, faStepBackward } from '@fortawesome/free-solid-svg-icons';
import { Header } from './components/Header';
import Spinner from 'react-bootstrap/Spinner';
import Intro from './components/Intro';
import Footer from './components/Footer';
import ChartBox from './components/ChartBox';
import ChartBoxP from './components/ChartBoxP';
import DateRange from "./components/DateRange";
import SelectCountries from "./components/SelectCountries";
import axios from 'axios';



function App() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [records, setRecords] =  useState([])
  const [scrollPosition, setScrollPosition] = useState(0);
  //New Tests: Regional Comparison
  const [series1, setSeries1] = useState({})
  const [series2, setSeries2] = useState({})
  const [series, setSeries] = useState()
  const [dates, setDates] = useState([])

  //Positivity Rate: Regional Comparison
  const [seriesP, setSeriesP] = useState()
  const [datesP, setDatesP] = useState([])
  const [seriesP1, setSeriesP1] = useState({})
  const [seriesP2, setSeriesP2] = useState({})


  const [no_embed_style, set_no_embed_style] = useState({ paddingTop: '20px' })
  const [selectedCountry1, setSelectedCountries1] = useState()
  const [selectedCountry2, setSelectedCountries2] = useState()
  const [country1, setCountry1] = useState()
  const [country2, setCountry2] = useState('')
  const [duration, setDuration] = useState()


  const countrySelect1 = (country) => {
    if (_.find(selectedCountry1, function (o) { return o.iso_code == country.iso_code }) == undefined) {
      setSelectedCountries1(country);
      setCountry1(country.location)
      api(updateCountry1, country.location )
      console.log(country)
      //setFlag1(country)
    }
  }

  const countrySelect2 = (country) => {
    if (_.find(selectedCountry2, function (o) { return o.iso_code == country.iso_code }) == undefined) {
      setSelectedCountries2(country);
      setCountry2(country.location)
      //api(updateCountry2, country.location )
    }
  }

  const months = (month) => {
    let file_data = records;
    var d = new Date();
    console.log('today ', d)
    d.setMonth(d.getMonth() - month);
    console.log('old date ', d)
    file_data = file_data.filter(value => {
      return (
        new Date(value.date) >= d
      )
    })
    let dates = _.map(file_data, 'date');
    if(dates.length > 0){
      setDates(dates)
    }
  }

  const monthsP = (month) => {
    let file_data = records;
    var d = new Date();
    d.setMonth(d.getMonth() - month);
    file_data = file_data.filter(value => {
      return (
        new Date(value.date) >= d
      )
    })
    let dates = _.map(file_data, 'date');
    if(dates.length > 0){
      setDatesP(dates)
    }
  }



  const duration_months = (number) => {

    if (number === 0) {
      months(6)
      monthsP(6)
    }
    else if (number === 1) {
      months(12)
      monthsP(12)
    }
    else {
      months(1200)
      monthsP(1200)
    }
  }


  const updateCountry2 = (result) => {
    let file_data = result.records;
    let dates = _.map(file_data, 'date');
    setDates(dates)
    setDatesP(dates)
    let chart_data = _.map(file_data, 'new_cases');
    let chart_dataP = _.map(file_data, 'new_cases');
    
    let ser = {
      name: country2,
      data: chart_data,
      type: 'line',
      smooth: true,
      itemStyle: {
        borderWidth: 3,
        width: 2,
        color: '#094151'
      },
    };

    let seriesP = {
      name: country2,
      data: chart_dataP,
      type: 'line',
      smooth: true,
      itemStyle: {
        borderWidth: 3,
        width: 2,
        color: '#094151'
      },
    };
    
    setChartP2(seriesP)
    setChart2(ser)

  }


  const updateCountry1 = (result) => {
    let file_data = result.records;
    let dates = _.map(file_data, 'date');
    setDates(dates)
    setDatesP(dates)
    let chart_data = _.map(file_data, 'new_cases');
    let chart_dataP = _.map(file_data, 'new_cases');
    
    let ser = {
      name: country1,
      data: chart_data,
      type: 'line',
      smooth: true,
      itemStyle: {
        borderWidth: 3,
        width: 2,
        color: '#BDEECB'
      },
    };

    let seriesP = {
      name: country1,
      data: chart_dataP,
      type: 'line',
      smooth: true,
      itemStyle: {
        borderWidth: 3,
        width: 2,
        color: '#BDEECB'
      },
    };
    
    setChartP1(seriesP)
    setChart1(ser)

  }

  const setChartP1 = (ser)=>{
    if(seriesP2){
      setSeriesP([ser, seriesP2])
      setSeriesP1(ser)
    }
    else{
      setSeriesP([ser])
      setSeriesP1(ser)
    }
  }
  const setChart1 = (ser)=>{
    if(series2){
      setSeries([ser, series2])
      setSeries1(ser)
    }
    else{
      setSeries([ser])
      setSeries1(ser)
    }
  }

  const setChartP2 = (ser)=>{
    if(seriesP1){
      setSeriesP([seriesP1, ser])
      setSeriesP2(ser)
    }
    else{
      setSeriesP([ser])
      setSeriesP2(ser)
    }
  }
  const setChart2 = (ser)=>{
    if(series1){
      setSeries([series1, ser])
      setSeries2(ser)
    }
    else{
      setSeries([ser])
      setSeries2(ser)
    }
  }


  const api = (callback, country) => {
    setLoading(true)
    axios.get(`https://adhtest.opencitieslab.org/api/3/action/datastore_search?resource_id=61ed4090-1598-4822-aa11-815e5984aba4&q=${country}`)
      .then(res => {
        console.log(res.data)
        callback(res.data.result)
        setRecords(res.data.result.records)
        setLoading(false)
        setError(false)
      })
      .catch(error=>{
        setLoading(false)
        setError(true)
        console.log(error)
      })
  }

  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
};


  // useEffect(() => {

  //   api(updateData2)
  //   api(PositiveDataDefault2)
  // }, [selectedCountry2])

  useEffect(() => {
    api(updateCountry2, country2 )
}, [country2])

    useEffect(() => {
      api(updateCountry1, country1 )
  }, [country1])


  useEffect(() => {
    api(updateCountry1, 'Africa' )
    if (window.location.search != '?embed') {
      set_no_embed_style({ paddingTop: '100px' })
    }
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
}, []);


  return (
    loading ?
      <>
        <div className="position-absolute top-50 start-50 translate-middle text-center">
          <Spinner animation="grow" />
          <h3 className="mt-4">Loading</h3>
        </div>
      </> :
      error ?
        <>
          <div className="position-absolute top-50 start-50 translate-middle text-center">
            <FontAwesomeIcon icon={faExclamationTriangle} size="5x" />
            <h3 className="mt-4">Error Fetching Data</h3>
          </div>
        </> :

        <>
          <div className="header pb-3">
            {window.location.search != '?embed' ? <Header /> : ''}
            <Intro no_embed_style={no_embed_style}
              selectedCountry1={selectedCountry1}
              selectedCountry2={selectedCountry2}
              countrySelect1={countrySelect1}
              countrySelect2={countrySelect2}
              setDuration={duration_months}
            />
          </div>
          <div className={ scrollPosition >= 111.11112213134766 ? 'sub-top resize' : "sub-top"}>
            <Container className="justify-content-between ">
            <Row>
                <Col md={6}>
                    <SelectCountries 
                    selectedCountry1={selectedCountry1} 
                    selectedCountry2={selectedCountry2} 
                    countrySelect1={countrySelect1}
                    countrySelect2={countrySelect2}
                    />
                </Col>
                <Col md={6} className="d-flex justify-content-end align-items-center date_range-wrapper">
                    <DateRange setDuration={setDuration}/>
                </Col>
            </Row>
            </Container>

          </div>
          {
            dates ? 
            <ChartBox title="New Tests: Regional Comparison" series={series} dates={dates} />:""
          }
          <ChartBoxP title="Positivity Rate: Regional Comparison" series={seriesP} dates={datesP} />
          <Footer />
        </>
  );
}

export default App;

const container = document.getElementsByClassName('app')[0];

ReactDOM.render(React.createElement(App), container);
