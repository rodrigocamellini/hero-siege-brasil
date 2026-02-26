import React, { useState } from 'react';

export const CHARM_DB = [
  {
    name: "Crow's Feather",
    size: [1, 1],
    rarity: 'SATANIC',
    file: 'charms/Charms_Crows_Feather.png',
    tier: 'D',
    level: '1',
    stats: [
      '+15% Velocidade de Movimento aumentada',
      '+5 em Todos os Atributos',
      '+5% em Todas as Resistências'
    ]
  },
  {
    name: "Viking's Glyphed Rune",
    size: [1, 1],
    rarity: 'SATANIC',
    file: 'charms/Charms_Vikings_Glyphed_Rune.png',
    tier: 'S',
    level: '60',
    stats: [
      '+[25-50]% Dano Aumentado',
      'Dano de Ataque aumentado em [15-35]%',
      'Dano Físico Recebido reduzido em value1%'
    ]
  },
  {
    name: 'Beetle of Life',
    size: [1, 1],
    rarity: 'SATANIC',
    file: 'charms/Charms_Beetle_of_Life.png',
    tier: 'S',
    level: '60',
    stats: [
      '+[10-15] em Vitalidade',
      'Regenera Vida 8%',
      '+[45-70] de Vida',
      '+[5-10] de Vida após cada Abate',
      'Vida aumentada em [5-10]%'
    ]
  },
  {
    name: 'Aztec Coin',
    size: [1, 1],
    rarity: 'SATANIC',
    file: 'charms/Charms_Aztec_Coin.png',
    tier: 'S',
    level: '61',
    stats: [
      '+[1-3] ao Alcance de Luz',
      '+[30-50]% em Resistência a Veneno',
      '+[3-5]% ao Máximo de Resistência a Veneno',
      '+[5-10]% Ouro Extra obtido de Abates',
      'Duração de Veneno reduzida em 25%'
    ]
  },
  {
    name: "Raider's Torch",
    size: [1, 1],
    rarity: 'SATANIC',
    file: 'charms/Charms_Raiders_Torch.png',
    tier: 'S',
    level: '61',
    stats: [
      '+[10-25]% Velocidade de Ataque aumentada',
      'Dano de Ataque aumentado em [8-20]%',
      '+[3-5] ao Alcance de Luz'
    ]
  },
  {
    name: "Satan's Chalice",
    size: [1, 1],
    rarity: 'SATANIC',
    file: 'charms/Charms_Satans_Chalice.png',
    tier: 'S',
    level: '62',
    stats: [
      '+[1-3] em Habilidades de Fogo',
      '+[5-15] em Todos os Atributos',
      '+[15-45]% em Resistência a Fogo'
    ]
  },
  {
    name: 'Moonshard',
    size: [1, 1],
    rarity: 'SATANIC',
    file: 'charms/Charms_Moonshard.png',
    tier: 'S',
    level: '63',
    stats: [
      '-[15-35]% à Resistência Arcana do Inimigo',
      '-75% à Resistência Arcana'
    ]
  },
  {
    name: "Adventurer's Quiver",
    size: [1, 1],
    rarity: 'SATANIC',
    file: 'charms/Charms_Adventurers_Quiver.png',
    tier: 'S',
    level: '64',
    stats: [
      'Alcance de Ataque aumentado em [10-20]%',
      '+[15-30]% Velocidade de Ataque aumentada'
    ]
  },
  {
    name: 'Eye of Skadi',
    size: [1, 1],
    rarity: 'SATANIC',
    file: 'charms/Charms_Eye_of_Skadi.png',
    tier: 'S',
    level: '65',
    stats: [
      '-[15-35]% à Resistência a Gelo do Inimigo',
      '-75% à Resistência a Gelo'
    ]
  },
  {
    name: 'Wind Token',
    size: [1, 1],
    rarity: 'SATANIC',
    file: 'charms/Charms_Wind_Token.png',
    tier: 'S',
    level: '65',
    stats: [
      '-[15-35]% à Resistência a Raios do Inimigo',
      '-75% à Resistência a Raios'
    ]
  },
  {
    name: 'Apple of Evolution',
    size: [1, 1],
    rarity: 'SATANIC',
    file: 'charms/Charms_Apple_of_Evolution.png',
    tier: 'S',
    level: '65',
    stats: [
      '-[15-35]% à Resistência a Veneno do Inimigo',
      '-75% à Resistência a Veneno'
    ]
  },
  {
    name: 'Witches Claw',
    size: [1, 2],
    rarity: 'SATANIC',
    file: 'charms/Charms_Witches_Claw.png',
    tier: 'S',
    level: '65',
    stats: [
      '+1 em Todas as Habilidades',
      '+[3-6]% de Mana roubada por Acerto',
      '+[13-20] de Mana após cada Abate'
    ]
  },
  {
    name: 'Solar Charm',
    size: [1, 1],
    rarity: 'SATANIC',
    file: 'charms/Charms_Solar_Charm.png',
    tier: 'S',
    level: '67',
    stats: [
      '-[15-35]% à Resistência a Fogo do Inimigo',
      '-75% à Resistência a Fogo'
    ]
  },
  {
    name: 'Bag of Unknown Riches',
    size: [1, 1],
    rarity: 'SATANIC',
    file: 'charms/Charms_Bag_of_Unknown_Riches.png',
    tier: 'S',
    level: '68',
    stats: [
      '+[8-15]% Ouro Extra obtido de Abates',
      '+[25-40]% Chance de Drop Mágico aumentada',
      '+[1-5]% Experiência obtida aumentada',
      '+[1-5]% Preços de Mercador reduzidos'
    ]
  },
  {
    name: 'Annihilator',
    size: [1, 1],
    rarity: 'SATANIC',
    file: 'charms/Charms_Annihilator.png',
    tier: 'SS',
    level: '72',
    stats: [
      '+1 em Todas as Habilidades',
      '+[20-35] em Todos os Atributos',
      '+[25-40]% em Todas as Resistências',
      '+[5-10]% Experiência obtida aumentada'
    ]
  },
  {
    name: 'Spine Trophy',
    size: [1, 1],
    rarity: 'SATANIC',
    file: 'charms/Charms_Spine_Trophy.png',
    tier: 'S',
    level: '74',
    stats: [
      '+[1-3] em Habilidades Físicas',
      '+8% de Chance de Golpe Mortal',
      '+[4-8]% Taxa de Acerto aumentada',
      '+[8-15] em Destreza'
    ]
  },
  {
    name: "Jack's Pumpkin Spice",
    size: [1, 1],
    rarity: 'SATANIC',
    file: 'charms/Charms_Jacks_Pumpkin_Spice.png',
    tier: 'S',
    level: '75',
    stats: [
      '+[15-30] em Vitalidade',
      'Área de efeito das Explosões aumentada em [5-10]%',
      '+[10-20] de Vida após cada Abate'
    ]
  },
  {
    name: 'Mark of the Black Knight',
    size: [1, 1],
    rarity: 'SATANIC',
    file: 'charms/Charms_Mark_of_the_Black_Knight.png',
    tier: 'S',
    level: '77',
    stats: [
      '+[8-20]% de Chance de Golpe Mortal',
      '+[8-15]% de Chance de Golpe Esmagador',
      '+[4-8]% de Vida roubada por Acerto'
    ]
  },
  {
    name: "Cold Giant's Charm",
    size: [1, 1],
    rarity: 'SATANIC',
    file: 'charms/Charms_Cold_Giants_Charm.png',
    tier: 'S',
    level: '77',
    stats: [
      'Dano de Habilidades de Gelo aumentado em [7-20]%',
      '-[3-10]% à Resistência a Gelo do Inimigo'
    ]
  },
  {
    name: 'Hardened Steel Defender',
    size: [1, 1],
    rarity: 'SATANIC',
    file: 'charms/Charms_Hardened_Steel_Defender.png',
    tier: 'S',
    level: '81',
    stats: [
      '+[25-40] de Armadura',
      'Vida aumentada em [10-15]%'
    ]
  },
  {
    name: 'Shrunken Head',
    size: [1, 1],
    rarity: 'SATANIC',
    file: 'charms/Charms_Shrunken_Head.png',
    tier: 'S',
    level: '83',
    stats: [
      '+[7-20] de Dano de Habilidades de Veneno',
      '-[3-10]% à Resistência a Veneno do Inimigo'
    ]
  },
  {
    name: "Anubis' Ankh Charm",
    size: [2, 3],
    rarity: 'SATANIC',
    file: 'charms/Charms_Anubis_Ankh_Charm.png',
    tier: 'S',
    level: '87',
    stats: [
      'Regenera Vida [15-35]%',
      '+[330-380] de Vida',
      'Vida aumentada em [7-15]%'
    ]
  },
  {
    name: 'Plague Shot',
    size: [2, 1],
    rarity: 'SATANIC',
    file: 'charms/Charms_Plague_Shot.png',
    tier: 'SS',
    level: '92',
    stats: ['+[4-12] em [Booster Shot]']
  },
  {
    name: "Sassy's Dislocated Foot",
    size: [1, 3],
    rarity: 'SATANIC',
    file: 'charms/Charms_Sassys_Dislocated_Foot.png',
    tier: 'SS',
    level: '100',
    stats: [
      '+1 em Todas as Habilidades',
      '+[3-5] em Habilidades de Veneno',
      '+[6-20] em [Poison Nova]',
      '-20% Velocidade de Movimento aumentada',
      '-[5-10]% à Resistência a Veneno do Inimigo',
      'Duração de Veneno reduzida em 50%'
    ]
  },
  {
    name: 'Hello its me, Steve!',
    size: [2, 2],
    rarity: 'SET',
    file: 'charms/Charms_Hello_its_me%2C_Steve%21.png',
    tier: 'S',
    level: '56',
    stats: ['+[12-25] em Todos os Atributos']
  },
  {
    name: 'Barrel of Explosives',
    size: [2, 2],
    rarity: 'SET',
    file: 'charms/Charms_Barrel_of_Explosives.png',
    tier: 'SS',
    level: '57',
    stats: ['Dano de Explosão aumentado em [15-40]%']
  },
  {
    name: 'The Detonator',
    size: [1, 2],
    rarity: 'SET',
    file: 'charms/Charms_The_Detonator.png',
    tier: 'SS',
    level: '58',
    stats: ['+[3-8] em Habilidades de Explosão']
  },
  {
    name: "Death Lord's Zombie Head",
    size: [1, 1],
    rarity: 'SET',
    file: 'charms/Charms_Death_Lords_Zombie_Head.png',
    tier: 'S',
    level: '62',
    stats: ['+[1-3] em Habilidade Aleatória']
  },
  {
    name: 'Heart of Agony',
    size: [1, 1],
    rarity: 'SET',
    file: 'charms/Charms_Heart_of_Agony.png',
    tier: 'S',
    level: '64',
    stats: ['+[1-3] em Habilidade Aleatória']
  },
  {
    name: "Redneck's Keychain",
    size: [1, 1],
    rarity: 'SET',
    file: 'charms/Charms_Rednecks_Keychain.png',
    tier: 'S',
    level: '65',
    stats: ['+[1-3] em Habilidade Aleatória']
  },
  {
    name: 'Aztec Devil',
    size: [1, 1],
    rarity: 'SET',
    file: 'charms/Charms_Aztec_Devil.png',
    tier: 'S',
    level: '65',
    stats: ['+[1-3] em Habilidade Aleatória']
  },
  {
    name: "Damien's Cage",
    size: [2, 2],
    rarity: 'SET',
    file: 'charms/Charms_Damiens_Cage.png',
    tier: 'S',
    level: '65',
    stats: [
      '+[1-3] em Habilidades Arcanas',
      '+[10-35] em Inteligência',
      '+[20-45]% em Resistência Arcana'
    ]
  },
  {
    name: "Marksman's Quiver",
    size: [1, 1],
    rarity: 'SET',
    file: 'charms/Charms_Marksmans_Quiver.png',
    tier: 'S',
    level: '66',
    stats: ['+[1-3] em Habilidade Aleatória']
  },
  {
    name: "Doctor's Mask in a Jar",
    size: [1, 1],
    rarity: 'SET',
    file: 'charms/Charms_Doctors_Mask_in_a_Jar.png',
    tier: 'S',
    level: '67',
    stats: ['+[1-3] em Habilidade Aleatória']
  },
  {
    name: "Pirate Captain's Flag",
    size: [2, 2],
    rarity: 'SET',
    file: 'charms/Charms_Pirate_Captains_Flag.png',
    tier: 'S',
    level: '68',
    stats: ['+[1-3] em Habilidade Aleatória']
  },
  {
    name: 'Sacred Owl',
    size: [1, 3],
    rarity: 'SET',
    file: 'charms/Charms_Sacred_Owl.png',
    tier: 'S',
    level: '68',
    stats: ['+[1-3] em Habilidade Aleatória']
  },
  {
    name: 'Flaming Coin',
    size: [1, 1],
    rarity: 'SET',
    file: 'charms/Charms_Flaming_Coin.png',
    tier: 'S',
    level: '69',
    stats: ['+[1-3] to Random Skill']
  },
  {
    name: "Plunderer's Gunpowder Bag",
    size: [1, 1],
    rarity: 'SET',
    file: 'charms/Charms_Plunderers_Gunpowder_Bag.png',
    tier: 'S',
    level: '72',
    stats: ['+[1-3] to Random Skill']
  },
  {
    name: "Champion's Signet",
    size: [1, 1],
    rarity: 'SET',
    file: 'charms/Charms_Champions_Signet.png',
    tier: 'S',
    level: '73',
    stats: ['+[1-3] to Random Skill']
  },
  {
    name: "Bone Conjurer's Trophy",
    size: [1, 1],
    rarity: 'SET',
    file: 'charms/Charms_Bone_Conjurers_Trophy.png',
    tier: 'S',
    level: '74',
    stats: ['+[1-3] to Random Skill']
  },
  {
    name: "Zealot's Beads of Destruction",
    size: [1, 1],
    rarity: 'SET',
    file: 'charms/Charms_Zealots_Beads_of_Destruction.png',
    tier: 'S',
    level: '76',
    stats: ['+[1-3] to Random Skill']
  },
  {
    name: "Sheep King's Wool",
    size: [1, 1],
    rarity: 'SET',
    file: 'charms/Charms_Sheep_Kings_Wool.png',
    tier: 'S',
    level: '77',
    stats: [
      '+[8-15] em Todos os Atributos',
      'Dano de Habilidades Mágicas aumentado em [5-10]%'
    ]
  },
  {
    name: "Engineer's Mini Drone",
    size: [1, 1],
    rarity: 'SET',
    file: 'charms/Charms_Engineers_Mini_Drone.png',
    tier: 'S',
    level: '78',
    stats: ['+[1-3] em Habilidade Aleatória']
  },
  {
    name: "Abomination's Eye",
    size: [1, 1],
    rarity: 'SET',
    file: 'charms/Charms_Abominations_Eye.png',
    tier: 'SS',
    level: '78',
    stats: [
      '+[15-30]% em Resistências dos Lacaios',
      '+[5-10]% Dano recebido por Lacaios reduzido'
    ]
  },
  {
    name: "Abomination's Brain",
    size: [1, 1],
    rarity: 'SET',
    file: 'charms/Charms_Abominations_Brain.png',
    tier: 'SS',
    level: '84',
    stats: [
      '+[10-20]% Velocidade de Ataque dos Lacaios aumentada',
      '+[10-25]% Velocidade de Movimento dos Lacaios aumentada'
    ]
  },
  {
    name: 'Canopic Jar of Blood',
    size: [1, 2],
    rarity: 'SET',
    file: 'charms/Charms_Canopic_Jar_of_Blood.png',
    tier: 'S',
    level: '85',
    stats: [
      'Regenera Vida [8-15]%',
      'Vida aumentada em [3-6]%'
    ]
  },
  {
    name: "Traveler's Map Journal",
    size: [2, 1],
    rarity: 'SET',
    file: 'charms/Charms_Travelers_Map_Journal.png',
    tier: 'S',
    level: '89',
    stats: [
      '+[10-20]% Velocidade de Movimento aumentada',
      '+[4-8] em Todos os Atributos',
      '+[5-10]% em Todas as Resistências'
    ]
  },
  {
    name: 'Sundial of Ancient Worlds',
    size: [1, 1],
    rarity: 'SET',
    file: 'charms/Charms_Sundial_of_Ancient_Worlds.png',
    tier: 'S',
    level: '91',
    stats: [
      '+[5-10] em Inteligência',
      '+[10-18] de Mana após cada Abate',
      'Mana aumentada em [4-8]%'
    ]
  },
  {
    name: "Gurag's Heart Charm",
    size: [2, 3],
    rarity: 'SET',
    file: 'charms/Charms_Gurags_Heart_Charm.png',
    tier: 'S',
    level: '91',
    stats: [
      '+[5-8]% Taxa de Acerto aumentada',
      '+[60-80] de Dano Físico Adicional',
      '+[15-20] em Força'
    ]
  },
  {
    name: "Tal's Deathskull",
    size: [1, 1],
    rarity: 'SET',
    file: 'charms/Charms_Tals_Deathskull.png',
    tier: 'S',
    level: '92',
    stats: [
      'Regenera Vida [6-12]%',
      'Regenera Mana [6-12]%',
      '+[35-50] de Vida',
      '+[35-50] de Mana'
    ]
  },
  {
    name: "Abomination's Heart",
    size: [1, 2],
    rarity: 'SET',
    file: 'charms/Charms_Abominations_Heart.png',
    tier: 'SS',
    level: '95',
    stats: [
      '+[1-3] em Habilidades de Lacaios',
      'Vida dos Lacaios aumentada em [4-12]%'
    ]
  },
  {
    name: 'Tablet of Awakening',
    size: [2, 2],
    rarity: 'HEROIC',
    file: 'charms/Charms_Tablet_of_Awakening.png',
    tier: 'SS',
    level: '75',
    stats: ['Engastes (1-4)']
  },
  {
    name: "Tarethiel's Ancient Wisdom",
    size: [1, 1],
    rarity: 'HEROIC',
    file: 'charms/Charms_Tarethiels_Ancient_Wisdom.png',
    tier: 'SS',
    level: '96',
    stats: [
      '+1 em Todas as Habilidades',
      '+15% Velocidade de Conjuração',
      'Recuperação de Recarga aumentada em [15-30]%'
    ]
  },
  {
    name: 'Loaded Dice',
    size: [1, 1],
    rarity: 'HEROIC',
    file: 'charms/Charms_Loaded_Dice.png',
    tier: 'SS',
    level: '99',
    stats: [
      '+[1-2] em Todas as Habilidades',
      '+[2-6] em [Habilidade de Classe Aleatória]'
    ]
  },
  {
    name: 'Torch of Shadows',
    size: [1, 2],
    rarity: 'HEROIC',
    file: 'charms/Charms_Torch_of_Shadows.png',
    tier: 'SS',
    level: '100',
    stats: [
      '5% de Chance ao Golpear de conjurar [Shadowflames] Nível 1',
      '+[1-3] em Todas as Habilidades',
      '+[20-30] em Todos os Atributos',
      '+8 ao Alcance de Luz',
      '+[10-20]% em Todas as Resistências'
    ]
  },
  {
    name: "Torstein's Anvil",
    size: [2, 2],
    rarity: 'HEROIC',
    file: 'charms/Charms_Torsteins_Anvil.png',
    tier: 'SS',
    level: '100',
    stats: [
      '+1 em Todas as Habilidades',
      '+1 em [The Shop is Open]',
      '+[5-10] em Todos os Atributos',
      '+[5-10]% em Todas as Resistências',
      '+[8-15]% Ouro Extra obtido de Abates'
    ]
  },
  {
    name: 'Eye of Rakhul',
    size: [1, 1],
    rarity: 'HEROIC',
    file: 'charms/Charms_Eye_of_Rakhul.png',
    tier: 'SS',
    level: '100',
    stats: [
      '+[3-8] em [Combat Orders]',
      '+[12-20] em Vitalidade',
      '+20 de Armadura',
      '+60% Defesa contra Projéteis',
      '+4 ao Alcance de Luz'
    ]
  },
  {
    name: 'Chaos Gemstone',
    size: [2, 2],
    rarity: 'HEROIC',
    file: 'charms/Charms_Chaos_Gemstone.png',
    tier: 'SS',
    level: '100',
    stats: [
      '+[1-2] em Todas as Habilidades',
      'Atributo Profano',
      'Atributo Profano',
      'Atributo Profano'
    ]
  },
  {
    name: 'Gas Canister',
    size: [1, 2],
    rarity: 'HEROIC',
    file: 'charms/Charms_Gas_Canister.png',
    tier: 'SS',
    level: '100',
    stats: [
      '8% de Chance ao Conjurar de lançar [Fuel the Flames!!] Nível 3',
      '+[2-5] em Habilidades de Fogo',
      '+[5-10] em [Oil Spill]'
    ]
  },
  {
    name: 'Fulgurite',
    size: [1, 1],
    rarity: 'HEROIC',
    file: 'charms/Charms_Fulgurite.png',
    tier: 'SS',
    level: '100',
    stats: [
      '+[1-2] em Todas as Habilidades',
      '+[1-15] em Todos os Atributos',
      'Dano de Habilidades Mágicas aumentado em [5-35]%',
      '+[3-20]% em Todas as Resistências'
    ]
  },
  {
    name: "Lilith's Wrath",
    size: [2, 2],
    rarity: 'UNHOLY',
    file: 'charms/Charms_Liliths_Wrath.png',
    tier: 'SS',
    level: '100',
    stats: [
      '8% de Chance ao ser Atingido de conjurar [Agony of Souls] Nível 1',
      'Dano Extra contra Monstros em Chamas [5-10]%',
      'Dano de Habilidades de Fogo aumentado em [15-40]%',
      'Área de efeito das Explosões aumentada em [5-15]%'
    ]
  },
  {
    name: 'Finger of Despair',
    size: [1, 1],
    rarity: 'UNHOLY',
    file: 'charms/Charms_Finger_of_Despair.png',
    tier: 'SS',
    level: '100',
    stats: [
      '+3 em Todas as Habilidades',
      'Atributo Profano',
      'Atributo Profano',
      'Atributo Profano',
      '+[25-50] em Todos os Atributos',
      '-50% em Todas as Resistências',
      '-10% ao Máximo de Todas as Resistências',
      'Inquebrável'
    ]
  },
  {
    name: "Sobek's Fall",
    size: [3, 1],
    rarity: 'UNHOLY',
    file: 'charms/Charms_Sobeks_Fall.png',
    tier: 'SS',
    level: '100',
    stats: [
      '5% de Chance ao Conjurar de lançar [Shade of Sobek] Nível 1',
      '+3 em Habilidades Arcanas',
      'Dano dos Lacaios aumentado em [50-75]%',
      '+8 ao Alcance de Luz',
      'Duração de Veneno reduzida em 50%',
      'Inquebrável'
    ]
  },
  {
    name: 'Arcane Pumpkin',
    size: [2, 2],
    rarity: 'ANGELIC',
    file: 'charms/Charms_Arcane_Pumpkin.png',
    tier: 'SS',
    level: '94',
    stats: [
      '+[4-6] em Habilidades Arcanas',
      '+1337 de Dano Arcano Adicional',
      '+1337 de Dano de Habilidade Arcana',
      'Dano de Habilidades Arcanas aumentado em [15-25]%',
      '+[40-50]% em Resistência Arcana'
    ]
  },
  {
    name: 'Fire Melon',
    size: [2, 2],
    rarity: 'ANGELIC',
    file: 'charms/Charms_Fire_Melon.png',
    tier: 'SS',
    level: '94',
    stats: [
      '+[4-6] em Habilidades de Fogo',
      '+1337 de Dano de Fogo Adicional',
      '+1337 de Dano de Habilidade de Fogo',
      'Dano de Habilidades de Fogo aumentado em [15-25]%',
      '+[40-50]% em Resistência a Fogo'
    ]
  },
  {
    name: 'Earth Melon',
    size: [2, 2],
    rarity: 'ANGELIC',
    file: 'charms/Charms_Earth_Melon.png',
    tier: 'SS',
    level: '94',
    stats: [
      '+[4-6] em Habilidades Físicas',
      '+2750 de Dano Físico Adicional',
      'Dano de Ataque aumentado em [20-30]%',
      '+[10-20]% em Todas as Resistências'
    ]
  },
  {
    name: 'Water Melon',
    size: [2, 2],
    rarity: 'ANGELIC',
    file: 'charms/Charms_Water_Melon.png',
    tier: 'SS',
    level: '94',
    stats: [
      '+[4-6] em Habilidades de Gelo',
      '+1337 de Dano de Gelo Adicional',
      '+1337 de Dano de Habilidade de Gelo',
      'Dano de Habilidades de Gelo aumentado em [15-25]%',
      '+[15-20]% em Resistência a Gelo'
    ]
  },
  {
    name: 'Air Melon',
    size: [2, 2],
    rarity: 'ANGELIC',
    file: 'charms/Charms_Air_Melon.png',
    tier: 'SS',
    level: '94',
    stats: [
      '+[4-6] em Habilidades de Raios',
      '+1337 de Dano de Raios Adicional',
      '+1337 de Dano de Habilidade de Raios',
      'Dano de Habilidades de Raios aumentado em [15-25]%',
      '+[40-50]% em Resistência a Raios'
    ]
  },
  {
    name: 'Rotten Pumpkin',
    size: [2, 2],
    rarity: 'ANGELIC',
    file: 'charms/Charms_Rotten_Pumpkin.png',
    tier: 'SS',
    level: '94',
    stats: [
      '+[4-6] em Habilidades de Veneno',
      '+1337 de Dano de Veneno Adicional',
      '+1337 de Dano de Habilidade de Veneno',
      'Dano de Habilidades de Veneno aumentado em [15-25]%',
      '+[40-50]% em Resistência a Veneno'
    ]
  },
  {
    name: 'Reverse Card',
    size: [1, 1],
    rarity: 'ANGELIC',
    file: 'charms/Charms_Reverse_Card.png',
    tier: 'SS',
    level: '100',
    stats: [
      '+[1-5] em [Throw Card]',
      '+1 à Velocidade de Projéteis',
      '+15 em Todos os Atributos',
      'Ataque Perfurante'
    ]
  }
];

