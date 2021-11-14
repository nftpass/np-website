const cacheTimeValidity = 60*1000; //in hours (1 min); expressed in milliseconds


const isCachedScoreValid = (lastUpdate) => {
    return Math.abs(new Date() - lastUpdate)  < cacheTimeValidity
}

export default isCachedScoreValid;