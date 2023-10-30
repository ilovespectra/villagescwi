import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { LoadingPage } from "@/components/LoadingPage";
import { Header } from "@/components/MediaObject/Header";
import { PublicKeyLink } from "@/components/PublicKeyLink";
import { useProject } from "@/hooks/useProject";
import { NetworkEnum } from "@underdog-protocol/js";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState, useEffect } from "react";
import { HiOutlineChevronLeft } from "react-icons/hi2";
import axios, { AxiosResponse } from "axios";

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

export function ProjectView() {
  const router = useRouter();
  const projectId = useMemo(
    () => parseInt(router.query.projectId as string),
    [router]
  );

  const { data } = useProject({
    params: { projectId },
    query: { limit: 10, page: 1 },
  });

  const baseUrl = 'https://mainnet.underdogprotocol.com/v2/projects/';
  const headers = {
    'accept': 'application/json',
    'authorization': `Bearer ${process.env.NEXT_PUBLIC_BEARER_KEY}`,
  };

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

  const [projectData, setProjectData] = useState<NFT[]>([]);
  const [claimedNFTs, setClaimedNFTs] = useState<number>(0);

  // Use useMemo for projectData
  const memoizedProjectData = useMemo(() => {
    return projectData;
  }, [projectData]);

  // Use useMemo for claimedNFTs
  const memoizedClaimedNFTs = useMemo(() => {
    return claimedNFTs;
  }, [claimedNFTs]);

  useEffect(() => {
    if (data) {
      fetchNFTsForProject(projectId).then((result) => {
        setProjectData(result);
        // Calculate the claimed NFTs
        const claimedCount = result.filter((nft) => !nft.ownerAddress.startsWith("shop")).length;
        setClaimedNFTs(claimedCount);
      });
    }
  }, [data, projectId]);

  if (!data) return <LoadingPage />;
  console.log("Project Name:", data.name);

  // Calculate remaining NFTs
  const remainingNFTs = 1000 - memoizedClaimedNFTs;

  return (
    <div>
      <div className="space-y-4 flex flex-col items-center bg-dark-800 py-8">
        <Container>
          <Link href="/">
            <Button type="link">
              <HiOutlineChevronLeft className="h-10 w-10 text-dark " />
            </Button>
          </Link>
        </Container>

        <img
          src={data.image}
          className="max-w-sm mx-auto my-6 shadow-2xl"
          style={{ borderRadius: '10px' }}
        />
      </div>

      <Container className="py-6 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 ml-4 md:ml-10 mr-4 md:mr-10">
          <div className="space-y-4">
            <div className="space-y-2">
              <Header title={data.name} size="2xl" />
              <PublicKeyLink
                publicKey={data.mintAddress}
                showExplorer
                network={process.env.NEXT_PUBLIC_NETWORK as NetworkEnum}
              />
            </div>

            {data.description && (
              <Header
                title="Description"
                description={data.description}
                size="xl"
              />
              
            )}
                      <div className="text-white">
                      <br></br><p><i>Coming Soon:<br></br><br></br>
                      Personal accounts from impacted villagers, 
                        including a statement from our women leaders 
                        who are forerunning operations on the ground.<br></br><br></br> 
                        Stay tuned for updates!
                        </i></p>
                </div>
          </div>

          <div className="space-y-4">
            {data.attributes?.paymentLink && (
              <Card className="p-4 md:p-8 space-y-2 md:space-y-4">
                <Header title="5 USDC" size="xl" />
                <div className="text-white">
                  <p>Claimed: {memoizedClaimedNFTs}</p>
                  <p>Remaining: {remainingNFTs}</p>
                </div>
                <Button
                  type="primary"
                  block
                  onClick={() =>
                    window.open(data.attributes?.paymentLink as string)
                  }
                >
                  Buy now
                </Button>
              </Card>
            )}
            {projectData.length > 0 && (
              <div className="space-y-4">
                <Header title="Supporters" size="xl" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectData.map((nft) => (
                    <div className="flex flex-col items-center" key={nft.id}>
                      <PublicKeyLink publicKey={nft.ownerAddress} className="w-full" />
                      <PublicKeyLink
                        publicKey={nft.mintAddress}
                        showXray
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
