module.exports = () => {
  switch (endpoint) {
    case 'address/nft':
      return `${s.API_URL}/${address}/nft`
    case 'nft/contractAddress':
      return `${s.API_URL}/nft/${contractAddress}`
    case 'getMultipleNFTs':
      return `${s.API_URL}/getMultipleNFTs`
    default:
      return `${s.API_URL}`
  }
}