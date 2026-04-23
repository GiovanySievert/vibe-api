import { db } from '../client'
import {
  users,
  accounts,
  brands,
  places,
  placeLocations,
  brandMenus,
  followers,
  followStats,
  userFavoritesPlaces,
  placeReviews
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
  mcdonalds: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'
}

const PLACE_IDS = {
  burgerPaulista: '11111111-aaaa-aaaa-aaaa-111111111111',
  burgerMoema: '22222222-aaaa-aaaa-aaaa-222222222222',
  pizzaJardins: '33333333-bbbb-bbbb-bbbb-333333333333',
  starbucksFaria: '44444444-cccc-cccc-cccc-444444444444',
  outbackMoema: '55555555-dddd-dddd-dddd-555555555555',
  mcdonaldsIbirapuera: '66666666-eeee-eeee-eeee-666666666666'
}

async function seed() {
  console.log('Seeding database...')

  console.log('Clearing existing data...')
  await db.delete(placeReviews)
  await db.delete(userFavoritesPlaces)
  await db.delete(followStats)
  await db.delete(followers)
  await db.delete(brandMenus)
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
      password: '$2a$10$hashedpassword123'
    },
    {
      accountId: USER_IDS.maria,
      providerId: 'credential',
      userId: USER_IDS.maria,
      password: '$2a$10$hashedpassword123'
    },
    {
      accountId: USER_IDS.pedro,
      providerId: 'credential',
      userId: USER_IDS.pedro,
      password: '$2a$10$hashedpassword123'
    },
    {
      accountId: USER_IDS.ana,
      providerId: 'credential',
      userId: USER_IDS.ana,
      password: '$2a$10$hashedpassword123'
    },
    {
      accountId: USER_IDS.lucas,
      providerId: 'credential',
      userId: USER_IDS.lucas,
      password: '$2a$10$hashedpassword123'
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
      userId: USER_IDS.pedro,
      placeId: PLACE_IDS.pizzaJardins,
      rating: 'crowded',

      comment: 'Pizza deliciosa, ambiente agradavel.'
    },
    {
      userId: USER_IDS.ana,
      placeId: PLACE_IDS.starbucksFaria,
      rating: 'dead',
      comment: 'Cafe otimo, mas preco salgado.'
    },
    {
      userId: USER_IDS.lucas,
      placeId: PLACE_IDS.outbackMoema,
      rating: 'crowded',
      comment: 'Ribeye perfeito! Bloomin Onion sensacional.'
    },
    {
      userId: USER_IDS.joao,
      placeId: PLACE_IDS.mcdonaldsIbirapuera,
      rating: 'crowded',
      comment: 'Basico, mas cumpre o que promete.'
    },
    {
      userId: USER_IDS.maria,
      placeId: PLACE_IDS.outbackMoema,
      rating: 'dead',
      comment: 'Adorei! Perfeito para ocasioes especiais.'
    },
    {
      userId: USER_IDS.pedro,
      placeId: PLACE_IDS.starbucksFaria,
      rating: 'dead',
      comment: 'Bom para trabalhar, wifi excelente.'
    }
  ])

  console.log('Seeding completed!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
