import "./App.css";
import { Component } from "react";
import Web3 from "web3";
import { BrowserRouter as Router } from "react-router-dom";
import BlockchainContext from "./Context/BlockchainContext";
import Routes from "./Routes";
import { Container, Image } from "react-bootstrap";
import ReactGA from "react-ga4";
import { Helmet } from "react-helmet";
import { NavComp } from "./Components/Navbar";
import { Button, Col, Row } from "react-bootstrap";
import NFTPass from "./contracts/NFTPassABI.json";
import config from "./config";


ReactGA.initialize(config.google_analytics);

class App extends Component {
  constructor() {
    super();
    this.state = {
      accounts: null,
      networkId: null,
      web3: new Web3(window.ethereum),
      contract: null,
      scoreProgress: null
    };
    this.connectWeb3 = this.connectWeb3.bind(this);
  }

  async componentDidMount() {
    console.log(window.innerWidth)
    ReactGA.send("pageview");

    if(window.ethereum) {
      this.connectWeb3()
      this.setState(
        {
            contract: new this.state.web3.eth.Contract(
                NFTPass,
                config.contract_address
            ),
        },
      );
      this.setState({networkId: await this.state.web3.eth.net.getId()})
    }

  }

  async connectWeb3() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.setState({ accounts })
        
        if (this.state.web3.eth.net.getId() !== 4) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x89' }], // chainId must be in hexadecimal numbers
            })     
            .then(async() => {this.setState({networkId: await this.state.web3.eth.net.getId()})})
          } catch (e) {
            if(e.code !== 4001) {
              try{
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: '0x89',
                    chainName: 'Matic (Polygon) Mainnet',
                    nativeCurrency: {
                        name: 'MATIC',
                        symbol: 'MATIC',
                        decimals: 18
                    },
                    rpcUrls: ['https://rpc-mainnet.matic.network'],
                    blockExplorerUrls: ['https://polygonscan.com']
                }]
                }).then( async() => {
                  await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x89' }], // chainId must be in hexadecimal numbers
                  })     
                  .then(async() => {this.setState({networkId: await this.state.web3.eth.net.getId()})})
                })
              } catch (e) {
                console.log(e)
              }
            }
            console.log(e)
          }

        }
      } catch (error) {
        if (error.code === 4001) {
          // User rejected request
        }
        console.log(error)
      }
    }
  }

  render() {
    const web3 = this.state.web3;
    const accounts = this.state.accounts;
    const contract = this.state.contract; 
    if(window.ethereum) {
      window.ethereum.on('chainChanged', (chain) => {this.setState({networkId: parseInt(chain)})})
      window.ethereum.on('accountsChanged', (accounts) => {this.setState({accounts})});
      
    }

    if (this.state.accounts !== null && this.state.networkId === 137) {
      return (
        <div className="App">
          <Helmet>
            <meta charSet="utf-8" />
            <title>NFTPass — your wallet score and rank</title>
            <link rel="canonical" href="/" />
            <meta
              name="description"
              content="Find out your wallet score. Prove your are not a bot. Mint NFT with a proof. Brag about it."
            />
          </Helmet>
          <Router>
            <BlockchainContext.Provider value={{ web3, accounts, contract }}>
                <NavComp/>
                <Routes />
            </BlockchainContext.Provider>
          </Router>
        </div>
      )
    } else {
      let fontSize = 10;
      if(window.innerHeight/window.innerWidth >= 1) {
          fontSize = 5
      }
      return (
        <div className="App">
          <Helmet>
            <meta charSet="utf-8" />
            <title>NFTPass — your wallet score and rank</title>
            <link rel="canonical" href="/" />
            <meta
              name="description"
              content="Find out your wallet score and rank. Mint NFT with a proof. Brag about it."
            />
          </Helmet>
          <Router>
            <BlockchainContext.Provider value={{ web3, accounts, contract }}>
              <NavComp/>
              <Container style={{textAlign: "left"}} fluid>
                <Row className="justify-content-center align-items-center">
                    <Col xs={{span: 12, order: 2}} lg={{span: 8, order: 1}}>
                        <div id='app' style={{borderStyle: "none", paddingTop: '10%'}}>
                            <h1 style={{ padding: '10px', fontFamily: 'Inter', fontWeight: '700', fontSize: `${fontSize}vh` }}>Connect 🔌 your wallet and find out 🔮 your NFTPASS score! 💎</h1>
                            <Row style={{ padding: '10px', paddingTop: '5%'}}>
                                <Col xs={{span: 12, order: 1}} lg={{span: 'auto'}} style={{paddingTop: '10px'}}>
                                    <Button className='border-0 w-100' style={{borderRadius: '0rem', backgroundColor: 'rgb(0,0,0)', color: 'white', fontFamily: 'Inter', fontWeight: '700', padding: '10px 20px 10px 20px'}} onClick={this.connectWeb3}><img src='metamask.svg' style={{paddingRight: '2px'}}/>Connect Metamask</Button>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col xs={{span: 12, order: 1}} lg={{span: 4, order: 2}}></Col>
                </Row>
                <Image src="/pepe.png" fluid className="pepe" />
              </Container>
            </BlockchainContext.Provider>
          </Router>
        </div>
      )
    }
  }
}

export default App;
