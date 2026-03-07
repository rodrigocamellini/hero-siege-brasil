
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import './HeroSkills.css';
import Footer from './Footer';

const CLASS_DATA = [
  { name: 'Prophet', type: 'MAGIC', destacado: true },
  { name: 'Viking', type: 'MELEE' },
  { name: 'Pyromancer', type: 'MAGIC' },
  { name: 'Marksman', type: 'RANGED' },
  { name: 'Pirate', type: 'RANGED' },
  { name: 'Nomad', type: 'MELEE' },
  { name: 'Redneck', type: 'MELEE' },
  { name: 'Necromancer', type: 'MAGIC' },
  { name: 'Samurai', type: 'MELEE' },
  { name: 'Paladin', type: 'MELEE' },
  { name: 'Amazon', type: 'RANGED' },
  { name: 'Demon Slayer', type: 'RANGED' },
  { name: 'Demonspawn', type: 'MELEE' },
  { name: 'Shaman', type: 'MAGIC' },
  { name: 'White Mage', type: 'MAGIC' },
  { name: 'Marauder', type: 'MELEE' },
  { name: 'Plague Doctor', type: 'MAGIC' },
  { name: 'Illusionist', type: 'MAGIC' },
  { name: 'Exo', type: 'MELEE' },
  { name: 'Butcher', type: 'MELEE' },
  { name: 'Stormweaver', type: 'MAGIC' },
  { name: 'Bard', type: 'MAGIC' },
  { name: 'Shield Lancer', type: 'MELEE' },
  { name: 'Jotunn', type: 'MELEE' }
];

