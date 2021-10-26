import config from "../config";


const getNFTScore = async (address) => {
    if(typeof address != 'string'){
        return
    }
    return fetch(
        `${config.backend_endpoint}/get_score/${address}`
    );
}

export default getNFTScore