const rarityLabel = (rarity) => {
  if (!rarity) return '';
  if (rarity === 'SATANIC') return 'Satanic';
  if (rarity === 'SET') return 'Satanic Set';
  if (rarity === 'HEROIC') return 'Heroic';
  if (rarity === 'UNHOLY') return 'Unholy';
  if (rarity === 'ANGELIC') return 'Angelic';
  return rarity;
};

const rarityColor = (rarity) => {
  if (rarity === 'SATANIC') return '#ef4444';
  if (rarity === 'SET') return '#4ade80';
  if (rarity === 'HEROIC') return '#34d399';
  if (rarity === 'UNHOLY') return '#f472b6';
  if (rarity === 'ANGELIC') return '#fde047';
  return '#e5e7eb';
};

const CharmsPage = () => {
  const [selectedCharm, setSelectedCharm] = useState(null);

  const groups = [
    { key: 'SATANIC', title: 'Satanic' },
    { key: 'SET', title: 'Satanic Set' },
    { key: 'HEROIC', title: 'Heroic' },
    { key: 'UNHOLY', title: 'Unholy' },
    { key: 'ANGELIC', title: 'Angelic' }
  ];

  const closeModal = () => setSelectedCharm(null);

  return (
    <div className="animate-fade-in">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <h2 className="text-4xl font-black text-white uppercase italic tracking-widest text-center mb-6 border-b border-white/10 pb-3">
          Charms
        </h2>

        <style>
          {`
          .charms-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
          }
          .charms-table th,
          .charms-table td {
            padding: 8px 6px;
            border-bottom: 1px solid rgba(148,163,184,0.3);
          }
          .charms-table th {
            text-transform: uppercase;
            letter-spacing: .16em;
            font-size: 11px;
            color: #9ca3af;
            text-align: left;
          }
          .charms-item-cell {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .charms-item-icon {
            width: 36px;
            height: 36px;
            object-fit: contain;
            image-rendering: pixelated;
            background: #020617;
            border: 1px solid rgba(148,163,184,0.4);
          }
          .charms-item-name {
            font-weight: 600;
            color: #e5e7eb;
          }
          .charms-rarity-tag {
            display: inline-block;
            margin-top: 2px;
            padding: 1px 6px;
            border-radius: 999px;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: .12em;
            border: 1px solid rgba(148,163,184,0.5);
            color: #e5e7eb;
          }
          .charms-tier,
          .charms-level,
          .charms-stats {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            font-size: 12px;
            color: #e5e7eb;
          }
        `}
        </style>

        <div className="bg-[#050816] border border-white/10 rounded-sm p-4 md:p-6 shadow-lg shadow-black/50">
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">
              {CHARM_DB.length} Itens
            </div>
          </div>
          {groups.map((group) => {
            const items = CHARM_DB.filter((c) => c.rarity === group.key);
            if (!items.length) return null;
            const color = rarityColor(group.key);
            return (
              <div key={group.key} className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest border"
                    style={{ borderColor: color, color }}
                  >
                    {group.title}
                  </div>
                  <div className="h-px bg-white/10 flex-1" />
                </div>
                <div className="overflow-x-auto">
                  <table className="charms-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Tier</th>
                        <th>Level</th>
                        <th>Stats</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((charm) => {
                        const img = `/images/${charm.file}`;
                        const rarityName = rarityLabel(charm.rarity);
                        const rarityHex = rarityColor(charm.rarity);
                        const statsArray = Array.isArray(charm.stats)
                          ? charm.stats
                          : charm.stats
                          ? [charm.stats]
                          : [];
                        return (
                          <tr
                            key={charm.name}
                            onClick={() => setSelectedCharm(charm)}
                            className="cursor-pointer hover:bg-white/5 transition-colors"
                            style={{ borderLeft: `3px solid ${color}` }}
                          >
                            <td>
                              <div className="charms-item-cell">
                                <img src={img} alt={charm.name} onError={(e) => e.target.style.display = 'none'} className="charms-item-icon" />
                                <div>
                                  <div className="charms-item-name">{charm.name}</div>
                                  {rarityName && (
                                    <span
                                      className="charms-rarity-tag"
                                      style={{ borderColor: rarityHex, color: rarityHex }}
                                    >
                                      {rarityName}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="charms-tier">{charm.tier}</td>
                            <td className="charms-level">{charm.level}</td>
                            <td className="charms-stats">
                              {statsArray.map((line, idx) => (
                                <div key={idx}>{line}</div>
                              ))}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
        {selectedCharm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={closeModal}
          >
            <div
              className="bg-[#050816] border border-white/20 rounded-sm max-w-lg w-full mx-4 p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-400 hover:text-white text-sm font-bold"
              >
                FECHAR
              </button>
              {(() => {
                const color = rarityColor(selectedCharm.rarity);
                const rarityName = rarityLabel(selectedCharm.rarity);
                const statsLines = Array.isArray(selectedCharm.stats)
                  ? selectedCharm.stats
                  : selectedCharm.stats
                  ? [selectedCharm.stats]
                  : [];
                return (
                  <>
                    <div className="flex gap-4 mb-4">
                      <img
                        src={`/images/${selectedCharm.file}`}
                        alt={selectedCharm.name}
                        onError={(e) => e.target.style.display = 'none'} className="charms-item-icon"
                        style={{ width: 48, height: 48 }}
                      />
                      <div>
                        <div
                          className="text-lg font-black uppercase tracking-tight"
                          style={{ color: color }}
                        >
                          {selectedCharm.name}
                        </div>
                        {rarityName && (
                          <div
                            className="mt-1 text-[11px] font-bold uppercase tracking-widest"
                            style={{ color: color }}
                          >
                            {rarityName}
                          </div>
                        )}
                        <div className="mt-2 text-xs text-gray-400">
                          {selectedCharm.tier && (
                            <span className="mr-3">
                              Tier:{' '}
                              <span className="text-gray-200">{selectedCharm.tier}</span>
                            </span>
                          )}
                          {selectedCharm.level && (
                            <span>
                              Level:{' '}
                              <span className="text-gray-200">{selectedCharm.level}</span>
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          Tamanho: {selectedCharm.size[0]}x{selectedCharm.size[1]}
                        </div>
                      </div>
                    </div>
                    {statsLines.length > 0 && (
                      <div className="mt-4">
                        <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                          Stats
                        </div>
                        <div className="text-sm text-gray-100 space-y-1">
                          {statsLines.map((line, idx) => (
                            <div key={idx}>{line}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharmsPage;