const builderDb = {
  viking: {
    t1: 'Berserker',
    t2: 'Shield Bearer',
    s1: [
      { id: 'vk1', n: 'Seismic Slam', r: 1, c: 1, req: null, hasPlus: true },
      { id: 'vk2', n: 'Brute Force', r: 1, c: 3, req: null, hasPlus: false },
      { id: 'vk3', n: 'Throw', r: 2, c: 1, req: 'vk1', hasPlus: true },
      { id: 'vk4', n: 'Zeal', r: 2, c: 2, req: null, hasPlus: true },
      { id: 'vk5', n: "Ymirs Champion", r: 3, c: 2, req: 'vk4', hasPlus: true },
      { id: 'vk6', n: 'Whirlwind', r: 3, c: 3, req: 'vk2', hasPlus: true },
      { id: 'vk7', n: 'Shockwave', r: 4, c: 1, req: 'vk3', hasPlus: true },
      { id: 'vk8', n: 'Berserk', r: 4, c: 2, req: 'vk5', hasPlus: true },
      { id: 'vk9', n: 'Demolishing Winds', r: 5, c: 3, req: 'vk6', hasPlus: false }
    ],
    s2: [
      { id: 'vk10', n: 'Weapon Master', r: 1, c: 2, req: null, hasPlus: false },
      { id: 'vk11', n: 'Charge', r: 1, c: 3, req: null, hasPlus: true },
      { id: 'vk12', n: 'Stoneskin', r: 2, c: 1, req: null, hasPlus: false },
      { id: 'vk13', n: 'Devastating Charge', r: 2, c: 3, req: 'vk11', hasPlus: false },
      { id: 'vk14', n: 'Norse Resistance', r: 3, c: 1, req: 'vk12', hasPlus: false },
      { id: 'vk15', n: 'Defensive Shout', r: 3, c: 2, req: null, hasPlus: false },
      { id: 'vk16', n: "Odins Fury", r: 4, c: 2, req: 'vk15', hasPlus: true },
      { id: 'vk17', n: 'Battle Agility', r: 4, c: 3, req: 'vk13', hasPlus: false },
      { id: 'vk18', n: 'Combat Orders', r: 5, c: 2, req: 'vk16', hasPlus: false }
    ]
  },
  pyromancer: {
    t1: 'Fire Mage',
    t2: 'Burning Soul',
    s1: [
      { id: 'py1', n: 'Fireball', r: 1, c: 1, req: null, hasPlus: true },
      { id: 'py2', n: 'Phoenix Flight', r: 1, c: 3, req: null, hasPlus: true },
      { id: 'py3', n: 'Fire Nova', r: 2, c: 1, req: 'py1', hasPlus: true },
      { id: 'py4', n: 'Scorching Aura', r: 2, c: 2, req: null, hasPlus: false },
      { id: 'py5', n: 'Volcano', r: 3, c: 2, req: 'py4', hasPlus: true },
      { id: 'py6', n: 'Blazing Trail', r: 3, c: 3, req: 'py2', hasPlus: true },
      { id: 'py7', n: 'Hydra', r: 4, c: 1, req: 'py3', hasPlus: true },
      { id: 'py8', n: 'Comet', r: 4, c: 2, req: 'py5', hasPlus: true },
      { id: 'py9', n: 'Meteor', r: 5, c: 3, req: 'py6', hasPlus: false }
    ],
    s2: [
      { id: 'py10', n: 'Inferno Slash', r: 1, c: 2, req: null, hasPlus: true },
      { id: 'py11', n: 'Ignite', r: 1, c: 3, req: null, hasPlus: false },
      { id: 'py12', n: 'Fire Shield', r: 2, c: 1, req: null, hasPlus: false },
      { id: 'py13', n: 'Armageddon', r: 3, c: 2, req: 'py12', hasPlus: true },
      { id: 'py14', n: 'Fire Enchant', r: 4, c: 1, req: null, hasPlus: false },
      { id: 'py15', n: 'Searing Chains', r: 4, c: 3, req: 'py11', hasPlus: true },
      { id: 'py16', n: 'Fiery Presence', r: 5, c: 1, req: 'py14', hasPlus: false },
      { id: 'py17', n: 'Breath of Fire', r: 5, c: 2, req: null, hasPlus: false },
      { id: 'py18', n: 'Avatar of Fire', r: 5, c: 3, req: 'py13', hasPlus: true }
    ]
  },
  marksman: {
    t1: 'Hunter',
    t2: 'Marksman',
    s1: [
      { id: 'mk1', n: 'Arrow Rain', r: 1, c: 1, req: null, hasPlus: true },
      { id: 'mk2', n: 'Agility', r: 1, c: 3, req: null, hasPlus: false },
      { id: 'mk3', n: 'Multishot', r: 2, c: 1, req: 'mk1', hasPlus: true },
      { id: 'mk4', n: 'Homing Missile', r: 2, c: 2, req: null, hasPlus: true },
      { id: 'mk5', n: 'Volatile Shot', r: 3, c: 2, req: 'mk4', hasPlus: true },
      { id: 'mk6', n: 'Critical Accuracy', r: 3, c: 3, req: 'mk2', hasPlus: false },
      { id: 'mk7', n: 'Arrow Turret', r: 4, c: 1, req: 'mk3', hasPlus: true },
      { id: 'mk8', n: 'Trickshot', r: 4, c: 2, req: 'mk5', hasPlus: true },
      { id: 'mk9', n: 'Master Mechanic', r: 5, c: 3, req: 'mk6', hasPlus: false }
    ],
    s2: [
      { id: 'mk10', n: 'Turret Mastery', r: 1, c: 2, req: null, hasPlus: false },
      { id: 'mk11', n: 'Arrow Rampage', r: 1, c: 3, req: null, hasPlus: true },
      { id: 'mk12', n: 'Gunner Drone', r: 2, c: 1, req: null, hasPlus: false },
      { id: 'mk13', n: 'Frag Grenade', r: 2, c: 3, req: 'mk11', hasPlus: false },
      { id: 'mk14', n: 'Vault', r: 3, c: 1, req: 'mk12', hasPlus: false },
      { id: 'mk15', n: 'Rocket Turret', r: 3, c: 2, req: null, hasPlus: true },
      { id: 'mk16', n: 'Landmine', r: 4, c: 2, req: 'mk15', hasPlus: true },
      { id: 'mk17', n: 'Cannon Turret', r: 4, c: 3, req: 'mk13', hasPlus: false },
      { id: 'mk18', n: 'Beacon', r: 5, c: 2, req: 'mk16', hasPlus: false }
    ]
  },
  pirate: {
    t1: 'Shipmaster',
    t2: 'Cannoneer',
    s1: [
      { id: 'pi1', n: 'Anchor Swing', r: 1, c: 1, req: null, hasPlus: true },
      { id: 'pi2', n: 'Land Ahoy', r: 1, c: 3, req: null, hasPlus: false },
      { id: 'pi3', n: 'Parrot', r: 2, c: 1, req: 'pi1', hasPlus: true },
      { id: 'pi4', n: 'Set Sail', r: 2, c: 2, req: null, hasPlus: true },
      { id: 'pi5', n: 'Powder Trail', r: 3, c: 2, req: 'pi4', hasPlus: true },
      { id: 'pi6', n: 'Kneecap', r: 3, c: 3, req: 'pi2', hasPlus: false },
      { id: 'pi7', n: 'Torrent', r: 4, c: 1, req: 'pi3', hasPlus: true },
      { id: 'pi8', n: 'Grenade Jump', r: 4, c: 2, req: 'pi5', hasPlus: true },
      { id: 'pi9', n: 'Treasure Hunter', r: 5, c: 3, req: 'pi6', hasPlus: false }
    ],
    s2: [
      { id: 'pi10', n: 'Cannonball', r: 1, c: 2, req: null, hasPlus: true },
      { id: 'pi11', n: 'Bomb Barrage', r: 1, c: 3, req: null, hasPlus: true },
      { id: 'pi12', n: 'Freezing Chain Shot', r: 2, c: 1, req: null, hasPlus: false },
      { id: 'pi13', n: 'Explosive Bullets', r: 2, c: 3, req: 'pi11', hasPlus: false },
      { id: 'pi14', n: 'Frozen Lead', r: 3, c: 1, req: 'pi12', hasPlus: false },
      { id: 'pi15', n: 'Remiges', r: 3, c: 2, req: null, hasPlus: true },
      { id: 'pi16', n: 'Buckshot', r: 4, c: 2, req: 'pi15', hasPlus: true },
      { id: 'pi17', n: 'Rapid Fire', r: 4, c: 3, req: 'pi13', hasPlus: false },
      { id: 'pi18', n: 'Explosive Barrel', r: 5, c: 2, req: 'pi16', hasPlus: false }
    ]
  },
  nomad: {
    t1: 'Sand Walker',
    t2: 'Desert Blade',
    s1: [
      { id: 'no1', n: 'Sand Vortex', r: 1, c: 1, req: null, hasPlus: true },
      { id: 'no2', n: 'Sand Gush', r: 1, c: 3, req: null, hasPlus: false },
      { id: 'no3', n: 'Healing Sunrays', r: 2, c: 1, req: 'no1', hasPlus: true },
      { id: 'no4', n: 'Mystic Sand', r: 2, c: 2, req: null, hasPlus: true },
      { id: 'no5', n: 'Sand Carver', r: 3, c: 2, req: 'no4', hasPlus: true },
      { id: 'no6', n: 'Chainslice', r: 3, c: 3, req: 'no2', hasPlus: false },
      { id: 'no7', n: 'Dissipating Tornado', r: 4, c: 1, req: 'no3', hasPlus: true },
      { id: 'no8', n: 'Blade Strike', r: 4, c: 2, req: 'no5', hasPlus: true },
      { id: 'no9', n: 'Sand Entombment', r: 5, c: 3, req: 'no6', hasPlus: false }
    ],
    s2: [
      { id: 'no10', n: 'Eye of Ra', r: 1, c: 2, req: null, hasPlus: true },
      { id: 'no11', n: 'Cloud of Sand', r: 1, c: 3, req: null, hasPlus: true },
      { id: 'no12', n: 'Oasis Aura', r: 2, c: 1, req: null, hasPlus: false },
      { id: 'no13', n: 'Phantom Blade', r: 2, c: 3, req: 'no11', hasPlus: false },
      { id: 'no14', n: 'Rupture', r: 3, c: 1, req: 'no12', hasPlus: false },
      { id: 'no15', n: 'Flying Scimitar', r: 3, c: 2, req: null, hasPlus: true },
      { id: 'no16', n: 'Scimitar Charge', r: 4, c: 2, req: 'no15', hasPlus: true },
      { id: 'no17', n: 'Sand Tremors', r: 4, c: 3, req: 'no13', hasPlus: false },
      { id: 'no18', n: 'Hemorrhage', r: 5, c: 2, req: 'no16', hasPlus: false }
    ]
  },
  redneck: {
    t1: 'Hillbilly',
    t2: 'Moonshiner',
    s1: [
      { id: 'rn1', n: 'Chainsaw Slash', r: 1, c: 1, req: null, hasPlus: true },
      { id: 'rn2', n: 'Durable Wear', r: 1, c: 3, req: null, hasPlus: false },
      { id: 'rn3', n: 'Oil Spill', r: 2, c: 1, req: 'rn1', hasPlus: true },
      { id: 'rn4', n: 'Moonshine Molotov', r: 2, c: 2, req: null, hasPlus: true },
      { id: 'rn5', n: 'Moonshine Madness', r: 3, c: 2, req: 'rn4', hasPlus: true },
      { id: 'rn6', n: 'Chainsaw Mastery', r: 3, c: 3, req: 'rn2', hasPlus: false },
      { id: 'rn7', n: 'Pipe Bombs', r: 4, c: 1, req: 'rn3', hasPlus: true },
      { id: 'rn8', n: 'Hillbilly Rage', r: 4, c: 2, req: 'rn5', hasPlus: true },
      { id: 'rn9', n: 'Pickup Raid', r: 5, c: 3, req: 'rn6', hasPlus: false }
    ],
    s2: [
      { id: 'rn10', n: 'Tire Fire', r: 1, c: 2, req: null, hasPlus: true },
      { id: 'rn11', n: 'Rogue Chainsaw', r: 1, c: 3, req: null, hasPlus: true },
      { id: 'rn12', n: 'Experienced Logger', r: 2, c: 1, req: null, hasPlus: false },
      { id: 'rn13', n: 'Combustible Oil', r: 2, c: 3, req: 'rn11', hasPlus: false },
      { id: 'rn14', n: 'Spontaneous Combustion', r: 3, c: 1, req: 'rn12', hasPlus: false },
      { id: 'rn15', n: 'Loggers Endurance', r: 3, c: 2, req: null, hasPlus: true },
      { id: 'rn16', n: 'Tree Trunk Triumph', r: 4, c: 2, req: 'rn15', hasPlus: true },
      { id: 'rn17', n: 'Revved Up', r: 4, c: 3, req: 'rn13', hasPlus: false },
      { id: 'rn18', n: 'Chainsaw Massacre', r: 5, c: 2, req: 'rn16', hasPlus: false }
    ]
  },
  necromancer: {
    t1: 'Summoner',
    t2: 'Lich',
    s1: [
      { id: 'ne1', n: 'Raise Skeleton', r: 1, c: 1, req: null, hasPlus: true },
      { id: 'ne2', n: 'Life Tap', r: 1, c: 3, req: null, hasPlus: false },
      { id: 'ne3', n: 'Raise Skeleton Mage', r: 2, c: 1, req: 'ne1', hasPlus: true },
      { id: 'ne4', n: 'Poison Breath', r: 2, c: 2, req: null, hasPlus: true },
      { id: 'ne5', n: 'Corpse Explosion', r: 3, c: 2, req: 'ne4', hasPlus: true },
      { id: 'ne6', n: 'Summon Mastery', r: 3, c: 3, req: 'ne2', hasPlus: false },
      { id: 'ne7', n: 'Meat Shield', r: 4, c: 1, req: 'ne3', hasPlus: true },
      { id: 'ne8', n: 'Cursed Ground', r: 4, c: 2, req: 'ne5', hasPlus: true },
      { id: 'ne9', n: 'Summon Damned Legion', r: 5, c: 3, req: 'ne6', hasPlus: false }
    ],
    s2: [
      { id: 'ne10', n: 'Poison Nova', r: 1, c: 2, req: null, hasPlus: true },
      { id: 'ne11', n: 'Bone Spear', r: 1, c: 3, req: null, hasPlus: true },
      { id: 'ne12', n: 'Summon Frenzy', r: 2, c: 1, req: null, hasPlus: false },
      { id: 'ne13', n: 'Summon Resistances', r: 2, c: 3, req: 'ne11', hasPlus: false },
      { id: 'ne14', n: 'Amplify Damage', r: 3, c: 1, req: 'ne12', hasPlus: false },
      { id: 'ne15', n: 'Summon Vengeful Spirit', r: 3, c: 2, req: null, hasPlus: true },
      { id: 'ne16', n: 'Meat Bomb', r: 4, c: 2, req: 'ne15', hasPlus: true },
      { id: 'ne17', n: 'Bone Spirit', r: 4, c: 3, req: 'ne13', hasPlus: false },
      { id: 'ne18', n: 'Bone Shred', r: 5, c: 2, req: 'ne16', hasPlus: false }
    ]
  },
  samurai: {
    t1: 'Bushido',
    t2: 'Ronin',
    s1: [
      { id: 'sa1', n: 'Quickslash', r: 1, c: 1, req: null, hasPlus: true },
      { id: 'sa2', n: 'Evasion', r: 1, c: 3, req: null, hasPlus: false },
      { id: 'sa3', n: 'Shuriken Throw', r: 2, c: 1, req: 'sa1', hasPlus: true },
      { id: 'sa4', n: 'Warriors Spirit', r: 2, c: 2, req: null, hasPlus: true },
      { id: 'sa5', n: 'Battle Glance', r: 3, c: 2, req: 'sa4', hasPlus: true },
      { id: 'sa6', n: 'Bushido', r: 3, c: 3, req: 'sa2', hasPlus: false },
      { id: 'sa7', n: 'Empires Slash', r: 4, c: 1, req: 'sa3', hasPlus: true },
      { id: 'sa8', n: 'Live by the Sword', r: 4, c: 2, req: 'sa5', hasPlus: true },
      { id: 'sa9', n: 'For Honor', r: 5, c: 3, req: 'sa6', hasPlus: false }
    ],
    s2: [
      { id: 'sa10', n: 'Way of the Warrior', r: 1, c: 2, req: null, hasPlus: true },
      { id: 'sa11', n: 'Shadow Step', r: 1, c: 3, req: null, hasPlus: true },
      { id: 'sa12', n: 'Blade Barrier', r: 2, c: 1, req: null, hasPlus: false },
      { id: 'sa13', n: 'Fan of Knives', r: 2, c: 3, req: 'sa11', hasPlus: false },
      { id: 'sa14', n: 'Burst of Speed', r: 3, c: 1, req: 'sa12', hasPlus: false },
      { id: 'sa15', n: 'Exploding Bolas', r: 3, c: 2, req: null, hasPlus: true },
      { id: 'sa16', n: 'Omnislash', r: 4, c: 2, req: 'sa15', hasPlus: true },
      { id: 'sa17', n: 'Explosive Kunai', r: 4, c: 3, req: 'sa13', hasPlus: false },
      { id: 'sa18', n: 'Smoke Bomb', r: 5, c: 2, req: 'sa16', hasPlus: false }
    ]
  },
  paladin: {
    t1: 'Holy Knight',
    t2: 'Crusader',
    s1: [
      { id: 'pa1', n: 'Holy Hammer', r: 1, c: 1, req: null, hasPlus: true },
      { id: 'pa2', n: 'Holy Aura', r: 1, c: 3, req: null, hasPlus: false },
      { id: 'pa3', n: 'Holy Bolt', r: 2, c: 1, req: 'pa1', hasPlus: true },
      { id: 'pa4', n: 'Thunder Shield', r: 2, c: 2, req: null, hasPlus: true },
      { id: 'pa5', n: 'Divine Wisdom', r: 3, c: 2, req: 'pa4', hasPlus: true },
      { id: 'pa6', n: 'Fanaticism Aura', r: 3, c: 3, req: 'pa2', hasPlus: false },
      { id: 'pa7', n: 'Holy Retribution', r: 4, c: 1, req: 'pa3', hasPlus: true },
      { id: 'pa8', n: 'Holy Nova', r: 4, c: 2, req: 'pa5', hasPlus: true },
      { id: 'pa9', n: 'Thors Fury', r: 5, c: 3, req: 'pa6', hasPlus: false }
    ],
    s2: [
      { id: 'pa10', n: 'Lights Embrace', r: 1, c: 2, req: null, hasPlus: true },
      { id: 'pa11', n: 'Fist of the Heavens', r: 1, c: 3, req: null, hasPlus: true },
      { id: 'pa12', n: 'The Venerated One', r: 2, c: 1, req: null, hasPlus: false },
      { id: 'pa13', n: 'Divine Storm', r: 2, c: 3, req: 'pa11', hasPlus: false },
      { id: 'pa14', n: 'Vengeance', r: 3, c: 1, req: 'pa12', hasPlus: false },
      { id: 'pa15', n: 'Holy Shock Aura', r: 3, c: 2, req: null, hasPlus: true },
      { id: 'pa16', n: 'Eye of the Storm', r: 4, c: 2, req: 'pa15', hasPlus: true },
      { id: 'pa17', n: 'Ball Lightning', r: 4, c: 3, req: 'pa13', hasPlus: false },
      { id: 'pa18', n: 'Lightning Fury', r: 5, c: 2, req: 'pa16', hasPlus: false }
    ]
  },
  amazon: {
    t1: 'Spear Maiden',
    t2: 'Huntress',
    s1: [
      { id: 'am1', n: 'Spearnage', r: 1, c: 1, req: null, hasPlus: true },
      { id: 'am2', n: 'Leaping Ambush', r: 1, c: 3, req: null, hasPlus: false },
      { id: 'am3', n: 'Thunder Fury', r: 2, c: 1, req: 'am1', hasPlus: true },
      { id: 'am4', n: 'Thrill of the Hunt', r: 2, c: 2, req: null, hasPlus: true },
      { id: 'am5', n: 'Astropes Gift', r: 3, c: 2, req: 'am4', hasPlus: true },
      { id: 'am6', n: 'Master Poisoner', r: 3, c: 3, req: 'am2', hasPlus: false },
      { id: 'am7', n: 'Thunder Goddesses Chosen', r: 4, c: 1, req: 'am3', hasPlus: true },
      { id: 'am8', n: 'Astropes Battle Maiden', r: 4, c: 2, req: 'am5', hasPlus: true },
      { id: 'am9', n: 'Death from Above', r: 5, c: 3, req: 'am6', hasPlus: false }
    ],
    s2: [
      { id: 'am10', n: 'Noxious Strike', r: 1, c: 2, req: null, hasPlus: true },
      { id: 'am11', n: 'Storm Dash', r: 1, c: 3, req: null, hasPlus: true },
      { id: 'am12', n: 'Jungle Camouflage', r: 2, c: 1, req: null, hasPlus: false },
      { id: 'am13', n: 'Caustic Spearhead', r: 2, c: 3, req: 'am11', hasPlus: false },
      { id: 'am14', n: 'Chooser of the Slain', r: 3, c: 1, req: 'am12', hasPlus: false },
      { id: 'am15', n: 'Toxic Remains', r: 3, c: 2, req: null, hasPlus: true },
      { id: 'am16', n: 'Envenom', r: 4, c: 2, req: 'am15', hasPlus: true },
      { id: 'am17', n: 'Feint', r: 4, c: 3, req: 'am13', hasPlus: false },
      { id: 'am18', n: 'Rebound', r: 5, c: 2, req: 'am16', hasPlus: false }
    ]
  },
  demon_slayer: {
    t1: 'Executioner',
    t2: 'Inquisitor',
    s1: [
      { id: 'ds1', n: 'Bullet Hell', r: 1, c: 1, req: null, hasPlus: true },
      { id: 'ds2', n: 'Concentration Aura', r: 1, c: 3, req: null, hasPlus: false },
      { id: 'ds3', n: 'Possessed Bullet', r: 2, c: 1, req: 'ds1', hasPlus: true },
      { id: 'ds4', n: 'Trigger Finger', r: 2, c: 2, req: null, hasPlus: true },
      { id: 'ds5', n: 'Demons Presence', r: 3, c: 2, req: 'ds4', hasPlus: true },
      { id: 'ds6', n: 'Sword Handler', r: 3, c: 3, req: 'ds2', hasPlus: false },
      { id: 'ds7', n: 'Shredder Trap', r: 4, c: 1, req: 'ds3', hasPlus: true },
      { id: 'ds8', n: 'Soul Leech', r: 4, c: 2, req: 'ds5', hasPlus: true },
      { id: 'ds9', n: 'Absolute Mayhem', r: 5, c: 3, req: 'ds6', hasPlus: false }
    ],
    s2: [
      { id: 'ds10', n: 'Fast Slices', r: 1, c: 2, req: null, hasPlus: true },
      { id: 'ds11', n: 'Slice of Shadows', r: 1, c: 3, req: null, hasPlus: true },
      { id: 'ds12', n: 'Demons Shield', r: 2, c: 1, req: null, hasPlus: false },
      { id: 'ds13', n: 'Execute', r: 2, c: 3, req: 'ds11', hasPlus: false },
      { id: 'ds14', n: 'Eagle Eye', r: 3, c: 1, req: 'ds12', hasPlus: false },
      { id: 'ds15', n: 'Shadow Anomalies', r: 3, c: 2, req: null, hasPlus: true },
      { id: 'ds16', n: 'Demons Calling', r: 4, c: 2, req: 'ds15', hasPlus: true },
      { id: 'ds17', n: 'Heart Attack', r: 4, c: 3, req: 'ds13', hasPlus: false },
      { id: 'ds18', n: 'Demon Form', r: 5, c: 2, req: 'ds16', hasPlus: false }
    ]
  },
  demonspawn: {
    t1: 'Blood',
    t2: 'Bone',
    s1: [
      { id: 'dp1', n: 'Blood Bolts', r: 1, c: 1, req: null, hasPlus: true },
      { id: 'dp2', n: 'Gut Spread', r: 1, c: 3, req: null, hasPlus: false },
      { id: 'dp3', n: 'Blood Surge', r: 2, c: 1, req: 'dp1', hasPlus: true },
      { id: 'dp4', n: 'Blood Tendrils', r: 2, c: 2, req: null, hasPlus: true },
      { id: 'dp5', n: 'Impale', r: 3, c: 2, req: 'dp4', hasPlus: true },
      { id: 'dp6', n: 'Spinal Tap', r: 3, c: 3, req: 'dp2', hasPlus: false },
      { id: 'dp7', n: 'Blood Demons', r: 4, c: 1, req: 'dp3', hasPlus: true },
      { id: 'dp8', n: 'Cartilage Build Up', r: 4, c: 2, req: 'dp5', hasPlus: true },
      { id: 'dp9', n: "Single Out", r: 5, c: 3, req: 'dp6', hasPlus: false }
    ],
    s2: [
      { id: 'dp10', n: 'Bone Fragments', r: 1, c: 2, req: null, hasPlus: true },
      { id: 'dp11', n: 'Bone Barrage', r: 1, c: 3, req: null, hasPlus: true },
      { id: 'dp12', n: 'Mana Devour', r: 2, c: 1, req: null, hasPlus: false },
      { id: 'dp13', n: 'Mana Shield', r: 2, c: 3, req: 'dp11', hasPlus: false },
      { id: 'dp14', n: 'Manapool Aura', r: 3, c: 1, req: 'dp12', hasPlus: false },
      { id: 'dp15', n: 'Bone Storm', r: 3, c: 2, req: null, hasPlus: true },
      { id: 'dp16', n: 'Ominous Aura', r: 4, c: 2, req: 'dp15', hasPlus: true },
      { id: 'dp17', n: 'Demonic Presence', r: 4, c: 3, req: 'dp13', hasPlus: false },
      { id: 'dp18', n: 'Ossification', r: 5, c: 2, req: 'dp16', hasPlus: false }
    ]
  },
  shaman: {
    t1: 'Elements',
    t2: 'Totems',
    s1: [
      { id: 'sh1', n: 'Fire Totem', r: 1, c: 1, req: null, hasPlus: true },
      { id: 'sh2', n: 'Storm Totem', r: 1, c: 3, req: null, hasPlus: false },
      { id: 'sh3', n: 'Earth Totem', r: 2, c: 1, req: 'sh1', hasPlus: true },
      { id: 'sh4', n: 'Chaos Totem', r: 2, c: 2, req: null, hasPlus: true },
      { id: 'sh5', n: 'Tectonic Boulder', r: 3, c: 2, req: 'sh4', hasPlus: true },
      { id: 'sh6', n: 'Spiritual Guide', r: 3, c: 3, req: 'sh2', hasPlus: false },
      { id: 'sh7', n: 'Meteor Storm', r: 4, c: 1, req: 'sh3', hasPlus: true },
      { id: 'sh8', n: 'Twisters', r: 4, c: 2, req: 'sh5', hasPlus: true },
      { id: 'sh9', n: 'Tornado', r: 5, c: 3, req: 'sh6', hasPlus: false }
    ],
    s2: [
      { id: 'sh10', n: 'Spirit Wolves', r: 1, c: 2, req: null, hasPlus: true },
      { id: 'sh11', n: 'Earth Bind', r: 1, c: 3, req: null, hasPlus: true },
      { id: 'sh12', n: 'Scent of the Wolf', r: 2, c: 1, req: null, hasPlus: false },
      { id: 'sh13', n: 'Astral Intellect', r: 2, c: 3, req: 'sh11', hasPlus: false },
      { id: 'sh14', n: 'Earths Grace', r: 3, c: 1, req: 'sh12', hasPlus: false },
      { id: 'sh15', n: 'Fractal Mind', r: 3, c: 2, req: null, hasPlus: true },
      { id: 'sh16', n: 'Natures Prophet', r: 4, c: 2, req: 'sh15', hasPlus: true },
      { id: 'sh17', n: 'Rock Fragments', r: 4, c: 3, req: 'sh13', hasPlus: false },
      { id: 'sh18', n: 'Fissures', r: 5, c: 2, req: 'sh16', hasPlus: false }
    ]
  },
  white_mage: {
    t1: 'Holy',
    t2: 'Dark',
    s1: [
      { id: 'wm1', n: 'Flash Heal', r: 1, c: 1, req: null, hasPlus: true },
      { id: 'wm2', n: 'Mana Orb', r: 1, c: 3, req: null, hasPlus: false },
      { id: 'wm3', n: 'Holy Shield', r: 2, c: 1, req: 'wm1', hasPlus: true },
      { id: 'wm4', n: 'Divine Healing', r: 2, c: 2, req: null, hasPlus: true },
      { id: 'wm5', n: 'Burst of Light', r: 3, c: 2, req: 'wm4', hasPlus: true },
      { id: 'wm6', n: 'Heavenly Fire', r: 3, c: 3, req: 'wm2', hasPlus: false },
      { id: 'wm7', n: 'Healing Zone', r: 4, c: 1, req: 'wm3', hasPlus: true },
      { id: 'wm8', n: 'Chain of Holy Lightning', r: 4, c: 2, req: 'wm5', hasPlus: true },
      { id: 'wm9', n: 'Benediction', r: 5, c: 3, req: 'wm6', hasPlus: false }
    ],
    s2: [
      { id: 'wm10', n: 'Shadow Bolt', r: 1, c: 2, req: null, hasPlus: true },
      { id: 'wm11', n: 'Restless Spirits', r: 1, c: 3, req: null, hasPlus: true },
      { id: 'wm12', n: 'Dark Oath', r: 2, c: 1, req: null, hasPlus: false },
      { id: 'wm13', n: 'Soul Spurn', r: 2, c: 3, req: 'wm11', hasPlus: false },
      { id: 'wm14', n: 'Malediction', r: 3, c: 1, req: 'wm12', hasPlus: false },
      { id: 'wm15', n: 'Satans Mark', r: 3, c: 2, req: null, hasPlus: true },
      { id: 'wm16', n: 'Digest Souls', r: 4, c: 2, req: 'wm15', hasPlus: true },
      { id: 'wm17', n: 'Black Mass', r: 4, c: 3, req: 'wm13', hasPlus: false },
      { id: 'wm18', n: 'Martyr', r: 5, c: 2, req: 'wm16', hasPlus: false }
    ]
  },
  marauder: {
    t1: 'Wrecker',
    t2: 'Trapper',
    s1: [
      { id: 'ma1', n: 'Wrecking Ball', r: 1, c: 1, req: null, hasPlus: true },
      { id: 'ma2', n: 'Heavy Ball', r: 1, c: 3, req: null, hasPlus: false },
      { id: 'ma3', n: 'Unstable Bomb', r: 2, c: 1, req: 'ma1', hasPlus: true },
      { id: 'ma4', n: 'The Big Bo-Om', r: 2, c: 2, req: null, hasPlus: true },
      { id: 'ma5', n: 'Bouncing Grenade', r: 3, c: 2, req: 'ma4', hasPlus: true },
      { id: 'ma6', n: 'Bombardment', r: 3, c: 3, req: 'ma2', hasPlus: false },
      { id: 'ma7', n: 'Madness Control', r: 4, c: 1, req: 'ma3', hasPlus: true },
      { id: 'ma8', n: 'Force Overwhelming', r: 4, c: 2, req: 'ma5', hasPlus: true },
      { id: 'ma9', n: 'Annihilation', r: 5, c: 3, req: 'ma6', hasPlus: false }
    ],
    s2: [
      { id: 'ma10', n: 'Chain Trap', r: 1, c: 2, req: null, hasPlus: true },
      { id: 'ma11', n: 'Serrated Chains', r: 1, c: 3, req: null, hasPlus: true },
      { id: 'ma12', n: 'Titanium Chains', r: 2, c: 1, req: null, hasPlus: false },
      { id: 'ma13', n: 'Crazy Grapple', r: 2, c: 3, req: 'ma11', hasPlus: false },
      { id: 'ma14', n: 'Retiarius Net', r: 3, c: 1, req: 'ma12', hasPlus: false },
      { id: 'ma15', n: 'Master Trap Maker', r: 3, c: 2, req: null, hasPlus: true },
      { id: 'ma16', n: 'Rend Flesh', r: 4, c: 2, req: 'ma15', hasPlus: true },
      { id: 'ma17', n: 'Resilient Gladiator', r: 4, c: 3, req: 'ma13', hasPlus: false },
      { id: 'ma18', n: 'Flail Mastery', r: 5, c: 2, req: 'ma16', hasPlus: false }
    ]
  },
  plague_doctor: {
    t1: 'Plague',
    t2: 'Doctor',
    s1: [
      { id: 'pd1', n: 'Plague of Rats', r: 1, c: 1, req: null, hasPlus: true },
      { id: 'pd2', n: 'Randy the Rancid Rat', r: 1, c: 3, req: null, hasPlus: false },
      { id: 'pd3', n: 'Exploding Mice', r: 2, c: 1, req: 'pd1', hasPlus: true },
      { id: 'pd4', n: 'Miasma', r: 2, c: 2, req: null, hasPlus: true },
      { id: 'pd5', n: 'Toxic Flask', r: 3, c: 2, req: 'pd4', hasPlus: true },
      { id: 'pd6', n: 'Plague Master', r: 3, c: 3, req: 'pd2', hasPlus: false },
      { id: 'pd7', n: 'Crematus', r: 4, c: 1, req: 'pd3', hasPlus: true },
      { id: 'pd8', n: 'Crow Masks Presence', r: 4, c: 2, req: 'pd5', hasPlus: true },
      { id: 'pd9', n: 'Oops', r: 5, c: 3, req: 'pd6', hasPlus: false }
    ],
    s2: [
      { id: 'pd10', n: 'Booster Shot', r: 1, c: 2, req: null, hasPlus: true },
      { id: 'pd11', n: 'Jar of Leeches', r: 1, c: 3, req: null, hasPlus: true },
      { id: 'pd12', n: 'Blood Sustenance', r: 2, c: 1, req: null, hasPlus: false },
      { id: 'pd13', n: 'Surgical Blood Letting', r: 2, c: 3, req: 'pd11', hasPlus: false },
      { id: 'pd14', n: 'Chant of Weakness', r: 3, c: 1, req: 'pd12', hasPlus: false },
      { id: 'pd15', n: 'Lifeblood Aura', r: 3, c: 2, req: null, hasPlus: true },
      { id: 'pd16', n: 'Malpractice', r: 4, c: 2, req: 'pd15', hasPlus: true },
      { id: 'pd17', n: 'Defunct Surgeon', r: 4, c: 3, req: 'pd13', hasPlus: false },
      { id: 'pd18', n: 'Devout Doctor', r: 5, c: 2, req: 'pd16', hasPlus: false }
    ]
  },
  illusionist: {
    t1: 'Phantasm',
    t2: 'Mirror',
    s1: [
      { id: 'il1', n: 'Sands of Time', r: 1, c: 1, req: null, hasPlus: true },
      { id: 'il2', n: 'Sand Guardians', r: 1, c: 3, req: null, hasPlus: false },
      { id: 'il3', n: 'Link of Sand', r: 2, c: 1, req: 'il1', hasPlus: true },
      { id: 'il4', n: 'Piercing Sand', r: 2, c: 2, req: null, hasPlus: true },
      { id: 'il5', n: 'Dissipation', r: 3, c: 2, req: 'il4', hasPlus: true },
      { id: 'il6', n: 'Expansive Mind', r: 3, c: 3, req: 'il2', hasPlus: false },
      { id: 'il7', n: 'Gravitation Slam', r: 4, c: 1, req: 'il3', hasPlus: true },
      { id: 'il8', n: 'Circle of Guardians', r: 4, c: 2, req: 'il5', hasPlus: true },
      { id: 'il9', n: 'Split Reality', r: 5, c: 3, req: 'il6', hasPlus: false }
    ],
    s2: [
      { id: 'il10', n: 'Time Deceleration', r: 1, c: 2, req: null, hasPlus: true },
      { id: 'il11', n: 'Temporal Heroes', r: 1, c: 3, req: null, hasPlus: true },
      { id: 'il12', n: 'Age Proliferation', r: 2, c: 1, req: null, hasPlus: false },
      { id: 'il13', n: 'Call For War', r: 2, c: 3, req: 'il11', hasPlus: false },
      { id: 'il14', n: 'Combat Order', r: 3, c: 1, req: 'il12', hasPlus: false },
      { id: 'il15', n: 'Precognition', r: 3, c: 2, req: null, hasPlus: true },
      { id: 'il16', n: 'Dimensional Displacement', r: 4, c: 2, req: 'il15', hasPlus: true },
      { id: 'il17', n: 'Spirit Link', r: 4, c: 3, req: 'il13', hasPlus: false },
      { id: 'il18', n: 'Cheapshot', r: 5, c: 2, req: 'il16', hasPlus: false }
    ]
  },
  exo: {
    t1: 'Solar',
    t2: 'Lunar',
    s1: [
      { id: 'ex1', n: 'Solar Form', r: 1, c: 1, req: null, hasPlus: true },
      { id: 'ex2', n: 'Solar Flare', r: 1, c: 3, req: null, hasPlus: false },
      { id: 'ex3', n: 'Solar Burst', r: 2, c: 1, req: 'ex1', hasPlus: true },
      { id: 'ex4', n: 'Solar Dash', r: 2, c: 2, req: null, hasPlus: true },
      { id: 'ex5', n: 'Scorching Whip', r: 3, c: 2, req: 'ex4', hasPlus: true },
      { id: 'ex6', n: 'Shine Bright', r: 3, c: 3, req: 'ex2', hasPlus: false },
      { id: 'ex7', n: 'Whiplash', r: 4, c: 1, req: 'ex3', hasPlus: true },
      { id: 'ex8', n: 'Supernova', r: 4, c: 2, req: 'ex5', hasPlus: true },
      { id: 'ex9', n: 'Collision', r: 5, c: 3, req: 'ex6', hasPlus: false }
    ],
    s2: [
      { id: 'ex10', n: 'Lunar Form', r: 1, c: 2, req: null, hasPlus: true },
      { id: 'ex11', n: 'Lunar Orbit', r: 1, c: 3, req: null, hasPlus: true },
      { id: 'ex12', n: 'Moonlight', r: 2, c: 1, req: null, hasPlus: false },
      { id: 'ex13', n: 'Dark Side of the Moon', r: 2, c: 3, req: 'ex11', hasPlus: false },
      { id: 'ex14', n: 'Blood Moon', r: 3, c: 1, req: 'ex12', hasPlus: false },
      { id: 'ex15', n: 'Black Hole', r: 3, c: 2, req: null, hasPlus: true },
      { id: 'ex16', n: 'Asteroid', r: 4, c: 2, req: 'ex15', hasPlus: true },
      { id: 'ex17', n: 'Tsunami', r: 4, c: 3, req: 'ex13', hasPlus: false },
      { id: 'ex18', n: 'Blinding Light', r: 5, c: 2, req: 'ex16', hasPlus: false }
    ]
  },
  butcher: {
    t1: 'Meat',
    t2: 'Blood',
    s1: [
      { id: 'bu1', n: "Butchers Hook", r: 1, c: 1, req: null, hasPlus: true },
      { id: 'bu2', n: 'Chain Swing', r: 1, c: 3, req: null, hasPlus: false },
      { id: 'bu3', n: 'Slicing Throw', r: 2, c: 1, req: 'bu1', hasPlus: true },
      { id: 'bu4', n: 'Brutalizing Slash', r: 2, c: 2, req: null, hasPlus: true },
      { id: 'bu5', n: 'Chain Rip', r: 3, c: 2, req: 'bu4', hasPlus: true },
      { id: 'bu6', n: 'Hunger For Blood', r: 3, c: 3, req: 'bu2', hasPlus: false },
      { id: 'bu7', n: 'Insatiable Hunger', r: 4, c: 1, req: 'bu3', hasPlus: true },
      { id: 'bu8', n: 'Furious Strike', r: 4, c: 2, req: 'bu5', hasPlus: true },
      { id: 'bu9', n: 'Ending Fate', r: 5, c: 3, req: 'bu6', hasPlus: false }
    ],
    s2: [
      { id: 'bu10', n: 'Awakening Fury', r: 1, c: 2, req: null, hasPlus: true },
      { id: 'bu11', n: 'Blender', r: 1, c: 3, req: null, hasPlus: true },
      { id: 'bu12', n: 'Enraged Mania', r: 2, c: 1, req: null, hasPlus: false },
      { id: 'bu13', n: 'Fuel To Fire', r: 2, c: 3, req: 'bu11', hasPlus: false },
      { id: 'bu14', n: 'Holy Form', r: 3, c: 1, req: 'bu12', hasPlus: false },
      { id: 'bu15', n: 'Sacrilegious Scorn', r: 3, c: 2, req: null, hasPlus: true },
      { id: 'bu16', n: 'Spiritual Duality', r: 4, c: 2, req: 'bu15', hasPlus: true },
      { id: 'bu17', n: 'Submerged Knives', r: 4, c: 3, req: 'bu13', hasPlus: false },
      { id: 'bu18', n: 'Unholy Form', r: 5, c: 2, req: 'bu16', hasPlus: false }
    ]
  },
  stormweaver: {
    t1: 'Thunder',
    t2: 'Storm',
    s1: [
      { id: 'st1', n: 'Storm Bolt', r: 1, c: 1, req: null, hasPlus: true },
      { id: 'st2', n: 'Charged Bolts', r: 1, c: 3, req: null, hasPlus: false },
      { id: 'st3', n: 'Static Shock', r: 2, c: 1, req: 'st1', hasPlus: true },
      { id: 'st4', n: 'Lightning Surge', r: 2, c: 2, req: null, hasPlus: true },
      { id: 'st5', n: 'High Voltage Aura', r: 3, c: 2, req: 'st4', hasPlus: true },
      { id: 'st6', n: 'Electric Cells', r: 3, c: 3, req: 'st2', hasPlus: false },
      { id: 'st7', n: 'Chain Lightning', r: 4, c: 1, req: 'st3', hasPlus: true },
      { id: 'st8', n: 'Apocalyptic Thunder', r: 4, c: 2, req: 'st5', hasPlus: true },
      { id: 'st9', n: 'Symphony of Thunder', r: 5, c: 3, req: 'st6', hasPlus: false }
    ],
    s2: [
      { id: 'st10', n: 'Storm Cloud', r: 1, c: 2, req: null, hasPlus: true },
      { id: 'st11', n: 'Pulsing Charge', r: 1, c: 3, req: null, hasPlus: true },
      { id: 'st12', n: 'Loaded Pulse', r: 2, c: 1, req: null, hasPlus: false },
      { id: 'st13', n: 'Wave Length', r: 2, c: 3, req: 'st11', hasPlus: false },
      { id: 'st14', n: 'Manafiend', r: 3, c: 1, req: 'st12', hasPlus: false },
      { id: 'st15', n: 'Gateway', r: 3, c: 2, req: null, hasPlus: true },
      { id: 'st16', n: 'The Battery Within', r: 4, c: 2, req: 'st15', hasPlus: true },
      { id: 'st17', n: 'Hyper Charged', r: 4, c: 3, req: 'st13', hasPlus: false },
      { id: 'st18', n: 'Aftershock', r: 5, c: 2, req: 'st16', hasPlus: false }
    ]
  },
  bard: {
    t1: 'Music',
    t2: 'Metal',
    s1: [
      { id: 'bd1', n: 'Sounds of Silence', r: 1, c: 1, req: null, hasPlus: true },
      { id: 'bd2', n: 'High Db', r: 1, c: 3, req: null, hasPlus: false },
      { id: 'bd3', n: 'Insane Riff', r: 2, c: 1, req: 'bd1', hasPlus: true },
      { id: 'bd4', n: "Satan's Melody", r: 2, c: 2, req: null, hasPlus: true },
      { id: 'bd5', n: 'Craving for Attention', r: 3, c: 2, req: 'bd4', hasPlus: true },
      { id: 'bd6', n: 'Craving for Another Killing', r: 3, c: 3, req: 'bd2', hasPlus: false },
      { id: 'bd7', n: 'Crowd Pummeler', r: 4, c: 1, req: 'bd3', hasPlus: true },
      { id: 'bd8', n: 'Headbanger', r: 4, c: 2, req: 'bd5', hasPlus: true },
      { id: 'bd9', n: 'Moshpit Massacre', r: 5, c: 3, req: 'bd6', hasPlus: false }
    ],
    s2: [
      { id: 'bd10', n: 'Slaying Riffs', r: 1, c: 2, req: null, hasPlus: true },
      { id: 'bd11', n: 'Sacrilegious Symphony', r: 1, c: 3, req: null, hasPlus: true },
      { id: 'bd12', n: 'Pyro Technician', r: 2, c: 1, req: null, hasPlus: false },
      { id: 'bd13', n: 'Progenies of the Great Cataclysm', r: 2, c: 3, req: 'bd11', hasPlus: false },
      { id: 'bd14', n: 'Crowd Dive', r: 3, c: 1, req: 'bd12', hasPlus: false },
      { id: 'bd15', n: 'Bard Skill 15', r: 3, c: 2, req: null, hasPlus: true },
      { id: 'bd16', n: 'Bard Skill 16', r: 4, c: 2, req: 'bd15', hasPlus: true },
      { id: 'bd17', n: 'Bard Skill 17', r: 4, c: 3, req: 'bd13', hasPlus: false },
      { id: 'bd18', n: 'Bard Skill 18', r: 5, c: 2, req: 'bd16', hasPlus: false }
    ]
  },

  shield_lancer: {
    t1: 'Lancer',
    t2: 'Shield',
    s1: [
      { id: 'sl1', n: 'Lance Thrust', r: 1, c: 1, req: null, hasPlus: true },
      { id: 'sl2', n: 'Crushing Lance', r: 1, c: 3, req: null, hasPlus: false },
      { id: 'sl3', n: 'Lance Throw', r: 2, c: 1, req: 'sl1', hasPlus: true },
      { id: 'sl4', n: 'Glorious Strike', r: 2, c: 2, req: null, hasPlus: true },
      { id: 'sl5', n: 'Battle Charge', r: 3, c: 2, req: 'sl4', hasPlus: true },
      { id: 'sl6', n: 'Armor Crush', r: 3, c: 3, req: 'sl2', hasPlus: false },
      { id: 'sl7', n: 'Counter', r: 4, c: 1, req: 'sl3', hasPlus: true },
      { id: 'sl8', n: 'Glory', r: 4, c: 2, req: 'sl5', hasPlus: true },
      { id: 'sl9', n: 'Commending Banner', r: 5, c: 3, req: 'sl6', hasPlus: false }
    ],
    s2: [
      { id: 'sl10', n: 'Shield Slam', r: 1, c: 2, req: null, hasPlus: true },
      { id: 'sl11', n: 'Shield Wall', r: 1, c: 3, req: null, hasPlus: true },
      { id: 'sl12', n: 'Spiked Shields', r: 2, c: 1, req: null, hasPlus: false },
      { id: 'sl13', n: 'Parry', r: 2, c: 3, req: 'sl11', hasPlus: false },
      { id: 'sl14', n: 'Taunt', r: 3, c: 1, req: 'sl12', hasPlus: false },
      { id: 'sl15', n: 'Last Stand', r: 3, c: 2, req: null, hasPlus: true },
      { id: 'sl16', n: 'Honed Defenses', r: 4, c: 2, req: 'sl15', hasPlus: true },
      { id: 'sl17', n: 'Knights Resilience', r: 4, c: 3, req: 'sl13', hasPlus: false },
      { id: 'sl18', n: 'Damage Reflect', r: 5, c: 2, req: 'sl16', hasPlus: false }
    ]
  },
  jotunn: {
    t1: 'Frost',
    t2: 'Glacial',
    s1: [
      { id: 'jo1', n: 'Icicles', r: 1, c: 1, req: null, hasPlus: true },
      { id: 'jo2', n: 'Frozen Boulder', r: 1, c: 3, req: null, hasPlus: false },
      { id: 'jo3', n: 'Flash Freeze', r: 2, c: 1, req: 'jo1', hasPlus: true },
      { id: 'jo4', n: 'Freezing Leap', r: 2, c: 2, req: null, hasPlus: true },
      { id: 'jo5', n: 'Breath of Ice', r: 3, c: 2, req: 'jo4', hasPlus: true },
      { id: 'jo6', n: 'Permafrost', r: 3, c: 3, req: 'jo2', hasPlus: false },
      { id: 'jo7', n: 'Orb of Frost', r: 4, c: 1, req: 'jo3', hasPlus: true },
      { id: 'jo8', n: 'Absolute Zero', r: 4, c: 2, req: 'jo5', hasPlus: true },
      { id: 'jo9', n: 'The Embodiment of Aurgelmir', r: 5, c: 3, req: 'jo6', hasPlus: false }
    ],
    s2: [
      { id: 'jo10', n: 'Glacial Armor', r: 1, c: 2, req: null, hasPlus: true },
      { id: 'jo11', n: 'Frozen Hide', r: 1, c: 3, req: null, hasPlus: true },
      { id: 'jo12', n: 'Glacial Tremors', r: 2, c: 1, req: null, hasPlus: false },
      { id: 'jo13', n: 'Avalanche', r: 2, c: 3, req: 'jo11', hasPlus: false },
      { id: 'jo14', n: 'Sweep Freeze', r: 3, c: 1, req: 'jo12', hasPlus: false },
      { id: 'jo15', n: 'Blizzard', r: 3, c: 2, req: null, hasPlus: true },
      { id: 'jo16', n: 'Portal of Ice', r: 4, c: 2, req: 'jo15', hasPlus: true },
      { id: 'jo17', n: 'Avatar of Frost', r: 4, c: 3, req: 'jo13', hasPlus: false },
      { id: 'jo18', n: 'Power of the Ancients', r: 5, c: 2, req: 'jo16', hasPlus: false }
    ]
  },
  prophet: {
    t1: 'Forest Mystic',
    t2: 'SkinWalker',
    s1: [
      { id: 'pr1', n: 'Prophet Skill 1', r: 1, c: 1, req: null, hasPlus: true },
      { id: 'pr2', n: 'Prophet Skill 2', r: 1, c: 3, req: null, hasPlus: false },
      { id: 'pr3', n: 'Prophet Skill 3', r: 2, c: 1, req: 'pr1', hasPlus: true },
      { id: 'pr4', n: 'Prophet Skill 4', r: 2, c: 2, req: null, hasPlus: true },
      { id: 'pr5', n: 'Prophet Skill 5', r: 3, c: 2, req: 'pr4', hasPlus: true },
      { id: 'pr6', n: 'Prophet Skill 6', r: 3, c: 3, req: 'pr2', hasPlus: false },
      { id: 'pr7', n: 'Prophet Skill 7', r: 4, c: 1, req: 'pr3', hasPlus: true },
      { id: 'pr8', n: 'Prophet Skill 8', r: 4, c: 2, req: 'pr5', hasPlus: true },
      { id: 'pr9', n: 'Prophet Skill 9', r: 5, c: 3, req: 'pr6', hasPlus: false }
    ],
    s2: [
      { id: 'pr10', n: 'Prophet Skill 10', r: 1, c: 2, req: null, hasPlus: true },
      { id: 'pr11', n: 'Prophet Skill 11', r: 1, c: 3, req: null, hasPlus: true },
      { id: 'pr12', n: 'Prophet Skill 12', r: 2, c: 1, req: null, hasPlus: false },
      { id: 'pr13', n: 'Prophet Skill 13', r: 2, c: 3, req: 'pr11', hasPlus: false },
      { id: 'pr14', n: 'Prophet Skill 14', r: 3, c: 1, req: 'pr12', hasPlus: false },
      { id: 'pr15', n: 'Prophet Skill 15', r: 3, c: 2, req: null, hasPlus: true },
      { id: 'pr16', n: 'Prophet Skill 16', r: 4, c: 2, req: 'pr15', hasPlus: true },
      { id: 'pr17', n: 'Prophet Skill 17', r: 4, c: 3, req: 'pr13', hasPlus: false },
      { id: 'pr18', n: 'Prophet Skill 18', r: 5, c: 2, req: 'pr16', hasPlus: false }
    ]
  }
};

