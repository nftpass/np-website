const cacheTimeValidity = 60*60*1000*2; //in hours (2 hours); expressed in milliseconds


const isCachedScoreValid = (lastUpdate) => {
    return Math.abs(new Date() - lastUpdate)  < cacheTimeValidity
}

export default isCachedScoreValid;