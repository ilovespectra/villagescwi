const axios = require('axios');

// Define the base URL and headers for the API
const baseUrl = 'https://mainnet.underdogprotocol.com/v2/projects/';
const headers = {
  'accept': 'application/json',
  'authorization': `Bearer ${process.env.NEXT_PUBLIC_BEARER_KEY}`,
};

// Function to fetch NFTs for a specific project and page
async function fetchNFTsForProject(projectId, page) {
  const apiUrl = `${baseUrl}${projectId}/nfts`;
  const params = {
    page: page,
    limit: 100, // Set the limit to 100 NFTs per page
  };

  try {
    const apiResponse = await axios.get(apiUrl, { headers, params });
    return apiResponse.data.results;
  } catch (error) {
    console.error(`Error making the API request for project ${projectId}:`, error);
    return [];
  }
}

// Function to fetch all NFTs for a specific project sequentially
async function fetchAllNFTsForProject(projectId) {
  let allNFTs = [];
  let page = 1;

  while (true) {
    const nfts = await fetchNFTsForProject(projectId, page);
    if (nfts.length === 0) {
      // No more NFTs to fetch
      break;
    }

    allNFTs = allNFTs.concat(nfts);
    page++;
  }

  return allNFTs;
}

// List of project IDs to fetch NFTs for (2, 4, and 5 in this example)
const projectIds = [2, 4, 5];

// Fetch and process NFTs for each project
Promise.all(projectIds.map(projectId => fetchAllNFTsForProject(projectId)))
  .then((results) => {
    results.forEach((allNFTs, index) => {
      console.log(`Fetched ${allNFTs.length} NFTs for project ${projectIds[index]}`);

      // Initialize counters for claimed and unclaimed NFTs
      let claimedNFTs = 0;
      let unclaimedNFTs = 0;

      allNFTs.forEach((nft) => {
        if (nft.ownerAddress.startsWith("shop")) {
          unclaimedNFTs++;
        } else {
          claimedNFTs++;
        }
      });

      console.log(`Claimed NFTs for project ${projectIds[index]}:`, claimedNFTs);
      console.log(`Unclaimed NFTs for project ${projectIds[index]}:`, unclaimedNFTs);
    });
  })
  .catch((error) => {
    console.error("Error fetching NFTs:", error);
  });
