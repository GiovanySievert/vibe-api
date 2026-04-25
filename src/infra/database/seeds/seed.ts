import { db } from '../client'
import {
  users,
  accounts,
  brands,
  places,
  placeLocations,
  placeOpeningHours,
  brandMenus,
  followers,
  followRequests,
  followStats,
  userFavoritesPlaces,
  userBlocks,
  placeReviews,
  events,
  eventParticipants,
  eventComments
} from '../schema'

const USER_IDS = {
  joao: '11111111-1111-1111-1111-111111111111',
  maria: '22222222-2222-2222-2222-222222222222',
  pedro: '33333333-3333-3333-3333-333333333333',
  ana: '44444444-4444-4444-4444-444444444444',
  lucas: '55555555-5555-5555-5555-555555555555'
}

const BRAND_IDS = {
  burgerKing: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  pizzaHut: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  starbucks: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
  outback: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
  mcdonalds: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  barelhoBar: 'f1f1f1f1-bbbb-bbbb-bbbb-f1f1f1f1f1f1',
  prudentePub: 'f2f2f2f2-bbbb-bbbb-bbbb-f2f2f2f2f2f2',
  cantinaBatel: 'f3f3f3f3-bbbb-bbbb-bbbb-f3f3f3f3f3f3',
  vilaDoChopp: 'f4f4f4f4-bbbb-bbbb-bbbb-f4f4f4f4f4f4',
  moraesWine: 'f5f5f5f5-bbbb-bbbb-bbbb-f5f5f5f5f5f5'
}

const PLACE_IDS = {
  burgerPaulista: '11111111-aaaa-aaaa-aaaa-111111111111',
  burgerMoema: '22222222-aaaa-aaaa-aaaa-222222222222',
  pizzaJardins: '33333333-bbbb-bbbb-bbbb-333333333333',
  barelhoBar: 'b1b1b1b1-cccc-cccc-cccc-b1b1b1b1b1b1',
  prudentePub: 'b2b2b2b2-cccc-cccc-cccc-b2b2b2b2b2b2',
  cantinaBatel: 'b3b3b3b3-cccc-cccc-cccc-b3b3b3b3b3b3',
  vilaDoChopp: 'b4b4b4b4-cccc-cccc-cccc-b4b4b4b4b4b4',
  moraesWine: 'b5b5b5b5-cccc-cccc-cccc-b5b5b5b5b5b5',
  starbucksFaria: '44444444-cccc-cccc-cccc-444444444444',
  outbackMoema: '55555555-dddd-dddd-dddd-555555555555',
  mcdonaldsIbirapuera: '66666666-eeee-eeee-eeee-666666666666'
}

