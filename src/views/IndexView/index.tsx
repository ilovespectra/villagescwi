import { Container } from "@/components/Container";
import { Header } from "@/components/MediaObject/Header";
import { Spin } from "@/components/Spin";
import { useProjects } from "@/hooks/useProjects";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import axios, { AxiosResponse } from "axios";

// Define a type for the NFT data
type NFT = {
  id: number;
  status: string;
  projectId: number;
  mintAddress: string;
  ownerAddress: string;
  name: string;
  symbol: string;
  description: string;
  image: string;
  animationUrl: string | null;
  attributes: {
    sellerFeeBasisPoints: string;
    price: string;
    paymentLink: string;
  };
  externalUrl: string | null;
};

export const IndexView: React.FC = () => {
  const { data, isLoading } = useProjects({ query: { page: 1, limit: 20 } });


  // Log the names of the projects
  console.log("All projects:", data?.results.map((project) => project.name));

  const filteredData = useMemo(() => {
  if (data) {
    return data.results.filter((project, index) => {
      const isBarapadaCWI = project.name === "Barapada-CWI";
      const isVillagesDAO = project.name === "VillagesDAO";

      if (isBarapadaCWI && index !== 4) {
        // Exclude the first instance of "Barapada-CWI" (index 4)
        return false;
      } else if (isVillagesDAO) {
        // Exclude "VillagesDAO"
        return false;
      }

      return true;
    });
  }
  // Return an empty array (or any default value) if data is falsy
  return [];
}, [data]);

  // Define the base URL and headers for the API
  const baseUrl = 'https://mainnet.underdogprotocol.com/v2/projects/';
  const headers = {
    'accept': 'application/json',
    'authorization': `Bearer ${process.env.NEXT_PUBLIC_BEARER_KEY}`,
  };

  // Function to fetch NFTs for a specific project
  async function fetchNFTsForProject(projectId: number): Promise<NFT[]> {
    const apiUrl = `${baseUrl}${projectId}/nfts`;
    const params = {
      limit: 100, // Set the limit to 100 NFTs per request
    };

    try {
      const apiResponse: AxiosResponse<{ results: NFT[] }> = await axios.get(apiUrl, { headers, params });
      return apiResponse.data.results;
    } catch (error) {
      console.error(`Error making the API request for project ${projectId}:`, error);
      return [];
    }
  }

  const loadingTimeout = 2000; // Simulated loading time in milliseconds

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, loadingTimeout);

    return () => {
      clearTimeout(timer);
    };
  }, []);


  const [projectData, setProjectData] = useState<NFT[][]>([]);

  useEffect(() => {
    if (filteredData) {
      // Fetch NFT data for each project
      Promise.all(filteredData.map((project) => fetchNFTsForProject(project.id)))
        .then((results) => {
          setProjectData(results);
        })
        .catch((error) => {
          console.error("Error fetching NFTs:", error);
        });
    }
  }, [filteredData]);

  return (
    <Container size="2xl" className="pt-8 space-y-8">
      <Header />
      <img src="/villagesbanner.png" alt="VD Logo" style={{ width: '100%' }} />
      {!filteredData || isLoading || loading ? (
        <div className="flex justify-center py-4">
          <Spin />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-1" style={{ rowGap: '0', height: '100%' }}>
            {filteredData.map((project, index) => (
              <div key={project.id} className="relative pb-[relative] rounded-md overflow-hidden hover:opacity-50">
                <Link href={`/${project.id}`}>
                  <img className="absolute h-[80%] w-full object-cover" src={project.image} />
                </Link>
                <div className="text-center mt-[100%] text-white">
                  {projectData[index] ? (
                    <>
                      <p>Claimed: {projectData[index].filter((nft) => !nft.ownerAddress.startsWith('shop')).length}</p>
                      <p>Remaining: {1000 - projectData[index].filter((nft) => !nft.ownerAddress.startsWith('shop')).length}</p>
                    </>
                  ) : (
                    <div className="loading-bar">
                      <div className="water-level"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <center>
        <div className="text-white">
          <p>
            <i>Select a collection above to mint, or bypass all the crypto stuff with a simple donation:</i>
          </p>
        </div>
      </center>
      <div className="flex justify-center mt-4">
        <a href="https://buy.stripe.com/00g6q11xR8PH7G89AA" target="_blank" rel="noopener noreferrer">
          <button className="bg-blue-600 hover:bg-blue-800 active:bg-blue-800 text-white font-bold py-2 px-4 rounded transition-transform transform-gpu active:scale-95">
            Donate
          </button>
        </a>
      </div>
      <div className="flex justify-center">
        <a
          href="https://app.realms.today/dao/VILLAGE"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/realmslogo.svg"
            alt="Realms Logo"
            className="cursor-pointer"
            style={{
              width: "110px",
              transition: "filter 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.filter = "brightness(60%)")}
            onMouseOut={(e) => (e.currentTarget.style.filter = "brightness(100%)")}
          />
        </a>
      </div>
      <div className="flex justify-center mt-4">
        <a href="https://twitter.com/HNTDenver" target="_blank" rel="noopener noreferrer">
          <img src="/favico.png" alt="Favico" style={{ width: "90px", marginRight: "50px" }} />
        </a>
        <a href="https://twitter.com/aerialiot" target="_blank" rel="noopener noreferrer">
          <img src="/aiot.png" alt="Aiot Logo" style={{ width: "90px", marginRight: "50px" }} />
        </a>
        <a href="https://twitter.com/NFTCryptoChicks" target="_blank" rel="noopener noreferrer">
          <img src="/cc.png" alt="CC" style={{ width: "90px" }} />
        </a>
      </div>
    </Container>
  );
};
