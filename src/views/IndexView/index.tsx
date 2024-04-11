import { Container } from "@/components/Container";
import { Header } from "@/components/MediaObject/Header";
import { Spin } from "@/components/Spin";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

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
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState<NFT[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://mainnet.underdogprotocol.com/v2/projects/', {
          headers: {
            'accept': 'application/json',
            'authorization': `Bearer ${process.env.NEXT_PUBLIC_BEARER_KEY}`
          },
          params: {
            page: currentPage,
            limit: 100, // Set the limit to fetch 100 projects per request
          },
        });
        setProjectData((prevData) => [...prevData, ...response.data.results]);
        setTotalPages(response.data.meta.totalPages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };

    if (currentPage <= totalPages) {
      fetchProjects();
    }
  }, [currentPage, totalPages]);

  const loadingTimeout = 2000; // Simulated loading time in milliseconds

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, loadingTimeout);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <Container size="2xl" className="pt-8 space-y-8">
      <Header />
      <img src="/villagesbanner.png" alt="VD Logo" style={{ width: '100%' }} />
      {loading ? (
        <div className="flex justify-center py-4">
          <Spin />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-1" style={{ rowGap: '0', height: '100%' }}>
            {projectData
              .filter((project) => [2, 4, 5].includes(project.id)) // Filter projects with IDs 2, 3, and 5
              .map((project) => {
                // Calculate claimed and remaining NFTs for each project
                const claimedCount = projectData.filter((nft) => nft.ownerAddress && !nft.ownerAddress.startsWith('shop')).length;
                const remainingCount = 1000 - claimedCount;
                
                return (
                  <div key={project.id} className="relative pb-[relative] rounded-md overflow-hidden hover:opacity-50">
                    <Link href={`/${project.id}`}>
                      <img className="absolute h-[80%] w-full object-cover" src={project.image} />
                    </Link>
                    <div className="text-center mt-[100%] text-white">
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
      <center>
        <div className="text-white">
          <p>
            <i>Contribute using a credit or debit card with Stripe</i>
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

