import React, { Component } from "react";
import { Container, Row, Spinner } from "react-bootstrap/esm/index";
import BlockchainContext from "../../Context/BlockchainContext";
import getRank from "../../helpers/rank.js";
import Web3 from "web3";


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

    render () {
        let {rank, error, loading} = this.state;
        rank = rank || [];
        return(
            <div id="app" style={{ borderStyle: "none", padding: "20%" }}>
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
                                {rank.map((address) => {
                                    return (<div>
                                        {address.address} | {address.score}
                                    </div>)
                                })}
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