import config from "../config";


async function mintNFT(address) {
    return fetch(
        `${config.backend_endpoint}/sign/${address}`
    ).then((res) => res.json());
}

export default mintNFT