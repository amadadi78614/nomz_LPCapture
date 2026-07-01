import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PLAYERS, franchiseById, stripeVar, winPct,
} from '../data/seed';


const MENS_S2_PREMIER = [
  { rank: 1, name: 'Yusuf Packery', team: 'Desert Falcons', played: 6, won: 6, lost: 0, setsWon: 17, gamesWon: 128 },
  { rank: 2, name: 'Heinrich Coomans', team: 'Sonic Viboras', played: 7, won: 5, lost: 2, setsWon: 16, gamesWon: 141 },
  { rank: 3, name: 'Uwaiz Patel', team: 'Desert Falcons', played: 7, won: 5, lost: 2, setsWon: 15, gamesWon: 140 },
  { rank: 4, name: 'Yusuf Patel', team: 'Desert Falcons', played: 6, won: 5, lost: 1, setsWon: 14, gamesWon: 126 },
  { rank: 5, name: 'Salmaan Methar', team: 'Desert Falcons', played: 6, won: 5, lost: 1, setsWon: 14, gamesWon: 119 },
  { rank: 6, name: 'Ahmed Ismail', team: 'Ice Breakers', played: 6, won: 5, lost: 1, setsWon: 13, gamesWon: 127 },
  { rank: 7, name: 'Maaz Randera', team: 'Ice Breakers', played: 7, won: 5, lost: 1, setsWon: 13, gamesWon: 119 },
  { rank: 8, name: 'Anton Grote', team: 'Rulo Apaches', played: 6, won: 4, lost: 2, setsWon: 12, gamesWon: 122 },
  { rank: 9, name: 'Wiehann Mohlen', team: 'Rulo Apaches', played: 6, won: 4, lost: 2, setsWon: 12, gamesWon: 121 },
  { rank: 10, name: 'Duhan Swart', team: 'Ice Breakers', played: 8, won: 4, lost: 3, setsWon: 11, gamesWon: 118 },
  { rank: 11, name: 'Rafiq Mohamed', team: 'Avalanche Aces', played: 6, won: 4, lost: 2, setsWon: 11, gamesWon: 111 },
  { rank: 12, name: 'Bryan Theron', team: 'Samurai Kicksmashers', played: 6, won: 4, lost: 2, setsWon: 11, gamesWon: 106 },
  { rank: 13, name: 'Ryan Tate', team: 'Avalanche Aces', played: 5, won: 4, lost: 1, setsWon: 9, gamesWon: 85 },
  { rank: 14, name: 'Greg Beyers', team: 'Avalanche Aces', played: 4, won: 4, lost: 0, setsWon: 9, gamesWon: 76 },
  { rank: 15, name: 'Yusuf Asvat', team: 'Baltic Blades', played: 5, won: 4, lost: 1, setsWon: 8, gamesWon: 72 },
  { rank: 16, name: 'Peet Welthagen', team: 'Desert Falcons', played: 5, won: 3, lost: 2, setsWon: 10, gamesWon: 100 },
  { rank: 17, name: 'Muhammad Azhar Sujee', team: 'Sonic Viboras', played: 5, won: 3, lost: 2, setsWon: 10, gamesWon: 97 },
  { rank: 18, name: 'JD Herbst', team: 'Samurai Kicksmashers', played: 6, won: 3, lost: 3, setsWon: 9, gamesWon: 101 },
  { rank: 19, name: 'Zaheer Methar', team: 'Ice Breakers', played: 5, won: 3, lost: 2, setsWon: 9, gamesWon: 97 },
  { rank: 20, name: 'Bevan Francis', team: 'Samurai Kicksmashers', played: 5, won: 3, lost: 2, setsWon: 9, gamesWon: 90 },
  { rank: 21, name: 'Ryan Kennett', team: 'Desert Falcons', played: 5, won: 3, lost: 1, setsWon: 9, gamesWon: 79 },
  { rank: 22, name: 'Cian Maritz', team: 'Samurai Kicksmashers', played: 3, won: 3, lost: 0, setsWon: 9, gamesWon: 66 },
  { rank: 23, name: 'Driaan Odendaal', team: 'Avalanche Aces', played: 6, won: 3, lost: 3, setsWon: 8, gamesWon: 88 },
  { rank: 24, name: 'Armand Esterhuizen', team: 'Sonic Viboras', played: 5, won: 3, lost: 2, setsWon: 8, gamesWon: 85 },
  { rank: 25, name: 'Cameron Jacobsz', team: 'Desert Falcons', played: 4, won: 3, lost: 1, setsWon: 8, gamesWon: 82 },
  { rank: 26, name: 'Warwick Morgan', team: 'Sonic Viboras', played: 4, won: 3, lost: 1, setsWon: 8, gamesWon: 74 },
  { rank: 27, name: 'Muhammed Jina', team: 'Ice Breakers', played: 5, won: 3, lost: 2, setsWon: 7, gamesWon: 82 },
  { rank: 28, name: 'Muhammed Shehzad Meer', team: 'Globo Boomerangs', played: 5, won: 3, lost: 2, setsWon: 7, gamesWon: 81 },
  { rank: 29, name: 'Ryan Wicht', team: 'Desert Falcons', played: 4, won: 3, lost: 1, setsWon: 7, gamesWon: 60 },
  { rank: 30, name: 'Hoffmann Maritz', team: 'Avalanche Aces', played: 6, won: 3, lost: 3, setsWon: 6, gamesWon: 89 },
  { rank: 31, name: 'Patrick Leyden', team: 'Avalanche Aces', played: 6, won: 3, lost: 3, setsWon: 6, gamesWon: 88 },
  { rank: 32, name: 'Zaheer Naby', team: 'Baltic Blades', played: 6, won: 3, lost: 3, setsWon: 6, gamesWon: 77 },
  { rank: 33, name: 'Zayd Methar', team: 'Desert Falcons', played: 4, won: 3, lost: 1, setsWon: 5, gamesWon: 55 },
  { rank: 34, name: 'Ahmed Mungalee', team: 'Globo Boomerangs', played: 6, won: 2, lost: 4, setsWon: 8, gamesWon: 96 },
  { rank: 35, name: 'Faeez Sebastian', team: 'Globo Boomerangs', played: 5, won: 2, lost: 3, setsWon: 8, gamesWon: 86 },
  { rank: 36, name: 'Pieter Badenhorst', team: 'Sonic Viboras', played: 4, won: 2, lost: 2, setsWon: 8, gamesWon: 78 },
  { rank: 37, name: 'Lefa Moganedi', team: 'Sonic Viboras', played: 4, won: 2, lost: 2, setsWon: 8, gamesWon: 76 },
  { rank: 38, name: 'Pieter Boshoff', team: 'Globo Boomerangs', played: 5, won: 2, lost: 3, setsWon: 7, gamesWon: 84 },
  { rank: 39, name: 'Yusuf Moola', team: 'Sonic Viboras', played: 6, won: 2, lost: 3, setsWon: 7, gamesWon: 82 },
  { rank: 40, name: 'Fiaz Bhikhoo', team: 'Ice Breakers', played: 4, won: 2, lost: 2, setsWon: 7, gamesWon: 71 },
  { rank: 41, name: 'Burger Bester', team: 'Rulo Apaches', played: 4, won: 2, lost: 2, setsWon: 7, gamesWon: 69 },
  { rank: 42, name: 'Suhayl Packery', team: 'Rulo Apaches', played: 5, won: 2, lost: 2, setsWon: 7, gamesWon: 69 },
  { rank: 43, name: 'Alexander Combrinck', team: 'Sonic Viboras', played: 4, won: 2, lost: 2, setsWon: 7, gamesWon: 69 },
  { rank: 44, name: 'Joseph Van der merwe', team: 'Sonic Viboras', played: 5, won: 2, lost: 2, setsWon: 7, gamesWon: 69 },
  { rank: 45, name: 'Ridhwaan Sujee', team: 'Sonic Viboras', played: 4, won: 2, lost: 1, setsWon: 7, gamesWon: 58 },
  { rank: 46, name: 'Cassim Vawda', team: 'Globo Boomerangs', played: 5, won: 2, lost: 3, setsWon: 6, gamesWon: 84 },
  { rank: 47, name: 'Faheem Nomani', team: 'Samurai Kicksmashers', played: 5, won: 2, lost: 3, setsWon: 6, gamesWon: 80 },
  { rank: 48, name: 'Donavan Taylor', team: 'Baltic Blades', played: 5, won: 2, lost: 3, setsWon: 6, gamesWon: 74 },
  { rank: 49, name: 'Morne Steenekamp', team: 'Samurai Kicksmashers', played: 4, won: 2, lost: 2, setsWon: 6, gamesWon: 72 },
  { rank: 50, name: 'Adil Ahmed', team: 'Sonic Viboras', played: 4, won: 2, lost: 2, setsWon: 6, gamesWon: 71 },
  { rank: 51, name: 'Sabelo Mathebula', team: 'Avalanche Aces', played: 4, won: 2, lost: 2, setsWon: 6, gamesWon: 70 },
  { rank: 52, name: 'Danyaal Nomani', team: 'Samurai Kicksmashers', played: 3, won: 2, lost: 1, setsWon: 6, gamesWon: 59 },
  { rank: 53, name: 'Shakir Suleman', team: 'Samurai Kicksmashers', played: 3, won: 2, lost: 1, setsWon: 6, gamesWon: 55 },
  { rank: 54, name: 'Erlo Olivier', team: 'Ice Breakers', played: 6, won: 2, lost: 4, setsWon: 5, gamesWon: 74 },
  { rank: 55, name: 'Nabeel Meer', team: 'Globo Boomerangs', played: 4, won: 2, lost: 2, setsWon: 5, gamesWon: 63 },
  { rank: 56, name: 'George du Toit', team: 'Avalanche Aces', played: 3, won: 2, lost: 1, setsWon: 5, gamesWon: 52 },
  { rank: 57, name: 'Liam Morgan', team: 'Baltic Blades', played: 2, won: 2, lost: 0, setsWon: 5, gamesWon: 44 },
  { rank: 58, name: 'Fanus Wilkens', team: 'Rulo Apaches', played: 3, won: 2, lost: 1, setsWon: 4, gamesWon: 51 },
  { rank: 59, name: 'Jacques Hopkins', team: 'Rulo Apaches', played: 3, won: 2, lost: 1, setsWon: 4, gamesWon: 51 },
  { rank: 60, name: 'Joshua Hoffman', team: 'Sonic Viboras', played: 4, won: 2, lost: 1, setsWon: 4, gamesWon: 48 },
  { rank: 61, name: 'Chris Triegaardt', team: 'Ice Breakers', played: 3, won: 2, lost: 1, setsWon: 4, gamesWon: 46 },
  { rank: 62, name: 'Etienne Swart', team: 'Rulo Apaches', played: 3, won: 2, lost: 0, setsWon: 4, gamesWon: 39 },
  { rank: 63, name: 'Jacques Burger', team: 'Avalanche Aces', played: 4, won: 1, lost: 3, setsWon: 5, gamesWon: 69 },
  { rank: 64, name: 'Justin van Staden', team: 'Rulo Apaches', played: 4, won: 1, lost: 2, setsWon: 5, gamesWon: 57 },
  { rank: 65, name: 'Warren Morgan', team: 'Globo Boomerangs', played: 3, won: 1, lost: 2, setsWon: 5, gamesWon: 57 },
  { rank: 66, name: 'Siraaj Shaik', team: 'Samurai Kicksmashers', played: 4, won: 1, lost: 3, setsWon: 4, gamesWon: 68 },
  { rank: 67, name: 'Ebrahim Ismail', team: 'Ice Breakers', played: 4, won: 1, lost: 3, setsWon: 4, gamesWon: 63 },
  { rank: 68, name: 'Andries van Niekerk', team: 'Desert Falcons', played: 4, won: 1, lost: 3, setsWon: 4, gamesWon: 61 },
  { rank: 69, name: 'Yusuf Ismail', team: 'Rulo Apaches', played: 4, won: 1, lost: 3, setsWon: 4, gamesWon: 59 },
  { rank: 70, name: 'Anas Mungalee', team: 'Globo Boomerangs', played: 3, won: 1, lost: 2, setsWon: 4, gamesWon: 53 },
  { rank: 71, name: 'Phil-Mar Van Rensburg', team: 'Avalanche Aces', played: 4, won: 1, lost: 3, setsWon: 4, gamesWon: 50 },
  { rank: 72, name: 'Jacques Van Zyl', team: 'Desert Falcons', played: 3, won: 1, lost: 2, setsWon: 4, gamesWon: 50 },
  { rank: 73, name: 'Luan Walters', team: 'Globo Boomerangs', played: 5, won: 1, lost: 4, setsWon: 3, gamesWon: 75 },
  { rank: 74, name: 'Ozayr Shaik', team: 'Baltic Blades', played: 6, won: 1, lost: 5, setsWon: 3, gamesWon: 72 },
  { rank: 75, name: 'Hendrik Tryhou', team: 'Rulo Apaches', played: 4, won: 1, lost: 3, setsWon: 3, gamesWon: 56 },
  { rank: 76, name: 'Frik De Beer', team: 'Avalanche Aces', played: 4, won: 1, lost: 3, setsWon: 3, gamesWon: 48 },
  { rank: 77, name: 'Marius Loock', team: 'Baltic Blades', played: 4, won: 1, lost: 3, setsWon: 3, gamesWon: 46 },
  { rank: 78, name: 'Naeem Omar', team: 'Samurai Kicksmashers', played: 3, won: 1, lost: 2, setsWon: 3, gamesWon: 45 },
  { rank: 79, name: 'Muhammad Khalid Jeewa', team: 'Globo Boomerangs', played: 3, won: 1, lost: 2, setsWon: 3, gamesWon: 45 },
  { rank: 80, name: 'Muhammad Fakir', team: 'Samurai Kicksmashers', played: 3, won: 1, lost: 2, setsWon: 3, gamesWon: 42 },
  { rank: 81, name: 'Ebrahim Mungalee', team: 'Globo Boomerangs', played: 1, won: 1, lost: 0, setsWon: 3, gamesWon: 22 },
  { rank: 82, name: 'Rayhaan Dinath', team: 'Ice Breakers', played: 4, won: 1, lost: 3, setsWon: 2, gamesWon: 56 },
  { rank: 83, name: 'Bilal Cassim', team: 'Baltic Blades', played: 4, won: 1, lost: 3, setsWon: 2, gamesWon: 38 },
  { rank: 84, name: 'Wayne Enslin', team: 'Rulo Apaches', played: 2, won: 1, lost: 1, setsWon: 2, gamesWon: 28 },
  { rank: 85, name: 'Marvin Naidoo', team: 'Ice Breakers', played: 4, won: 0, lost: 4, setsWon: 3, gamesWon: 63 },
  { rank: 86, name: 'Uzair Ismail', team: 'Rulo Apaches', played: 4, won: 0, lost: 3, setsWon: 2, gamesWon: 44 },
  { rank: 87, name: 'Mohamed Nomani', team: 'Samurai Kicksmashers', played: 3, won: 0, lost: 3, setsWon: 2, gamesWon: 44 },
  { rank: 88, name: 'Dewald Meyer', team: 'Baltic Blades', played: 3, won: 0, lost: 3, setsWon: 2, gamesWon: 41 },
  { rank: 89, name: 'Feroz Guman', team: 'Baltic Blades', played: 4, won: 0, lost: 4, setsWon: 1, gamesWon: 40 },
  { rank: 90, name: 'Imran Omar', team: 'Globo Boomerangs', played: 3, won: 0, lost: 3, setsWon: 1, gamesWon: 40 },
  { rank: 91, name: 'Tim Kaden', team: 'Baltic Blades', played: 3, won: 0, lost: 3, setsWon: 1, gamesWon: 34 },
  { rank: 92, name: 'Niel Pienaar', team: 'Baltic Blades', played: 2, won: 0, lost: 2, setsWon: 1, gamesWon: 27 },
  { rank: 93, name: 'Kiran Hansraj', team: 'Desert Falcons', played: 2, won: 0, lost: 1, setsWon: 1, gamesWon: 14 },
  { rank: 94, name: 'Ruaan Naude', team: 'Avalanche Aces', played: 4, won: 0, lost: 4, setsWon: 0, gamesWon: 40 },
  { rank: 95, name: 'Sikander Cassim', team: 'Baltic Blades', played: 4, won: 0, lost: 4, setsWon: 0, gamesWon: 27 },
];
const MENS_S2_CHAMP = [
  { rank: 1, name: 'Felix Lombard', team: 'Avalanche Aces', played: 7, won: 6, lost: 1, setsWon: 16, gamesWon: 140 },
  { rank: 2, name: 'Irshaad Mahomed', team: 'Sonic Viboras', played: 7, won: 6, lost: 1, setsWon: 16, gamesWon: 132 },
  { rank: 3, name: 'Etienne Grobler', team: 'Desert Falcons', played: 7, won: 6, lost: 1, setsWon: 15, gamesWon: 137 },
  { rank: 4, name: 'Alfaiz Mamji', team: 'Globo Boomerangs', played: 6, won: 5, lost: 1, setsWon: 15, gamesWon: 120 },
  { rank: 5, name: 'Taahir Mungalee', team: 'Sonic Viboras', played: 7, won: 5, lost: 2, setsWon: 14, gamesWon: 122 },
  { rank: 6, name: 'Fahad Patel', team: 'Globo Boomerangs', played: 7, won: 4, lost: 2, setsWon: 14, gamesWon: 128 },
  { rank: 7, name: 'Irfaan Mahomed', team: 'Globo Boomerangs', played: 6, won: 4, lost: 2, setsWon: 13, gamesWon: 119 },
  { rank: 8, name: 'Zahid Methar', team: 'Sonic Viboras', played: 6, won: 4, lost: 2, setsWon: 12, gamesWon: 106 },
  { rank: 9, name: 'Reino Grobler', team: 'Desert Falcons', played: 5, won: 4, lost: 1, setsWon: 12, gamesWon: 104 },
  { rank: 10, name: 'Uwais Guman', team: 'Ice Breakers', played: 6, won: 4, lost: 1, setsWon: 12, gamesWon: 103 },
  { rank: 11, name: 'Irshaad Moola', team: 'Ice Breakers', played: 6, won: 4, lost: 1, setsWon: 11, gamesWon: 104 },
  { rank: 12, name: 'Brent Grix', team: 'Sonic Viboras', played: 5, won: 4, lost: 1, setsWon: 11, gamesWon: 101 },
  { rank: 13, name: 'Gerco van Rooyen', team: 'Avalanche Aces', played: 6, won: 4, lost: 2, setsWon: 11, gamesWon: 96 },
  { rank: 14, name: 'Suliman Patel', team: 'Desert Falcons', played: 6, won: 4, lost: 1, setsWon: 10, gamesWon: 100 },
  { rank: 15, name: 'Zainul Choohan', team: 'Baltic Blades', played: 6, won: 3, lost: 3, setsWon: 10, gamesWon: 107 },
  { rank: 16, name: 'Kobus van Rensburg', team: 'Avalanche Aces', played: 4, won: 3, lost: 0, setsWon: 10, gamesWon: 78 },
  { rank: 17, name: 'Gavin Moffett', team: 'Rulo Apaches', played: 6, won: 3, lost: 3, setsWon: 9, gamesWon: 97 },
  { rank: 18, name: 'Stefan De Villiers', team: 'Rulo Apaches', played: 6, won: 3, lost: 2, setsWon: 9, gamesWon: 94 },
  { rank: 19, name: 'Muhammed Minty', team: 'Ice Breakers', played: 4, won: 3, lost: 1, setsWon: 9, gamesWon: 83 },
  { rank: 20, name: 'Drew Packman', team: 'Desert Falcons', played: 4, won: 3, lost: 1, setsWon: 9, gamesWon: 78 },
  { rank: 21, name: 'Stefan Erasmus', team: 'Desert Falcons', played: 4, won: 3, lost: 1, setsWon: 9, gamesWon: 78 },
  { rank: 22, name: 'Nicky Joubert', team: 'Avalanche Aces', played: 5, won: 3, lost: 1, setsWon: 8, gamesWon: 87 },
  { rank: 23, name: 'Danie Rautenbach', team: 'Sonic Viboras', played: 5, won: 3, lost: 2, setsWon: 8, gamesWon: 82 },
  { rank: 24, name: 'Mickal Bakker', team: 'Rulo Apaches', played: 4, won: 3, lost: 1, setsWon: 8, gamesWon: 78 },
  { rank: 25, name: 'Soyab maxi Patel', team: 'Globo Boomerangs', played: 4, won: 3, lost: 1, setsWon: 8, gamesWon: 69 },
  { rank: 26, name: 'Muhammed Shaffique Jeewa', team: 'Globo Boomerangs', played: 4, won: 3, lost: 1, setsWon: 8, gamesWon: 69 },
  { rank: 27, name: 'Pierre De Villiers', team: 'Avalanche Aces', played: 4, won: 3, lost: 1, setsWon: 7, gamesWon: 62 },
  { rank: 28, name: 'Zaeem Sadiq', team: 'Avalanche Aces', played: 3, won: 3, lost: 0, setsWon: 7, gamesWon: 60 },
  { rank: 29, name: 'Shaun Moropa', team: 'Samurai Kicksmashers', played: 7, won: 2, lost: 4, setsWon: 8, gamesWon: 95 },
  { rank: 30, name: 'Dillon Francis', team: 'Baltic Blades', played: 6, won: 2, lost: 4, setsWon: 8, gamesWon: 95 },
  { rank: 31, name: 'Tim Forssman', team: 'Samurai Kicksmashers', played: 6, won: 2, lost: 3, setsWon: 8, gamesWon: 83 },
  { rank: 32, name: 'Waldo van Tonder', team: 'Rulo Apaches', played: 5, won: 2, lost: 3, setsWon: 7, gamesWon: 85 },
  { rank: 33, name: 'Aadil Asvat', team: 'Globo Boomerangs', played: 5, won: 2, lost: 2, setsWon: 7, gamesWon: 70 },
  { rank: 34, name: 'Muhammed Cachalia', team: 'Rulo Apaches', played: 3, won: 2, lost: 1, setsWon: 7, gamesWon: 59 },
  { rank: 35, name: 'Ismail Karodia', team: 'Rulo Apaches', played: 5, won: 2, lost: 2, setsWon: 6, gamesWon: 76 },
  { rank: 36, name: 'Drikus Prins', team: 'Rulo Apaches', played: 4, won: 2, lost: 2, setsWon: 6, gamesWon: 70 },
  { rank: 37, name: 'Ian Roberts', team: 'Ice Breakers', played: 3, won: 2, lost: 1, setsWon: 6, gamesWon: 60 },
  { rank: 38, name: 'Devlin Grix', team: 'Desert Falcons', played: 3, won: 2, lost: 1, setsWon: 6, gamesWon: 56 },
  { rank: 39, name: 'Duran Greaver', team: 'Globo Boomerangs', played: 3, won: 2, lost: 1, setsWon: 6, gamesWon: 56 },
  { rank: 40, name: 'Ismail Fakir', team: 'Globo Boomerangs', played: 3, won: 2, lost: 1, setsWon: 6, gamesWon: 56 },
  { rank: 41, name: 'Nathan Treherne', team: 'Desert Falcons', played: 3, won: 2, lost: 1, setsWon: 6, gamesWon: 54 },
  { rank: 42, name: 'Zahraan Jassat', team: 'Baltic Blades', played: 3, won: 2, lost: 1, setsWon: 6, gamesWon: 45 },
  { rank: 43, name: 'Adil Patel', team: 'Baltic Blades', played: 5, won: 2, lost: 3, setsWon: 5, gamesWon: 77 },
  { rank: 44, name: 'Ali Choohan', team: 'Baltic Blades', played: 4, won: 2, lost: 2, setsWon: 5, gamesWon: 69 },
  { rank: 45, name: 'Irfan Mamji', team: 'Baltic Blades', played: 4, won: 2, lost: 2, setsWon: 5, gamesWon: 65 },
  { rank: 46, name: 'Imtiaz Mohamed', team: 'Desert Falcons', played: 4, won: 2, lost: 1, setsWon: 5, gamesWon: 64 },
  { rank: 47, name: 'Mohammed Patel', team: 'Desert Falcons', played: 3, won: 2, lost: 1, setsWon: 5, gamesWon: 58 },
  { rank: 48, name: 'Rishad Shaik', team: 'Desert Falcons', played: 3, won: 2, lost: 1, setsWon: 5, gamesWon: 53 },
  { rank: 49, name: 'Mohammed Seedat', team: 'Avalanche Aces', played: 3, won: 2, lost: 1, setsWon: 5, gamesWon: 51 },
  { rank: 50, name: 'Mohamed Dadamia', team: 'Baltic Blades', played: 5, won: 1, lost: 4, setsWon: 5, gamesWon: 77 },
  { rank: 51, name: 'Zunaid Ganchi', team: 'Avalanche Aces', played: 3, won: 1, lost: 2, setsWon: 4, gamesWon: 49 },
  { rank: 52, name: 'Mohammed Mungalee', team: 'Rulo Apaches', played: 3, won: 1, lost: 2, setsWon: 4, gamesWon: 47 },
  { rank: 53, name: 'Suhail Patel', team: 'Ice Breakers', played: 3, won: 1, lost: 2, setsWon: 4, gamesWon: 46 },
  { rank: 54, name: 'Muhammed Suliman', team: 'Samurai Kicksmashers', played: 5, won: 1, lost: 4, setsWon: 3, gamesWon: 60 },
  { rank: 55, name: 'Jaco Nel', team: 'Ice Breakers', played: 4, won: 1, lost: 3, setsWon: 3, gamesWon: 57 },
  { rank: 56, name: 'Shoaib Nomani', team: 'Samurai Kicksmashers', played: 5, won: 1, lost: 4, setsWon: 3, gamesWon: 55 },
  { rank: 57, name: 'Dc Francis', team: 'Baltic Blades', played: 3, won: 1, lost: 2, setsWon: 3, gamesWon: 49 },
  { rank: 58, name: 'Adnaan Abderoof', team: 'Baltic Blades', played: 3, won: 1, lost: 2, setsWon: 3, gamesWon: 48 },
  { rank: 59, name: 'Mohammed Malek', team: 'Avalanche Aces', played: 4, won: 1, lost: 3, setsWon: 3, gamesWon: 45 },
  { rank: 60, name: 'Imraan Khan', team: 'Globo Boomerangs', played: 3, won: 1, lost: 2, setsWon: 3, gamesWon: 36 },
  { rank: 61, name: 'Umar Yunus', team: 'Sonic Viboras', played: 3, won: 1, lost: 2, setsWon: 3, gamesWon: 27 },
  { rank: 62, name: 'Estiaan Maritz', team: 'Ice Breakers', played: 4, won: 1, lost: 3, setsWon: 2, gamesWon: 47 },
  { rank: 63, name: 'Francois Eloff', team: 'Sonic Viboras', played: 4, won: 1, lost: 3, setsWon: 2, gamesWon: 37 },
  { rank: 64, name: 'Luqman Hoosen', team: 'Ice Breakers', played: 4, won: 0, lost: 4, setsWon: 3, gamesWon: 59 },
  { rank: 65, name: 'Saliem Mahomed', team: 'Ice Breakers', played: 4, won: 0, lost: 4, setsWon: 2, gamesWon: 51 },
  { rank: 66, name: 'Martin Swart', team: 'Samurai Kicksmashers', played: 3, won: 0, lost: 3, setsWon: 1, gamesWon: 41 },
  { rank: 67, name: 'Sailesh Nagar', team: 'Samurai Kicksmashers', played: 4, won: 0, lost: 4, setsWon: 1, gamesWon: 35 },
  { rank: 68, name: 'Dian Erasmus', team: 'Avalanche Aces', played: 3, won: 0, lost: 3, setsWon: 1, gamesWon: 32 },
  { rank: 69, name: 'Muhammad Zakariyya Akoojee', team: 'Rulo Apaches', played: 3, won: 0, lost: 3, setsWon: 1, gamesWon: 31 },
  { rank: 70, name: 'Sandeep Daya', team: 'Rulo Apaches', played: 3, won: 0, lost: 3, setsWon: 1, gamesWon: 29 },
  { rank: 71, name: 'Sergio Correia', team: 'Samurai Kicksmashers', played: 4, won: 0, lost: 4, setsWon: 0, gamesWon: 44 },
  { rank: 72, name: 'Muhammad Mangerah', team: 'Ice Breakers', played: 4, won: 0, lost: 4, setsWon: 0, gamesWon: 38 },
  { rank: 73, name: 'Akmeer Amod', team: 'Samurai Kicksmashers', played: 3, won: 0, lost: 3, setsWon: 0, gamesWon: 31 },
  { rank: 74, name: 'Rayman Vinesh', team: 'Samurai Kicksmashers', played: 4, won: 0, lost: 4, setsWon: 0, gamesWon: 26 },
  { rank: 75, name: 'Safeer Jamadar', team: 'Baltic Blades', played: 3, won: 0, lost: 3, setsWon: 0, gamesWon: 26 },
  { rank: 76, name: 'Mohammed Mayet', team: 'Sonic Viboras', played: 2, won: 0, lost: 2, setsWon: 0, gamesWon: 13 },
  { rank: 77, name: 'Heinrich van Staden', team: 'Sonic Viboras', played: 3, won: 0, lost: 3, setsWon: 0, gamesWon: 8 },
  { rank: 78, name: 'Jay Nagar', team: 'Globo Boomerangs', played: 1, won: 0, lost: 1, setsWon: 0, gamesWon: 7 },
  { rank: 79, name: 'Noah Snell', team: 'Samurai Kicksmashers', played: 1, won: 0, lost: 1, setsWon: 0, gamesWon: 0 },
];
const LADIES_S1 = [
  { rank: 1, name: 'Jeanetha Boshoff', team: 'Lunar Lillies', played: 5, won: 5, lost: 0, setsWon: 15, gamesWon: 111 },
  { rank: 2, name: 'Imaan Packery', team: 'Lunar Lillies', played: 5, won: 4, lost: 1, setsWon: 13, gamesWon: 101 },
  { rank: 3, name: 'Sunel Grote', team: 'Backhand Blossoms', played: 5, won: 4, lost: 1, setsWon: 11, gamesWon: 88 },
  { rank: 4, name: 'Heleen Van Der Mescht', team: 'Lunar Lillies', played: 3, won: 3, lost: 0, setsWon: 9, gamesWon: 66 },
  { rank: 5, name: 'Lia Odendaal', team: 'Desert Roses', played: 5, won: 3, lost: 2, setsWon: 8, gamesWon: 78 },
  { rank: 6, name: 'Michelle Du preez', team: 'Desert Roses', played: 4, won: 3, lost: 1, setsWon: 8, gamesWon: 74 },
  { rank: 7, name: 'Marise Schutte', team: 'Desert Roses', played: 4, won: 3, lost: 1, setsWon: 8, gamesWon: 68 },
  { rank: 8, name: 'Berna Claassens', team: 'Phoenix Flames', played: 4, won: 3, lost: 1, setsWon: 8, gamesWon: 68 },
  { rank: 9, name: 'Anneri Duvenage', team: 'Lunar Lillies', played: 4, won: 3, lost: 1, setsWon: 8, gamesWon: 66 },
  { rank: 10, name: 'Tanija de Villiers', team: 'Net Novas', played: 4, won: 3, lost: 1, setsWon: 8, gamesWon: 66 },
  { rank: 11, name: 'Ayesha Jogi', team: 'Desert Roses', played: 3, won: 3, lost: 0, setsWon: 8, gamesWon: 57 },
  { rank: 12, name: 'Hunaynah Mungalee', team: 'Arctic Angels', played: 4, won: 3, lost: 1, setsWon: 7, gamesWon: 64 },
  { rank: 13, name: 'Dalene Minnaar', team: 'Phoenix Flames', played: 3, won: 3, lost: 0, setsWon: 7, gamesWon: 64 },
  { rank: 14, name: 'Karlien Janse van Rensburg', team: 'Phoenix Flames', played: 4, won: 3, lost: 1, setsWon: 5, gamesWon: 66 },
  { rank: 15, name: 'Khadija Badat', team: 'Arctic Angels', played: 5, won: 2, lost: 3, setsWon: 7, gamesWon: 80 },
  { rank: 16, name: 'Samantha de Araujo', team: 'Backhand Blossoms', played: 4, won: 2, lost: 1, setsWon: 7, gamesWon: 56 },
  { rank: 17, name: 'Mieke Swart', team: 'Net Novas', played: 3, won: 2, lost: 1, setsWon: 6, gamesWon: 60 },
  { rank: 18, name: 'Carien Vos', team: 'Net Novas', played: 4, won: 2, lost: 2, setsWon: 6, gamesWon: 54 },
  { rank: 19, name: 'Mufeedah Hoosen', team: 'Desert Roses', played: 3, won: 2, lost: 1, setsWon: 6, gamesWon: 51 },
  { rank: 20, name: 'Faeeza Patel', team: 'Desert Roses', played: 3, won: 2, lost: 1, setsWon: 6, gamesWon: 51 },
  { rank: 21, name: 'Zantelle Hopkins', team: 'Arctic Angels', played: 4, won: 2, lost: 2, setsWon: 5, gamesWon: 61 },
  { rank: 22, name: 'Firdaus Hoosen', team: 'Desert Roses', played: 4, won: 2, lost: 2, setsWon: 5, gamesWon: 61 },
  { rank: 23, name: 'Dhiya Ismail', team: 'Net Novas', played: 3, won: 2, lost: 1, setsWon: 5, gamesWon: 55 },
  { rank: 24, name: 'Dirkie Coomans', team: 'Backhand Blossoms', played: 3, won: 2, lost: 1, setsWon: 5, gamesWon: 54 },
  { rank: 25, name: 'Muneera Jina', team: 'Backhand Blossoms', played: 3, won: 2, lost: 1, setsWon: 5, gamesWon: 52 },
  { rank: 26, name: 'Diyaana Nomani', team: 'Arctic Angels', played: 3, won: 2, lost: 1, setsWon: 5, gamesWon: 48 },
  { rank: 27, name: 'Teresa Kempen', team: 'Lunar Lillies', played: 3, won: 2, lost: 1, setsWon: 5, gamesWon: 47 },
  { rank: 28, name: 'Aletia van Rooyen', team: 'Lunar Lillies', played: 3, won: 2, lost: 1, setsWon: 5, gamesWon: 44 },
  { rank: 29, name: 'Amani M Nomani', team: 'Phoenix Flames', played: 4, won: 1, lost: 3, setsWon: 5, gamesWon: 74 },
  { rank: 30, name: 'Noerien Moolla', team: 'Arctic Angels', played: 5, won: 1, lost: 4, setsWon: 4, gamesWon: 68 },
  { rank: 31, name: 'Suhana Mohamed', team: 'Phoenix Flames', played: 3, won: 1, lost: 2, setsWon: 4, gamesWon: 50 },
  { rank: 32, name: 'Zahra Jogi', team: 'Phoenix Flames', played: 3, won: 1, lost: 2, setsWon: 4, gamesWon: 48 },
  { rank: 33, name: 'Martinette Meyer', team: 'Phoenix Flames', played: 3, won: 1, lost: 2, setsWon: 4, gamesWon: 43 },
  { rank: 34, name: 'Anita Smith', team: 'Phoenix Flames', played: 3, won: 1, lost: 2, setsWon: 4, gamesWon: 41 },
  { rank: 35, name: 'Liz Bartie', team: 'Net Novas', played: 4, won: 1, lost: 3, setsWon: 3, gamesWon: 53 },
  { rank: 36, name: 'Marz Asvat', team: 'Arctic Angels', played: 3, won: 1, lost: 2, setsWon: 3, gamesWon: 42 },
  { rank: 37, name: 'Lana Nel', team: 'Backhand Blossoms', played: 3, won: 1, lost: 2, setsWon: 3, gamesWon: 41 },
  { rank: 38, name: 'Nasreen Omar', team: 'Arctic Angels', played: 2, won: 1, lost: 1, setsWon: 3, gamesWon: 38 },
  { rank: 39, name: 'Erica Van Jaarsveld', team: 'Net Novas', played: 2, won: 1, lost: 1, setsWon: 3, gamesWon: 36 },
  { rank: 40, name: 'Simone Maritz', team: 'Net Novas', played: 4, won: 1, lost: 3, setsWon: 3, gamesWon: 36 },
  { rank: 41, name: 'Farzahna Nomani', team: 'Lunar Lillies', played: 3, won: 1, lost: 2, setsWon: 2, gamesWon: 30 },
  { rank: 42, name: 'Fazila Hafesji', team: 'Backhand Blossoms', played: 3, won: 1, lost: 2, setsWon: 2, gamesWon: 25 },
  { rank: 43, name: 'Stephanie Steenekamp', team: 'Desert Roses', played: 3, won: 0, lost: 3, setsWon: 2, gamesWon: 44 },
  { rank: 44, name: 'Nasreen Methar', team: 'Backhand Blossoms', played: 3, won: 0, lost: 3, setsWon: 2, gamesWon: 31 },
  { rank: 45, name: 'Sabena Omar', team: 'Arctic Angels', played: 3, won: 0, lost: 2, setsWon: 1, gamesWon: 37 },
  { rank: 46, name: 'Icem Wilken', team: 'Lunar Lillies', played: 4, won: 0, lost: 4, setsWon: 1, gamesWon: 31 },
  { rank: 47, name: 'Imaan Shaik', team: 'Backhand Blossoms', played: 3, won: 0, lost: 2, setsWon: 1, gamesWon: 25 },
  { rank: 48, name: 'Tasneem Sheikh', team: 'Phoenix Flames', played: 3, won: 0, lost: 3, setsWon: 1, gamesWon: 24 },
  { rank: 49, name: 'Simonne Herbst', team: 'Desert Roses', played: 1, won: 0, lost: 1, setsWon: 1, gamesWon: 16 },
  { rank: 50, name: 'Tasneem Moolla', team: 'Arctic Angels', played: 1, won: 0, lost: 0, setsWon: 1, gamesWon: 12 },
  { rank: 51, name: 'Joshna Nagar', team: 'Net Novas', played: 3, won: 0, lost: 3, setsWon: 0, gamesWon: 36 },
  { rank: 52, name: 'Radhia Mungalee', team: 'Net Novas', played: 3, won: 0, lost: 3, setsWon: 0, gamesWon: 34 },
  { rank: 53, name: 'Shaheda Sujee', team: 'Backhand Blossoms', played: 3, won: 0, lost: 3, setsWon: 0, gamesWon: 14 },
];

