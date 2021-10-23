import React, { Component } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import './pages.css'
import ReactDOM from 'react-dom';
import axios from 'axios';


export class Home extends Component {
    constructor(){
        super()
        this.state = {
            scoreProgress: 'start',
            phrases: [
                'Counting NFTs',
                'Looking into wallet history',
                'Counting collections',
                'Valuating collection',
                'Calculate ranking',
                'Checking diamond hands',
                'Asking reputable DAOs',
                'Checking POAPs'
            ],
            count: 0,
            loaderText: null
        }
        this.getScore = this.getScore.bind(this);
        this.mintNFTPass = this.mintNFTPass.bind(this);
    }

    getScore() {
        this.setState({scoreProgress: 'progress', loaderText: <>Calculating your score! <br/> this will take a minute</>})
        const timeOut = setTimeout(() => {
            this.setState({scoreProgress: 'score'})
        }, 2000)

    }

    async mintNFTPass () {
        this.setState({scoreProgress: 'progress', loaderText: 'We are minting your NFT...'})
        // this.pinFileToIPFS()
        //     .then(async (res) => {
        //         this.pinJSONToIPFS()
        //             .then(async () => {
        //                 const tokenURI = res
        //             })
        //     })
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
    
    pinJSONToIPFS = async (name, imageURL, description) => {
        const JSONBody = {
            pinataMetadata: {
                name: name,
            },
            pinataContent: {
                name: name,
                description: description,
                image: `https://gateway.pinata.cloud/ipfs/${imageURL}`,
                attributes: [
                    {
                        "display_type": 'number',
                        "trait_type": 'NFTPass Score',
                        "value": 0,
                        "max_value": 5
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

    render () {
        return (
            <Container style={{textAlign: "left"}} fluid>
                <Row className="justify-content-center align-items-center">
                    
                        {
                            this.state.scoreProgress == 'start' &&
                            <>
                                <Col xs={{span: 12, order: 2}} lg={{span: 6, order: 1}}>
                                    <div id='app' style={{borderStyle: "none", paddingTop: '20%'}}>
                                        <h1 style={{ fontSize: '5vh', padding: '10px', fontFamily: 'Inter', fontWeight: '700' }}>NFTPass</h1>
                                        <h2 style={{ padding: '10px', fontFamily: 'Inter', fontWeight: '700' }}>Connect 🔌your wallet and 🔮 find out your 💎score! </h2>
                                        <Row style={{ padding: '10px'}}>
                                            <Col xs={{span: 12, order: 1}} lg={{span: 'auto'}}>
                                                <Button className='border-0' style={{borderRadius: '0rem', backgroundColor: 'rgb(0,0,0)', color: 'white', fontFamily: 'Inter', fontWeight: '400' }} onClick={this.getScore}><img src='metamask.svg'/> Connect Metamask</Button>
                                            </Col>
                                            <Col xs={{span: 12, order: 2}} lg={{span: 'auto'}}>
                                                <Button className='border-0' style={{borderRadius: '0rem', backgroundColor: 'rgb(0,0,0)', color: 'white', fontFamily: 'Inter', fontWeight: '400', paddingTop: '10px' }} onClick={this.getScore}><img src='walletconnect.svg'/> WalletConnect</Button>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                                <Col xs={{span: 12, order: 1}} lg={{span: 4, order: 2}}></Col>
                            </>
                        }
                        {
                            this.state.scoreProgress == 'progress' &&
                            <div id='app' style={{borderStyle: "none", padding: '20%'}}>
                                <Loader>
                                    <h4 style={{ fontFamily: 'Inter', fontWeight: '700', paddingTop: '10px' }} >{this.state.loaderText}</h4>
                                </Loader>
                            </div>
                        }
                        {
                            this.state.scoreProgress == 'score' && 
                            <div id='app' style={{borderStyle: "none", paddingTop: '10%'}}>
                                <Minter mint={this.mintNFTPass}/>
                            </div>
                        }
                </Row>
            </Container>
        )
    }

}

function Loader (props) {
  
    return (
        <Container className="justify-content-center">
            <Row>
                <Spinner size='200%' animation="border" role="status"/>
            </Row>
            <Row>
                <>{props.children}</>
            </Row>
        </Container>);
}

function Minter (props) {
    return (
        <Container>
            <Row>
                <Col className='p-5'>
                    <Row>
                        <div style={{ position: 'relative', textAlign: 'center'}}>
                            <img style={{minWidth: '100%', height: 'auto', border: '5px solid black'}} src='frame.png'></img>
                            <div className="imagecenter align-items-center">
                                <img src='logo.svg' width='20%' />
                                <h1 style={{ fontFamily: 'Inter', fontWeight: '700'}}>1299</h1>
                                <p style={{ fontFamily: 'Inter', fontWeight: '700', maxWidth: '60%'}}>MY NFTPASS SCORE IS IN THE TOP 10%</p>
                            </div>
                            <h6 className='fixed-bottom' style={{position: "absolute", bottom: '3px', fontFamily: 'Inter', fontWeight: '700'}}>nftpass.xyz</h6>
                        </div>
                    </Row>
                    <Row style={{paddingTop: '30px'}}>
                        <Button style={{backgroundColor: 'rgba(0, 0, 0, 1)', borderRadius: '0', border: '0'}} className='w-100' onClick={props.mint}>Mint it!</Button>
                    </Row>
                </Col>
                <Col className='p-5'>
                    <Row style={{ textAlign: 'center', paddingTop: '10px'}}>
                        <h5 className='w-100'><a style={{textDecoration: 'none', color: "black", fontFamily: 'Inter', fontWeight: '700'}} href='/'>How do we calculate this?</a></h5>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}