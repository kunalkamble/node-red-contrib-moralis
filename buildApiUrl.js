module.exports = (endpoint, apiUrl, address, contractAddress, tokenId) => {
  switch (endpoint) {
    case 'address/nft':
      return `${apiUrl}/${address}/nft`
    case 'nft/contractAddress':
      return `${apiUrl}/nft/${contractAddress}`
    case 'getMultipleNFTs':
      return `${apiUrl}/getMultipleNFTs`
    default:
      return `${apiUrl}`
  }
}