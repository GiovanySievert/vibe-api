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
  placeReviewReactions,
  events,
  eventParticipants,
  eventComments,
  appNotifications,
  notificationPreferences,
  userStreaks,
  userWeeklyActivity,
  userPlaceBadges
} from '../schema'
import { osmBrands, osmPlaces, osmPlaceLocations } from './data/curitiba-osm-places'

const USER_IDS = {
  joao: '11111111-1111-1111-1111-111111111111',
  maria: '22222222-2222-2222-2222-222222222222',
  pedro: '33333333-3333-3333-3333-333333333333',
  ana: '44444444-4444-4444-4444-444444444444',
  lucas: '55555555-5555-5555-5555-555555555555',
  // extra users
  carla: 'aa000001-0000-0000-0000-000000000001',
  rafael: 'aa000002-0000-0000-0000-000000000002',
  bruna: 'aa000003-0000-0000-0000-000000000003',
  thiago: 'aa000004-0000-0000-0000-000000000004',
  fernanda: 'aa000005-0000-0000-0000-000000000005',
  gabriel: 'aa000006-0000-0000-0000-000000000006',
  juliana: 'aa000007-0000-0000-0000-000000000007',
  marcos: 'aa000008-0000-0000-0000-000000000008',
  beatriz: 'aa000009-0000-0000-0000-000000000009',
  rodrigo: 'aa000010-0000-0000-0000-000000000010',
  camila: 'aa000011-0000-0000-0000-000000000011',
  vinicius: 'aa000012-0000-0000-0000-000000000012'
}

const BRAND_IDS = {
  jamesBar: '196f2298-6100-4ed5-ae1b-080c011126d1',
  tesorosDeCuba: '0d04db46-e68e-453c-a55b-f0aa572625f7',
  botecoBoaPraca: '3b18d50b-cd41-471f-ab30-cc1be77b4225',
  seuPrudente: '71965752-fa1a-4fbd-ad07-e45fcc8b4b9a',
  revistariaVisconde: 'ef2f8ea0-eeb7-44f3-adb9-6874d35d42c9',
  barOtelo: '2f2f77e3-fc88-4fa1-a2d2-5e8decbfdca6',
  amarelinho: 'ff2ff35f-99f7-4ade-a806-fa176390b978',
  janelaBar: '9575d73a-c45b-402f-a602-96b093bb4458',
  caramelo: 'edde69e4-1716-4f7e-a531-3f39d7216a63',
  jatai: '9b264373-d86d-432e-a6c9-874bd50de16b',
  ottroRole: 'f72d7d81-c5cc-435f-ad0b-f229ff5df70a'
}

