import React, { Component } from "react";
import { Container, Row, Spinner, Table } from "react-bootstrap/esm/index";
import BlockchainContext from "../../Context/BlockchainContext";
import getRank from "../../helpers/rank.js";
import "./Rank.css";
import shortenAddress from "../../helpers/address";

export class RankScore extends Component {

    static contextType = BlockchainContext;

    constructor(){
        super()
        this.state = {
            rank: undefined,
            loading:true,
            error:false
        }

    }

    async componentDidMount() {
        try {
            const response = await getRank();
            this.setState({
                rank:response,
                loading: false,
                error: false
            });

        } catch (e) {
            console.log(e)
            this.setState({
                error: 'Bug fetching rank',
                loading:false
            })
        }
    }

    renderAddressRow(address, index, userAddressShort){
        const isUser = address && address.address == userAddressShort;
        const cssClasses = isUser ? 'user-address' : '';
        return (
            <tr className={cssClasses}>
                <td>{index + 1} </td>
                <td>{address.score}</td>
                <td>
                    {address.address} { isUser &&  <span>(this is you)</span>}
                </td>
            </tr>
        )
    }

    render () {
        const userAddress = this.context && this.context.accounts[0];
        const userAddressShort = shortenAddress(userAddress);
        let {rank, error, loading} = this.state;
        rank = rank || [];
        return(
            <div id="app" style={{ borderStyle: "none"}}>
                <Container className="justify-content-center">
                    {
                        loading && (
                            <Row className="justify-content-center align-items-center">
                                <Spinner size='200%' animation="border" role="status"/>
                            </Row>
                        )
                    }
                    {
                        !loading && (
                            <Row className="justify-content-center align-items-center">
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Rank</th>
                                            <th>Score</th>
                                            <th>Address</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rank.map((address, index) => {
                                            return this.renderAddressRow(address, index, userAddressShort);
                                        })}
                                    </tbody>
                                </Table>
                            </Row>
                        )
                    }
                    {
                        error && (
                            <Row className="justify-content-center align-items-center">
                                {error}
                            </Row>
                        )
                    }
                </Container>
            </div>
        )
    }
}