import React, { useState } from "react";
import { DropdownButton, Dropdown, Row, Col } from "react-bootstrap";
import ReactCountryFlag from 'react-country-flag';
import getCountryISO2 from 'country-iso-3-to-2';
import * as countriesList from '../data/countries.json';


const SelectCountries = ({selectedCountry1, selectedCountry2, countrySelect1, countrySelect2 }) => {

    return (
        <Row className="mt-2 mb-4 countries-row">
            <Col xs="auto">
                <Row className="mt-4">
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
            </div>{selectedCountry1.location}</> : "Choose Countries"} 
                
                className="country-select" >
                    {countriesList.map((country, index) => (
                        <Dropdown.Item key={country.iso_code} onClick={() => countrySelect1({ iso_code: country.iso_code, location: country.location })}>

                            {country.location}</Dropdown.Item>
                    ))}
                </DropdownButton>
            </Col>
            <Col xs="auto">
                <Row className="mt-4">
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
            </div>{selectedCountry2.location}</> : "Choose Countries"} 
                
                className="country-select" >
                    {countriesList.map((country, index) => (
                        <Dropdown.Item key={country.iso_code} onClick={() => countrySelect2({ iso_code: country.iso_code, location: country.location })}>

                            {country.location}</Dropdown.Item>
                    ))}
                </DropdownButton>
            </Col>
        </Row>
    )
}
export default SelectCountries;