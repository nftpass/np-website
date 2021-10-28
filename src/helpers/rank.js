import config from "../config";


async function getRank() {
    return fetch(
        `${config.backend_endpoint}/rank`
    ).then((res) => res.json());
}

export default getRank;