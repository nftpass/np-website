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
                        <div style={{borderStyle: "none", padding: '20%'}}>
                            <h1 style={{ fontSize: '5vh', padding: '10px' }}>NFTPass</h1>
                            <h2 style={{ padding: '10px' }}>Connect 🔌your wallet and 🔮 find out your 💎score! </h2>
                            <div style={{ padding: '10px' }}>
                                <Button className='transparent' style={{borderRadius: '0.7rem', border: '1px solid black', color: 'black', marginRight: '10px'}} href="/">Get My Score</Button>
                                <Button className='transparent' style={{borderRadius: '0.7rem', border: '1px solid black', color: 'black'}} href="/">Read the docs</Button>
                            </div>
                        </div>
                    </Col>
                    <Col xs={{span: 12, order: 1}} lg={{span: 4, order: 2}}>
                    </Col>
                </Row>
            </Container>
        )
    }

}