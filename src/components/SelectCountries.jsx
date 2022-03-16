import React, { useState, useEffect } from "react";
import { DropdownButton, Dropdown, Row, Col } from "react-bootstrap";
import ReactCountryFlag from 'react-country-flag';
import getCountryISO2 from 'country-iso-3-to-2';
import axios from 'axios';


const SelectCountries = ({selectedCountry1, selectedCountry2, countrySelect1, countrySelect2 }) => {
    const [countries, setCountries] = useState([])

    const countries_api = callback =>{
        axios.get('https://adhtest.opencitieslab.org/api/3/action/datastore_search?resource_id=de166a29-fede-4409-a72f-425ddc8d4bfb&limit=500')
        .then(res=>{
          callback(res.data.result.records)
        })
      }

    useEffect(() => {
        countries_api(setCountries)
      }, [countries])

    return (
        <Row className="mt-2 mb-4 countries-row">
            <Col xs="auto">
                <Row >
                    <Col><h5 className="select-country--title" >Select Country/Region 1 </h5></Col>
                </Row>
                <DropdownButton 
                title={selectedCountry1 ? <>
                <div style={{ width: '1.5em', height: '1.5em', borderRadius: '50%', overflow: 'hidden', position: 'relative', display: "inline-block", marginRight: "10px" }} className="border">
                <ReactCountryFlag
                    svg
                    countryCode={getCountryISO2(selectedCountry1.iso_code)}
                    style={{
                        position: 'absolute',
                        top: '30%',
                        left: '30%',
                        marginTop: '-50%',
                        marginLeft: '-50%',
                        fontSize: '2em',
                        lineHeight: '2em',
                        
                    }} />
            </div>{selectedCountry1.location}</> : "Choose country"} 
                
                className="country-select" >
                    {countries.map((country, index) => (
                        <Dropdown.Item key={country.iso} onClick={() => countrySelect1({ iso_code: country.iso, location: country.countries })}>

                            {country.countries}</Dropdown.Item>
                    ))}
                </DropdownButton>
            </Col>
            <Col xs="auto">
                <Row >
                    <Col>

                        <h5 className="select-country--title">Select Country/Region 2 </h5></Col>
                </Row>
                <DropdownButton 
                title={selectedCountry2 ? <>
                <div style={{ width: '1.5em', height: '1.5em', borderRadius: '50%', overflow: 'hidden', position: 'relative', display: "inline-block", marginRight: "10px" }} className="border">
                <ReactCountryFlag
                    svg
                    countryCode={getCountryISO2(selectedCountry2.iso_code)}
                    style={{
                        position: 'absolute',
                        top: '30%',
                        left: '30%',
                        marginTop: '-50%',
                        marginLeft: '-50%',
                        fontSize: '2em',
                        lineHeight: '2em',
                        
                    }} />
            </div>{selectedCountry2.location}</> : "Choose country"} 
                
                className="country-select" >
                    {countries.map((country, index) => (
                        <Dropdown.Item key={country.iso} onClick={() => countrySelect2({ iso_code: country.iso, location: country.countries })}>

                            {country.countries}</Dropdown.Item>
                    ))}
                </DropdownButton>
            </Col>
        </Row>
    )
}
export default SelectCountries;