import config from "../config";


async function getNFTScore(address) {
    return fetch(
        `${config.backend_endpoint}/get_score/${this.context.accounts[0]}`
    );
}

export default getNFTScore