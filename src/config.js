const config = {
    backend_endpoint: process.env.REACT_APP_BACKEND_URL || 'https://nftpass.herokuapp.com',
    fontend_endpoint: process.env.REACT_APP_FRONTEND_URL || 'https://nftpass.xyz',
    contract_address: process.env.REACT_APP_CONTRACT_ADDRESS || '0xFdD8B67c0E63e93Aa1963248646378a3E8C819f4',
    google_analytics: process.env.REACT_APP_GOOGLE_ANALYTICS || "G-TWE1F7Y03G"
}

console.log(config)

export default config;
