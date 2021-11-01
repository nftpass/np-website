import React, { Component } from "react";
import { Container, Row, Spinner, Table } from "react-bootstrap/esm/index";
import BlockchainContext from "../../Context/BlockchainContext";
import getRank from "../../helpers/rank.js";
import shortenAddress from "../../helpers/address";
import getAddressPercentile from "../../helpers/percentile";
import "./Rank.css";


export class RankScore extends Component {

    static contextType = BlockchainContext;

    constructor(){
        super()
        this.state = {
            rank: undefined,
            loading:true,
            error:false,
            account: null
        }
    }

    async componentDidMount() {
        try {
            const accounts = await this.context.web3.eth.getAccounts()
            if(accounts[0] !== undefined) {
                const account = accounts[0].toLowerCase()
                this.setState({account})
                const rank = await getRank();
                const percentile = await getAddressPercentile(account);
                this.setState({
                    rank:rank,
                    percentile:percentile,
                    loading: false,
                    error: false
                });
            }




        } catch (e) {
            this.setState({
                error: 'Bug fetching rank or percentile',
                loading:false
            })
        }
    }

    renderAddressRow(address, index, userAddressShort){
        const isUser = address && address.address === userAddressShort;
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
        const userAddress = this.context && this.state.account;
        const userAddressShort = shortenAddress(userAddress);
        let {rank, percentile, error, loading} = this.state;
        rank = rank || [];
        return(
            <div id="app" style={{ borderStyle: "none"}}>
                <Container className="justify-content-center">
                    {
                        loading && (
                            <Row className="justify-content-center align-items-center" style={{paddingTop: '20%'}}>
                                <Spinner size='200%' animation="border" role="status"/>
                            </Row>
                        )
                    }
                    {
                        !loading && (
                            <div>
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
                                {
                                    percentile &&
                                    <Row className="justify-content-center align-items-center percentile-row">
                                        <p>You are in the <b> {percentile.percentile}</b> percentile.</p>
                                    </Row>
                                }
                            </div>
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