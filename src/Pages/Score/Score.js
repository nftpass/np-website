import React, { Component } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap/esm/index";
import './Score.css'
import Web3 from "web3";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue} from "firebase/database";
import BlockchainContext from "../../Context/BlockchainContext";
import getNFTScore from "../../helpers/score.js"

export class ViewScore extends Component {

    static contextType = BlockchainContext;

    constructor(){
        super()
        this.state = {
            scoreProgress: 'start',
            scores: null,
            accounts: null,
            networkId: null,
            web3: new Web3(window.ethereum),
            spinner: true,
            contract: null,
            firebaseConfig: {
                apiKey: "AIzaSyAEaknNq7Hcxffpma9NezdSTj1e2S4VuPE",
                authDomain: "nftpassxyz.firebaseapp.com",
                databaseURL: "https://nftpassxyz-default-rtdb.firebaseio.com",
                projectId: "nftpassxyz",
                storageBucket: "nftpassxyz.appspot.com",
                messagingSenderId: "557649105169",
                appId: "1:557649105169:web:e750322638098c6ec13cb0",
                measurementId: "G-F6YXEN1NVY"
            },
            app: null,
            database: null
        }
        
    }

    async componentDidMount() {
        this.state.app = initializeApp(this.state.firebaseConfig);

        this.state.database = getDatabase(this.state.app);
       
        try {
            // this.setState({loaderText: <>Calculating your score! <br/> this will take a minute...</>})
            const address = this.context && this.context.accounts[0];

            const response = await getNFTScore(address);

            await response.json().then(async (res) => {
                if (res.success) {
                    try{
                        const starCountRef = ref(
                            this.state.database,
                            "score/" + this.context.accounts[0]
                        );
                        onValue(starCountRef, async (snapshot) => {
                            try{
                                const data = await snapshot.val();
                                this.setState({ scores: data && data.score });
                            } catch (e) {
                                console.log('Error when getting Firebase score value')
                                console.log(e)
                                this.setState({scoreProgress: 'error'})
                            }
                        });
                        const starCountBreakdownRef = ref(
                            this.state.database,
                            "scoreBreakdown/" + this.context.accounts[0]
                        );
                        onValue(starCountBreakdownRef, async (snapshot) => {
                            try{
                                const data = await snapshot.val();
                                console.log(data)
                                this.setState({ scoreBreakdown: data });
                            } catch (e) {
                                console.log(e)
                                console.log('Error when getting Firebase score breakdown')
                                this.setState({scoreProgress: 'error'})
                            }
                        });
                    } catch(e) {
                        console.log(e)
                        throw new Error();
                    }
                } else {
                    throw new Error();
                }
            });

        } catch (e) {
            console.log(e)
            this.setState({scoreProgress: 'error'})
        }
    }

    renderBreakdown(){
        let { scoreBreakdown } = this.state;
        if (!scoreBreakdown)
            return
        let lastUpdate = new Date(scoreBreakdown.last_updated);
        scoreBreakdown = scoreBreakdown.scoreComponents;
        // only show if udpated sccore is fresher than 2 hours
        const show = scoreBreakdown && scoreBreakdown.length > 0 && Math.abs(new Date() - lastUpdate) / 36e5*2 < 2;
        if(show) {
            return (
                <Col className='p-5'>
                    <div className='score-breakdown'>
                        <p className="score-breakdown-title">What's in the score?</p>
                        {scoreBreakdown.map((breakdown) => {
                            if (breakdown.points > 0) {
                                if (breakdown.type == 'collection') {
                                    return (
                                        <div className='score-component collection' key={breakdown.contractAddress + '_collection'}>
                                            <div>
                                                <div className="score-component-text">{breakdown.collectionName} collection score</div>
                                                <div className="points points-piece">+{breakdown.points}</div>
                                            </div>
                                        </div>
                                    )
                                } else if (breakdown.type == 'piece') {
                                    return (
                                        <div className='score-component collection-piece' key={breakdown.contractAddress + '_' + breakdown.pieceID}>
                                            <div>
                                                <div className="score-component-text">{breakdown.collectionName} - {breakdown.pieceID}</div>
                                                <div className="points points-collection">+{breakdown.points}</div>
                                            </div>
                                        </div>
                                    )
                                } else if ((breakdown.type == 'all_pieces')) {
                                    return (
                                        <div className='score-component collection-all-pieces' key={breakdown.collectionName + '_all_pieces'}>
                                            <div>
                                                <div className="score-component-text">{breakdown.collectionName} all pieces score</div>
                                                <div className="points points-all-pieces">+{breakdown.points}</div>
                                            </div>
                                        </div>
                                    )
                                }
                            }
                        })}
                    </div>
                </Col>
            )
        }


    }

    render () {
        if(this.state.scores !== null) {
            return (
                <Container style={{textAlign: "left"}} fluid>
                    <Row className="justify-content-center align-items-center">
                        <div id="app" style={{ borderStyle: "none", paddingTop: "10%" }}>
                            <Container className="justify-content-center">
                                <Row className="align-items-center">
                                    <Col className='p-5'>
                                        <Row className="justify-content-center align-items-center">
                                            <div style={{ position: 'relative', textAlign: 'center'}}>
                                                <img style={{minWidth: '100%', height: 'auto', border: '5px solid black'}} src='frame.png'></img>
                                                <div className="imagecenter align-items-center">
                                                    <img src='logo.svg' width='20%' />
                                                    <h1 style={{ fontFamily: 'Inter', fontWeight: '700', paddingTop: '15px'}}>{this.state.scores}</h1>
                                                    <p style={{ fontFamily: 'Inter', fontWeight: '700'}}>POINTS</p>
                                                </div>
                                                <h6 className='fixed-bottom' style={{position: "absolute", bottom: '3px', fontFamily: 'Inter', fontWeight: '700', fontSize: '0.7em'}}>NFTPASS.XYZ</h6>
                                            </div>
                                        </Row>
                                        <Row style={{paddingTop: '30px'}}>
                                            <Button style={{backgroundColor: 'rgba(0, 0, 0, 1)', borderRadius: '0', border: '0'}} className='w-100' href='/mint'>Mint it!</Button>
                                        </Row>
                                    </Col>
                                    {this.renderBreakdown()}
                                </Row>
                            </Container>
                        </div>
                    </Row>
                </Container>
            )
        } else if(this.state.scoreProgress == 'error') {
            return(
                <div id="app" style={{ borderStyle: "none", padding: "20%" }}>
                    <Container className="justify-content-center">
                        <Row className="justify-content-center align-items-center">
                            <h4 style={{ fontFamily: 'Inter', fontWeight: '700', paddingTop: '10px', textAlign: 'center' }}>
                                Oops! <br/> An error occured.
                            </h4>
                        </Row>
                    </Container>
                </div>
            )
        } else {
            return(
                <div id="app" style={{ borderStyle: "none", padding: "20%" }}>
                    <Container className="justify-content-center">
                        <Row className="justify-content-center align-items-center">
                            <Spinner size='200%' animation="border" role="status"/>
                        </Row>
                        <Row className="justify-content-center align-items-center">
                            <h4 style={{ fontFamily: 'Inter', fontWeight: '700', paddingTop: '10px', textAlign: 'center' }}>
                                Calculating your score! <br /> this will take a few seconds...
                            </h4>
                        </Row>
                    </Container>
                </div>
            )
        }
    }
}