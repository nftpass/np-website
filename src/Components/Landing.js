import { Button, Col, Container, Row, Image } from "react-bootstrap";

export function Landing() {
    let fontSize = 10;
    if (window.innerHeight / window.innerWidth >= 1) {
        fontSize = 5;
    }
    return (
        <Container style={{ textAlign: "left" }} fluid>
            <Row className="justify-content-center align-items-center">
                <Col xs={{ span: 12, order: 2 }} lg={{ span: 8, order: 1 }}>
                    <div
                        id="app"
                        style={{ borderStyle: "none", paddingTop: "10%" }}
                    >
                        <h1
                            style={{
                                padding: "10px",
                                fontFamily: "Inter",
                                fontWeight: "700",
                                fontSize: `${fontSize}vh`,
                            }}
                        >
                            Connect 🔌 your wallet and find out 🔮 your NFTPASS
                            score! 💎
                        </h1>
                        <Row style={{ padding: "10px", paddingTop: "5%" }}>
                            <Col
                                xs={{ span: "auto" }}
                                style={{ paddingTop: "10px" }}
                            >
                                <Button
                                    className="border-0 w-100"
                                    style={{
                                        borderRadius: "0rem",
                                        backgroundColor: "rgb(0,0,0)",
                                        color: "white",
                                        fontFamily: "Inter",
                                        fontWeight: "700",
                                        padding: "10px 20px 10px 20px",
                                    }}
                                    href="/score"
                                >
                                    Get your score ↗
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col
                    xs={{ span: 12, order: 1 }}
                    lg={{ span: 4, order: 2 }}
                ></Col>
            </Row>

            <Image src="/pepe.png" fluid className="pepe" />
        </Container>
    );
}
