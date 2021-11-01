import config from "../config";


const getAddressPercentile = async (address) => {
    if(typeof address != 'string'){
        return
    }
    return await fetch(
        `${config.backend_endpoint}/get_percentile/${address}`
    ).then((res) => res.json());
}

export default getAddressPercentile