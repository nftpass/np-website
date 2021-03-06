import React, { Component } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap/esm/index";
import '../pages.css'
import Web3 from "web3";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue} from "firebase/database";
import BlockchainContext from "../../Context/BlockchainContext";
import getNFTScore from "../../helpers/score"
import mintNFT from "../../helpers/sign"
import NFTPass from '../../contracts/NFTPassABI.json'
import config from "../../config";
export class MintNFTPass extends Component {

    static contextType = BlockchainContext;

    constructor(){
        super()
        this.state = {
            scoreProgress: 'start',
            scores: null,
            accounts: null,
            web3: new Web3(window.ethereum),
            contract: null,
            txHash: null,
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
            database: null,
            text: '',
        }
        this.fetchScore = this.fetchScore.bind(this);
    }

    async componentDidMount() {
        const accounts = await this.context.web3.eth.getAccounts()
        if(accounts[0] !== undefined) {
            const contract = new this.context.web3.eth.Contract(
                NFTPass,
                config.contract_address
            )
            const account = accounts[0].toLowerCase() 
            this.fetchScore(account, contract)
        }
    }

    async fetchScore(account, contract) {
        this.state.app = initializeApp(this.state.firebaseConfig);

        this.state.database = getDatabase(this.state.app);
        const balance = await contract.methods.balanceOf(account).call()
        try {
            const address = account;
            const response = await getNFTScore(address);
            await response.json().then(async (res) => {
                if (res.success) {
                    const starCountRef = ref(
                        this.state.database,
                        "score/" + account
                    );
                    onValue(starCountRef, async (snapshot) => {
                        try{
                            const data = await snapshot.val();
                            this.setState({ scores: data.score });
                            const address = account;
                            const signature = await mintNFT(address);
                            if(balance == 0) {
                                this.setState({text: 'minting new nft', scoreProgress: "progress"})
                                    try {
                                        console.log(signature.score)
                                        contract.methods
                                            .mint(
                                                signature.messageHash,
                                                signature.signature,
                                                signature.nonce,
                                                signature.score
                                            )
                                            .send({ from: account, value: 0 })
                                            .then((res) => {
                                                this.setState({
                                                    txHash: res.transactionHash,
                                                    scoreProgress: "minted",
                                                });
                                            })
                                    } catch (error) {
                                        this.setState({ scoreProgress: "error" });
                                        console.log(error);
                                    }
                            } else if( balance == 1) {
                                this.setState({text: 'updating current nft', scoreProgress: "progress"})
                                try {
                                    contract.methods
                                        .updateScore(
                                            signature.messageHash,
                                            signature.signature,
                                            signature.nonce,
                                            signature.score
                                        )
                                        .send({ from: account, value: 0 })
                                        .then((res) => {
                                            this.setState({
                                                txHash: res.transactionHash,
                                                scoreProgress: "minted",
                                            });
                                        });
                                } catch (error) {
                                    this.setState({ scoreProgress: "error" });
                                    console.log(error);
                                }
                            }
                        } catch (e) {
                            console.log(e)
                            this.setState({scoreProgress: 'error'})
                        }
                    });
                } else {
                    throw new Error();
                }
            })
        } catch (e) {
            this.setState({scoreProgress: 'error'})
            console.log(e)
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
                                        { this.state.scoreProgress == 'progress' && (
                                            <div>
                                                <Row className="justify-content-center align-items-center" style={{paddingTop: '15px'}}>
                                                    <Spinner size='200%' animation="border" role="status"/>
                                                </Row>
                                                <Row style={{ paddingTop: "15px" }} className="justify-content-center">
                                                    <p style={{ backgroundColor: "rgba(0, 0, 0, 0)", borderRadius: "0", border: "0" }}>
                                                        {this.state.text.toUpperCase()}
                                                    </p>
                                                </Row>
                                            </div>
                                            )
                                        }
                                        { this.state.scoreProgress == 'minted' && (
                                            <div>
                                                <Row
                                                    style={{
                                                        paddingTop: "5%",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <a
                                                        className="border-0 w-100"
                                                        style={{
                                                            borderRadius: "0rem",
                                                            backgroundColor: "rgb(0,0,0)",
                                                            color: "white",
                                                            fontFamily: "Inter",
                                                            fontWeight: "700",
                                                            padding: "10px 20px 10px 20px",
                                                        }}
                                                        href={`https://polygonscan.com/tx/${this.state.txHash}`}
                                                    >
                                                        View on PolygonScan ???
                                                    </a>
                                                </Row>
                                                {/* <Row
                                                    style={{
                                                        paddingTop: "5%",
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    <a
                                                        className="border-0 w-100"
                                                        style={{
                                                            borderRadius: "0rem",
                                                            backgroundColor: "rgb(0,0,0)",
                                                            color: "white",
                                                            fontFamily: "Inter",
                                                            fontWeight: "700",
                                                            padding: "10px 20px 10px 20px",
                                                        }}
                                                        href="https://opensea.io"
                                                    >
                                                        View in OpenSea ???
                                                    </a>
                                                </Row> */}
                                            </div>)
                                        }
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </Row>
                </Container>
            )
        } else if (this.state.scoreProgress === 'error') {
            return (
                <div
                    id="app"
                    style={{ borderStyle: "none", paddingTop: "20%" }}
                >
                    <h4
                        style={{
                            fontFamily: "Inter",
                            fontWeight: "700",
                            paddingTop: "10px",
                        }}
                    >
                        Oops! <br /> An error occured.
                    </h4>
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
                                Getting your NFTPass...
                            </h4>
                        </Row>
                    </Container>
                </div>
            )
        }
    }
}