async function seed() {
  console.log('Seeding database...')

  console.log('Clearing existing data...')
  await db.delete(eventComments)
  await db.delete(eventParticipants)
  await db.delete(events)
  await db.delete(placeReviews)
  await db.delete(userFavoritesPlaces)
  await db.delete(userBlocks)
  await db.delete(followRequests)
  await db.delete(followStats)
  await db.delete(followers)
  await db.delete(brandMenus)
  await db.delete(placeOpeningHours)
  await db.delete(placeLocations)
  await db.delete(places)
  await db.delete(brands)
  await db.delete(accounts)
  await db.delete(users)

  console.log('Seeding users...')
  await db.insert(users).values([
    {
      id: USER_IDS.joao,
      name: 'Joao Silva',
      username: 'joaosilva',
      email: 'joao@email.com',
      emailVerified: true,
      image: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      id: USER_IDS.maria,
      name: 'Maria Santos',
      username: 'mariasantos',
      email: 'maria@email.com',
      emailVerified: true,
      image: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    {
      id: USER_IDS.pedro,
      name: 'Pedro Oliveira',
      username: 'pedrooliveira',
      email: 'pedro@email.com',
      emailVerified: true,
      image: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    {
      id: USER_IDS.ana,
      name: 'Ana Costa',
      username: 'anacosta',
      email: 'ana@email.com',
      emailVerified: false,
      image: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    {
      id: USER_IDS.lucas,
      name: 'Lucas Ferreira',
      username: 'lucasferreira',
      email: 'lucas@email.com',
      emailVerified: true,
      image: 'https://randomuser.me/api/portraits/men/3.jpg'
    }
  ])

  console.log('Seeding accounts...')
  await db.insert(accounts).values([
    {
      accountId: USER_IDS.joao,
      providerId: 'credential',
      userId: USER_IDS.joao,
      password:
        '$argon2id$v=19$m=65536,t=2,p=1$f/4kZmu8cyp1cc0Ujkzw5WHTPYoZ5ZPAk3fMlP8SKeA$wdCiM/wGd+TbYrHmtO9MVciTZrTT0IfRzBgQV0CbB8M'
    },
    {
      accountId: USER_IDS.maria,
      providerId: 'credential',
      userId: USER_IDS.maria,
      password:
        '$argon2id$v=19$m=65536,t=2,p=1$f/4kZmu8cyp1cc0Ujkzw5WHTPYoZ5ZPAk3fMlP8SKeA$wdCiM/wGd+TbYrHmtO9MVciTZrTT0IfRzBgQV0CbB8M'
    },
    {
      accountId: USER_IDS.pedro,
      providerId: 'credential',
      userId: USER_IDS.pedro,
      password:
        '$argon2id$v=19$m=65536,t=2,p=1$f/4kZmu8cyp1cc0Ujkzw5WHTPYoZ5ZPAk3fMlP8SKeA$wdCiM/wGd+TbYrHmtO9MVciTZrTT0IfRzBgQV0CbB8M'
    },
    {
      accountId: USER_IDS.ana,
      providerId: 'credential',
      userId: USER_IDS.ana,
      password:
        '$argon2id$v=19$m=65536,t=2,p=1$f/4kZmu8cyp1cc0Ujkzw5WHTPYoZ5ZPAk3fMlP8SKeA$wdCiM/wGd+TbYrHmtO9MVciTZrTT0IfRzBgQV0CbB8M'
    },
    {
      accountId: USER_IDS.lucas,
      providerId: 'credential',
      userId: USER_IDS.lucas,
      password:
        '$argon2id$v=19$m=65536,t=2,p=1$f/4kZmu8cyp1cc0Ujkzw5WHTPYoZ5ZPAk3fMlP8SKeA$wdCiM/wGd+TbYrHmtO9MVciTZrTT0IfRzBgQV0CbB8M'
    }
  ])

  console.log('Seeding brands...')
  await db.insert(brands).values([
    {
      id: BRAND_IDS.burgerKing,
      name: 'Burger King',
      taxId: '12345678000101',
      type: 'fast-food',
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Burger_King_logo_%281999%29.svg'
    },
    {
      id: BRAND_IDS.pizzaHut,
      name: 'Pizza Hut',
      taxId: '23456789000102',
      type: 'fast-food',
      avatar: 'https://upload.wikimedia.org/wikipedia/sco/d/d2/Pizza_Hut_logo.svg'
    },
    {
      id: BRAND_IDS.starbucks,
      name: 'Starbucks',
      taxId: '34567890000103',
      type: 'cafe',
      avatar: 'https://upload.wikimedia.org/wikipedia/en/d/d3/Starbucks_Corporation_Logo_2011.svg'
    },
    {
      id: BRAND_IDS.outback,
      name: 'Outback Steakhouse',
      taxId: '45678901000104',
      type: 'steakhouse',
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Outback_Steakhouse.svg'
    },
    {
      id: BRAND_IDS.mcdonalds,
      name: "McDonald's",
      taxId: '56789012000105',
      type: 'fast-food',
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/McDonald%27s_logo.svg'
    },
    {
      id: BRAND_IDS.barelhoBar,
      name: 'Barelho Bar',
      taxId: '61234567000110',
      type: 'bar',
      avatar: null
    },
    {
      id: BRAND_IDS.prudentePub,
      name: 'Prudente Pub',
      taxId: '62345678000111',
      type: 'pub',
      avatar: null
    },
    {
      id: BRAND_IDS.cantinaBatel,
      name: 'Cantina do Batel',
      taxId: '63456789000112',
      type: 'bar',
      avatar: null
    },
    {
      id: BRAND_IDS.vilaDoChopp,
      name: 'Vila do Chopp',
      taxId: '64567890000113',
      type: 'bar',
      avatar: null
    },
    {
      id: BRAND_IDS.moraesWine,
      name: 'Moraes Wine Bar',
      taxId: '65678901000114',
      type: 'wine-bar',
      avatar: null
    }
  ])

  console.log('Seeding places...')
  await db.insert(places).values([
    {
      id: PLACE_IDS.burgerPaulista,
      brandId: BRAND_IDS.burgerKing,
      name: 'Burger King - Paulista',
      priceRange: '$$',
      paymentMethods: 'cash,credit,debit,pix',
      socialInstagram: '@burgerkingbr',
      contactPhone: '11999999999',
      about: 'O Burger King da Paulista, um dos mais movimentados de SP.',
      status: 'active'
    },
    {
      id: PLACE_IDS.burgerMoema,
      brandId: BRAND_IDS.burgerKing,
      name: 'Burger King - Moema',
      priceRange: '$$',
      paymentMethods: 'cash,credit,debit,pix',
      socialInstagram: '@burgerkingbr',
      contactPhone: '11988888888',
      about: 'Burger King no coracao de Moema.',
      status: 'active'
    },
    {
      id: PLACE_IDS.pizzaJardins,
      brandId: BRAND_IDS.pizzaHut,
      name: 'Pizza Hut - Jardins',
      priceRange: '$$$',
      paymentMethods: 'cash,credit,debit,pix',
      socialInstagram: '@pizzahutbr',
      contactPhone: '11977777777',
      about: 'Pizza Hut nos Jardins, ambiente familiar.',
      status: 'active'
    },
    {
      id: PLACE_IDS.starbucksFaria,
      brandId: BRAND_IDS.starbucks,
      name: 'Starbucks - Faria Lima',
      priceRange: '$$$',
      paymentMethods: 'cash,credit,debit,pix',
      socialInstagram: '@starbucksbrasil',
      contactPhone: '11966666666',
      about: 'Starbucks na Faria Lima, perfeito para reunioes.',
      status: 'active'
    },
    {
      id: PLACE_IDS.outbackMoema,
      brandId: BRAND_IDS.outback,
      name: 'Outback - Moema',
      priceRange: '$$$$',
      paymentMethods: 'cash,credit,debit,pix',
      socialInstagram: '@outbackbrasil',
      contactPhone: '11955555555',
      about: 'Outback em Moema, o melhor steak da regiao.',
      status: 'active'
    },
    {
      id: PLACE_IDS.mcdonaldsIbirapuera,
      brandId: BRAND_IDS.mcdonalds,
      name: "McDonald's - Ibirapuera",
      priceRange: '$',
      paymentMethods: 'cash,credit,debit,pix',
      socialInstagram: '@mcdonalds_br',
      contactPhone: '11944444444',
      about: "McDonald's proximo ao Parque Ibirapuera.",
      status: 'active'
    },
    {
      id: PLACE_IDS.barelhoBar,
      brandId: BRAND_IDS.barelhoBar,
      name: 'Barelho Bar',
      priceRange: '$$',
      paymentMethods: 'cash,credit,debit,pix',
      socialInstagram: '@barelhobar',
      contactPhone: '41999110001',
      about: 'Bar descolado no Batel com drinques autorais e petiscos. Musica ao vivo nas sextas.',
      status: 'active'
    },
    {
      id: PLACE_IDS.prudentePub,
      brandId: BRAND_IDS.prudentePub,
      name: 'Prudente Pub',
      priceRange: '$$',
      paymentMethods: 'cash,credit,debit,pix',
      socialInstagram: '@prudentepub',
      contactPhone: '41999110002',
      about: 'Pub com mais de 20 chopes artesanais, ambiente aconchegante e petiscos pra compartilhar.',
      status: 'active'
    },
    {
      id: PLACE_IDS.cantinaBatel,
      brandId: BRAND_IDS.cantinaBatel,
      name: 'Cantina do Batel',
      priceRange: '$$$',
      paymentMethods: 'cash,credit,debit,pix',
      socialInstagram: '@cantinabatel',
      contactPhone: '41999110003',
      about: 'Cozinha italiana informal com boa carta de vinhos e um ambiente intimista.',
      status: 'active'
    },
    {
      id: PLACE_IDS.vilaDoChopp,
      brandId: BRAND_IDS.vilaDoChopp,
      name: 'Vila do Chopp',
      priceRange: '$',
      paymentMethods: 'cash,credit,debit,pix',
      socialInstagram: '@viladochopp',
      contactPhone: '41999110004',
      about: 'Chopp gelado, bolinha de queijo e muito pagode. O point mais animado da Prudente.',
      status: 'active'
    },
    {
      id: PLACE_IDS.moraesWine,
      brandId: BRAND_IDS.moraesWine,
      name: 'Moraes Wine Bar',
      priceRange: '$$$',
      paymentMethods: 'cash,credit,debit,pix',
      socialInstagram: '@moraeswinebar',
      contactPhone: '41999110005',
      about: 'Wine bar sofisticado com curadoria de vinhos naturais e tabuadas de frios.',
      status: 'active'
    }
  ])

  console.log('Seeding place locations...')
  await db.insert(placeLocations).values([
    {
      placeId: PLACE_IDS.burgerPaulista,
      addressLine: 'Av. Paulista, 1000',
      neighborhood: 'Bela Vista',
      city: 'Sao Paulo',
      state: 'SP',
      country: 'Brasil',
      postalCode: '01310-100',
      lat: '-23.561414',
      lng: '-46.656646'
    },
    {
      placeId: PLACE_IDS.burgerMoema,
      addressLine: 'Av. Ibirapuera, 2500',
      neighborhood: 'Moema',
      city: 'Sao Paulo',
      state: 'SP',
      country: 'Brasil',
      postalCode: '04028-001',
      lat: '-23.601820',
      lng: '-46.665260'
    },
    {
      placeId: PLACE_IDS.pizzaJardins,
      addressLine: 'Rua Oscar Freire, 500',
      neighborhood: 'Jardins',
      city: 'Sao Paulo',
      state: 'SP',
      country: 'Brasil',
      postalCode: '01426-001',
      lat: '-23.562480',
      lng: '-46.669890'
    },
    {
      placeId: PLACE_IDS.starbucksFaria,
      addressLine: 'Av. Faria Lima, 3000',
      neighborhood: 'Itaim Bibi',
      city: 'Sao Paulo',
      state: 'SP',
      country: 'Brasil',
      postalCode: '04538-132',
      lat: '-23.586453',
      lng: '-46.682739'
    },
    {
      placeId: PLACE_IDS.outbackMoema,
      addressLine: 'Alameda dos Arapanes, 100',
      neighborhood: 'Moema',
      city: 'Sao Paulo',
      state: 'SP',
      country: 'Brasil',
      postalCode: '04524-001',
      lat: '-23.607180',
      lng: '-46.665320'
    },
    {
      placeId: PLACE_IDS.mcdonaldsIbirapuera,
      addressLine: 'Av. Republica do Libano, 1500',
      neighborhood: 'Ibirapuera',
      city: 'Sao Paulo',
      state: 'SP',
      country: 'Brasil',
      postalCode: '04502-001',
      lat: '-23.591420',
      lng: '-46.657810'
    },
    {
      placeId: PLACE_IDS.barelhoBar,
      addressLine: 'R. Prudente de Moraes, 238',
      neighborhood: 'Batel',
      city: 'Curitiba',
      state: 'PR',
      country: 'Brasil',
      postalCode: '80420-200',
      lat: '-25.441820',
      lng: '-49.288540'
    },
    {
      placeId: PLACE_IDS.prudentePub,
      addressLine: 'R. Prudente de Moraes, 411',
      neighborhood: 'Batel',
      city: 'Curitiba',
      state: 'PR',
      country: 'Brasil',
      postalCode: '80420-200',
      lat: '-25.442010',
      lng: '-49.288920'
    },
    {
      placeId: PLACE_IDS.cantinaBatel,
      addressLine: 'R. Prudente de Moraes, 512',
      neighborhood: 'Batel',
      city: 'Curitiba',
      state: 'PR',
      country: 'Brasil',
      postalCode: '80420-200',
      lat: '-25.442190',
      lng: '-49.289210'
    },
    {
      placeId: PLACE_IDS.vilaDoChopp,
      addressLine: 'R. Prudente de Moraes, 601',
      neighborhood: 'Batel',
      city: 'Curitiba',
      state: 'PR',
      country: 'Brasil',
      postalCode: '80420-200',
      lat: '-25.442350',
      lng: '-49.289480'
    },
    {
      placeId: PLACE_IDS.moraesWine,
      addressLine: 'R. Prudente de Moraes, 748',
      neighborhood: 'Batel',
      city: 'Curitiba',
      state: 'PR',
      country: 'Brasil',
      postalCode: '80420-200',
      lat: '-25.442580',
      lng: '-49.289810'
    }
  ])

  console.log('Seeding brand menus...')
  await db.insert(brandMenus).values([
    {
      brandId: BRAND_IDS.burgerKing,
      name: 'Whopper',
      description: 'O classico hamburguer grelhado no fogo',
      priceCents: 2990
    },
    {
      brandId: BRAND_IDS.burgerKing,
      name: 'Whopper Duplo',
      description: 'Duas carnes grelhadas no fogo',
      priceCents: 3990
    },
    {
      brandId: BRAND_IDS.burgerKing,
      name: 'Onion Rings',
      description: 'Aneis de cebola empanados e crocantes',
      priceCents: 1290
    },

    {
      brandId: BRAND_IDS.pizzaHut,
      name: 'Pizza Pepperoni Grande',
      description: 'Pizza com pepperoni e queijo',
      priceCents: 5990
    },
    {
      brandId: BRAND_IDS.pizzaHut,
      name: 'Pizza Margherita Grande',
      description: 'Pizza com tomate, mussarela e manjericao',
      priceCents: 4990
    },

    {
      brandId: BRAND_IDS.starbucks,
      name: 'Caramel Macchiato',
      description: 'Espresso com leite vaporizado e caramelo',
      priceCents: 1890
    },
    {
      brandId: BRAND_IDS.starbucks,
      name: 'Frappuccino Mocha',
      description: 'Bebida gelada com cafe, chocolate e chantilly',
      priceCents: 2190
    },

    {
      brandId: BRAND_IDS.outback,
      name: 'Bloomin Onion',
      description: 'Cebola gigante empanada e frita',
      priceCents: 5990
    },
    {
      brandId: BRAND_IDS.outback,
      name: 'Ribeye Steak',
      description: 'Corte nobre grelhado no ponto',
      priceCents: 8990
    },

    {
      brandId: BRAND_IDS.mcdonalds,
      name: 'Big Mac',
      description: 'Dois hamburgueres, alface, queijo, molho especial',
      priceCents: 2490
    },
    {
      brandId: BRAND_IDS.mcdonalds,
      name: 'McFlurry Ovomaltine',
      description: 'Sorvete com Ovomaltine',
      priceCents: 1290
    },

    {
      brandId: BRAND_IDS.barelhoBar,
      name: 'Negroni da Casa',
      description: 'Drinque autoral com gin, campari e vermute',
      priceCents: 2890
    },
    {
      brandId: BRAND_IDS.barelhoBar,
      name: 'Tábua de Frios Barelho',
      description: 'Queijos, embutidos e pao de fermentacao natural',
      priceCents: 4990
    },
    {
      brandId: BRAND_IDS.barelhoBar,
      name: 'Gin Tônica Especial',
      description: 'Gin artesanal com tonico e botanicos frescos',
      priceCents: 2490
    },

    {
      brandId: BRAND_IDS.prudentePub,
      name: 'Chope Artesanal IPA',
      description: 'IPA gelado de cervejaria local, 500ml',
      priceCents: 1890
    },
    {
      brandId: BRAND_IDS.prudentePub,
      name: 'Bolinha de Queijo',
      description: 'Porcao com 10 bolinhas crocantes recheadas',
      priceCents: 2290
    },
    {
      brandId: BRAND_IDS.prudentePub,
      name: 'Hamburguer Pub',
      description: 'Artesanal com cheddar, bacon e aioli',
      priceCents: 3490
    },

    {
      brandId: BRAND_IDS.cantinaBatel,
      name: 'Bruschetta ao Tomate',
      description: 'Pao rústico com tomate cereja, basilico e azeite',
      priceCents: 2490
    },
    {
      brandId: BRAND_IDS.cantinaBatel,
      name: 'Tagliatelle Carbonara',
      description: 'Massa fresca com pancetta, ovo e parmesao',
      priceCents: 4990
    },
    {
      brandId: BRAND_IDS.cantinaBatel,
      name: 'Tiramisu',
      description: 'Sobremesa italiana classica com cafe e mascarpone',
      priceCents: 2290
    },

    {
      brandId: BRAND_IDS.vilaDoChopp,
      name: 'Chope Pilsen 600ml',
      description: 'Chope gelado bem tirado',
      priceCents: 1290
    },
    {
      brandId: BRAND_IDS.vilaDoChopp,
      name: 'Porcao de Frango',
      description: 'Frango frito temperado, porcao generosa',
      priceCents: 2490
    },
    {
      brandId: BRAND_IDS.vilaDoChopp,
      name: 'Caldo de Feijao',
      description: 'Caldo espesso com linguica e torresmo',
      priceCents: 1590
    },

    {
      brandId: BRAND_IDS.moraesWine,
      name: 'Taça de Vinho Natural Branco',
      description: 'Curadoria de vinhos naturais, selecao do dia',
      priceCents: 3490
    },
    {
      brandId: BRAND_IDS.moraesWine,
      name: 'Taça de Vinho Natural Tinto',
      description: 'Tinto natural de pequeno produtor, selecao do dia',
      priceCents: 3690
    },
    {
      brandId: BRAND_IDS.moraesWine,
      name: 'Tábua Premium',
      description: 'Queijos especiais, presunto cru e geleias artesanais',
      priceCents: 6990
    }
  ])

  console.log('Seeding followers...')
  await db.insert(followers).values([
    { followerId: USER_IDS.joao, followingId: USER_IDS.maria },
    { followerId: USER_IDS.joao, followingId: USER_IDS.pedro },
    { followerId: USER_IDS.maria, followingId: USER_IDS.joao },
    { followerId: USER_IDS.maria, followingId: USER_IDS.ana },
    { followerId: USER_IDS.pedro, followingId: USER_IDS.joao },
    { followerId: USER_IDS.pedro, followingId: USER_IDS.lucas },
    { followerId: USER_IDS.ana, followingId: USER_IDS.maria },
    { followerId: USER_IDS.lucas, followingId: USER_IDS.joao },
    { followerId: USER_IDS.lucas, followingId: USER_IDS.maria },
    { followerId: USER_IDS.lucas, followingId: USER_IDS.pedro }
  ])

  console.log('Seeding follow stats...')
  await db.insert(followStats).values([
    { userId: USER_IDS.joao, followersCount: 3, followingCount: 2 },
    { userId: USER_IDS.maria, followersCount: 3, followingCount: 2 },
    { userId: USER_IDS.pedro, followersCount: 2, followingCount: 2 },
    { userId: USER_IDS.ana, followersCount: 1, followingCount: 1 },
    { userId: USER_IDS.lucas, followersCount: 1, followingCount: 3 }
  ])

  console.log('Seeding user favorites places...')
  await db.insert(userFavoritesPlaces).values([
    { userId: USER_IDS.joao, placeId: PLACE_IDS.burgerPaulista },
    { userId: USER_IDS.joao, placeId: PLACE_IDS.starbucksFaria },
    { userId: USER_IDS.maria, placeId: PLACE_IDS.pizzaJardins },
    { userId: USER_IDS.maria, placeId: PLACE_IDS.outbackMoema },
    { userId: USER_IDS.pedro, placeId: PLACE_IDS.burgerMoema },
    { userId: USER_IDS.pedro, placeId: PLACE_IDS.mcdonaldsIbirapuera },
    { userId: USER_IDS.ana, placeId: PLACE_IDS.starbucksFaria },
    { userId: USER_IDS.lucas, placeId: PLACE_IDS.outbackMoema }
  ])

  console.log('Seeding place reviews...')
  await db.insert(placeReviews).values([
    {
      userId: USER_IDS.joao,
      placeId: PLACE_IDS.burgerPaulista,
      rating: 'crowded',
      comment: 'Melhor Whopper que ja comi! Atendimento rapido.'
    },
    {
      userId: USER_IDS.maria,
      placeId: PLACE_IDS.burgerPaulista,
      rating: 'crowded',
      comment: 'Muito bom, mas as vezes demora um pouco.'
    },
    {
      userId: USER_IDS.lucas,
      placeId: PLACE_IDS.burgerPaulista,
      rating: 'crowded',
      comment: 'Sempre lotado na hora do almoco, chega cedo.'
    },

    {
      userId: USER_IDS.pedro,
      placeId: PLACE_IDS.burgerMoema,
      rating: 'dead',
      comment: 'Mais tranquilo que o da Paulista, prefiro esse.'
    },
    {
      userId: USER_IDS.ana,
      placeId: PLACE_IDS.burgerMoema,
      rating: 'dead',
      comment: 'Atendimento rapido, quase sem fila.'
    },

    {
      userId: USER_IDS.pedro,
      placeId: PLACE_IDS.pizzaJardins,
      rating: 'crowded',
      comment: 'Pizza deliciosa, ambiente agradavel.'
    },
    {
      userId: USER_IDS.maria,
      placeId: PLACE_IDS.pizzaJardins,
      rating: 'crowded',
      comment: 'Pepperoni incrivel, mas cheio no fim de semana.'
    },

    {
      userId: USER_IDS.ana,
      placeId: PLACE_IDS.starbucksFaria,
      rating: 'dead',
      comment: 'Cafe otimo, mas preco salgado.'
    },
    {
      userId: USER_IDS.pedro,
      placeId: PLACE_IDS.starbucksFaria,
      rating: 'dead',
      comment: 'Bom para trabalhar, wifi excelente.'
    },
    {
      userId: USER_IDS.joao,
      placeId: PLACE_IDS.starbucksFaria,
      rating: 'dead',
      comment: 'Sempre tem lugar vago pela manha.'
    },

    {
      userId: USER_IDS.lucas,
      placeId: PLACE_IDS.outbackMoema,
      rating: 'crowded',
      comment: 'Ribeye perfeito! Bloomin Onion sensacional.'
    },
    {
      userId: USER_IDS.maria,
      placeId: PLACE_IDS.outbackMoema,
      rating: 'dead',
      comment: 'Adorei! Perfeito para ocasioes especiais.'
    },

    {
      userId: USER_IDS.joao,
      placeId: PLACE_IDS.mcdonaldsIbirapuera,
      rating: 'crowded',
      comment: 'Basico, mas cumpre o que promete.'
    },
    {
      userId: USER_IDS.lucas,
      placeId: PLACE_IDS.mcdonaldsIbirapuera,
      rating: 'crowded',
      comment: 'Cheio depois do parque, espera uns 10 minutos.'
    },

    {
      userId: USER_IDS.joao,
      placeId: PLACE_IDS.barelhoBar,
      rating: 'crowded',
      comment: 'Negroni impecavel, musica ao vivo na sexta e o lugar lotou rapido.'
    },
    {
      userId: USER_IDS.maria,
      placeId: PLACE_IDS.barelhoBar,
      rating: 'crowded',
      comment: 'Ambiente super agradavel, drinques otimos. Ja virou meu favorito do Batel.'
    },

    {
      userId: USER_IDS.pedro,
      placeId: PLACE_IDS.prudentePub,
      rating: 'crowded',
      comment: 'Melhor IPA da cidade, porcao de bolinha de queijo enorme. Vai sempre cheio.'
    },
    {
      userId: USER_IDS.lucas,
      placeId: PLACE_IDS.prudentePub,
      rating: 'dead',
      comment: 'Fui numa quarta e tava tranquilo, perfeito pra uma cerveja sem barulho.'
    },

    {
      userId: USER_IDS.ana,
      placeId: PLACE_IDS.cantinaBatel,
      rating: 'dead',
      comment: 'Ambiente intimo, carbonara deliciosa. Bom pra jantar a dois.'
    },
    {
      userId: USER_IDS.maria,
      placeId: PLACE_IDS.cantinaBatel,
      rating: 'crowded',
      comment: 'No sabado tava bem cheio mas valeu a espera, comida excelente.'
    },

    {
      userId: USER_IDS.lucas,
      placeId: PLACE_IDS.vilaDoChopp,
      rating: 'crowded',
      comment: 'Point do bairro! Chope bem tirado e porcao de frango generosa.'
    },
    {
      userId: USER_IDS.pedro,
      placeId: PLACE_IDS.vilaDoChopp,
      rating: 'crowded',
      comment: 'Sempre cheio e animado, preco acessivel pro Batel.'
    },

    {
      userId: USER_IDS.joao,
      placeId: PLACE_IDS.moraesWine,
      rating: 'dead',
      comment: 'Curadoria de vinhos naturais impressionante, atendimento atencioso.'
    },
    {
      userId: USER_IDS.ana,
      placeId: PLACE_IDS.moraesWine,
      rating: 'dead',
      comment: 'Lugar sofisticado, tranquilo e com uma selecao de vinhos que voce nao acha em outro lugar.'
    }
  ])

  console.log('Seeding place opening hours...')
  const barPlaceIds = new Set([
    PLACE_IDS.barelhoBar,
    PLACE_IDS.prudentePub,
    PLACE_IDS.cantinaBatel,
    PLACE_IDS.vilaDoChopp,
    PLACE_IDS.moraesWine
  ])
  const openingHoursData: { placeId: string; weekday: number; opensAt: string; closesAt: string; isClosed: boolean }[] =
    []
  const allPlaceIds = Object.values(PLACE_IDS)
  for (const placeId of allPlaceIds) {
    const isBar = barPlaceIds.has(placeId)
    for (let weekday = 0; weekday <= 6; weekday++) {
      if (isBar) {
        openingHoursData.push({
          placeId,
          weekday,

          opensAt: weekday === 1 ? '00:00:00' : '18:00:00',
          closesAt: weekday >= 4 ? '02:00:00' : '00:00:00',
          isClosed: weekday === 1
        })
      } else {
        openingHoursData.push({
          placeId,
          weekday,
          opensAt: weekday === 0 ? '10:00:00' : '09:00:00',
          closesAt: weekday === 0 ? '22:00:00' : '23:00:00',
          isClosed: false
        })
      }
    }
  }
  await db.insert(placeOpeningHours).values(openingHoursData)

  console.log('Seeding follow requests...')
  await db.insert(followRequests).values([
    {
      requesterId: USER_IDS.ana,
      requestedId: USER_IDS.lucas,
      status: 'pending'
    },
    {
      requesterId: USER_IDS.pedro,
      requestedId: USER_IDS.ana,
      status: 'accepted'
    },
    {
      requesterId: USER_IDS.lucas,
      requestedId: USER_IDS.ana,
      status: 'declined'
    }
  ])

  console.log('Seeding user blocks...')
  await db.insert(userBlocks).values([
    {
      blockerId: USER_IDS.joao,
      blockedId: USER_IDS.lucas
    }
  ])

  const EVENT_IDS = {
    churrasco: 'eeeeeeee-1111-1111-1111-111111111111',
    happy_hour: 'eeeeeeee-2222-2222-2222-222222222222',
    pizza_night: 'eeeeeeee-3333-3333-3333-333333333333'
  }

  console.log('Seeding events...')
  await db.insert(events).values([
    {
      id: EVENT_IDS.churrasco,
      ownerId: USER_IDS.joao,
      name: 'Churrasco na Paulista',
      date: '2026-05-10',
      time: '18:00:00',
      description: 'Churrasco com os amigos perto do Burger King Paulista.'
    },
    {
      id: EVENT_IDS.happy_hour,
      ownerId: USER_IDS.maria,
      name: 'Happy Hour no Starbucks',
      date: '2026-05-15',
      time: '17:30:00',
      description: 'Happy hour relaxado no Starbucks da Faria Lima.'
    },
    {
      id: EVENT_IDS.pizza_night,
      ownerId: USER_IDS.pedro,
      name: 'Pizza Night Jardins',
      date: '2026-05-20',
      time: '20:00:00',
      description: 'Noite de pizza no Pizza Hut dos Jardins.'
    }
  ])

  console.log('Seeding event participants...')
  await db.insert(eventParticipants).values([
    { eventId: EVENT_IDS.churrasco, userId: USER_IDS.maria, status: 'accepted' },
    { eventId: EVENT_IDS.churrasco, userId: USER_IDS.pedro, status: 'accepted' },
    { eventId: EVENT_IDS.churrasco, userId: USER_IDS.ana, status: 'pending' },
    { eventId: EVENT_IDS.happy_hour, userId: USER_IDS.joao, status: 'accepted' },
    { eventId: EVENT_IDS.happy_hour, userId: USER_IDS.lucas, status: 'pending' },
    { eventId: EVENT_IDS.pizza_night, userId: USER_IDS.maria, status: 'accepted' },
    { eventId: EVENT_IDS.pizza_night, userId: USER_IDS.ana, status: 'declined' }
  ])

  console.log('Seeding event comments...')
  await db.insert(eventComments).values([
    {
      eventId: EVENT_IDS.churrasco,
      userId: USER_IDS.maria,
      content: 'Adorei a ideia! Levo a salada de maionese.'
    },
    {
      eventId: EVENT_IDS.churrasco,
      userId: USER_IDS.pedro,
      content: 'Confirmo presenca! Ja aviso o pessoal.'
    },
    {
      eventId: EVENT_IDS.happy_hour,
      userId: USER_IDS.joao,
      content: 'Otimo lugar, ja fui varias vezes. Vai ser top!'
    },
    {
      eventId: EVENT_IDS.pizza_night,
      userId: USER_IDS.maria,
      content: 'Pizza Hut Jardins e demais, boa escolha Pedro!'
    }
  ])

  console.log('Seeding completed!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
