import Button from "@restart/ui/esm/Button";
import { Component } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import BlockchainContext from "../Context/BlockchainContext";
export class NavComp extends Component {

    static contextType = BlockchainContext;

    render() {
        let account;
        if(this.context.accounts !== null) {
            account = this.context.accounts[0]
        }
        return(
        <Navbar
              variant="dark"
              expand="lg"
              style={{ backgroundColor: "rgba(0, 0, 0, 0)", height: "5em" }}
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
                      href="https://github.com/nftpass/"
                    >
                      GitHub
                    </Nav.Link>
                    <Nav.Link
                      style={{ color: "black" }}
                      className="navlink"
                      href="https://rinkeby.etherscan.io/address/0x48647b5E64f4ECb7F9E2BA11461Cc2fA4438d816"
                    >
                      Contract
                    </Nav.Link>
                    <Button className='border-0 w-100' style={{borderRadius: '0rem', backgroundColor: 'rgba(0,0,0,0)',  color: 'black', fontFamily: 'Inter', fontWeight: '700', padding: '0px 10px 0px 10px'}} disabled={true}>{account}</Button>
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>
        )
    }
    
}