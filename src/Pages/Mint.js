import React, { Component } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import './pages.css'
import Web3 from "web3";
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue} from "firebase/database";
import BlockchainContext from "../Context/BlockchainContext";
import axios from "axios";


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
            pinata_api_key: '9abc6e0558f2d596f696',
            pinata_secret_api_key: 'af50e53805c94dfa4b6bd3ddb85eadb5898704a5c17577b5651cf968e441cdec'
        }
        
    }

    async componentDidMount() {
        this.state.app = initializeApp(this.state.firebaseConfig);

        this.state.database = getDatabase(this.state.app);
        const balance = await this.context.contract.methods.balanceOf(this.context.accounts[0]).call({from: this.context.accounts[0]})
        try {
            const response = await fetch(
                `https://nftpass.herokuapp.com/get_score/${this.context.accounts[0]}`
            );
            await response.json().then(async (res) => {
                if (res.success) {
                    const starCountRef = ref(
                        this.state.database,
                        "score/" + this.context.accounts[0]
                    );
                    onValue(starCountRef, async (snapshot) => {
                        const data = await snapshot.val();
                        this.setState({ scores: data.score });
                    });
                } else {
                    throw new Error();
                }
            })
            .then(async () => {
                const signature = await fetch(
                    `https://nftpass.herokuapp.com/sign/${this.context.accounts[0]}`
                ).then((res) => res.json());
                if(balance == 0) {
                    this.setState({text: 'minting new nft', scoreProgress: "progress"})
                    this.pinJSONToIPFS(this.state.scores)
                        .then((res) => {console.log(`https://gateway.pinata.cloud/ipfs/${res}`)})
                        try {
                            await this.context.contract.methods
                                .mint(
                                    signature.messageHash,
                                    signature.signature,
                                    signature.nonce,
                                    signature.score
                                )
                                .send({ from: this.context.accounts[0], value: 0 })
                                .then((res) => {
                                    this.setState({
                                        txHash: res.transactionHash,
                                        scoreProgress: "minted",
                                    });
                                })
                                .then(async () => {
                                    try {
                                        const metadata = this.pinJSONToIPFS(this.state.score)
                                        console.log(metadata)
                                    } catch (error) {
                                        this.setState({ scoreProgress: "error" });
                                        console.log(error)
                                    }
                                })
                        } catch (error) {
                            this.setState({ scoreProgress: "error" });
                            console.log(error);
                        }
                } else if( balance == 1) {
                    this.setState({text: 'updating current nft', scoreProgress: "progress"})
                    try {
                        await this.context.contract.methods
                            .updateScore(
                                signature.messageHash,
                                signature.signature,
                                signature.nonce,
                                signature.score
                            )
                            .send({ from: this.context.accounts[0], value: 0 })
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
            })
        } catch (e) {
            this.setState({scoreProgress: 'error'})
            console.log(e)
        }
    }

    pinFileToIPFS = (file) => {

        //we gather a local file for this example, but any valid readStream source will work here.
        let data = new FormData();
        data.append('file', file);

        //pinataOptions are optional
        const pinataOptions = JSON.stringify({
            cidVersion: 0,
            customPinPolicy: {
                regions: [
                    {
                        id: 'FRA1',
                        desiredReplicationCount: 1
                    },
                    {
                        id: 'NYC1',
                        desiredReplicationCount: 2
                    }
                ]
            }
        });
        data.append('pinataOptions', pinataOptions);

        return axios
            .post(`https://api.pinata.cloud/pinning/pinFileToIPFS`, data, {
                maxBodyLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                    pinata_api_key: this.state.pinata_api_key,
                    pinata_secret_api_key: this.state.pinata_secret_api_key
                }
            })
            .then((response) => {
                console.log(response.data.IpfsHash)
                return response.data.IpfsHash;
            })
            .catch((error) => {
                console.log(error)
            });
    };

    pinJSONToIPFS = async (score) => {
        const JSONBody = {
            pinataMetadata: {
                name: 'NFTPass',
            },
            pinataContent: {
                name: 'NFTPass',
                description: 'NFTPasses rank ethereum addresses based on their NFT history.',
                image: `https://nftpass.xyz/default.png`,
                attributes: [
                    {
                        "display_type": 'number',
                        "trait_type": 'Score',
                        "value": parseInt(score)
                    }
                ]
            }
        }

        return axios
            .post(`https://api.pinata.cloud/pinning/pinJSONToIPFS`, JSONBody, {
                headers: {
                    pinata_api_key: this.state.pinata_api_key,
                    pinata_secret_api_key: this.state.pinata_secret_api_key
                }
            })
            .then((response) => {
                return response.data.IpfsHash;
            })
            .catch((error) => {
                console.log(error)
            });
    };

    changeMetadataForHash = (newScore, hash, contract, tokenID) => {
        const url = `https://api.pinata.cloud/pinning/hashMetadata`;
        const body = {
            ipfsPinHash: hash,
            attributes: [
                {
                    "display_type": 'number',
                    "trait_type": 'NFT Slots',
                    "value": newScore,
                }
            ]
        };
        return axios
            .put(url, body, {
                headers: {
                    pinata_api_key: this.state.pinata_api_key,
                    pinata_secret_api_key: this.state.pinata_secret_api_key
                }
            })
            .then(function (response) {
                console.log(response)
            })
            .catch(function (error) {
                console.log(error)
            });
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
                                                        href={`https://rinkeby.etherscan.io/tx/${this.state.txHash}`}
                                                    >
                                                        View on Etherscan ↗
                                                    </a>
                                                </Row>
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
                                                        href="https://opensea.io"
                                                    >
                                                        View in OpenSea ↗
                                                    </a>
                                                </Row>
                                            </div>)
                                        }
                                        {this.state.scoreProgress == "error" && (
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
                                        )}
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </Row>
                </Container>
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