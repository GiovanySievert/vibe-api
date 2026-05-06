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
  eventComments,
  appNotifications,
  notificationPreferences,
  userStreaks,
  userWeeklyActivity
} from '../schema'

const USER_IDS = {
  joao: '11111111-1111-1111-1111-111111111111',
  maria: '22222222-2222-2222-2222-222222222222',
  pedro: '33333333-3333-3333-3333-333333333333',
  ana: '44444444-4444-4444-4444-444444444444',
  lucas: '55555555-5555-5555-5555-555555555555'
}

const BRAND_IDS = {
  burgerKing: 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
  pizzaHut: 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb',
  starbucks: 'cccccccc-cccc-4ccc-cccc-cccccccccccc',
  outback: 'dddddddd-dddd-4ddd-dddd-dddddddddddd',
  mcdonalds: 'eeeeeeee-eeee-4eee-eeee-eeeeeeeeeeee',
  barelhoBar: 'f1f1f1f1-f1f1-4f1f-af1f-f1f1f1f1f1f1',
  prudentePub: 'f2f2f2f2-f2f2-4f2f-af2f-f2f2f2f2f2f2',
  cantinaBatel: 'f3f3f3f3-f3f3-4f3f-af3f-f3f3f3f3f3f3',
  vilaDoChopp: 'f4f4f4f4-f4f4-4f4f-af4f-f4f4f4f4f4f4',
  moraesWine: 'f5f5f5f5-f5f5-4f5f-af5f-f5f5f5f5f5f5'
}

const PLACE_IDS = {
  burgerPaulista: '11111111-1111-4111-a111-111111111111',
  burgerMoema: '22222222-2222-4222-a222-222222222222',
  pizzaJardins: '33333333-3333-4333-a333-333333333333',
  barelhoBar: 'b1b1b1b1-b1b1-4b1b-ab1b-b1b1b1b1b1b1',
  prudentePub: 'b2b2b2b2-b2b2-4b2b-ab2b-b2b2b2b2b2b2',
  cantinaBatel: 'b3b3b3b3-b3b3-4b3b-ab3b-b3b3b3b3b3b3',
  vilaDoChopp: 'b4b4b4b4-b4b4-4b4b-ab4b-b4b4b4b4b4b4',
  moraesWine: 'b5b5b5b5-b5b5-4b5b-ab5b-b5b5b5b5b5b5',
  starbucksFaria: '44444444-4444-4444-a444-444444444444',
  outbackMoema: '55555555-5555-4555-a555-555555555555',
  mcdonaldsIbirapuera: '66666666-6666-4666-a666-666666666666'
}

