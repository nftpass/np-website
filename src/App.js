import "./App.css";
import { Component } from "react";
import Web3 from "web3";
import { BrowserRouter as Router } from "react-router-dom";
import BlockchainContext from "./Context/BlockchainContext";
import Routes from "./Routes";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import ReactGA from "react-ga4";
import { Helmet } from "react-helmet";

ReactGA.initialize("G-TWE1F7Y03G");

class App extends Component {
  constructor() {
    super();
    this.state = {
      accounts: null,
      balance: 0,
      networkId: null,
      web3: new Web3(window.ethereum),
    };
    this.connected = false;
  }

  componentDidMount() {
    ReactGA.send("pageview");
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
        this.state.web3.eth.net.getId().then((networkId) => {
          this.setState({ networkId });
        });
        this.setState({ accounts, balance });
      } catch (error) {
        if (error.code === 4001) {
        }
        console.log(error);
      }
    }
  }

  render() {
    const balance = this.state.balance;
    const web3 = this.state.web3;
    const accounts = this.state.accounts;
    if (this.state.accounts !== null && this.state.contract !== null) {
      this.connected = true;
    }
    return (
      <div className="App">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Nftpass — your wallet score and rank</title>
          <link rel="canonical" href="https://nftpass.xyz/" />
          <meta
            name="description"
            content="Find out your wallet score and rank. Mint NFT with a proof. Brag about it."
          />
        </Helmet>
        <Router>
          <BlockchainContext.Provider value={{ balance, web3, accounts }}>
            <Navbar
              variant="dark"
              expand="lg"
              style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            >
              <Container fluid>
                <Navbar.Brand href="/">
                  <img
                    src="logowithtext.svg"
                    style={{ height: "2em" }}
                    alt=""
                  />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="ml-auto">
                    <Nav.Link
                      style={{ color: "black" }}
                      className="navlink"
                      href="/"
                    >
                      DAO
                    </Nav.Link>
                    <Nav.Link
                      style={{ color: "black" }}
                      className="navlink"
                      href="/"
                    >
                      FAQ
                    </Nav.Link>
                    <Nav.Link
                      style={{ color: "black" }}
                      className="navlink"
                      href="/"
                    >
                      Docs
                    </Nav.Link>
                  </Nav>
                  {/* <Nav
                    className="mr-auto"
                    style={{
                      borderRadius: "0.7rem",
                      border: "0.1px solid black",
                    }}
                  >
                    {this.connected ? (
                      <Navbar.Text style={{ padding: "10px", color: "black" }}>
                        {accounts[0]}
                      </Navbar.Text>
                    ) : (
                      <Button
                        className="border-0 transparent"
                        style={{ color: "black" }}
                        onClick={() => {
                          this.connectWeb3();
                        }}
                      >
                        Connect
                      </Button>
                    )}
                  </Nav> */}
                </Navbar.Collapse>
              </Container>
            </Navbar>
            <Routes />
          </BlockchainContext.Provider>
        </Router>
      </div>
    );
  }
}

export default App;
