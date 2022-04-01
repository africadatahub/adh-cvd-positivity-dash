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
  const [ datesCountry2, setDatesCountry2] = useState([])
  const [ datesCountry1, setDatesCountry1] = useState([])


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
  
    }
  }

  const countrySelect2 = (country) => {
    if (_.find(selectedCountry2, function (o) { return o.iso_code == country.iso_code }) == undefined) {
      setSelectedCountries2(country);
      setCountry2(country.location)
    }
  }
  const removeMonths = (months) => {
    let date = new Date()
    date.setMonth(date.getMonth() - months);
    date.setMilliseconds(0)
    date.setMinutes(0)
    date.setSeconds(0)
    date.setHours(0)
    return new Date(date);
  }
  const months = (month) => {
    var d = removeMonths(month)
    axios.get(`https://adhtest.opencitieslab.org/api/3/action/datastore_search_sql?sql=SELECT%20*%20from%20%2261ed4090-1598-4822-aa11-815e5984aba4%22%20WHERE%20region%20LIKE%20%27${country1}%27&limit=1500`)
    .then(res=>{
      let file_data = res.data.result.records;
      if(month == 1200){
        let new_dates = getDateArray(new Date('2020-02-01T00:00:00'), new Date())
        updateCountryNewCases1(file_data,new_dates)
      }
      else{
        let new_dates = getDateArray(new Date(d), new Date())
        updateCountryNewCases1(file_data,new_dates)

      }
    })

    axios.get(`https://adhtest.opencitieslab.org/api/3/action/datastore_search_sql?sql=SELECT%20*%20from%20%2261ed4090-1598-4822-aa11-815e5984aba4%22%20WHERE%20region%20LIKE%20%27${country2}%27&limit=1500`)
    .then(res=>{
      let file_data = res.data.result.records;
      if(month == 1200){
        let new_dates = getDateArray(new Date('2020-02-01T00:00:00'), new Date())
        updateCountryNewCases2(file_data,new_dates)
      }
      else{
        let new_dates = getDateArray(new Date(d), new Date())
        updateCountryNewCases2(file_data,new_dates)

      }
    })
  }

  const monthsP = (month) => {
    var d = removeMonths(month)
    axios.get(`https://adhtest.opencitieslab.org/api/3/action/datastore_search_sql?sql=SELECT%20*%20from%20%22af42ed1a-0fb4-4846-9a28-f8baf3aee826%22%20WHERE%20region%20LIKE%20%27${country1}%27&limit=1500`)
    .then(res=>{
      let file_data = res.data.result.records;
      if(month == 1200){
        let new_dates = getDateArray(new Date('2020-02-01T00:00:00'), new Date())
        updateCountryPositive1(file_data,new_dates)
      }
      else{
        let new_dates = getDateArray(new Date(d), new Date())
        updateCountryPositive1(file_data,new_dates)

      }
    })

    axios.get(`https://adhtest.opencitieslab.org/api/3/action/datastore_search_sql?sql=SELECT%20*%20from%20%22af42ed1a-0fb4-4846-9a28-f8baf3aee826%22%20WHERE%20region%20LIKE%20%27${country2}%27&limit=1500`)
    .then(res=>{
      let file_data = res.data.result.records;
      if(month == 1200){
        let new_dates = getDateArray(new Date('2020-02-01T00:00:00'), new Date())
        updateCountryPositive2(file_data,new_dates)
      }
      else{
        let new_dates = getDateArray(new Date(d), new Date())
        updateCountryPositive2(file_data,new_dates)

      }
    })
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

  const updateCountryPositive1 = (result, new_dates) => {
    let file_data = result;
    for(let i = 0; i<file_data.length; i++){
      file_data[i].date = new Date(file_data[i].date)
    }
    setDatesP(new_dates)

    let chart_data = []
    for(let i = 0; i < new_dates.length; i++){
      let value;
      for(let f=0; f < file_data.length; f++){
        if(file_data[f]['date'].getTime() == new_dates[i].getTime() ){
          value = file_data[f]['positive_rate']
        }
      }
      if(value){
        chart_data.push(value)
      }
      else{
        chart_data.push("")
      }
    }

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
  const updateCountryPositive2 = (result, new_dates) => {
    let file_data = result;
    for(let i = 0; i<file_data.length; i++){
      file_data[i].date = new Date(file_data[i].date)
    }
    //let dates = _.map(file_data, 'date');
    setDatesP(new_dates)

    let chart_data = []
    for(let i = 0; i < new_dates.length; i++){
      let value;
      for(let f=0; f < file_data.length; f++){
        if(file_data[f]['date'].getTime() == new_dates[i].getTime() ){
          value = file_data[f]['positive_rate']
        }
      }
      if(value){
        chart_data.push(value)
      }
      else{
        chart_data.push("")
      }
    }

    
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


  const updateCountryNewCases1 = (result, new_dates) => {
    let file_data = result;
    file_data.sort(function(a,b){
      return new Date(a.date) - new Date(b.date)
    })
    for(let i = 0; i<file_data.length; i++){
      file_data[i].date = new Date(file_data[i].date)
    }
    setDates(new_dates)

    let chart_data = []
    for(let i = 0; i < new_dates.length; i++){
      let value;
      for(let f=0; f < file_data.length; f++){
        if( file_data[f]['date'].getTime() == new_dates[i].getTime() ){
          value = file_data[f]['new_cases']
        }
      }
      if(value){
        chart_data.push(value)
      }
      else{
        chart_data.push("")
      }
    }

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

  const updateCountryNewCases2 = (result, new_dates) => {
    let file_data = result;
    file_data.sort(function(a,b){
      return new Date(a.date) - new Date(b.date)
    })
    for(let i = 0; i<file_data.length; i++){
      file_data[i].date = new Date(file_data[i].date)
    }
    console.log(file_data)
    
    let chart_data = []
    for(let i = 0; i < new_dates.length; i++){
      let value;
      let current_date = new_dates[i]
      for(let f=0; f < file_data.length; f++){
        if(file_data[f]['date'].getTime() == current_date.getTime()){
          value = file_data[f]['new_cases']
        }
      }
      if(value){
        chart_data.push(value)
      }
      else{
        chart_data.push("")
      }
    }
    setDates(new_dates)
    
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
        let new_dates = getDateArray(new Date('2020-02-01T00:00:00'), new Date())
        callback(res.data.result.records, new_dates)
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
        let new_dates = getDateArray(new Date('2020-02-01T00:00:00'), new Date())
        callback(res.data.result.records, new_dates)
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

// date array
const getDateArray = (start, end) => {

  var
    arr = new Array(), dt = new Date(start);

  while (dt <= end) {
    arr.push(new Date(dt));
    dt.setDate(dt.getDate() + 1);
  }

  return arr;

}

const getDates = ()=>{
  let start_date = new Date('2020-02-01T00:00:00')
  let arr = getDateArray(new Date('2020-02-01T00:00:00'), new Date());
  //console.log(arr)
  setDates(arr)
}

  useEffect(() => {
    api_positive(updateCountryPositive2, country2 )
    api_new_cases(updateCountryNewCases2, country2 )
}, [country2])

    useEffect(() => {
      api_new_cases(updateCountryNewCases1, country1 )
      api_positive(updateCountryPositive1, country1 )
  }, [country1])


  useEffect(() => {
    getDates()
    api_new_cases(updateCountryNewCases1, country1 )
    api_positive(updateCountryPositive1, country1 )

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
            {/* {window.location.search != '?embed_positive' && window.location.search != '?embed_newcases' && window.location.search != '?embed' ? <Header /> : ''} */}
            {window.location.search != '?embed_positive' && window.location.search != '?embed_newcases' && window.location.search != '?embed' ?
            <Intro no_embed_style={no_embed_style}
              selectedCountry1={selectedCountry1}
              selectedCountry2={selectedCountry2}
              countrySelect1={countrySelect1}
              countrySelect2={countrySelect2}
              setDuration={duration_months}
            />: ''}
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
          {window.location.search != '?embed_newcases' ? <ChartBoxP title="Positivity Rate: Country Comparison" series={seriesP} dates={dates} />: ''} 
          {window.location.search != '?embed_positive' && window.location.search != '?embed_newcases' && window.location.search != '?embed' ? <Footer />: ''} 
        </>
  );
}

export default App;

const container = document.getElementsByClassName('app')[0];

ReactDOM.render(React.createElement(App), container);