async function seed() {
  console.log('Seeding database...')

  console.log('Clearing existing data...')
  await db.delete(appNotifications)
  await db.delete(notificationPreferences)
  await db.delete(eventComments)
  await db.delete(eventParticipants)
  await db.delete(events)
  await db.delete(placeReviews)
  await db.delete(userWeeklyActivity)
  await db.delete(userStreaks)
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
      image: 'https://picsum.photos/200/200?random=1&place=review'
    },
    {
      id: USER_IDS.maria,
      name: 'Maria Santos',
      username: 'mariasantos',
      email: 'maria@email.com',
      emailVerified: true,
      image: 'https://picsum.photos/200/200?random=2&place=review'
    },
    {
      id: USER_IDS.pedro,
      name: 'Pedro Oliveira',
      username: 'pedrooliveira',
      email: 'pedro@email.com',
      emailVerified: true,
      image: 'https://picsum.photos/200/200?random=3&place=review'
    },
    {
      id: USER_IDS.ana,
      name: 'Ana Costa',
      username: 'anacosta',
      email: 'ana@email.com',
      emailVerified: false,
      image: 'https://picsum.photos/200/200?random=4&place=review'
    },
    {
      id: USER_IDS.lucas,
      name: 'Lucas Ferreira',
      username: 'lucasferreira',
      email: 'lucas@email.com',
      emailVerified: true,
      image: 'https://picsum.photos/200/200?random=5&place=review'
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
      avatar: 'https://picsum.photos/400/400?random=10&place=review'
    },
    {
      id: BRAND_IDS.pizzaHut,
      name: 'Pizza Hut',
      taxId: '23456789000102',
      type: 'fast-food',
      avatar: 'https://picsum.photos/400/400?random=11&place=review'
    },
    {
      id: BRAND_IDS.starbucks,
      name: 'Starbucks',
      taxId: '34567890000103',
      type: 'cafe',
      avatar: 'https://picsum.photos/400/400?random=12&place=review'
    },
    {
      id: BRAND_IDS.outback,
      name: 'Outback Steakhouse',
      taxId: '45678901000104',
      type: 'steakhouse',
      avatar: 'https://picsum.photos/400/400?random=13&place=review'
    },
    {
      id: BRAND_IDS.mcdonalds,
      name: "McDonald's",
      taxId: '56789012000105',
      type: 'fast-food',
      avatar: 'https://picsum.photos/400/400?random=14&place=review'
    },
    {
      id: BRAND_IDS.barelhoBar,
      name: 'Barelho Bar',
      taxId: '61234567000110',
      type: 'bar',
      avatar: 'https://picsum.photos/400/400?random=15&place=review'
    },
    {
      id: BRAND_IDS.prudentePub,
      name: 'Prudente Pub',
      taxId: '62345678000111',
      type: 'pub',
      avatar: 'https://picsum.photos/400/400?random=16&place=review'
    },
    {
      id: BRAND_IDS.cantinaBatel,
      name: 'Cantina do Batel',
      taxId: '63456789000112',
      type: 'bar',
      avatar: 'https://picsum.photos/400/400?random=17&place=review'
    },
    {
      id: BRAND_IDS.vilaDoChopp,
      name: 'Vila do Chopp',
      taxId: '64567890000113',
      type: 'bar',
      avatar: 'https://picsum.photos/400/400?random=18&place=review'
    },
    {
      id: BRAND_IDS.moraesWine,
      name: 'Moraes Wine Bar',
      taxId: '65678901000114',
      type: 'wine-bar',
      avatar: 'https://picsum.photos/400/400?random=19&place=review'
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
      placeName: 'Burger King - Paulista',
      rating: 'crowded',
      comment: 'Melhor Whopper que ja comi! Atendimento rapido.',
      placeImageUrl: 'https://picsum.photos/800/600?random=100&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=1&place=review',
      selfieFriendsOnly: true
    },
    {
      userId: USER_IDS.maria,
      placeId: PLACE_IDS.burgerPaulista,
      placeName: 'Burger King - Paulista',
      rating: 'crowded',
      comment: 'Muito bom, mas as vezes demora um pouco.',
      placeImageUrl: 'https://picsum.photos/800/600?random=101&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=2&place=review'
    },
    {
      userId: USER_IDS.lucas,
      placeId: PLACE_IDS.burgerPaulista,
      placeName: 'Burger King - Paulista',
      rating: 'crowded',
      comment: 'Sempre lotado na hora do almoco, chega cedo.',
      placeImageUrl: null,
      selfieUrl: 'https://picsum.photos/200/200?random=5&place=review'
    },

    {
      userId: USER_IDS.pedro,
      placeId: PLACE_IDS.burgerMoema,
      placeName: 'Burger King - Moema',
      rating: 'dead',
      comment: 'Mais tranquilo que o da Paulista, prefiro esse.',
      placeImageUrl: 'https://picsum.photos/800/600?random=102&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=3&place=review',
      selfieFriendsOnly: true
    },
    {
      userId: USER_IDS.ana,
      placeId: PLACE_IDS.burgerMoema,
      placeName: 'Burger King - Moema',
      rating: 'dead',
      comment: 'Atendimento rapido, quase sem fila.',
      placeImageUrl: null,
      selfieUrl: null
    },

    {
      userId: USER_IDS.pedro,
      placeId: PLACE_IDS.pizzaJardins,
      placeName: 'Pizza Hut - Jardins',
      rating: 'crowded',
      comment: 'Pizza deliciosa, ambiente agradavel.',
      placeImageUrl: 'https://picsum.photos/800/600?random=103&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=3&place=review'
    },
    {
      userId: USER_IDS.maria,
      placeId: PLACE_IDS.pizzaJardins,
      placeName: 'Pizza Hut - Jardins',
      rating: 'crowded',
      comment: 'Pepperoni incrivel, mas cheio no fim de semana.',
      placeImageUrl: 'https://picsum.photos/800/600?random=104&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=2&place=review',
      selfieFriendsOnly: true
    },

    {
      userId: USER_IDS.ana,
      placeId: PLACE_IDS.starbucksFaria,
      placeName: 'Starbucks - Faria Lima',
      rating: 'dead',
      comment: 'Cafe otimo, mas preco salgado.',
      placeImageUrl: 'https://picsum.photos/800/600?random=105&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=4&place=review'
    },
    {
      userId: USER_IDS.pedro,
      placeId: PLACE_IDS.starbucksFaria,
      placeName: 'Starbucks - Faria Lima',
      rating: 'dead',
      comment: 'Bom para trabalhar, wifi excelente.',
      placeImageUrl: 'https://picsum.photos/800/600?random=106&place=review',
      selfieUrl: null
    },
    {
      userId: USER_IDS.joao,
      placeId: PLACE_IDS.starbucksFaria,
      placeName: 'Starbucks - Faria Lima',
      rating: 'dead',
      comment: 'Sempre tem lugar vago pela manha.',
      placeImageUrl: null,
      selfieUrl: 'https://picsum.photos/200/200?random=1&place=review'
    },

    {
      userId: USER_IDS.lucas,
      placeId: PLACE_IDS.outbackMoema,
      placeName: 'Outback - Moema',
      rating: 'crowded',
      comment: 'Ribeye perfeito! Bloomin Onion sensacional.',
      placeImageUrl: 'https://picsum.photos/800/600?random=107&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=5&place=review'
    },
    {
      userId: USER_IDS.maria,
      placeId: PLACE_IDS.outbackMoema,
      placeName: 'Outback - Moema',
      rating: 'dead',
      comment: 'Adorei! Perfeito para ocasioes especiais.',
      placeImageUrl: 'https://picsum.photos/800/600?random=108&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=2&place=review'
    },

    {
      userId: USER_IDS.joao,
      placeId: PLACE_IDS.mcdonaldsIbirapuera,
      placeName: "McDonald's - Ibirapuera",
      rating: 'crowded',
      comment: 'Basico, mas cumpre o que promete.',
      placeImageUrl: 'https://picsum.photos/800/600?random=109&place=review',
      selfieUrl: null
    },
    {
      userId: USER_IDS.lucas,
      placeId: PLACE_IDS.mcdonaldsIbirapuera,
      placeName: "McDonald's - Ibirapuera",
      rating: 'crowded',
      comment: 'Cheio depois do parque, espera uns 10 minutos.',
      placeImageUrl: null,
      selfieUrl: 'https://picsum.photos/200/200?random=5&place=review'
    },

    {
      userId: USER_IDS.joao,
      placeId: PLACE_IDS.barelhoBar,
      placeName: 'Barelho Bar',
      rating: 'crowded',
      comment: 'Negroni impecavel, musica ao vivo na sexta e o lugar lotou rapido.',
      placeImageUrl: 'https://picsum.photos/800/600?random=110&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=1&place=review',
      selfieFriendsOnly: true
    },
    {
      userId: USER_IDS.maria,
      placeId: PLACE_IDS.barelhoBar,
      placeName: 'Barelho Bar',
      rating: 'crowded',
      comment: 'Ambiente super agradavel, drinques otimos. Ja virou meu favorito do Batel.',
      placeImageUrl: 'https://picsum.photos/800/600?random=111&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=2&place=review'
    },

    {
      userId: USER_IDS.pedro,
      placeId: PLACE_IDS.prudentePub,
      placeName: 'Prudente Pub',
      rating: 'crowded',
      comment: 'Melhor IPA da cidade, porcao de bolinha de queijo enorme. Vai sempre cheio.',
      placeImageUrl: 'https://picsum.photos/800/600?random=112&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=3&place=review',
      selfieFriendsOnly: true
    },
    {
      userId: USER_IDS.lucas,
      placeId: PLACE_IDS.prudentePub,
      placeName: 'Prudente Pub',
      rating: 'dead',
      comment: 'Fui numa quarta e tava tranquilo, perfeito pra uma cerveja sem barulho.',
      placeImageUrl: null,
      selfieUrl: 'https://picsum.photos/200/200?random=5&place=review'
    },

    {
      userId: USER_IDS.ana,
      placeId: PLACE_IDS.cantinaBatel,
      placeName: 'Cantina do Batel',
      rating: 'dead',
      comment: 'Ambiente intimo, carbonara deliciosa. Bom pra jantar a dois.',
      placeImageUrl: 'https://picsum.photos/800/600?random=113&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=4&place=review'
    },
    {
      userId: USER_IDS.maria,
      placeId: PLACE_IDS.cantinaBatel,
      placeName: 'Cantina do Batel',
      rating: 'crowded',
      comment: 'No sabado tava bem cheio mas valeu a espera, comida excelente.',
      placeImageUrl: 'https://picsum.photos/800/600?random=114&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=2&place=review'
    },

    {
      userId: USER_IDS.lucas,
      placeId: PLACE_IDS.vilaDoChopp,
      placeName: 'Vila do Chopp',
      rating: 'crowded',
      comment: 'Point do bairro! Chope bem tirado e porcao de frango generosa.',
      placeImageUrl: 'https://picsum.photos/800/600?random=115&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=5&place=review'
    },
    {
      userId: USER_IDS.pedro,
      placeId: PLACE_IDS.vilaDoChopp,
      placeName: 'Vila do Chopp',
      rating: 'crowded',
      comment: 'Sempre cheio e animado, preco acessivel pro Batel.',
      placeImageUrl: null,
      selfieUrl: null
    },

    {
      userId: USER_IDS.joao,
      placeId: PLACE_IDS.moraesWine,
      placeName: 'Moraes Wine',
      rating: 'dead',
      comment: 'Curadoria de vinhos naturais impressionante, atendimento atencioso.',
      placeImageUrl: 'https://picsum.photos/800/600?random=116&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=1&place=review'
    },
    {
      userId: USER_IDS.ana,
      placeId: PLACE_IDS.moraesWine,
      placeName: 'Moraes Wine',
      rating: 'dead',
      comment: 'Lugar sofisticado, tranquilo e com uma selecao de vinhos que voce nao acha em outro lugar.',
      placeImageUrl: 'https://picsum.photos/800/600?random=117&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=4&place=review',
      selfieFriendsOnly: true
    }
  ])

  console.log('Seeding user streaks...')
  await db.insert(userStreaks).values([
    {
      userId: USER_IDS.joao,
      currentStreak: 6,
      longestStreak: 6,
      lastActiveWeek: 18,
      lastActiveYear: 2026,
      weeklyThreshold: 2
    },
    {
      userId: USER_IDS.maria,
      currentStreak: 6,
      longestStreak: 8,
      lastActiveWeek: 18,
      lastActiveYear: 2026,
      weeklyThreshold: 2
    },
    {
      userId: USER_IDS.pedro,
      currentStreak: 4,
      longestStreak: 4,
      lastActiveWeek: 18,
      lastActiveYear: 2026,
      weeklyThreshold: 2
    },
    {
      userId: USER_IDS.ana,
      currentStreak: 3,
      longestStreak: 5,
      lastActiveWeek: 18,
      lastActiveYear: 2026,
      weeklyThreshold: 2
    },
    {
      userId: USER_IDS.lucas,
      currentStreak: 3,
      longestStreak: 3,
      lastActiveWeek: 18,
      lastActiveYear: 2026,
      weeklyThreshold: 2
    }
  ])

  console.log('Seeding user weekly activity...')
  await db.insert(userWeeklyActivity).values([
    { userId: USER_IDS.joao, isoYear: 2026, isoWeek: 13, reviewCount: 2, streakContributed: true },
    { userId: USER_IDS.joao, isoYear: 2026, isoWeek: 14, reviewCount: 3, streakContributed: true },
    { userId: USER_IDS.joao, isoYear: 2026, isoWeek: 15, reviewCount: 2, streakContributed: true },
    { userId: USER_IDS.joao, isoYear: 2026, isoWeek: 16, reviewCount: 4, streakContributed: true },
    { userId: USER_IDS.joao, isoYear: 2026, isoWeek: 17, reviewCount: 2, streakContributed: true },
    { userId: USER_IDS.joao, isoYear: 2026, isoWeek: 18, reviewCount: 3, streakContributed: true },

    { userId: USER_IDS.maria, isoYear: 2026, isoWeek: 13, reviewCount: 3, streakContributed: true },
    { userId: USER_IDS.maria, isoYear: 2026, isoWeek: 14, reviewCount: 2, streakContributed: true },
    { userId: USER_IDS.maria, isoYear: 2026, isoWeek: 15, reviewCount: 2, streakContributed: true },
    { userId: USER_IDS.maria, isoYear: 2026, isoWeek: 16, reviewCount: 3, streakContributed: true },
    { userId: USER_IDS.maria, isoYear: 2026, isoWeek: 17, reviewCount: 2, streakContributed: true },
    { userId: USER_IDS.maria, isoYear: 2026, isoWeek: 18, reviewCount: 2, streakContributed: true },

    { userId: USER_IDS.pedro, isoYear: 2026, isoWeek: 13, reviewCount: 1, streakContributed: false },
    { userId: USER_IDS.pedro, isoYear: 2026, isoWeek: 14, reviewCount: 1, streakContributed: false },
    { userId: USER_IDS.pedro, isoYear: 2026, isoWeek: 15, reviewCount: 2, streakContributed: true },
    { userId: USER_IDS.pedro, isoYear: 2026, isoWeek: 16, reviewCount: 3, streakContributed: true },
    { userId: USER_IDS.pedro, isoYear: 2026, isoWeek: 17, reviewCount: 2, streakContributed: true },
    { userId: USER_IDS.pedro, isoYear: 2026, isoWeek: 18, reviewCount: 2, streakContributed: true },

    { userId: USER_IDS.ana, isoYear: 2026, isoWeek: 14, reviewCount: 1, streakContributed: false },
    { userId: USER_IDS.ana, isoYear: 2026, isoWeek: 16, reviewCount: 2, streakContributed: true },
    { userId: USER_IDS.ana, isoYear: 2026, isoWeek: 17, reviewCount: 3, streakContributed: true },
    { userId: USER_IDS.ana, isoYear: 2026, isoWeek: 18, reviewCount: 2, streakContributed: true },

    { userId: USER_IDS.lucas, isoYear: 2026, isoWeek: 13, reviewCount: 2, streakContributed: true },
    { userId: USER_IDS.lucas, isoYear: 2026, isoWeek: 14, reviewCount: 2, streakContributed: true },
    { userId: USER_IDS.lucas, isoYear: 2026, isoWeek: 15, reviewCount: 1, streakContributed: false },
    { userId: USER_IDS.lucas, isoYear: 2026, isoWeek: 16, reviewCount: 3, streakContributed: true },
    { userId: USER_IDS.lucas, isoYear: 2026, isoWeek: 17, reviewCount: 2, streakContributed: true },
    { userId: USER_IDS.lucas, isoYear: 2026, isoWeek: 18, reviewCount: 2, streakContributed: true }
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

  console.log('Seeding notification preferences...')
  await db.insert(notificationPreferences).values([
    {
      userId: USER_IDS.joao,
      type: 'event_invitation',
      pushEnabled: true,
      inAppEnabled: true
    },
    {
      userId: USER_IDS.joao,
      type: 'follow_request_created',
      pushEnabled: false,
      inAppEnabled: true
    },
    {
      userId: USER_IDS.maria,
      type: 'event_invitation',
      pushEnabled: true,
      inAppEnabled: true
    },
    {
      userId: USER_IDS.ana,
      type: 'follow_request_created',
      pushEnabled: true,
      inAppEnabled: true
    }
  ])

  console.log('Seeding app notifications...')
  const now = Date.now()
  const minutesAgo = (n: number) => new Date(now - n * 60 * 1000)
  const hoursAgo = (n: number) => new Date(now - n * 60 * 60 * 1000)
  const daysAgo = (n: number) => new Date(now - n * 24 * 60 * 60 * 1000)

  await db.insert(appNotifications).values([
    {
      userId: USER_IDS.joao,
      type: 'follow_request_created',
      title: 'Nova solicitacao de follow',
      body: 'Ana Costa quer seguir voce.',
      data: {
        type: 'follow_request_received',
        url: 'myapp://social/follow-requests/received',
        requesterId: USER_IDS.ana
      },
      readAt: null,
      createdAt: minutesAgo(8)
    },
    {
      userId: USER_IDS.joao,
      type: 'event_invitation',
      title: 'Novo convite para evento',
      body: 'Maria Santos convidou voce para Happy Hour no Starbucks.',
      data: {
        type: 'event_invitation_received',
        url: 'myapp://events/share/eeeeeeee-2222-2222-2222-222222222222',
        eventId: 'eeeeeeee-2222-2222-2222-222222222222',
        ownerId: USER_IDS.maria
      },
      readAt: null,
      createdAt: hoursAgo(2)
    },
    {
      userId: USER_IDS.joao,
      type: 'event_invitation',
      title: 'Novo convite para evento',
      body: 'Pedro Oliveira convidou voce para Pizza Night Jardins.',
      data: {
        type: 'event_invitation_received',
        url: 'myapp://events/share/eeeeeeee-3333-3333-3333-333333333333',
        eventId: 'eeeeeeee-3333-3333-3333-333333333333',
        ownerId: USER_IDS.pedro
      },
      readAt: null,
      createdAt: hoursAgo(6)
    },
    {
      userId: USER_IDS.joao,
      type: 'follow_request_created',
      title: 'Nova solicitacao de follow',
      body: 'Lucas Ferreira quer seguir voce.',
      data: {
        type: 'follow_request_received',
        url: 'myapp://social/follow-requests/received',
        requesterId: USER_IDS.lucas
      },
      readAt: daysAgo(2),
      createdAt: daysAgo(3)
    },
    {
      userId: USER_IDS.joao,
      type: 'event_invitation',
      title: 'Novo convite para evento',
      body: 'Maria Santos convidou voce para um churrasco antigo.',
      data: {
        type: 'event_invitation_received',
        url: 'myapp://events/share/eeeeeeee-1111-1111-1111-111111111111',
        eventId: 'eeeeeeee-1111-1111-1111-111111111111',
        ownerId: USER_IDS.maria
      },
      readAt: daysAgo(5),
      createdAt: daysAgo(6)
    },

    {
      userId: USER_IDS.maria,
      type: 'event_invitation',
      title: 'Novo convite para evento',
      body: 'Joao Silva convidou voce para Churrasco na Paulista.',
      data: {
        type: 'event_invitation_received',
        url: 'myapp://events/share/eeeeeeee-1111-1111-1111-111111111111',
        eventId: 'eeeeeeee-1111-1111-1111-111111111111',
        ownerId: USER_IDS.joao
      },
      readAt: null,
      createdAt: minutesAgo(30)
    },
    {
      userId: USER_IDS.maria,
      type: 'event_invitation',
      title: 'Novo convite para evento',
      body: 'Pedro Oliveira convidou voce para Pizza Night Jardins.',
      data: {
        type: 'event_invitation_received',
        url: 'myapp://events/share/eeeeeeee-3333-3333-3333-333333333333',
        eventId: 'eeeeeeee-3333-3333-3333-333333333333',
        ownerId: USER_IDS.pedro
      },
      readAt: hoursAgo(4),
      createdAt: hoursAgo(5)
    },

    {
      userId: USER_IDS.ana,
      type: 'event_invitation',
      title: 'Novo convite para evento',
      body: 'Joao Silva convidou voce para Churrasco na Paulista.',
      data: {
        type: 'event_invitation_received',
        url: 'myapp://events/share/eeeeeeee-1111-1111-1111-111111111111',
        eventId: 'eeeeeeee-1111-1111-1111-111111111111',
        ownerId: USER_IDS.joao
      },
      readAt: null,
      createdAt: hoursAgo(1)
    },
    {
      userId: USER_IDS.ana,
      type: 'event_invitation',
      title: 'Novo convite para evento',
      body: 'Pedro Oliveira convidou voce para Pizza Night Jardins.',
      data: {
        type: 'event_invitation_received',
        url: 'myapp://events/share/eeeeeeee-3333-3333-3333-333333333333',
        eventId: 'eeeeeeee-3333-3333-3333-333333333333',
        ownerId: USER_IDS.pedro
      },
      readAt: null,
      createdAt: daysAgo(1)
    },

    {
      userId: USER_IDS.lucas,
      type: 'follow_request_created',
      title: 'Nova solicitacao de follow',
      body: 'Ana Costa quer seguir voce.',
      data: {
        type: 'follow_request_received',
        url: 'myapp://social/follow-requests/received',
        requesterId: USER_IDS.ana
      },
      readAt: null,
      createdAt: hoursAgo(3)
    },
    {
      userId: USER_IDS.lucas,
      type: 'event_invitation',
      title: 'Novo convite para evento',
      body: 'Maria Santos convidou voce para Happy Hour no Starbucks.',
      data: {
        type: 'event_invitation_received',
        url: 'myapp://events/share/eeeeeeee-2222-2222-2222-222222222222',
        eventId: 'eeeeeeee-2222-2222-2222-222222222222',
        ownerId: USER_IDS.maria
      },
      readAt: hoursAgo(8),
      createdAt: hoursAgo(10)
    }
  ])

  console.log('Seeding completed!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
