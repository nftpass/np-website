import { Button, Col, Container, Row } from "react-bootstrap";


export function Landing () {
        return(
            <Container style={{textAlign: "left"}} fluid>
                <Row className="justify-content-center align-items-center">
                    <Col xs={{span: 12, order: 2}} lg={{span: 8, order: 1}}>
                        <div id='app' style={{borderStyle: "none", paddingTop: '10%'}}>
                            <h1 style={{ padding: '10px', fontFamily: 'Inter', fontWeight: '700', fontSize: '6vw' }}>Connect 🔌 your wallet and find out 🔮 your NFTPASS score! 💎</h1>
                            <Row style={{ padding: '10px', paddingTop: '5%'}}>
                                <Col xs={{span: 'auto'}} style={{paddingTop: '10px'}}>
                                    <Button className='border-0 w-100' style={{borderRadius: '0rem', backgroundColor: 'rgb(0,0,0)', color: 'white', fontFamily: 'Inter', fontWeight: '700', padding: '10px 20px 10px 20px'}} href='/score'>Get your Score ↗</Button>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col xs={{span: 12, order: 1}} lg={{span: 4, order: 2}}></Col>
                </Row>
            </Container>
        )
}