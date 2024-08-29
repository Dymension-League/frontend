import React, { useState, useEffect, Fragment } from "react";
import { useWalletStore } from "../../../../store/useWalletStore";
import useGameLeagueService from "../../../../services/contracts/gameleague.service";
import useMintService from "../../../../services/contracts/cosmoships.service";
import TeamCard from "./TeamCard";

interface Team {
    teamId: number;
    teamName: string;
    ships: Array<{
        id: number;
        img: string;
        model: string;
        name: string;
        type: string;
        color: string;
        tool: string;
        capacity: string | number;
        attack: string | number;
        speed: string | number;
        shield: string | number;
    }>;
}

const EnrollTeam: React.FC = () => {
    const { account } = useWalletStore();
    const { getTeamsByOwner, enrollToLeague } = useGameLeagueService();
    const { getIPFSTokenMetadata, convertIPFSUrl } = useMintService();
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [initiated, setInitiated] = useState<boolean>(false);

    useEffect(() => {
        const fetchTeams = async () => {
            if (account && !initiated) {
                try {
                    const teamInfo = await getTeamsByOwner(account);

                    // Convert Proxy objects to arrays
                    const teamIds = Array.from(teamInfo.teamIds);
                    const teamNames = Array.from(teamInfo.teamNames);
                    const tokenIndexes = Array.from(teamInfo.tokenIndexes).map(indexes => Array.from(indexes));

                    const teamData: Team[] = await Promise.all(teamIds.map(async (id, index) => {
                        const ships = await Promise.all(tokenIndexes[index].map(async (tokenId: number) => {
                            const metadata = await getIPFSTokenMetadata(tokenId);
                            return {
                                id: tokenId,
                                img: metadata.img ? convertIPFSUrl(metadata.img) : '',
                                model: metadata.model || "Unknown",
                                name: metadata.name || `Spaceship #${tokenId}`,
                                type: metadata.type || "Unknown",
                                color: metadata.color || "Unknown",
                                tool: metadata.tool || "Unknown",
                                capacity: metadata.capacity || "0",
                                attack: metadata.attack || "0",
                                speed: metadata.speed || "0",
                                shield: metadata.shield || "0",
                            };
                        }));
                        return {
                            teamId: id,
                            teamName: teamNames[index],
                            ships,
                        };
                    }));

                    setTeams(teamData);
                    setInitiated(true);
                } catch (error) {
                    console.error('Error fetching teams:', error);
                    setError('Failed to fetch teams. Please try again later.');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchTeams();
    }, [account, getTeamsByOwner, getIPFSTokenMetadata, convertIPFSUrl, initiated]);

    const handleEnroll = async (teamId: number) => {
        try {
            await enrollToLeague(teamId);
            alert('Team enrolled successfully!');
        } catch (error) {
            console.error('Error enrolling team:', error);
            alert('Failed to enroll team. Please try again.');
        }
    };

    if (loading) {
        return <div>Loading teams...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Fragment>
            <section className="tf-section live-auctions">
                <div className="themesflat-container">
                    <h1>My Teams</h1>
                    {/*<div className="container">*/}
                        {teams.map((team, index) => (
                            <TeamCard key={index} team={team} onEnroll={handleEnroll} />
                        ))}
                    {/*</div>*/}
                </div>
            </section>
        </Fragment>
    );
};

export default EnrollTeam;