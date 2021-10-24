import { Container, Row, Spinner } from "react-bootstrap";

export function Loader (props) {
  
    return (
        <Container className="justify-content-center">
            <Row className="justify-content-center">
                <Spinner size='200%' animation="border" role="status"/>
            </Row>
            <Row>
                <h4 style={{ fontFamily: 'Inter', fontWeight: '700', paddingTop: '10px' }}>{props.text}</h4>
            </Row>
        </Container>);
}