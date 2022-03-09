import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";

const DateRange = ({setDuration}) => {
    const [selected, setSelected] = useState(2)
    return(
    <div className="date_range">
        <Row>
            <Col>
                <h3 className="date_range-title">Choose Date Range</h3>
            </Col>
        </Row>
        <Row>
            <div className={selected == 0 ? "col date_range-btn six_months active" : "col date_range-btn six_months"} onClick={()=>{setSelected(0); setDuration(0)}}>6 Months</div>
            <div className={selected == 1 ? "col date_range-btn active" : "col date_range-btn"} onClick={()=>{setSelected(1); setDuration(1)}} >1 Year</div>
            <div className={selected == 2 ? "col date_range-btn all-btn active" : "col date_range-btn all-btn"} onClick={()=>{setSelected(2); setDuration(2)}} >All</div>
        </Row>
    </div>
    )
}
export default DateRange;