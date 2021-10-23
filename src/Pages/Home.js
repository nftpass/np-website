import React, { Component } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import './pages.css'
import Web3 from "web3";
import axios from 'axios';
import NFTPass from '../contracts/NFTPassABI.json'
require('dotenv').config()
const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;

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
            loaderText: null,
            scores: null,
            accounts: null,
            networkId: null,
            web3: new Web3(window.ethereum),
            spinner: true,
            contract: null
        }
        this.getScore = this.getScore.bind(this);
        this.mintNFTPass = this.mintNFTPass.bind(this);
    }

    async componentDidMount() {
        this.setState({contract: new this.state.web3.eth.Contract(NFTPass, '0x8d2De24678bD8BD2486f943b633a341E33FBd251')}, () => {
            console.log(this.state.contract)
        })
        console.log(PRIVATE_KEY)
    }

    async connectWeb3() {
        if (window.ethereum) {
          try {
            const accounts = await window.ethereum.request({
              method: "eth_requestAccounts",
            });
            const balance = this.state.web3.utils.fromWei(
              await this.state.web3.eth.getBalance(accounts[0])
            );
            this.state.web3.eth.net.getId().then(async (networkId) => {
                console.log(networkId)
              
              if(networkId !== 4) {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x4' }], // chainId must be in hexadecimal numbers
                  });
              }
            });
            this.setState({ accounts });
            return accounts
          } catch (error) {
            return error
          }
        }
      }

    async getScore(metamask) {
        try {
            this.setState({scoreProgress: 'progress', loaderText: 'Connecting to web3'})
            await this.connectWeb3(metamask)
            .then((res) => {
                console.log(res)
                if(res.code !== 4001) {
                    this.setState({loaderText: <>Calculating your score! <br/> this will take a minute...</>})
                } else {
                    throw new Error();
                }
            })
            const response = await fetch('https://chat.kesarx.repl.co/score')
            await response
            .json()
            .then((scores) => {
                setTimeout(() => { this.setState({scoreProgress: 'score', scores}) }, 1000)
            }) 
        } catch (e) {
            this.setState({scoreProgress: 'error'})
        }
    }

    between(min, max) {  
        return Math.floor(
          Math.random() * (max - min) + min
        )
    }

    async mintNFTPass () {
        this.setState({scoreProgress: 'progress', loaderText: 'We are minting your NFT...'})
        const nonce = this.between(0, Number.MAX_SAFE_INTEGER)
        const score = this.between(0, Number.MAX_SAFE_INTEGER)
        let hashMessage = this.state.web3.utils.soliditySha3(this.state.accounts[0], score, nonce)
        console.log(hashMessage)
        let signature = this.state.web3.eth.accounts.sign(hashMessage, PRIVATE_KEY)
        console.log(signature.messageHash, signature.signature)
        await this.state.contract.methods.mint(signature.messageHash, signature.signature, nonce, score)
            .send({ from: this.state.accounts[0], value: 0 })
            .then((res) => {
                console.log(res)
            })


        // const canvas = createCanvas(256, 256);
        // const ctx = canvas.getContext('2d');
        // const background = await loadImage('/frame.png')
        // ctx.drawImage(background, 0, 0, 256, 256);
        // const image = canvas.toBuffer()
        // console.log(image)

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
                                <Col xs={{span: 12, order: 2}} lg={{span: 8, order: 1}}>
                                    <div id='app' style={{borderStyle: "none", paddingTop: '10%'}}>
                                        <h1 style={{ padding: '10px', fontFamily: 'Inter', fontWeight: '700', fontSize: '10vh' }}>Connect 🔌 your wallet and find out 🔮 your NFTPASS score! 💎</h1>
                                        <Row style={{ padding: '10px', paddingTop: '5%'}}>
                                            <Col xs={{span: 12, order: 1}} lg={{span: 'auto'}} style={{paddingTop: '10px'}}>
                                                <Button className='border-0 w-100' style={{borderRadius: '0rem', backgroundColor: 'rgb(0,0,0)', color: 'white', fontFamily: 'Inter', fontWeight: '700', padding: '10px 20px 10px 20px'}} onClick={this.getScore}><img src='metamask.svg' style={{paddingRight: '2px'}}/> Connect Metamask</Button>
                                            </Col>
                                            <Col xs={{span: 12, order: 2}} lg={{span: 'auto'}} style={{paddingTop: '10px'}}>
                                                <Button className='border-0 w-100' disabled={true} style={{borderRadius: '0rem', backgroundColor: 'rgb(0,0,0)', color: 'white', fontFamily: 'Inter', fontWeight: '700', padding: '10px 20px 10px 20px', opacity: '0.3' }} onClick={this.getScore}><img src='walletconnect.svg' style={{paddingRight: '2px'}}/>WalletConnect</Button>
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
                                <Minter mint={this.mintNFTPass} scores={this.state.scores}/>
                            </div>
                        }
                                                {
                            this.state.scoreProgress == 'error' && 
                            <div id='app' style={{borderStyle: "none", paddingTop: '20%'}}>
                                <h4 style={{ fontFamily: 'Inter', fontWeight: '700', paddingTop: '10px' }} >Oops! <br/> An error occured.</h4>
                            </div>
                        }
                        {
                            this.state.scoreProgress == 'minted' && 
                            <div id='app' style={{borderStyle: "none", paddingTop: '10%'}}>
                                <Container>
                                    <h1>Minted</h1>
                                    <h4>Your personal NFTPASS score has been minted!</h4>
                                </Container>
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
            <Row className="justify-content-center">
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
                                <h1 style={{ fontFamily: 'Inter', fontWeight: '700'}}>{props.scores.normalized_score}</h1>
                                <p style={{ fontFamily: 'Inter', fontWeight: '700'}}>{props.scores.unnormalized_score} points</p>
                                <p style={{ fontFamily: 'Inter', fontWeight: '700', padding: '0px'}}>TOP {props.scores.percentile}%</p>
                            </div>
                            <h6 className='fixed-bottom' style={{position: "absolute", bottom: '3px', fontFamily: 'Inter', fontWeight: '700', fontSize: '0.7em'}}>NFTPASS.XYZ</h6>
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