const TEAM_COLORS = {
  'Desert Falcons': '#c79a3e',
  'Ice Breakers': '#00C8E8',
  'Avalanche Aces': '#0057E9',
  'Sonic Viboras': '#9aa823',
  'Samurai Kicksmashers': '#dc2626',
  'Samurai Kick Smashers': '#dc2626',
  'Globo Boomerangs': '#7c3aed',
  'Sahara Lions': '#f59e0b',
  'Rulo Apaches': '#6b7280',
  'Baltic Blades': '#0891b2',
  'Lunar Lillies': '#8b5cf6',
  'Desert Roses': '#ec4899',
  'Phoenix Flames': '#f97316',
  'Backhand Blossoms': '#10b981',
  'Net Novas': '#3b82f6',
  'Arctic Angels': '#06b6d4',
};

function RankingsTable({ data, title, note }) {

const TEAM_COLORS = {
  'Desert Falcons': '#c79a3e', 'Ice Breakers': '#00C8E8', 'Avalanche Aces': '#0057E9',
  'Sonic Viboras': '#9aa823', 'Samurai Kicksmashers': '#dc2626', 'Samurai Kick Smashers': '#dc2626',
  'Globo Boomerangs': '#7c3aed', 'Global Boomerangs': '#7c3aed', 'Sahara Lions': '#f59e0b',
  'Rulo Apaches': '#6b7280', 'Baltic Blades': '#0891b2',
  'Lunar Lillies': '#8b5cf6', 'Desert Roses': '#ec4899', 'Phoenix Flames': '#f97316',
  'Backhand Blossoms': '#10b981', 'Net Novas': '#3b82f6', 'Arctic Angels': '#06b6d4',
};

function RankTable({ data, champion }) {
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const teams = [...new Set(data.map((p) => p.team))].sort();
  const filtered = data
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => teamFilter === 'all' || p.team === teamFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {champion && (
        <div className="card row spread" style={{ borderLeft: '3px solid var(--gold)', paddingLeft: 14, background: 'linear-gradient(135deg,rgba(199,154,62,.12),transparent)' }}>
          <div>
            <span className="eyebrow">Season Champions</span>
            <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 16, display: 'block', marginTop: 2 }}>{champion.name}</b>
          </div>
          <img src={champion.logo} alt="" style={{ width: 48, height: 48, objectFit: 'contain' }} />
        </div>
      )}
      <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search player..."
          style={{ flex: 1, minWidth: 150, padding: '10px 13px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)', font: 'inherit', fontSize: 13 }} />
        <select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)}
          style={{ padding: '10px 13px', borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--text)', font: 'inherit', fontSize: 13 }}>
          <option value="all">All Teams</option>
          {teams.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <p className="muted" style={{ fontSize: 12 }}>{filtered.length} player{filtered.length !== 1 ? 's' : ''}</p>
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="tbl">
          <thead>
            <tr><th>#</th><th>Player</th><th>Team</th><th className="num">P</th><th className="num">W</th><th className="num">L</th><th className="num">Win%</th><th className="num">Sets</th><th className="num">Games</th></tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const pct = p.played ? Math.round((p.won / p.played) * 100) : 0;
              const color = TEAM_COLORS[p.team] || 'var(--muted)';
              return (
                <tr key={p.rank}>
                  <td><span className="pos-badge">{p.rank}</span></td>
                  <td><b style={{ fontSize: 13 }}>{p.name}</b></td>
                  <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 3, height: 14, borderRadius: 2, background: color, display: 'inline-block' }} />
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>{p.team}</span>
                  </span></td>
                  <td className="num">{p.played}</td>
                  <td className="num" style={{ color: 'var(--win)' }}>{p.won}</td>
                  <td className="num" style={{ color: 'var(--loss)' }}>{p.lost}</td>
                  <td className="num"><b style={{ color: pct >= 60 ? 'var(--win)' : pct < 40 ? 'var(--muted)' : 'var(--text)' }}>{pct}%</b></td>
                  <td className="num">{p.setsWon}</td>
                  <td className="num">{p.gamesWon}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Season3MensRankings() {
  const [sortBy, setSortBy] = useState('lp');
  const players = PLAYERS.filter((p) => p.league === 'mens' && p.stats && p.stats.played > 0);
  const sorted = [...players].sort(
    sortBy === 'lp' ? (a, b) => b.lp_rating - a.lp_rating :
    sortBy === 'win' ? (a, b) => winPct(b.stats) - winPct(a.stats) || b.stats.wins - a.stats.wins :
    sortBy === 'mvp' ? (a, b) => b.stats.mvp_points - a.stats.mvp_points :
    (a, b) => b.stats.wins - a.stats.wins
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="card" style={{ borderLeft: '3px solid var(--live)', paddingLeft: 14 }}>
        <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 14 }}>Season 3 · Live Rankings</b>
        <p className="muted" style={{ margin: '4px 0 0', fontSize: 12 }}>P1/P2/P3 format · {sorted.length} players with match time</p>
      </div>
      <div className="tabbar">
        {[['lp','LP Rating'],['win','Win %'],['wins','Wins'],['mvp','MVP Pts']].map(([k,lbl]) => (
          <button key={k} className={sortBy === k ? 'on' : ''} onClick={() => setSortBy(k)}>{lbl}</button>
        ))}
      </div>
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table className="tbl">
          <thead>
            <tr><th>#</th><th>Player</th><th>Franchise</th><th className="num">Ct</th><th className="num">P</th><th className="num">W</th><th className="num">L</th><th className="num">{sortBy === 'lp' ? 'LP' : sortBy === 'win' ? 'Win%' : sortBy === 'mvp' ? 'MVP' : 'W'}</th></tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => {
              const fr = franchiseById(p.franchise_id);
              const val = sortBy === 'lp' ? p.lp_rating : sortBy === 'win' ? `${winPct(p.stats)}%` : sortBy === 'mvp' ? p.stats.mvp_points : p.stats.wins;
              return (
                <tr key={p.id}>
                  <td><span className="pos-badge">{i + 1}</span></td>
                  <td><Link to={`/player/${p.id}`}><b style={{ fontSize: 13 }}>{p.name}</b></Link></td>
                  <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 3, height: 14, borderRadius: 2, background: stripeVar(fr.id), display: 'inline-block' }} />
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>{fr.short || fr.name}</span>
                  </span></td>
                  <td className="muted" style={{ fontSize: 11, textAlign: 'center' }}>{p.tier}</td>
                  <td className="num">{p.stats.played}</td>
                  <td className="num" style={{ color: 'var(--win)' }}>{p.stats.wins}</td>
                  <td className="num" style={{ color: 'var(--loss)' }}>{p.stats.losses}</td>
                  <td className="num"><b style={{ color: sortBy === 'lp' ? 'var(--gold)' : 'var(--text)' }}>{val}</b></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AllTimeRankings() {
  const [league, setLeague] = useState('mens');
  const [mensSeason, setMensSeason] = useState('s3');
  const [ladiesSeason, setLadiesSeason] = useState('s1');
  const [mensDiv, setMensDiv] = useState('premier');

  return (
    <div className="page">
      <h1 className="display">Historical Stats</h1>
      <p className="muted" style={{ fontSize: 13 }}>Player rankings and statistics across all Lowveld Padel seasons.</p>

      {/* League tabs */}
      <div className="tabbar mt">
        <button className={league === 'mens' ? 'on' : ''} onClick={() => setLeague('mens')}>Men's</button>
        <button className={league === 'ladies' ? 'on' : ''} onClick={() => setLeague('ladies')}>Ladies</button>
        <button className={league === 'youth' ? 'on' : ''} onClick={() => setLeague('youth')}>Youth</button>
      </div>

      {/* ── MEN'S ── */}
      {league === 'mens' && (
        <>
          <div className="tabbar mt">
            <button className={mensSeason === 's1' ? 'on' : ''} onClick={() => { setMensSeason('s1'); setMensDiv('premier'); }}>Season 1</button>
            <button className={mensSeason === 's2' ? 'on' : ''} onClick={() => { setMensSeason('s2'); setMensDiv('premier'); }}>Season 2</button>
            <button className={mensSeason === 's3' ? 'on' : ''} onClick={() => setMensSeason('s3')}>Season 3 · Live</button>
          </div>

          {mensSeason === 's1' && (
            <div className="mt">
              <div className="grid cols-2" style={{ gap: 10, marginBottom: 14 }}>
                <div className="card" style={{ borderLeft: '3px solid var(--gold)', paddingLeft: 14, background: 'linear-gradient(135deg,rgba(199,154,62,.1),transparent)' }}>
                  <span className="eyebrow">Premier Division Champion</span>
                  <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 15, display: 'block', marginTop: 4 }}>Sonic Viboras</b>
                  <img src="/logos/sonic-viboras.webp" alt="" style={{ width: 40, height: 40, objectFit: 'contain', marginTop: 8 }} />
                </div>
                <div className="card" style={{ borderLeft: '3px solid var(--court)', paddingLeft: 14, background: 'linear-gradient(135deg,rgba(0,200,232,.08),transparent)' }}>
                  <span className="eyebrow">Championship Champion</span>
                  <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 15, display: 'block', marginTop: 4 }}>Desert Falcons</b>
                  <img src="/logos/desert-falcons.webp" alt="" style={{ width: 40, height: 40, objectFit: 'contain', marginTop: 8 }} />
                </div>
              </div>
              <div className="card" style={{ textAlign: 'center', padding: '28px 20px' }}>
                <div style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 18, marginBottom: 8 }}>Season 1 Player Stats</div>
                <p className="muted" style={{ margin: '0 0 14px', fontSize: 13 }}>Season 1 had Premier and Championship divisions. Full player stats will be published here.</p>
                <span className="chip">Data Coming Soon</span>
              </div>
            </div>
          )}

          {mensSeason === 's2' && (
            <div className="mt">
              <div className="tabbar" style={{ marginBottom: 14 }}>
                <button className={mensDiv === 'premier' ? 'on' : ''} onClick={() => setMensDiv('premier')}>Premier Division</button>
                <button className={mensDiv === 'champ' ? 'on' : ''} onClick={() => setMensDiv('champ')}>Championship Division</button>
              </div>
              {mensDiv === 'premier' && (
                <RankTable
                  data={MENS_S2_PREMIER}
                  champion={{ name: 'Sonic Viboras', logo: '/logos/sonic-viboras.webp' }}
                />
              )}
              {mensDiv === 'champ' && (
                <RankTable
                  data={MENS_S2_CHAMP}
                  champion={{ name: 'Global Boomerangs', logo: '/logos/globo-boomerangs.webp' }}
                />
              )}
            </div>
          )}

          {mensSeason === 's3' && (
            <div className="mt"><Season3MensRankings /></div>
          )}
        </>
      )}

      {/* ── LADIES ── */}
      {league === 'ladies' && (
        <>
          <div className="tabbar mt">
            <button className={ladiesSeason === 's1' ? 'on' : ''} onClick={() => setLadiesSeason('s1')}>Season 1</button>
            <button className={ladiesSeason === 's2' ? 'on' : ''} onClick={() => setLadiesSeason('s2')}>Season 2</button>
          </div>
          {ladiesSeason === 's1' && (
            <div className="mt">
              <RankTable
                data={LADIES_S1}
                champion={{ name: 'Lunar Lillies', logo: '/logos/lunar-lillies.webp' }}
              />
            </div>
          )}
          {ladiesSeason === 's2' && (
            <div className="mt">
              <div className="card" style={{ textAlign: 'center', padding: '36px 20px' }}>
                <div style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 20, marginBottom: 8 }}>Ladies Season 2</div>
                <p className="muted" style={{ margin: '0 0 14px', fontSize: 13 }}>Season 2 is upcoming — stats will appear here once play begins.</p>
                <Link to="/register" className="btn gold">Register Now →</Link>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── YOUTH ── */}
      {league === 'youth' && (
        <div className="mt">
          <div className="card" style={{ textAlign: 'center', padding: '36px 20px' }}>
            <div style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 20, marginBottom: 8 }}>Youth Championship</div>
            <p className="muted" style={{ margin: '0 0 14px', fontSize: 13 }}>Youth competition stats will appear here once the championship launches.</p>
            <span className="chip">Coming Soon</span>
          </div>
        </div>
      )}
    </div>
  );
}
