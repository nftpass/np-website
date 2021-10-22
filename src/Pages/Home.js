import React, { Component } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import './pages.css'
import ReactDOM from 'react-dom';


export class Home extends Component {

    getScore() {
        const phrases = [
            'Counting NFTs',
            'Looking into wallet history',
            'Counting collections',
            'Valuating collection',
            'Calculate ranking',
            'Checking diamond hands',
            'Asking reputable DAOs',
            'Checking POAPs'
        ]
        var i = 0
        let spinner = (
            <div>
                <Spinner animation="border" role="status"/>
                <h2>Calculating your score! <br/>{phrases[i]}.</h2>
            </div>
        )

        ReactDOM.render(spinner, document.getElementById('app'))

        const timeOut = setTimeout(() => {
            i = i + 1
        }, 3000)
    }

    render () {
        return (
            <Container style={{textAlign: "left"}} fluid>
                <Row className="justify-content-center align-items-center">
                    <Col xs={{span: 12, order: 2}} lg={{span: 6, order: 1}}>
                        <div id='app' style={{borderStyle: "none", padding: '20%'}}>
                            <h1 style={{ fontSize: '5vh', padding: '10px' }}>NFTPass</h1>
                            <h2 style={{ padding: '10px' }}>Connect 🔌your wallet and 🔮 find out your 💎score! </h2>
                            <div style={{ padding: '10px' }}>
                                <Button className='transparent' style={{borderRadius: '0.7rem', border: '1px solid black', color: 'black', marginRight: '10px'}} onClick={this.getScore} >Get My Score</Button>
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
