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
  const [error_message, setErrorMessage] = useState('Error Fetching Data')
  const [records, setRecords] =  useState([])
  const [new_cases_records, setNewCasesRecords] =  useState([])
  const [scrollPosition, setScrollPosition] = useState(0);
  //New Tests: Regional Comparison
  const [series, setSeries] = useState([])
  const [dates, setDates] = useState([])

  //Positivity Rate: Regional Comparison
  const [seriesP, setSeriesP] = useState([])
  const [datesP, setDatesP] = useState([])


  const [no_embed_style, set_no_embed_style] = useState({ paddingTop: '20px' })
  const [selectedCountry1, setSelectedCountries1] = useState({
    "iso_code": "DZA",
    "location": "Algeria"
})
  const [selectedCountry2, setSelectedCountries2] = useState({
    "iso_code": "CMR",
    "location": "Cameroon"
})
  const [country1, setCountry1] = useState('Algeria')
  const [country2, setCountry2] = useState('Cameroon')


  const countrySelect1 = (country) => {
    if (_.find(selectedCountry1, function (o) { return o.iso_code == country.iso_code }) == undefined) {
      setSelectedCountries1(country);
      setCountry1(country.location)
      console.log(country)
  
    }
  }

  const countrySelect2 = (country) => {
    if (_.find(selectedCountry2, function (o) { return o.iso_code == country.iso_code }) == undefined) {
      setSelectedCountries2(country);
      setCountry2(country.location)
      console.log(country)
    }
  }

  const months = (month) => {
    let file_data = new_cases_records;
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
    setDates(dates)
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
    setDatesP(dates)
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

  const updateCountryPositive1 = (result) => {
    let file_data = result.records;
    let dates = _.map(file_data, 'date');
    setDates(dates)
    setDatesP(dates)
    let chart_data = _.map(file_data, 'positive_rate');
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
    let series = seriesP
    series[0] = ser
    setSeriesP(series)
  }
  const updateCountryPositive2 = (result) => {
    let file_data = result.records;
    let dates = _.map(file_data, 'date');
    setDates(dates)
    setDatesP(dates)
    let chart_data = _.map(file_data, 'positive_rate');
    console.log('posi', country2, chart_data)
    
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
    let series = seriesP
    series[1] = ser
    setSeriesP(series)
  }


  const updateCountryNewCases1 = (result) => {
    let file_data = result.records;
    let dates = _.map(file_data, 'date');
    setDates(dates)
    setDatesP(dates)
    let chart_data = _.map(file_data, 'new_cases');
    
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
    let newSeries = series
    newSeries[0] = ser
    setSeries(newSeries)

  }

  const updateCountryNewCases2 = (result) => {
    let file_data = result.records;
    let dates = _.map(file_data, 'date');
    setDates(dates)
    setDatesP(dates)
    let chart_data = _.map(file_data, 'new_cases');
    
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
    let newSeries = series
    newSeries[1] = ser
    setSeries(newSeries)
  }



  const api_positive = (callback, country) => {
   
    axios.get(`https://adhtest.opencitieslab.org/api/3/action/datastore_search_sql?sql=SELECT%20*%20from%20%22af42ed1a-0fb4-4846-9a28-f8baf3aee826%22%20WHERE%20region%20LIKE%20%27${country}%27&limit=1500`)
      .then(res => {
        if(res.data.result.records.length < 1){
          setError(true)
        }
        else{
          setError(false)
        }
        callback(res.data.result)
        setRecords(res.data.result.records)
        setLoading(false)
      })
      .catch(error=>{
        setLoading(false)
        setError(true)
        console.log(error)
      })
  }

  const api_new_cases = (callback, country) => {
    
    axios.get(`https://adhtest.opencitieslab.org/api/3/action/datastore_search_sql?sql=SELECT%20*%20from%20%2261ed4090-1598-4822-aa11-815e5984aba4%22%20WHERE%20region%20LIKE%20%27${country}%27&limit=1500`)
      .then(res => {
        if(res.data.result.records.length < 1){
          setError(true)
        }
        else{
          setError(false)
        }
        callback(res.data.result)
        setNewCasesRecords(res.data.result.records)
        setLoading(false)
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

  useEffect(() => {
    api_positive(updateCountryPositive2, country2 )
    api_new_cases(updateCountryNewCases2, country2 )
}, [country2])

    useEffect(() => {
      api_new_cases(updateCountryNewCases1, country1 )
      api_positive(updateCountryPositive1, country1 )
  }, [country1])


  useEffect(() => {
    api_new_cases(updateCountryNewCases1, country1 )
    api_positive(updateCountryPositive1, country1 )
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
            <h3 className="mt-4">{error_message}</h3>
          </div>
        </> :

        <>
          <div className="header pb-3">
            {window.location.search != '?embed_positive' && window.location.search != '?embed_newcases' ? <Header /> : ''}
            <Intro no_embed_style={no_embed_style}
              selectedCountry1={selectedCountry1}
              selectedCountry2={selectedCountry2}
              countrySelect1={countrySelect1}
              countrySelect2={countrySelect2}
              setDuration={duration_months}
            />
          </div>
          <div className={ scrollPosition >= 111.11112213134766 ? 'sub-top resize' : "sub-top"}>
            <Container className="justify-content-between padding-left-zero ">
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
                    <DateRange setDuration={duration_months}/>
                </Col>
            </Row>
            </Container>

          </div>
          {window.location.search != '?embed_positive' ? <ChartBox title="New Tests: Country Comparison" series={series} dates={dates} />: ''} 
          {window.location.search != '?embed_newcases' ? <ChartBoxP title="Positivity Rate: Country Comparison" series={seriesP} dates={datesP} />: ''} 
          {window.location.search != '?embed_positive' && window.location.search != '?embed_newcases' ? <Footer />: ''} 
        </>
  );
}

export default App;

const container = document.getElementsByClassName('app')[0];

ReactDOM.render(React.createElement(App), container);
