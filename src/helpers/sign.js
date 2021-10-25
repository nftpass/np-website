import config from "../config";


async function mintNFT(address) {
    return fetch(
        `${config.backend_endpoint}/sign/${this.context.accounts[0]}`
    ).then((res) => res.json());
}

export default mintNFT