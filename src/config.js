const config = {
    backend_endpoint: process.env.BACKEND_URL || 'https://nftpass.herokuapp.com',
    fontend_endpoint: process.env.FRONTEND_URL || 'https://nftpass.xyz',
    contract_address: process.env.CONTRACT_ADDRESS || '0x48647b5E64f4ECb7F9E2BA11461Cc2fA4438d816',
    google_analytics: process.env.GOOGLE_ANALYTICS || "G-TWE1F7Y03G"
}

export default config;