const PLACE_IDS = {
  jamesBar: '58f0220a-1806-45b1-ae01-bda728ef0f83',
  tesorosDeCuba: '4c3e795d-0166-41c1-a37d-1aba9290cb08',
  botecoBoaPraca: 'f5e4bffd-8d24-410d-af3d-1d38abc61a58',
  seuPrudente: '2db33be6-eff2-4a49-a128-9fd46d5aee04',
  revistariaVisconde: '3d2e1141-0f1f-44f7-a4b4-035936d5a51a',
  barOtelo: 'ad87d507-a07d-404b-ad5b-ad1e0c898916',
  amarelinho: '7c6924b7-cdeb-469d-a3ce-c6768ef574b4',
  janelaBar: '9b13f4b3-a928-4f80-a232-38214fc2ca9f',
  caramelo: '16724293-c629-49ed-ae5d-f1419675fd7e',
  jatai: '75a51af8-1170-4422-aa82-64b87c6d0adf',
  ottroRole: '50eea33c-4b9c-447b-ac0e-54425e6b5663'
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
  await db.delete(userPlaceBadges)
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
    },
    {
      id: USER_IDS.carla,
      name: 'Carla Mendes',
      username: 'carlamendes',
      email: 'carla@email.com',
      emailVerified: true,
      image: 'https://picsum.photos/200/200?random=6&place=review'
    },
    {
      id: USER_IDS.rafael,
      name: 'Rafael Souza',
      username: 'rafaelsouza',
      email: 'rafael@email.com',
      emailVerified: true,
      image: 'https://picsum.photos/200/200?random=7&place=review'
    },
    {
      id: USER_IDS.bruna,
      name: 'Bruna Lima',
      username: 'brunalima',
      email: 'bruna@email.com',
      emailVerified: true,
      image: 'https://picsum.photos/200/200?random=8&place=review'
    },
    {
      id: USER_IDS.thiago,
      name: 'Thiago Rocha',
      username: 'thiagorocha',
      email: 'thiago@email.com',
      emailVerified: true,
      image: 'https://picsum.photos/200/200?random=9&place=review'
    },
    {
      id: USER_IDS.fernanda,
      name: 'Fernanda Castro',
      username: 'fernandacastro',
      email: 'fernanda@email.com',
      emailVerified: true,
      image: 'https://picsum.photos/200/200?random=10&place=review'
    },
    {
      id: USER_IDS.gabriel,
      name: 'Gabriel Nunes',
      username: 'gabrielnunes',
      email: 'gabriel@email.com',
      emailVerified: true,
      image: 'https://picsum.photos/200/200?random=11&place=review'
    },
    {
      id: USER_IDS.juliana,
      name: 'Juliana Alves',
      username: 'julianaalves',
      email: 'juliana@email.com',
      emailVerified: true,
      image: 'https://picsum.photos/200/200?random=12&place=review'
    },
    {
      id: USER_IDS.marcos,
      name: 'Marcos Barbosa',
      username: 'marcosbarbosa',
      email: 'marcos@email.com',
      emailVerified: true,
      image: 'https://picsum.photos/200/200?random=13&place=review'
    },
    {
      id: USER_IDS.beatriz,
      name: 'Beatriz Pinto',
      username: 'beatrizpinto',
      email: 'beatriz@email.com',
      emailVerified: true,
      image: 'https://picsum.photos/200/200?random=14&place=review'
    },
    {
      id: USER_IDS.rodrigo,
      name: 'Rodrigo Teixeira',
      username: 'rodrigoteixeira',
      email: 'rodrigo@email.com',
      emailVerified: true,
      image: 'https://picsum.photos/200/200?random=15&place=review'
    },
    {
      id: USER_IDS.camila,
      name: 'Camila Freitas',
      username: 'camilafreitas',
      email: 'camila@email.com',
      emailVerified: true,
      image: 'https://picsum.photos/200/200?random=16&place=review'
    },
    {
      id: USER_IDS.vinicius,
      name: 'Vinicius Cardoso',
      username: 'viniciuscardoso',
      email: 'vinicius@email.com',
      emailVerified: true,
      image: 'https://picsum.photos/200/200?random=17&place=review'
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
    },
    {
      accountId: USER_IDS.carla,
      providerId: 'credential',
      userId: USER_IDS.carla,
      password:
        '$argon2id$v=19$m=65536,t=2,p=1$f/4kZmu8cyp1cc0Ujkzw5WHTPYoZ5ZPAk3fMlP8SKeA$wdCiM/wGd+TbYrHmtO9MVciTZrTT0IfRzBgQV0CbB8M'
    },
    {
      accountId: USER_IDS.rafael,
      providerId: 'credential',
      userId: USER_IDS.rafael,
      password:
        '$argon2id$v=19$m=65536,t=2,p=1$f/4kZmu8cyp1cc0Ujkzw5WHTPYoZ5ZPAk3fMlP8SKeA$wdCiM/wGd+TbYrHmtO9MVciTZrTT0IfRzBgQV0CbB8M'
    },
    {
      accountId: USER_IDS.bruna,
      providerId: 'credential',
      userId: USER_IDS.bruna,
      password:
        '$argon2id$v=19$m=65536,t=2,p=1$f/4kZmu8cyp1cc0Ujkzw5WHTPYoZ5ZPAk3fMlP8SKeA$wdCiM/wGd+TbYrHmtO9MVciTZrTT0IfRzBgQV0CbB8M'
    },
    {
      accountId: USER_IDS.thiago,
      providerId: 'credential',
      userId: USER_IDS.thiago,
      password:
        '$argon2id$v=19$m=65536,t=2,p=1$f/4kZmu8cyp1cc0Ujkzw5WHTPYoZ5ZPAk3fMlP8SKeA$wdCiM/wGd+TbYrHmtO9MVciTZrTT0IfRzBgQV0CbB8M'
    },
    {
      accountId: USER_IDS.fernanda,
      providerId: 'credential',
      userId: USER_IDS.fernanda,
      password:
        '$argon2id$v=19$m=65536,t=2,p=1$f/4kZmu8cyp1cc0Ujkzw5WHTPYoZ5ZPAk3fMlP8SKeA$wdCiM/wGd+TbYrHmtO9MVciTZrTT0IfRzBgQV0CbB8M'
    },
    {
      accountId: USER_IDS.gabriel,
      providerId: 'credential',
      userId: USER_IDS.gabriel,
      password:
        '$argon2id$v=19$m=65536,t=2,p=1$f/4kZmu8cyp1cc0Ujkzw5WHTPYoZ5ZPAk3fMlP8SKeA$wdCiM/wGd+TbYrHmtO9MVciTZrTT0IfRzBgQV0CbB8M'
    },
    {
      accountId: USER_IDS.juliana,
      providerId: 'credential',
      userId: USER_IDS.juliana,
      password:
        '$argon2id$v=19$m=65536,t=2,p=1$f/4kZmu8cyp1cc0Ujkzw5WHTPYoZ5ZPAk3fMlP8SKeA$wdCiM/wGd+TbYrHmtO9MVciTZrTT0IfRzBgQV0CbB8M'
    },
    {
      accountId: USER_IDS.marcos,
      providerId: 'credential',
      userId: USER_IDS.marcos,
      password:
        '$argon2id$v=19$m=65536,t=2,p=1$f/4kZmu8cyp1cc0Ujkzw5WHTPYoZ5ZPAk3fMlP8SKeA$wdCiM/wGd+TbYrHmtO9MVciTZrTT0IfRzBgQV0CbB8M'
    },
    {
      accountId: USER_IDS.beatriz,
      providerId: 'credential',
      userId: USER_IDS.beatriz,
      password:
        '$argon2id$v=19$m=65536,t=2,p=1$f/4kZmu8cyp1cc0Ujkzw5WHTPYoZ5ZPAk3fMlP8SKeA$wdCiM/wGd+TbYrHmtO9MVciTZrTT0IfRzBgQV0CbB8M'
    },
    {
      accountId: USER_IDS.rodrigo,
      providerId: 'credential',
      userId: USER_IDS.rodrigo,
      password:
        '$argon2id$v=19$m=65536,t=2,p=1$f/4kZmu8cyp1cc0Ujkzw5WHTPYoZ5ZPAk3fMlP8SKeA$wdCiM/wGd+TbYrHmtO9MVciTZrTT0IfRzBgQV0CbB8M'
    },
    {
      accountId: USER_IDS.camila,
      providerId: 'credential',
      userId: USER_IDS.camila,
      password:
        '$argon2id$v=19$m=65536,t=2,p=1$f/4kZmu8cyp1cc0Ujkzw5WHTPYoZ5ZPAk3fMlP8SKeA$wdCiM/wGd+TbYrHmtO9MVciTZrTT0IfRzBgQV0CbB8M'
    },
    {
      accountId: USER_IDS.vinicius,
      providerId: 'credential',
      userId: USER_IDS.vinicius,
      password:
        '$argon2id$v=19$m=65536,t=2,p=1$f/4kZmu8cyp1cc0Ujkzw5WHTPYoZ5ZPAk3fMlP8SKeA$wdCiM/wGd+TbYrHmtO9MVciTZrTT0IfRzBgQV0CbB8M'
    }
  ])

  console.log('Seeding brands...')
  await db.insert(brands).values(osmBrands)

  console.log('Seeding places...')
  await db.insert(places).values(osmPlaces)

  console.log('Seeding place locations...')
  await db.insert(placeLocations).values(osmPlaceLocations)

  console.log('Seeding brand menus...')
  await db.insert(brandMenus).values([
    {
      brandId: BRAND_IDS.botecoBoaPraca,
      name: 'Whopper',
      description: 'O classico hamburguer grelhado no fogo',
      priceCents: 2990
    },
    {
      brandId: BRAND_IDS.botecoBoaPraca,
      name: 'Whopper Duplo',
      description: 'Duas carnes grelhadas no fogo',
      priceCents: 3990
    },
    {
      brandId: BRAND_IDS.botecoBoaPraca,
      name: 'Onion Rings',
      description: 'Aneis de cebola empanados e crocantes',
      priceCents: 1290
    },

    {
      brandId: BRAND_IDS.tesorosDeCuba,
      name: 'Pizza Pepperoni Grande',
      description: 'Pizza com pepperoni e queijo',
      priceCents: 5990
    },
    {
      brandId: BRAND_IDS.tesorosDeCuba,
      name: 'Pizza Margherita Grande',
      description: 'Pizza com tomate, mussarela e manjericao',
      priceCents: 4990
    },

    {
      brandId: BRAND_IDS.caramelo,
      name: 'Caramel Macchiato',
      description: 'Espresso com leite vaporizado e caramelo',
      priceCents: 1890
    },
    {
      brandId: BRAND_IDS.caramelo,
      name: 'Frappuccino Mocha',
      description: 'Bebida gelada com cafe, chocolate e chantilly',
      priceCents: 2190
    },

    {
      brandId: BRAND_IDS.jamesBar,
      name: 'Bloomin Onion',
      description: 'Cebola gigante empanada e frita',
      priceCents: 5990
    },
    {
      brandId: BRAND_IDS.jamesBar,
      name: 'Ribeye Steak',
      description: 'Corte nobre grelhado no ponto',
      priceCents: 8990
    },

    {
      brandId: BRAND_IDS.revistariaVisconde,
      name: 'Big Mac',
      description: 'Dois hamburgueres, alface, queijo, molho especial',
      priceCents: 2490
    },
    {
      brandId: BRAND_IDS.revistariaVisconde,
      name: 'McFlurry Ovomaltine',
      description: 'Sorvete com Ovomaltine',
      priceCents: 1290
    },

    {
      brandId: BRAND_IDS.seuPrudente,
      name: 'Negroni da Casa',
      description: 'Drinque autoral com gin, campari e vermute',
      priceCents: 2890
    },
    {
      brandId: BRAND_IDS.seuPrudente,
      name: 'Tábua de Frios Barelho',
      description: 'Queijos, embutidos e pao de fermentacao natural',
      priceCents: 4990
    },
    {
      brandId: BRAND_IDS.seuPrudente,
      name: 'Gin Tônica Especial',
      description: 'Gin artesanal com tonico e botanicos frescos',
      priceCents: 2490
    },

    {
      brandId: BRAND_IDS.janelaBar,
      name: 'Chope Artesanal IPA',
      description: 'IPA gelado de cervejaria local, 500ml',
      priceCents: 1890
    },
    {
      brandId: BRAND_IDS.janelaBar,
      name: 'Bolinha de Queijo',
      description: 'Porcao com 10 bolinhas crocantes recheadas',
      priceCents: 2290
    },
    {
      brandId: BRAND_IDS.janelaBar,
      name: 'Hamburguer Pub',
      description: 'Artesanal com cheddar, bacon e aioli',
      priceCents: 3490
    },

    {
      brandId: BRAND_IDS.jatai,
      name: 'Bruschetta ao Tomate',
      description: 'Pao rústico com tomate cereja, basilico e azeite',
      priceCents: 2490
    },
    {
      brandId: BRAND_IDS.jatai,
      name: 'Tagliatelle Carbonara',
      description: 'Massa fresca com pancetta, ovo e parmesao',
      priceCents: 4990
    },
    {
      brandId: BRAND_IDS.jatai,
      name: 'Tiramisu',
      description: 'Sobremesa italiana classica com cafe e mascarpone',
      priceCents: 2290
    },

    {
      brandId: BRAND_IDS.ottroRole,
      name: 'Chope Pilsen 600ml',
      description: 'Chope gelado bem tirado',
      priceCents: 1290
    },
    {
      brandId: BRAND_IDS.ottroRole,
      name: 'Porcao de Frango',
      description: 'Frango frito temperado, porcao generosa',
      priceCents: 2490
    },
    {
      brandId: BRAND_IDS.ottroRole,
      name: 'Caldo de Feijao',
      description: 'Caldo espesso com linguica e torresmo',
      priceCents: 1590
    },

    {
      brandId: BRAND_IDS.barOtelo,
      name: 'Taça de Vinho Natural Branco',
      description: 'Curadoria de vinhos naturais, selecao do dia',
      priceCents: 3490
    },
    {
      brandId: BRAND_IDS.barOtelo,
      name: 'Taça de Vinho Natural Tinto',
      description: 'Tinto natural de pequeno produtor, selecao do dia',
      priceCents: 3690
    },
    {
      brandId: BRAND_IDS.barOtelo,
      name: 'Tábua Premium',
      description: 'Queijos especiais, presunto cru e geleias artesanais',
      priceCents: 6990
    },

    {
      brandId: BRAND_IDS.amarelinho,
      name: 'Caipirinha da Casa',
      description: 'Cachaça artesanal, limão siciliano e bastante gelo',
      priceCents: 1990
    },
    {
      brandId: BRAND_IDS.amarelinho,
      name: 'Espetinho Misto',
      description: 'Frango, linguiça e queijo coalho na brasa',
      priceCents: 2290
    },
    {
      brandId: BRAND_IDS.amarelinho,
      name: 'Porção de Mandioca Frita',
      description: 'Mandioca crocante com vinagrete e molho de pimenta',
      priceCents: 1890
    }
  ])

  console.log('Seeding followers...')
  // joao follows and is followed by all 12 extra users (12 followers + 12 following)
  // plus the original relationships between the 5 base users
  await db.insert(followers).values([
    // original base relationships
    { followerId: USER_IDS.joao, followingId: USER_IDS.maria },
    { followerId: USER_IDS.joao, followingId: USER_IDS.pedro },
    { followerId: USER_IDS.maria, followingId: USER_IDS.joao },
    { followerId: USER_IDS.maria, followingId: USER_IDS.ana },
    { followerId: USER_IDS.pedro, followingId: USER_IDS.joao },
    { followerId: USER_IDS.pedro, followingId: USER_IDS.lucas },
    { followerId: USER_IDS.ana, followingId: USER_IDS.maria },
    { followerId: USER_IDS.lucas, followingId: USER_IDS.joao },
    { followerId: USER_IDS.lucas, followingId: USER_IDS.maria },
    { followerId: USER_IDS.lucas, followingId: USER_IDS.pedro },
    // joao follows all 12 extra users
    { followerId: USER_IDS.joao, followingId: USER_IDS.carla },
    { followerId: USER_IDS.joao, followingId: USER_IDS.rafael },
    { followerId: USER_IDS.joao, followingId: USER_IDS.bruna },
    { followerId: USER_IDS.joao, followingId: USER_IDS.thiago },
    { followerId: USER_IDS.joao, followingId: USER_IDS.fernanda },
    { followerId: USER_IDS.joao, followingId: USER_IDS.gabriel },
    { followerId: USER_IDS.joao, followingId: USER_IDS.juliana },
    { followerId: USER_IDS.joao, followingId: USER_IDS.marcos },
    { followerId: USER_IDS.joao, followingId: USER_IDS.beatriz },
    { followerId: USER_IDS.joao, followingId: USER_IDS.rodrigo },
    { followerId: USER_IDS.joao, followingId: USER_IDS.camila },
    { followerId: USER_IDS.joao, followingId: USER_IDS.vinicius },
    // all 12 extra users follow joao
    { followerId: USER_IDS.carla, followingId: USER_IDS.joao },
    { followerId: USER_IDS.rafael, followingId: USER_IDS.joao },
    { followerId: USER_IDS.bruna, followingId: USER_IDS.joao },
    { followerId: USER_IDS.thiago, followingId: USER_IDS.joao },
    { followerId: USER_IDS.fernanda, followingId: USER_IDS.joao },
    { followerId: USER_IDS.gabriel, followingId: USER_IDS.joao },
    { followerId: USER_IDS.juliana, followingId: USER_IDS.joao },
    { followerId: USER_IDS.marcos, followingId: USER_IDS.joao },
    { followerId: USER_IDS.beatriz, followingId: USER_IDS.joao },
    { followerId: USER_IDS.rodrigo, followingId: USER_IDS.joao },
    { followerId: USER_IDS.camila, followingId: USER_IDS.joao },
    { followerId: USER_IDS.vinicius, followingId: USER_IDS.joao }
  ])

  console.log('Seeding follow stats...')
  // joao: 12 extra followers + maria + pedro + lucas = 15 followers; 12 extra following + maria + pedro = 14 following
  await db.insert(followStats).values([
    { userId: USER_IDS.joao, followersCount: 15, followingCount: 14 },
    { userId: USER_IDS.maria, followersCount: 3, followingCount: 2 },
    { userId: USER_IDS.pedro, followersCount: 2, followingCount: 2 },
    { userId: USER_IDS.ana, followersCount: 1, followingCount: 1 },
    { userId: USER_IDS.lucas, followersCount: 1, followingCount: 3 },
    { userId: USER_IDS.carla, followersCount: 0, followingCount: 1 },
    { userId: USER_IDS.rafael, followersCount: 0, followingCount: 1 },
    { userId: USER_IDS.bruna, followersCount: 0, followingCount: 1 },
    { userId: USER_IDS.thiago, followersCount: 0, followingCount: 1 },
    { userId: USER_IDS.fernanda, followersCount: 0, followingCount: 1 },
    { userId: USER_IDS.gabriel, followersCount: 0, followingCount: 1 },
    { userId: USER_IDS.juliana, followersCount: 0, followingCount: 1 },
    { userId: USER_IDS.marcos, followersCount: 0, followingCount: 1 },
    { userId: USER_IDS.beatriz, followersCount: 0, followingCount: 1 },
    { userId: USER_IDS.rodrigo, followersCount: 0, followingCount: 1 },
    { userId: USER_IDS.camila, followersCount: 0, followingCount: 1 },
    { userId: USER_IDS.vinicius, followersCount: 0, followingCount: 1 }
  ])

  console.log('Seeding user favorites places...')
  await db.insert(userFavoritesPlaces).values([
    { userId: USER_IDS.joao, placeId: PLACE_IDS.botecoBoaPraca },
    { userId: USER_IDS.joao, placeId: PLACE_IDS.jamesBar },
    { userId: USER_IDS.maria, placeId: PLACE_IDS.caramelo },
    { userId: USER_IDS.maria, placeId: PLACE_IDS.janelaBar },
    { userId: USER_IDS.pedro, placeId: PLACE_IDS.tesorosDeCuba },
    { userId: USER_IDS.pedro, placeId: PLACE_IDS.revistariaVisconde },
    { userId: USER_IDS.ana, placeId: PLACE_IDS.jamesBar },
    { userId: USER_IDS.lucas, placeId: PLACE_IDS.janelaBar }
  ])

  console.log('Seeding place reviews...')
  await db.insert(placeReviews).values([
    {
      userId: USER_IDS.joao,
      placeId: PLACE_IDS.botecoBoaPraca,
      placeName: 'Burger King - Paulista',
      rating: 'crowded',
      comment: 'Melhor Whopper que ja comi! Atendimento rapido.',
      placeImageUrl: 'https://picsum.photos/800/600?random=100&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=1&place=review',
      selfieFriendsOnly: true
    },
    {
      userId: USER_IDS.maria,
      placeId: PLACE_IDS.botecoBoaPraca,
      placeName: 'Burger King - Paulista',
      rating: 'crowded',
      comment: 'Muito bom, mas as vezes demora um pouco.',
      placeImageUrl: 'https://picsum.photos/800/600?random=101&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=2&place=review'
    },
    {
      userId: USER_IDS.lucas,
      placeId: PLACE_IDS.botecoBoaPraca,
      placeName: 'Burger King - Paulista',
      rating: 'crowded',
      comment: 'Sempre lotado na hora do almoco, chega cedo.',
      placeImageUrl: 'https://picsum.photos/800/600?random=200&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=5&place=review'
    },

    {
      userId: USER_IDS.pedro,
      placeId: PLACE_IDS.tesorosDeCuba,
      placeName: 'Burger King - Moema',
      rating: 'dead',
      comment: 'Mais tranquilo que o da Paulista, prefiro esse.',
      placeImageUrl: 'https://picsum.photos/800/600?random=102&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=3&place=review',
      selfieFriendsOnly: true
    },
    {
      userId: USER_IDS.ana,
      placeId: PLACE_IDS.tesorosDeCuba,
      placeName: 'Burger King - Moema',
      rating: 'dead',
      comment: 'Atendimento rapido, quase sem fila.',
      placeImageUrl: 'https://picsum.photos/800/600?random=201&place=review',
      selfieUrl: null
    },

    {
      userId: USER_IDS.pedro,
      placeId: PLACE_IDS.caramelo,
      placeName: 'Pizza Hut - Jardins',
      rating: 'crowded',
      comment: 'Pizza deliciosa, ambiente agradavel.',
      placeImageUrl: 'https://picsum.photos/800/600?random=103&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=3&place=review'
    },
    {
      userId: USER_IDS.maria,
      placeId: PLACE_IDS.caramelo,
      placeName: 'Pizza Hut - Jardins',
      rating: 'crowded',
      comment: 'Pepperoni incrivel, mas cheio no fim de semana.',
      placeImageUrl: 'https://picsum.photos/800/600?random=104&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=2&place=review',
      selfieFriendsOnly: true
    },

    {
      userId: USER_IDS.ana,
      placeId: PLACE_IDS.jamesBar,
      placeName: 'Starbucks - Faria Lima',
      rating: 'dead',
      comment: 'Cafe otimo, mas preco salgado.',
      placeImageUrl: 'https://picsum.photos/800/600?random=105&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=4&place=review'
    },
    {
      userId: USER_IDS.pedro,
      placeId: PLACE_IDS.jamesBar,
      placeName: 'Starbucks - Faria Lima',
      rating: 'dead',
      comment: 'Bom para trabalhar, wifi excelente.',
      placeImageUrl: 'https://picsum.photos/800/600?random=106&place=review',
      selfieUrl: null
    },
    {
      userId: USER_IDS.joao,
      placeId: PLACE_IDS.jamesBar,
      placeName: 'Starbucks - Faria Lima',
      rating: 'dead',
      comment: 'Sempre tem lugar vago pela manha.',
      placeImageUrl: 'https://picsum.photos/800/600?random=202&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=1&place=review'
    },

    {
      userId: USER_IDS.lucas,
      placeId: PLACE_IDS.janelaBar,
      placeName: 'Outback - Moema',
      rating: 'crowded',
      comment: 'Ribeye perfeito! Bloomin Onion sensacional.',
      placeImageUrl: 'https://picsum.photos/800/600?random=107&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=5&place=review'
    },
    {
      userId: USER_IDS.maria,
      placeId: PLACE_IDS.janelaBar,
      placeName: 'Outback - Moema',
      rating: 'dead',
      comment: 'Adorei! Perfeito para ocasioes especiais.',
      placeImageUrl: 'https://picsum.photos/800/600?random=108&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=2&place=review'
    },

    {
      userId: USER_IDS.joao,
      placeId: PLACE_IDS.revistariaVisconde,
      placeName: "McDonald's - Ibirapuera",
      rating: 'crowded',
      comment: 'Basico, mas cumpre o que promete.',
      placeImageUrl: 'https://picsum.photos/800/600?random=109&place=review',
      selfieUrl: null
    },
    {
      userId: USER_IDS.lucas,
      placeId: PLACE_IDS.revistariaVisconde,
      placeName: "McDonald's - Ibirapuera",
      rating: 'crowded',
      comment: 'Cheio depois do parque, espera uns 10 minutos.',
      placeImageUrl: 'https://picsum.photos/800/600?random=203&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=5&place=review'
    },

    {
      userId: USER_IDS.joao,
      placeId: PLACE_IDS.seuPrudente,
      placeName: 'Barelho Bar',
      rating: 'crowded',
      comment: 'Negroni impecavel, musica ao vivo na sexta e o lugar lotou rapido.',
      placeImageUrl: 'https://picsum.photos/800/600?random=110&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=1&place=review',
      selfieFriendsOnly: true
    },
    {
      userId: USER_IDS.maria,
      placeId: PLACE_IDS.seuPrudente,
      placeName: 'Barelho Bar',
      rating: 'crowded',
      comment: 'Ambiente super agradavel, drinques otimos. Ja virou meu favorito do Batel.',
      placeImageUrl: 'https://picsum.photos/800/600?random=111&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=2&place=review'
    },

    {
      userId: USER_IDS.pedro,
      placeId: PLACE_IDS.tesorosDeCuba,
      placeName: 'Prudente Pub',
      rating: 'crowded',
      comment: 'Melhor IPA da cidade, porcao de bolinha de queijo enorme. Vai sempre cheio.',
      placeImageUrl: 'https://picsum.photos/800/600?random=112&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=3&place=review',
      selfieFriendsOnly: true
    },
    {
      userId: USER_IDS.lucas,
      placeId: PLACE_IDS.tesorosDeCuba,
      placeName: 'Prudente Pub',
      rating: 'dead',
      comment: 'Fui numa quarta e tava tranquilo, perfeito pra uma cerveja sem barulho.',
      placeImageUrl: 'https://picsum.photos/800/600?random=204&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=5&place=review'
    },

    {
      userId: USER_IDS.ana,
      placeId: PLACE_IDS.jatai,
      placeName: 'Cantina do Batel',
      rating: 'dead',
      comment: 'Ambiente intimo, carbonara deliciosa. Bom pra jantar a dois.',
      placeImageUrl: 'https://picsum.photos/800/600?random=113&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=4&place=review'
    },
    {
      userId: USER_IDS.maria,
      placeId: PLACE_IDS.jatai,
      placeName: 'Cantina do Batel',
      rating: 'crowded',
      comment: 'No sabado tava bem cheio mas valeu a espera, comida excelente.',
      placeImageUrl: 'https://picsum.photos/800/600?random=114&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=2&place=review'
    },

    {
      userId: USER_IDS.joao,
      placeId: PLACE_IDS.barOtelo,
      placeName: 'Moraes Wine',
      rating: 'dead',
      comment: 'Curadoria de vinhos naturais impressionante, atendimento atencioso.',
      placeImageUrl: 'https://picsum.photos/800/600?random=116&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=1&place=review'
    },
    {
      userId: USER_IDS.ana,
      placeId: PLACE_IDS.barOtelo,
      placeName: 'Moraes Wine',
      rating: 'dead',
      comment: 'Lugar sofisticado, tranquilo e com uma selecao de vinhos que voce nao acha em outro lugar.',
      placeImageUrl: 'https://picsum.photos/800/600?random=117&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=4&place=review',
      selfieFriendsOnly: true
    },

    {
      userId: USER_IDS.pedro,
      placeId: PLACE_IDS.amarelinho,
      placeName: 'Quintal do Batel',
      rating: 'crowded',
      comment: 'Caipirinha perfeita e o espetinho e absurdo. Tava cheio mas valeu cada minuto de espera.',
      placeImageUrl: 'https://picsum.photos/800/600?random=118&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=3&place=review'
    },
    {
      userId: USER_IDS.maria,
      placeId: PLACE_IDS.amarelinho,
      placeName: 'Quintal do Batel',
      rating: 'dead',
      comment: 'Fui numa segunda e tinha quase ninguem, ótimo pra bater papo. Mandioca frita e delicia.',
      placeImageUrl: 'https://picsum.photos/800/600?random=206&place=review',
      selfieUrl: 'https://picsum.photos/200/200?random=2&place=review',
      selfieFriendsOnly: true
    }
  ])

  console.log('Seeding popular reviews (old, high interactions)...')
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
  const seventyDaysAgo = new Date(Date.now() - 70 * 24 * 60 * 60 * 1000)
  const fiftyDaysAgo = new Date(Date.now() - 50 * 24 * 60 * 60 * 1000)

  const popularReviews = await db
    .insert(placeReviews)
    .values([
      {
        userId: USER_IDS.joao,
        placeId: PLACE_IDS.ottroRole,
        placeName: 'Vila do Chopp',
        rating: 'crowded',
        comment: 'Melhor chope da cidade, fila enorme mas vale cada minuto.',
        placeImageUrl: 'https://picsum.photos/800/600?random=300&place=review',
        selfieUrl: 'https://picsum.photos/200/200?random=10&place=review',
        createdAt: ninetyDaysAgo,
        updatedAt: ninetyDaysAgo
      },
      {
        userId: USER_IDS.maria,
        placeId: PLACE_IDS.ottroRole,
        placeName: 'Vila do Chopp',
        rating: 'crowded',
        comment: 'Ambiente incrivel, musica ao vivo toda sexta. Lotado mas divertido.',
        placeImageUrl: 'https://picsum.photos/800/600?random=301&place=review',
        selfieUrl: 'https://picsum.photos/200/200?random=11&place=review',
        createdAt: seventyDaysAgo,
        updatedAt: seventyDaysAgo
      },
      {
        userId: USER_IDS.pedro,
        placeId: PLACE_IDS.ottroRole,
        placeName: 'Vila do Chopp',
        rating: 'dead',
        comment: 'Fui numa terca e tava tranquilo, servico rapido e chope gelado.',
        placeImageUrl: 'https://picsum.photos/800/600?random=302&place=review',
        selfieUrl: null,
        createdAt: fiftyDaysAgo,
        updatedAt: fiftyDaysAgo
      }
    ])
    .returning()

  const [reviewA, reviewB, reviewC] = popularReviews

  await db.insert(placeReviewReactions).values([
    { reviewId: reviewA.id, userId: USER_IDS.maria, type: 'on' },
    { reviewId: reviewA.id, userId: USER_IDS.pedro, type: 'on' },
    { reviewId: reviewA.id, userId: USER_IDS.ana, type: 'on' },
    { reviewId: reviewA.id, userId: USER_IDS.lucas, type: 'on' },
    { reviewId: reviewA.id, userId: USER_IDS.carla, type: 'on' },
    { reviewId: reviewA.id, userId: USER_IDS.rafael, type: 'on' },
    { reviewId: reviewA.id, userId: USER_IDS.bruna, type: 'off' },
    { reviewId: reviewA.id, userId: USER_IDS.thiago, type: 'on' },

    { reviewId: reviewB.id, userId: USER_IDS.joao, type: 'on' },
    { reviewId: reviewB.id, userId: USER_IDS.pedro, type: 'on' },
    { reviewId: reviewB.id, userId: USER_IDS.ana, type: 'on' },
    { reviewId: reviewB.id, userId: USER_IDS.lucas, type: 'on' },
    { reviewId: reviewB.id, userId: USER_IDS.carla, type: 'off' },
    { reviewId: reviewB.id, userId: USER_IDS.fernanda, type: 'on' },

    { reviewId: reviewC.id, userId: USER_IDS.joao, type: 'on' },
    { reviewId: reviewC.id, userId: USER_IDS.maria, type: 'on' },
    { reviewId: reviewC.id, userId: USER_IDS.ana, type: 'on' },
    { reviewId: reviewC.id, userId: USER_IDS.gabriel, type: 'on' }
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
    PLACE_IDS.seuPrudente,
    PLACE_IDS.tesorosDeCuba,
    PLACE_IDS.jatai,
    PLACE_IDS.ottroRole,
    PLACE_IDS.barOtelo,
    PLACE_IDS.amarelinho
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

  console.log('Seeding user place badges...')
  await db.insert(userPlaceBadges).values([
    // Joao: rei do Barelho Bar (20+ reviews históricos) + fã do Starbucks
    { userId: USER_IDS.joao, placeId: PLACE_IDS.seuPrudente, tier: 'regular' },
    { userId: USER_IDS.joao, placeId: PLACE_IDS.seuPrudente, tier: 'fan' },
    { userId: USER_IDS.joao, placeId: PLACE_IDS.seuPrudente, tier: 'frequent' },
    { userId: USER_IDS.joao, placeId: PLACE_IDS.seuPrudente, tier: 'legend' },
    { userId: USER_IDS.joao, placeId: PLACE_IDS.seuPrudente, tier: 'king' },
    { userId: USER_IDS.joao, placeId: PLACE_IDS.jamesBar, tier: 'regular' },
    { userId: USER_IDS.joao, placeId: PLACE_IDS.jamesBar, tier: 'fan' },

    // Maria: lenda do Outback + VIP da Cantina
    { userId: USER_IDS.maria, placeId: PLACE_IDS.janelaBar, tier: 'regular' },
    { userId: USER_IDS.maria, placeId: PLACE_IDS.janelaBar, tier: 'fan' },
    { userId: USER_IDS.maria, placeId: PLACE_IDS.janelaBar, tier: 'frequent' },
    { userId: USER_IDS.maria, placeId: PLACE_IDS.janelaBar, tier: 'legend' },
    { userId: USER_IDS.maria, placeId: PLACE_IDS.jatai, tier: 'regular' },
    { userId: USER_IDS.maria, placeId: PLACE_IDS.jatai, tier: 'fan' },
    { userId: USER_IDS.maria, placeId: PLACE_IDS.jatai, tier: 'frequent' },

    // Pedro: rei do Prudente Pub + cliente do Burger Moema
    { userId: USER_IDS.pedro, placeId: PLACE_IDS.tesorosDeCuba, tier: 'regular' },
    { userId: USER_IDS.pedro, placeId: PLACE_IDS.tesorosDeCuba, tier: 'fan' },
    { userId: USER_IDS.pedro, placeId: PLACE_IDS.tesorosDeCuba, tier: 'frequent' },
    { userId: USER_IDS.pedro, placeId: PLACE_IDS.tesorosDeCuba, tier: 'legend' },
    { userId: USER_IDS.pedro, placeId: PLACE_IDS.tesorosDeCuba, tier: 'king' },

    // Ana: fã do Moraes Wine + cliente da Cantina
    { userId: USER_IDS.ana, placeId: PLACE_IDS.barOtelo, tier: 'regular' },
    { userId: USER_IDS.ana, placeId: PLACE_IDS.barOtelo, tier: 'fan' },
    { userId: USER_IDS.ana, placeId: PLACE_IDS.jatai, tier: 'regular' },

    // Lucas: VIP da Vila do Chopp + cliente do Outback
    { userId: USER_IDS.lucas, placeId: PLACE_IDS.ottroRole, tier: 'regular' },
    { userId: USER_IDS.lucas, placeId: PLACE_IDS.ottroRole, tier: 'fan' },
    { userId: USER_IDS.lucas, placeId: PLACE_IDS.ottroRole, tier: 'frequent' },
    { userId: USER_IDS.lucas, placeId: PLACE_IDS.janelaBar, tier: 'regular' }
  ])

  console.log('Seeding completed!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
