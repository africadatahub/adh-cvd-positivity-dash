import React from "react";
import { Container, Row, Col } from "react-bootstrap";



const Intro = ({ no_embed_style, selectedCountry1, selectedCountry2, countrySelect1, countrySelect2,setDuration }) => {
    return (
        <Container style={no_embed_style} className="justify-content-between padding-left-zero pm-75">
            <Row>
                <Col>
                    <h3 className="heading">COVID-19 testing and positivity rates: Compare countries & regions</h3>
                    <p className="intro-p">This dashboard is designed to help you understand how COVID-19 testing and positivity rates differ between African countries. To use this dashboard, select two countries and/or regions from the drop down menus and compare the results in real-time.</p>
                </Col>
            </Row>
        </Container>
    )
}
export default Intro;