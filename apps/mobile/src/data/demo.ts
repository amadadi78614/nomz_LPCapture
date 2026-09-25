import type { ImageSourcePropType } from 'react-native';

export type Team = { id: string; name: string; points: number; logo: ImageSourcePropType; color: string };
export type Result = { id: string; date: string; venue: string; home: Team; away: Team; homePoints: number; awayPoints: number };

export const teams: Team[] = [
  { id: 'backhand-blossoms', name: 'Backhand Blossoms', points: 53, color: '#23c98b', logo: require('../../assets/teams/backhand-blossoms.webp') },
  { id: 'lunar-lillies', name: 'Lunar Lillies', points: 44, color: '#637dff', logo: require('../../assets/teams/lunar-lillies.webp') },
  { id: 'phoenix-flames', name: 'Phoenix Flames', points: 39, color: '#ff704c', logo: require('../../assets/teams/phoenix-flames.webp') },
  { id: 'net-novas', name: 'Net Novas', points: 35, color: '#5da9ff', logo: require('../../assets/teams/net-novas.webp') },
  { id: 'arctic-angels', name: 'Arctic Angels', points: 31, color: '#62e8ff', logo: require('../../assets/teams/arctic-angels.webp') },
  { id: 'desert-roses', name: 'Desert Roses', points: 14, color: '#ed6a9e', logo: require('../../assets/teams/desert-roses.webp') },
];
const team = (id: string) => teams.find((item) => item.id === id)!;
export const latestResults: Result[] = [
  { id: 'mw5-lillies-blossoms', date: '16 Sep', venue: 'Padel 24', home: team('lunar-lillies'), away: team('backhand-blossoms'), homePoints: 11, awayPoints: 4 },
  { id: 'mw5-phoenix-roses', date: '16 Sep', venue: 'Lowveld Padel', home: team('phoenix-flames'), away: team('desert-roses'), homePoints: 10, awayPoints: 3 },
  { id: 'mw5-novas-angels', date: '15 Sep', venue: 'Lowveld Padel', home: team('net-novas'), away: team('arctic-angels'), homePoints: 6, awayPoints: 7 },
];
export const competitions = [
  { id: 'ladies-s2', label: 'CURRENT', title: 'Ladies Season 2', detail: 'Playoffs next', color: '#ef4fa0' },
  { id: 'legacy-2026', label: 'CHAMPIONS', title: 'Legacy League', detail: 'LP Honey Badgers', color: '#f7c548' },
  { id: 'mens-s3', label: 'CHAMPIONS', title: "Men's Season 3", detail: 'Desert Falcons', color: '#5f86ff' },
  { id: 'super-cup-2026', label: 'NATIONAL', title: '360 Super Cup', detail: 'Lowveld · 3rd', color: '#20d38a' },
];
