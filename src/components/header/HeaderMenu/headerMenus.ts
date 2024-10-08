export interface HeaderMenuItem {
  id: number;
  name: string;
  links: string;
}

const headerMenus: HeaderMenuItem[] = [
  {
    id: 1,
    name: "Mint",
    links: "/mint-ship",
  },
  {
    id: 2,
    name: "Create Team",
    links: "/create-team",
  },
  {
    id: 3,
    name: "Enroll Team",
    links: "/enroll-team",
  },
  {
    id: 4,
    name: "Bet",
    links: "/bet",
  },
  {
    id: 5,
    name: "Leaderboard",
    links: "/leaderboard",
  },
  // {
  //     id: 6,
  //     name: 'Leaderboard',
  //     links: '/leaderboard'
  // }
];

export default headerMenus;
