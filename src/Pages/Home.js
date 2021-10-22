import { Component } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import './pages.css'

export class Home extends Component {
    constructor() {
        super()
    }

    render () {
        return (
            <Container style={{textAlign: "left"}} fluid>
                <Row className="justify-content-center align-items-center">
                    <Col xs={{span: 12, order: 2}} lg={{span: 6, order: 1}}>
                        <div className="p-5" style={{borderStyle: "none"}}>
                            <h1>NFTPass</h1>
                            <Button className='border-0 coloredreverse' href="/signup">Get Started</Button>
                        </div>
                    </Col>
                    <Col xs={{span: 12, order: 1}} lg={{span: 4, order: 2}}>
                        <div className="p-5">
                        <video autoPlay muted loop style={{maxWidth: '90%'}}>
                            <source src="coinflip.mp4" type="video/mp4"/>
                        </video>
                        </div>
                    </Col>
                </Row>
            </Container>
        )
    }

}