const normalizeKey = (k) => {
  return k
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_');
};

const classKeyFromName = (name) => {
  if (!name) return 'viking';
  return normalizeKey(name);
};

const classImagePath = (name, type = 'normal') => {
  const key = classKeyFromName(name);
  // Remove underscores to match file names (e.g. demon_slayer -> demonslayer)
  const imageKey = key.replace(/_/g, '');
  
  if (type === 'legacy') return `/images/${imageKey}.png`;
  return `/images/${imageKey}.webp`;
};

const HeroSkills = () => {
  const navigate = useNavigate();
  const [builderClass, setBuilderClass] = useState('Viking');
  const [mainPts, setMainPts] = useState(100);
  const [subPts, setSubPts] = useState(20);
  const [spent, setSpent] = useState({});
  const [sSpent, setSSpent] = useState({});
  const iconCacheRef = useRef({});
  const sectionsCacheRef = useRef({});

  // Navbar state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDbOpen, setIsDbOpen] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const dbMenuRef = useRef(null);
  const builderMenuRef = useRef(null);

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dbMenuRef.current && !dbMenuRef.current.contains(event.target)) {
        setIsDbOpen(false);
      }
      if (builderMenuRef.current && !builderMenuRef.current.contains(event.target)) {
        setIsBuilderOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const ensureIconCacheFor = async (className) => {
    const clsKey = classKeyFromName(className);
    if (iconCacheRef.current[clsKey]) return;

    try {
      const docRef = doc(db, 'classes', clsKey.replace(/_/g, '-'));
      const snap = await getDoc(docRef);
      const cache2 = { ...iconCacheRef.current };
      const secCache = { ...sectionsCacheRef.current };

      if (snap.exists()) {
        const d = snap.data();
        const map = {};
        const sectionsMap = {};

        // Helper to extract icons
        const extract = (html) => {
          if (!html) return;
          const regex = /<img[^>]+src="([^"]+)"[^>]+alt="([^"]+)"/g;
          let m;
          while ((m = regex.exec(html)) !== null) {
            const url = m[1];
            const alt = m[2];
            const clean = alt
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/\s+/g, ' ')
              .trim();
            map[clean] = url;
          }
        };

        (d.especializacoes || []).forEach((s) => {
          extract(s.html);
          if (s.title && s.html) {
             const parser = new DOMParser();
             const doc = parser.parseFromString(s.html, 'text/html');
             const skillNames = Array.from(doc.querySelectorAll('h3, strong, b'))
                .map(el => el.textContent.trim())
                .filter(t => t.length > 2 && !t.includes(':') && !t.includes('+'));
             
             if (skillNames.length > 0) {
                sectionsMap[normalizeKey(s.title)] = skillNames;
             }
          }
        });
        (d.extra_info || []).forEach((s) => extract(s.html));

        cache2[clsKey] = map;
        secCache[clsKey] = sectionsMap;
      } else {
        cache2[clsKey] = {}; 
      }
      iconCacheRef.current = cache2;
      sectionsCacheRef.current = secCache;
    } catch (e) {
      console.error('Erro carregando cache de ícones', e);
    }
  };

  const openSub = (e, id, name) => {
    e.stopPropagation();
    const base = spent[id] || 0;
    if (base === 0) {
      alert('Ative a skill com pelo menos 1 ponto antes!');
      return;
    }
    const ov = document.getElementById('overlay');
    const sw = document.getElementById('sub-window');
    const st = document.getElementById('sub-title');
    const sc = document.getElementById('sub-content');
    
    if (!ov || !sw || !st || !sc) return;
    
    ov.style.display = 'block';
    sw.style.display = 'block';
    st.innerText = 'Sub-skills: ' + name;
    sc.innerHTML = '';

    [1, 2, 3].forEach((i) => {
      const sid = id + '_s' + i;
      const slvl = sSpent[sid] || 0;

      const item = document.createElement('div');
      item.className = 'hs-sub-skill-card';
      
      const span = document.createElement('span');
      span.textContent = 'Talento ' + i;
      
      const bold = document.createElement('b');
      bold.textContent = `${slvl}/5`;
      
      item.appendChild(span);
      item.appendChild(bold);

      item.onmousedown = (ev) => {
        if (ev.button === 0 && subPts > 0 && slvl < 5) {
          setSSpent(prev => ({ ...prev, [sid]: (prev[sid] || 0) + 1 }));
          setSubPts(prev => prev - 1);
        } else if (ev.button === 2 && slvl > 0) {
          setSSpent(prev => ({ ...prev, [sid]: (prev[sid] || 0) - 1 }));
          setSubPts(prev => prev + 1);
        }
      };
      
      sc.appendChild(item);
    });
  };

  const renderTree = (skills, gridId) => {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = '';

    if (!skills || skills.length === 0) {
      grid.innerHTML =
        '<div style="grid-column: 1 / span 3; text-align: center; color: #9ca3af; margin-top: 40px; font-size: 12px;">Aguardando preenchimento manual das skills...</div>';
      return;
    }

    const cache = iconCacheRef.current || {};
    const clsKey = classKeyFromName(builderClass);
    const iconMap = cache[clsKey] || {};

    skills.forEach(sk => {
      const iconCandidates = [];
      const raw = (sk.n || '').trim();

      let filePrefix = clsKey
        .split('_')
        .map(p => p.charAt(0).toUpperCase() + p.slice(1))
        .join('_');
      
      if (clsKey === 'jotunn') {
        filePrefix = 'Jötunn';
      }
      
      const baseForLocal = raw.replace(/['’!]/g, '').replace(/\s+/g, '_');
      
      // Ajuste para usar PUBLIC_URL e garantir caminho correto para Jotunn
      if (clsKey === 'jotunn') {
         iconCandidates.push(`${process.env.PUBLIC_URL || ''}/images/jotunn/${filePrefix}_${baseForLocal}.png`);
      } else {
         iconCandidates.push(`${process.env.PUBLIC_URL || ''}/images/${clsKey}/${filePrefix}_${baseForLocal}.png`);
      }

      const base = raw.replace(/\s+/g, '_').replace(/'/g, '%27');
      const nameKey = raw
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (iconMap[nameKey]) {
        iconCandidates.push(iconMap[nameKey]);
      }
      
      let cls = builderClass
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '_');
        
      if (cls.toLowerCase() === 'bard') cls = 'Monk';
      if (cls.toLowerCase() === 'jötunn' || cls.toLowerCase() === 'jotunn') cls = 'Jotunn';

      iconCandidates.push(`https://herosiege.wiki.gg/images/${cls}_${base}.png`);
      iconCandidates.push(`https://herosiege.wiki.gg/images/Icon_${cls}_${base}.png`);
      iconCandidates.push(`https://herosiege.wiki.gg/images/${cls}_${base}.jpg`);
      iconCandidates.push(`https://herosiege.wiki.gg/images/Icon_${cls}_${base}.jpg`);
      
      const vikingName = 'Viking_' + raw.replace(/['’!]/g, '').replace(/\s+/g, '_');
      iconCandidates.push(`https://herosiege.wiki.gg/images/${vikingName}.png`);
      iconCandidates.push(`https://herosiege.wiki.gg/images/${base}.png`);
      iconCandidates.push(`https://herosiege.wiki.gg/images/Icon_${base}.png`);
      iconCandidates.push(`https://herosiege.wiki.gg/images/${base}.jpg`);
      iconCandidates.push(`https://herosiege.wiki.gg/images/Icon_${base}.jpg`);
      iconCandidates.push(`/images/herosiege.png`);

      const pts = spent[sk.id] || 0;
      const locked = sk.req && (spent[sk.req] || 0) === 0;

      const div = document.createElement('div');
      div.className = `skill${locked ? ' locked' : ''}${pts > 0 ? ' has-points' : ''}`;
      div.style.gridRow = String(sk.r);
      div.style.gridColumn = String(sk.c);

      const img = document.createElement('img');
      img.dataset.idx = '0';
      img.src = iconCandidates[0];
      img.onerror = () => {
        const i = Number(img.dataset.idx || '0') + 1;
        if (i < iconCandidates.length) {
          img.dataset.idx = String(i);
          img.src = iconCandidates[i];
        } else {
          img.remove();
        }
      };

      const nameDiv = document.createElement('div');
      nameDiv.className = 'name-label';
      nameDiv.textContent = sk.n;

      const lvl = document.createElement('div');
      lvl.className = 'lvl-badge';
      lvl.textContent = `${pts}/20`;

      div.appendChild(img);
      div.appendChild(nameDiv);
      div.appendChild(lvl);

      if (sk.hasPlus) {
        const plus = document.createElement('button');
        plus.className = `plus-btn${pts > 0 ? ' active-plus' : ''}`;
        plus.textContent = '+';
        plus.addEventListener('click', (e) => {
          e.stopPropagation();
          openSub(e, sk.id, sk.n);
        });
        div.appendChild(plus);
      }

      div.onmousedown = (e) => {
        if (locked) return;
        if (e.button === 0 && mainPts > 0 && pts < 20) {
          setSpent(prev => ({ ...prev, [sk.id]: (prev[sk.id] || 0) + 1 }));
          setMainPts(prev => prev - 1);
        } else if (e.button === 2 && pts > 0) {
          setSpent(prev => ({ ...prev, [sk.id]: (prev[sk.id] || 0) - 1 }));
          setMainPts(prev => prev + 1);
        }
      };

      grid.appendChild(div);
    });
  };

  const update = () => {
    const key = classKeyFromName(builderClass);
    const data = builderDb[key] || builderDb.viking;

    ensureIconCacheFor(builderClass).then(() => {
      const again = classKeyFromName(builderClass);
      if (again !== key) return;

      if (!data.s2 || data.s2.length <= 1) {
        const clsKey = classKeyFromName(builderClass);
        const per = (sectionsCacheRef.current && sectionsCacheRef.current[clsKey]) || null;
        if (per) {
          const secKey = normalizeKey(data.t2 || '');
          const names = per[secKey];
          if (names && names.length) {
            const gen = names.slice(0, 9).map((titleRaw, idx) => {
              const r = Math.floor(idx / 3) + 1;
              const c = (idx % 3) + 1;
              return {
                id: `pd${10 + idx}`,
                n: String(titleRaw).trim(),
                r, c,
                req: null,
                hasPlus: false
              };
            });
            data.s2 = gen;
          }
        }
      }

      const t1 = document.getElementById('tree-title-1');
      const t2 = document.getElementById('tree-title-2');
      if (t1 && data.t1) t1.textContent = data.t1;
      if (t2 && data.t2) t2.textContent = data.t2;
      renderTree(data.s1, 'grid-berserker');
      renderTree(data.s2, 'grid-shield');
    });
  };

    update();
  }, [builderClass, spent, sSpent, mainPts, subPts]);

  useEffect(() => {
    const handleContextMenu = (e) => {
        if (e.target.closest('.grid') || e.target.closest('.hs-sub-skill-card')) {
            e.preventDefault();
        }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  return (
    <div className="hs-wrapper bg-[#0f111a] min-h-screen text-gray-200 font-sans selection:bg-orange-500/30 flex flex-col">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-[#0b0d14]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img
              src="/images/herosiege.png"
              alt="Hero Siege Brasil"
              className="block h-8 sm:h-9 w-auto"
              style={{ imageRendering: 'auto' }}
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded border border-white/20 text-gray-200 hover:bg-white/10"
              onClick={() => setMobileMenuOpen((v) => !v)}
            >
              <span className="sr-only">Abrir menu</span>
              <span className="flex flex-col gap-[3px]">
                <span className="block w-5 h-[2px] bg-current" />
                <span className="block w-5 h-[2px] bg-current" />
                <span className="block w-5 h-[2px] bg-current" />
              </span>
            </button>
            <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-gray-400">
              <button
                onClick={() => navigate('/')}
                className={`transition-colors hover:text-white`}
              >
                Home
              </button>
              <div
                className="relative"
                ref={dbMenuRef}
                onMouseEnter={() => setIsDbOpen(true)}
                onMouseLeave={() => setIsDbOpen(false)}
              >
                <button
                    type="button"
                    onClick={() => setIsDbOpen((v) => !v)}
                    className={`transition-colors ${isDbOpen ? 'text-orange-500' : 'hover:text-white'}`}
                  >
                    DataBase
                  </button>
                <div
                  className={`absolute left-0 top-full w-44 bg-[#0b0d14] border border-white/10 rounded shadow-xl py-2 ${
                    isDbOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                  } transition`}
                >
                  <button onClick={() => { navigate('/classes'); setIsDbOpen(false); }} className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5">Classes</button>
                  <button onClick={() => { navigate('/items'); setIsDbOpen(false); }} className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5">Items</button>
                  <button onClick={() => { navigate('/runes'); setIsDbOpen(false); }} className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5">Runas</button>
                  <button onClick={() => { navigate('/relics'); setIsDbOpen(false); }} className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5">Relíquias</button>
                  <button onClick={() => { navigate('/chaos-tower'); setIsDbOpen(false); }} className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5">Chaos Tower</button>
                  <button onClick={() => { navigate('/mercenarios'); setIsDbOpen(false); }} className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5">Mercenários</button>
                  <button onClick={() => { navigate('/chaves'); setIsDbOpen(false); }} className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5">Chaves</button>
                  <button onClick={() => { navigate('/augments'); setIsDbOpen(false); }} className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5">Augments</button>
                  <button onClick={() => { navigate('/quests'); setIsDbOpen(false); }} className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5">Quests</button>
                  <button onClick={() => { navigate('/mineracao'); setIsDbOpen(false); }} className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5">Mineração</button>
                  <button onClick={() => { navigate('/gems'); setIsDbOpen(false); }} className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5">Gemas e Jóias</button>
                  <button onClick={() => { navigate('/charms'); setIsDbOpen(false); }} className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5">Charms</button>
                </div>
              </div>
              <button
                onClick={() => navigate('/blog')}
                className={`transition-colors hover:text-white`}
              >
                Blog
              </button>
              <div
                className="relative"
                ref={builderMenuRef}
                onMouseEnter={() => setIsBuilderOpen(true)}
                onMouseLeave={() => setIsBuilderOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setIsBuilderOpen((v) => !v)}
                  className={`transition-colors ${isBuilderOpen ? 'text-orange-500' : 'text-orange-500'}`}
                >
                  Builder
                </button>
                <div
                  className={`absolute left-0 top-full w-44 bg-[#0b0d14] border border-white/10 rounded shadow-xl py-2 ${
                    isBuilderOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                  } transition`}
                >
                  <button
                    onClick={() => {
                      navigate('/forum');
                      setIsBuilderOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5"
                  >
                    Forum
                  </button>
                  <button
                    onClick={() => {
                      navigate('/hero-skills');
                      setIsBuilderOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest text-orange-500 hover:bg-white/5"
                  >
                    Hero Skills
                  </button>
                  <button
                    onClick={() => {
                      navigate('/hero-level-tree');
                      setIsBuilderOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5"
                  >
                    Hero Level Tree
                  </button>
                  <button
                    onClick={() => {
                      navigate('/ether');
                      setIsBuilderOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 flex items-center justify-between"
                  >
                    <span>Ether</span>
                    <span className="text-[9px] bg-gradient-to-r from-green-400 to-emerald-600 text-black px-1.5 py-0.5 rounded-sm font-black ml-2 leading-none shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse">S9</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/incarnation');
                      setIsBuilderOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 flex items-center justify-between"
                  >
                    <span>Incarnation</span>
                    <span className="text-[9px] bg-gradient-to-r from-green-400 to-emerald-600 text-black px-1.5 py-0.5 rounded-sm font-black ml-2 leading-none shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse">S9</span>
                  </button>
                </div>
              </div>
              <button
                onClick={() => navigate('/equipe')}
                className={`transition-colors hover:text-white`}
              >
                Equipe
              </button>
              <button
                onClick={() => navigate('/contato')}
                className={`transition-colors hover:text-white`}
              >
                Contatos
              </button>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0b0d14]">
            <div className="max-w-7xl mx-auto px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-300 space-y-1">
              <button className="block w-full text-left py-1" onClick={() => { navigate('/'); setMobileMenuOpen(false); }}>Home</button>
              <button className="block w-full text-left py-1" onClick={() => { navigate('/classes'); setMobileMenuOpen(false); }}>Classes</button>
              <button className="block w-full text-left py-1" onClick={() => { navigate('/items'); setMobileMenuOpen(false); }}>Items</button>
              <button className="block w-full text-left py-1" onClick={() => { navigate('/runes'); setMobileMenuOpen(false); }}>Runas</button>
              <button className="block w-full text-left py-1" onClick={() => { navigate('/relics'); setMobileMenuOpen(false); }}>Relíquias</button>
              <button className="block w-full text-left py-1" onClick={() => { navigate('/chaos-tower'); setMobileMenuOpen(false); }}>Chaos Tower</button>
              <button className="block w-full text-left py-1" onClick={() => { navigate('/mercenarios'); setMobileMenuOpen(false); }}>Mercenários</button>
              <button className="block w-full text-left py-1" onClick={() => { navigate('/chaves'); setMobileMenuOpen(false); }}>Chaves</button>
              <button className="block w-full text-left py-1" onClick={() => { navigate('/augments'); setMobileMenuOpen(false); }}>Augments</button>
              <button className="block w-full text-left py-1" onClick={() => { navigate('/quests'); setMobileMenuOpen(false); }}>Quests</button>
              <button className="block w-full text-left py-1" onClick={() => { navigate('/mineracao'); setMobileMenuOpen(false); }}>Mineração</button>
              <button className="block w-full text-left py-1" onClick={() => { navigate('/gems'); setMobileMenuOpen(false); }}>Gemas e Jóias</button>
              <button className="block w-full text-left py-1" onClick={() => { navigate('/charms'); setMobileMenuOpen(false); }}>Charms</button>
              <div className="border-t border-white/10 my-1 pt-1"></div>
              <button className="block w-full text-left py-1" onClick={() => { navigate('/blog'); setMobileMenuOpen(false); }}>Blog</button>
              <button className="block w-full text-left py-1" onClick={() => { navigate('/forum'); setMobileMenuOpen(false); }}>Forum</button>
              <button className="block w-full text-left py-1 text-orange-500" onClick={() => { navigate('/hero-skills'); setMobileMenuOpen(false); }}>Hero Skills</button>
              <button className="block w-full text-left py-1" onClick={() => { navigate('/hero-level-tree'); setMobileMenuOpen(false); }}>Hero Level Tree</button>
              <button className="block w-full text-left py-1 flex items-center justify-between" onClick={() => { navigate('/ether'); setMobileMenuOpen(false); }}>
                <span>Ether</span>
                <span className="text-[9px] bg-gradient-to-r from-green-400 to-emerald-600 text-black px-1.5 py-0.5 rounded-sm font-black leading-none shadow-[0_0_8px_rgba(52,211,153,0.5)]">S9</span>
              </button>
              <button className="block w-full text-left py-1 flex items-center justify-between" onClick={() => { navigate('/incarnation'); setMobileMenuOpen(false); }}>
                <span>Incarnation</span>
                <span className="text-[9px] bg-gradient-to-r from-green-400 to-emerald-600 text-black px-1.5 py-0.5 rounded-sm font-black leading-none shadow-[0_0_8px_rgba(52,211,153,0.5)]">S9</span>
              </button>
              <button className="block w-full text-left py-1" onClick={() => { navigate('/equipe'); setMobileMenuOpen(false); }}>Equipe</button>
              <button className="block w-full text-left py-1" onClick={() => { navigate('/contato'); setMobileMenuOpen(false); }}>Contatos</button>
            </div>
          </div>
        )}
      </nav>

      <div className="flex-1 max-w-7xl mx-auto w-full p-6">
        <div className="class-menu">
          <span className="class-menu-title">Classes</span>
          <div className="class-menu-grid">
            {CLASS_DATA.map((c) => {
              const src = classImagePath(c.name);
              const selected = builderClass === c.name;
              return (
                <button
                  key={c.name}
                  type="button"
                  title={c.name}
                  className={`class-icon${selected ? ' selected' : ''}`}
                  onClick={() => setBuilderClass(c.name)}
                >
                  <img
                    src={src}
                    onError={(e) => { const t = e.currentTarget; if (!t.dataset.fallback) { t.dataset.fallback = '1'; t.src = classImagePath(c.name, 'legacy'); } }}
                    alt={c.name}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="dashboard">
          <div className="stat-box">
            <label>Level</label>
            <span>{builderClass ? '100' : '100'}</span>
          </div>
          <div className="stat-box">
            <label>Main Points</label>
            <span id="main-pts">{mainPts}</span>
          </div>
          <div className="stat-box">
            <label>Sub-Skill Points</label>
            <span id="sub-pts">{subPts}</span>
          </div>
        </div>

        <div className="tree-wrapper">
          <div className="specialization-box">
            <h3 id="tree-title-1">{builderDb[classKeyFromName(builderClass)]?.t1 || 'Tree 1'}</h3>
            <div className="grid" id="grid-berserker"></div>
          </div>
          <div className="specialization-box">
            <h3 id="tree-title-2">{builderDb[classKeyFromName(builderClass)]?.t2 || 'Tree 2'}</h3>
            <div className="grid" id="grid-shield"></div>
          </div>
        </div>

        <div className="hs-overlay" id="overlay" />
        <div className="hs-sub-window" id="sub-window">
          <h3 id="sub-title">Sub-skills</h3>
          <div id="sub-content"></div>
          <button className="hs-back-btn" onClick={() => {
            const sub = document.getElementById('sub-window');
            const ov = document.getElementById('overlay');
            if (sub) sub.style.display = 'none';
            if (ov) ov.style.display = 'none';
          }}>Voltar</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HeroSkills;
