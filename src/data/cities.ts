// ─── City data for SEO landing pages ─────────────────────────────────────────
// Each city has unique, hand-written content to avoid thin/duplicate content.
// Add new cities by appending to the CITIES array below.

export type CityRegion =
  | 'london'
  | 'south-east'
  | 'south-west'
  | 'midlands'
  | 'north-west'
  | 'north-east'
  | 'east'
  | 'scotland'
  | 'wales';

export interface CityData {
  slug: string;
  name: string;
  county: string;
  region: CityRegion;
  postcodeAreas: string[];
  postcodeExample: string;
  population: string;
  heroDescription: string;
  localInsights: string[];
  averageCostRange: string;
  popularAreas: string[];
  movingTips: string[];
  nearbyCities: string[];
  parkingNotes?: string;
  congestionNotes?: string;
  propertyTypes?: string;
}

export const REGIONS: Record<CityRegion, { name: string; description: string }> = {
  london: {
    name: 'London',
    description: 'Greater London and surrounding areas',
  },
  'south-east': {
    name: 'South East',
    description: 'Kent, Sussex, Surrey, Hampshire, Berkshire, Oxfordshire and more',
  },
  'south-west': {
    name: 'South West',
    description: 'Bristol, Bath, Devon, Cornwall, Dorset and more',
  },
  midlands: {
    name: 'Midlands',
    description: 'Birmingham, Nottingham, Leicester, Coventry and more',
  },
  'north-west': {
    name: 'North West',
    description: 'Manchester, Liverpool, Chester, Preston and more',
  },
  'north-east': {
    name: 'North East & Yorkshire',
    description: 'Newcastle, Leeds, Sheffield, York and more',
  },
  east: {
    name: 'East of England',
    description: 'Norwich, Ipswich, Colchester, Chelmsford, Peterborough and more',
  },
  scotland: {
    name: 'Scotland',
    description: 'Edinburgh, Glasgow, Aberdeen and more',
  },
  wales: {
    name: 'Wales',
    description: 'Cardiff, Swansea, Newport and more',
  },
};

export const CITIES: CityData[] = [
  // ─── London ──────────────────────────────────────────────────────────────
  {
    slug: 'london',
    name: 'London',
    county: 'Greater London',
    region: 'london',
    postcodeAreas: ['E', 'EC', 'N', 'NW', 'SE', 'SW', 'W', 'WC'],
    postcodeExample: 'SW1A 1AA',
    population: '8.8 million',
    heroDescription:
      'London is the UK\'s largest and most complex city for house removals. With congestion charges, ULEZ zones, narrow Victorian streets, and high-rise flats without lifts, finding the right removal company who truly knows the city is essential. MoveFox connects you with experienced London movers who handle everything from Shoreditch studio flats to Hampstead family homes.',
    localInsights: [
      'The Congestion Charge (£15/day) and ULEZ (£12.50/day for non-compliant vehicles) apply across most of central London, which can add significant cost to your move if your removal company isn\'t prepared.',
      'Most London boroughs require you to apply for a parking suspension for your removal van — typically costing £30–£70 and needing at least two weeks\' notice.',
      'A large proportion of London properties are upper-floor flats without lifts, so check whether your removal company has specialist stair-climbing equipment or extra porters.',
      'Summer months and end-of-month dates are peak moving periods in London — booking 4–6 weeks ahead is strongly recommended.',
      'London house moves cost significantly more than the national average due to access challenges, traffic, and parking restrictions.',
    ],
    averageCostRange: '£400 – £1,500',
    popularAreas: ['Camden', 'Islington', 'Greenwich', 'Hackney', 'Clapham', 'Brixton', 'Wimbledon', 'Ealing'],
    movingTips: [
      'Apply for a parking suspension from your borough council at least two weeks before your move — this guarantees a loading space outside your property and avoids fines.',
      'Check whether your removal company\'s vehicles are ULEZ compliant to avoid unexpected surcharges on the day.',
      'Consider a mid-week move if your schedule allows it — London removal companies often offer better rates Tuesday to Thursday.',
    ],
    nearbyCities: ['brighton', 'reading', 'cambridge', 'oxford', 'southampton', 'luton'],
    parkingNotes: 'Most boroughs require a parking suspension for removal vans, typically costing £30–£70 with 10–14 days\' notice.',
    congestionNotes: 'The Congestion Charge (£15/day) and ULEZ (£12.50/day for non-compliant vehicles) apply to central London moves.',
    propertyTypes: 'A mix of Victorian and Georgian conversions, purpose-built flats, terraced houses, and modern new-build apartments.',
  },

  // ─── Manchester ──────────────────────────────────────────────────────────
  {
    slug: 'manchester',
    name: 'Manchester',
    county: 'Greater Manchester',
    region: 'north-west',
    postcodeAreas: ['M'],
    postcodeExample: 'M1 1AA',
    population: '550,000',
    heroDescription:
      'Manchester is the North West\'s largest city and one of the UK\'s fastest-growing property markets. With a booming city centre full of high-rise apartments and leafy suburbs like Didsbury and Chorlton, demand for reliable removal services is consistently high. MoveFox matches you with vetted Manchester movers who know every area from the Northern Quarter to Sale.',
    localInsights: [
      'Manchester\'s city centre has seen a surge in high-rise apartment buildings — many require advance booking of service lifts and have strict moving time windows.',
      'Traffic around the Mancunian Way and inner ring road can cause significant delays during peak hours, so morning starts are advisable.',
      'The student population means September and June are particularly busy months for removals, with prices and availability affected across the city.',
      'Many of the Victorian terraced streets in Fallowfield, Levenshulme, and Longsight have narrow access that large removal vehicles may struggle with.',
    ],
    averageCostRange: '£250 – £900',
    popularAreas: ['Didsbury', 'Chorlton', 'Northern Quarter', 'Salford Quays', 'Altrincham', 'Sale'],
    movingTips: [
      'If moving to a city centre apartment, contact your building management in advance to book the service lift and confirm any time restrictions.',
      'Avoid moving during university term changeover periods (September and late June) when demand spikes across the whole of Greater Manchester.',
    ],
    nearbyCities: ['liverpool', 'warrington', 'preston', 'leeds', 'sheffield', 'york'],
    propertyTypes: 'Victorian terraces, modern city centre apartments, and suburban semi-detached homes in the outer boroughs.',
  },

  // ─── Birmingham ──────────────────────────────────────────────────────────
  {
    slug: 'birmingham',
    name: 'Birmingham',
    county: 'West Midlands',
    region: 'midlands',
    postcodeAreas: ['B'],
    postcodeExample: 'B1 1AA',
    population: '1.1 million',
    heroDescription:
      'Birmingham is the UK\'s second-largest city and the heart of the West Midlands, with a property market ranging from city centre penthouses to suburban family homes in Edgbaston, Moseley, and Sutton Coldfield. The city\'s Clean Air Zone and complex ring road system make choosing a local removal company who knows Birmingham\'s streets a smart move.',
    localInsights: [
      'Birmingham\'s Clean Air Zone (CAZ) charges non-compliant vehicles up to £50/day — make sure your removal company\'s fleet meets emission standards.',
      'The city\'s one-way ring road system (Queensway) can confuse out-of-area drivers, adding time and stress to your move.',
      'Birmingham has a wide range of property types, from back-to-back terraces in inner-city areas to large detached homes in Sutton Coldfield and Solihull.',
      'The Jewellery Quarter, Digbeth, and Brindleyplace areas have many converted industrial buildings with awkward access and goods lifts.',
      'Parking is restricted across much of the city centre, so a removal company familiar with loading bay permits is essential.',
    ],
    averageCostRange: '£250 – £850',
    popularAreas: ['Edgbaston', 'Moseley', 'Harborne', 'Sutton Coldfield', 'Kings Heath', 'Jewellery Quarter'],
    movingTips: [
      'Verify your removal company\'s vehicles are Clean Air Zone compliant before booking — the £50/day charge for non-compliant HGVs adds up quickly.',
      'If moving within the city centre, ask your removal company about loading bay access and whether they\'ll handle the council permit.',
      'The A38 corridor and Spaghetti Junction are congestion hotspots — an early morning start can save hours on moving day.',
    ],
    nearbyCities: ['wolverhampton', 'coventry', 'nottingham', 'leicester', 'stoke-on-trent', 'derby'],
    congestionNotes: 'Birmingham\'s Clean Air Zone charges non-compliant vehicles entering the city centre — up to £50/day for HGVs.',
    propertyTypes: 'Victorian terraces, 1930s semi-detached homes, converted industrial buildings, and modern city centre apartments.',
  },

  // ─── Liverpool ───────────────────────────────────────────────────────────
  {
    slug: 'liverpool',
    name: 'Liverpool',
    county: 'Merseyside',
    region: 'north-west',
    postcodeAreas: ['L'],
    postcodeExample: 'L1 1AA',
    population: '490,000',
    heroDescription:
      'Liverpool is a vibrant city with a diverse property market stretching from the waterfront apartments of the Albert Dock to the leafy suburbs of Woolton and Allerton. With ongoing regeneration across the city and a large student population, removal services in Liverpool stay busy year-round. MoveFox helps you find trusted local movers at competitive prices.',
    localInsights: [
      'Liverpool\'s waterfront and dockside developments often have controlled access, narrow corridors, and strict moving hours — confirm logistics with your building before the day.',
      'The city has one of the highest student populations in the UK, meaning late August and September are the busiest months for removals.',
      'Georgian townhouses in areas like Toxteth and Everton often have steep staircases and no off-street parking.',
      'Liverpool\'s road network funnels most traffic through the Queensway and Kingsway tunnels for Wirral-bound moves, which can add time during rush hour.',
    ],
    averageCostRange: '£200 – £800',
    popularAreas: ['Albert Dock', 'Woolton', 'Allerton', 'Aigburth', 'Sefton Park', 'Crosby'],
    movingTips: [
      'If moving to or from a waterfront apartment, call your building management to check access restrictions, lift availability, and permitted moving hours.',
      'For Wirral-bound moves, factor in tunnel toll charges and peak-hour queues — crossing at off-peak times can save 30+ minutes.',
    ],
    nearbyCities: ['manchester', 'warrington', 'preston', 'leeds', 'birmingham', 'cardiff'],
    propertyTypes: 'Georgian townhouses, waterfront apartments, post-war council estates, and suburban Edwardian semis.',
  },

  // ─── Leeds ───────────────────────────────────────────────────────────────
  {
    slug: 'leeds',
    name: 'Leeds',
    county: 'West Yorkshire',
    region: 'north-east',
    postcodeAreas: ['LS'],
    postcodeExample: 'LS1 1AA',
    population: '810,000',
    heroDescription:
      'Leeds is Yorkshire\'s largest city and a major commercial hub with a property market that ranges from converted mills in Holbeck to grand Victorian villas in Roundhay and Chapel Allerton. Its central location makes it a popular destination for people relocating from across the UK. MoveFox connects you with experienced Leeds removal companies who handle every type of move.',
    localInsights: [
      'Leeds city centre has numerous converted warehouse and mill buildings with goods lifts, loading bays, and restricted access times.',
      'The Headingley and Hyde Park areas are heavily student-populated, making September the single busiest month for removals in Leeds.',
      'Hilly terrain in areas like Chapel Allerton, Meanwood, and Kirkstall can affect loading times and may require removal teams with extra manpower.',
      'The Leeds inner ring road has frequent congestion, particularly at the Armley Gyratory — plan routes carefully with your removal company.',
    ],
    averageCostRange: '£250 – £850',
    popularAreas: ['Headingley', 'Chapel Allerton', 'Roundhay', 'Horsforth', 'Meanwood', 'Kirkstall'],
    movingTips: [
      'Avoid the Headingley area during September if possible — it\'s the busiest time of year due to the student population shift.',
      'If moving to a converted mill or warehouse, check the goods lift capacity and dimensions in advance to avoid surprises on moving day.',
    ],
    nearbyCities: ['bradford', 'sheffield', 'york', 'hull', 'manchester', 'newcastle'],
    propertyTypes: 'Converted mills and warehouses, Victorian terraces, modern city centre apartments, and suburban semis.',
  },

  // ─── Sheffield ───────────────────────────────────────────────────────────
  {
    slug: 'sheffield',
    name: 'Sheffield',
    county: 'South Yorkshire',
    region: 'north-east',
    postcodeAreas: ['S'],
    postcodeExample: 'S1 1AA',
    population: '585,000',
    heroDescription:
      'Known as the \'Steel City\', Sheffield sits at the edge of the Peak District and is famously one of the hilliest cities in the UK. This makes house removals here a unique challenge — steep gradients, narrow hillside streets, and limited parking all factor in. MoveFox pairs you with Sheffield movers who are well-equipped for the city\'s distinctive terrain.',
    localInsights: [
      'Sheffield\'s steep hills — particularly in areas like Walkley, Crookes, and Meersbrook — mean removal teams often need additional manpower and specialist equipment.',
      'The city centre Clean Air Zone launched in 2023 and charges non-compliant HGVs £50/day, so check your removal company\'s vehicle compliance.',
      'Two large universities mean student areas like Broomhill, Endcliffe, and Ecclesall Road are extremely busy in September and June.',
      'Properties in the older hillside areas often have multiple flights of steps to the front door with no vehicle access to the property itself.',
    ],
    averageCostRange: '£200 – £750',
    popularAreas: ['Crookes', 'Ecclesall', 'Meersbrook', 'Kelham Island', 'Broomhill', 'Dore'],
    movingTips: [
      'Be upfront about the number of steps and the gradient at your property when getting quotes — this is the single biggest factor affecting removal costs in Sheffield.',
      'If your property is on a steep hillside street, ask whether the removal company has a smaller shuttle vehicle for the final leg.',
    ],
    nearbyCities: ['leeds', 'derby', 'nottingham', 'manchester', 'york', 'bradford'],
    congestionNotes: 'Sheffield\'s Clean Air Zone charges non-compliant buses, coaches, taxis, and HGVs entering the city centre.',
    propertyTypes: 'Stone-built Victorian terraces, hillside cottages, modern city centre apartments, and suburban detached homes in the south-west.',
  },

  // ─── Bristol ─────────────────────────────────────────────────────────────
  {
    slug: 'bristol',
    name: 'Bristol',
    county: 'City of Bristol',
    region: 'south-west',
    postcodeAreas: ['BS'],
    postcodeExample: 'BS1 1AA',
    population: '470,000',
    heroDescription:
      'Bristol is the South West\'s largest city, known for its creative culture, harbour-side living, and steep streets in areas like Totterdown and Clifton. The city\'s Clean Air Zone, Residents\' Parking Zones, and hilly geography mean local knowledge is invaluable when planning a removal. MoveFox matches you with Bristol removal companies who navigate these challenges daily.',
    localInsights: [
      'Bristol\'s Clean Air Zone charges non-compliant vehicles entering the central zone — this affects older removal vans and can add unexpected cost.',
      'The iconic steep streets of Clifton, Totterdown, and Bedminster can make access extremely difficult for large removal vehicles.',
      'Residents\' Parking Zones (RPZs) cover much of central Bristol, Clifton, and Redland — your removal company may need a temporary parking dispensation.',
      'Bristol Harbour and the Floating Harbour area have many converted warehouse apartments with restricted access and goods lifts.',
    ],
    averageCostRange: '£250 – £850',
    popularAreas: ['Clifton', 'Redland', 'Southville', 'Stokes Croft', 'Bedminster', 'Totterdown'],
    movingTips: [
      'If you live in a Residents\' Parking Zone, apply for a temporary dispensation from Bristol City Council at least a week before your move.',
      'For properties on Bristol\'s steepest streets, ask your removal company about shuttle vehicles that can navigate narrow, hilly roads.',
      'Early morning moves work best in Bristol — the city centre and Gloucester Road corridor get very congested from mid-morning onwards.',
    ],
    nearbyCities: ['bath', 'cardiff', 'swindon', 'southampton', 'birmingham', 'reading'],
    congestionNotes: 'Bristol\'s Clean Air Zone charges non-compliant vehicles entering the central area.',
    parkingNotes: 'RPZs cover much of central Bristol — a temporary parking dispensation from the council is usually needed for removal vans.',
    propertyTypes: 'Georgian and Victorian terraces, converted harbour warehouses, Edwardian semis, and modern new-builds in the south of the city.',
  },

  // ─── Newcastle ───────────────────────────────────────────────────────────
  {
    slug: 'newcastle',
    name: 'Newcastle upon Tyne',
    county: 'Tyne and Wear',
    region: 'north-east',
    postcodeAreas: ['NE'],
    postcodeExample: 'NE1 1AA',
    population: '300,000',
    heroDescription:
      'Newcastle upon Tyne is the North East\'s cultural and economic capital, with a housing market that spans from quayside apartments overlooking the Tyne bridges to traditional Tyneside flats and suburban family homes in Jesmond and Gosforth. MoveFox connects you with trusted Newcastle removal companies who understand the city\'s unique property types and parking challenges.',
    localInsights: [
      'The famous Tyneside flat — two self-contained flats sharing a common entrance — is unique to the region and presents specific access considerations for removal teams.',
      'Newcastle\'s city centre has extensive pedestrianised areas and bus lanes that restrict removal vehicle access during the day.',
      'Jesmond and Heaton have large student populations, making September the busiest month for local removals.',
      'The steep banks leading down to the Quayside can be challenging for heavy loads — experienced local movers know the best routes.',
    ],
    averageCostRange: '£200 – £750',
    popularAreas: ['Jesmond', 'Gosforth', 'Heaton', 'Ouseburn', 'Quayside', 'Tynemouth'],
    movingTips: [
      'If you\'re in a Tyneside flat, measure your doorways and staircases carefully — many have narrow communal entrances that limit what furniture can fit through.',
      'Book early if moving in September — Newcastle\'s three universities create a city-wide surge in removal demand.',
    ],
    nearbyCities: ['sunderland', 'middlesbrough', 'leeds', 'york', 'edinburgh', 'glasgow'],
    propertyTypes: 'Tyneside flats, Victorian terraces, quayside apartments, and suburban semis in Gosforth and Jesmond.',
  },

  // ─── Nottingham ──────────────────────────────────────────────────────────
  {
    slug: 'nottingham',
    name: 'Nottingham',
    county: 'Nottinghamshire',
    region: 'midlands',
    postcodeAreas: ['NG'],
    postcodeExample: 'NG1 1AA',
    population: '330,000',
    heroDescription:
      'Nottingham sits in the heart of the East Midlands, offering affordable housing and excellent transport links. The city has a vibrant mix of student lets in Lenton and Beeston, family homes in West Bridgford, and converted lace-market apartments in the Hockley area. MoveFox helps you find Nottingham removal companies who deliver a reliable, stress-free move.',
    localInsights: [
      'Nottingham has an extensive tram network (NET) that runs through several residential areas — removal vehicles need to be careful not to block tram lines.',
      'The Lace Market and Hockley areas feature converted Victorian warehouses with industrial goods lifts and unusual floor plans.',
      'West Bridgford, south of the River Trent, is one of the most sought-after residential areas and has tight parking on many streets.',
      'With two major universities, Lenton and Beeston experience high removal demand in September and June.',
    ],
    averageCostRange: '£200 – £700',
    popularAreas: ['West Bridgford', 'Hockley', 'Beeston', 'Sherwood', 'Mapperley', 'The Park'],
    movingTips: [
      'If your route crosses a tram line, plan your loading and unloading to avoid blocking the tracks — fines for obstructing tram routes are significant.',
      'West Bridgford streets can be very tight on matchday weekends (Nottingham Forest and Trent Bridge cricket) — check the fixtures calendar before booking.',
    ],
    nearbyCities: ['derby', 'leicester', 'birmingham', 'sheffield', 'lincoln', 'leeds'],
    propertyTypes: 'Victorian terraces, converted lace-market warehouses, inter-war semis, and modern student accommodation.',
  },

  // ─── Leicester ───────────────────────────────────────────────────────────
  {
    slug: 'leicester',
    name: 'Leicester',
    county: 'Leicestershire',
    region: 'midlands',
    postcodeAreas: ['LE'],
    postcodeExample: 'LE1 1AA',
    population: '370,000',
    heroDescription:
      'Leicester is one of the most diverse cities in the UK, with a property market offering everything from city centre apartments near the Cultural Quarter to spacious family homes in Oadby and Stoneygate. Its central England location makes it a popular destination for relocations from across the country. MoveFox helps you compare trusted Leicester removal companies quickly.',
    localInsights: [
      'Leicester\'s inner ring road (St Nicholas Circle and Burleys Flyover) funnels most traffic through narrow routes that can significantly delay removal vehicles.',
      'The city centre has expanding pedestrianised zones that limit vehicle access during daytime hours.',
      'Areas like Stoneygate and Knighton have tree-lined streets with overhanging branches that can restrict access for tall removal vehicles.',
      'Leicester is centrally located with easy motorway access (M1, M69), making it a cost-effective base for long-distance moves.',
    ],
    averageCostRange: '£200 – £700',
    popularAreas: ['Stoneygate', 'Clarendon Park', 'Oadby', 'Knighton', 'Evington', 'Braunstone'],
    movingTips: [
      'Take advantage of Leicester\'s central location — M1 access means long-distance moves to London or the North can be very efficient.',
      'If moving within the city centre, check vehicle access times and any pedestrianisation restrictions with the council beforehand.',
    ],
    nearbyCities: ['nottingham', 'birmingham', 'coventry', 'milton-keynes', 'cambridge', 'sheffield'],
    propertyTypes: 'Victorian and Edwardian terraces, inter-war semis, modern city centre flats, and large detached homes in the south.',
  },

  // ─── Southampton ─────────────────────────────────────────────────────────
  {
    slug: 'southampton',
    name: 'Southampton',
    county: 'Hampshire',
    region: 'south-east',
    postcodeAreas: ['SO'],
    postcodeExample: 'SO14 1AA',
    population: '260,000',
    heroDescription:
      'Southampton is a major port city on England\'s south coast, popular with both families and professionals drawn by its maritime heritage, university campuses, and proximity to the New Forest. With a mix of waterfront apartments, suburban family homes, and student accommodation, finding the right removal company makes all the difference. MoveFox compares trusted Southampton movers for you.',
    localInsights: [
      'Southampton\'s cruise terminal traffic can cause significant congestion on moving days, particularly in the Ocean Village and Town Quay areas.',
      'Parking is restricted across much of the city centre, and Controlled Parking Zones require dispensations for removal vehicles.',
      'The University of Southampton campus drives high removal demand in Portswood and Highfield during September.',
      'Waterfront and marina apartments often have specific delivery entrance requirements and moving hour restrictions.',
    ],
    averageCostRange: '£250 – £800',
    popularAreas: ['Portswood', 'Highfield', 'Ocean Village', 'Shirley', 'Bitterne', 'Woolston'],
    movingTips: [
      'Check the cruise ship schedule before booking your move — terminal traffic can gridlock the city centre on sailing days.',
      'If you\'re in a CPZ, arrange a dispensation from Southampton City Council well in advance to guarantee loading access.',
    ],
    nearbyCities: ['portsmouth', 'bournemouth', 'brighton', 'reading', 'bath', 'london'],
    parkingNotes: 'Controlled Parking Zones cover most of the city centre and inner suburbs — removal van dispensations are needed.',
    propertyTypes: 'Victorian terraces, 1930s suburban semis, waterfront apartments, and student HMOs near the university.',
  },

  // ─── Brighton ────────────────────────────────────────────────────────────
  {
    slug: 'brighton',
    name: 'Brighton & Hove',
    county: 'East Sussex',
    region: 'south-east',
    postcodeAreas: ['BN'],
    postcodeExample: 'BN1 1AA',
    population: '290,000',
    heroDescription:
      'Brighton & Hove is one of the UK\'s most popular coastal cities, known for its vibrant culture, Regency architecture, and steep hillside streets. Moving here comes with unique challenges: narrow lanes in the North Laine, permit-only parking across most of the city, and limited vehicle access along the seafront. MoveFox connects you with Brighton movers who handle these daily.',
    localInsights: [
      'Brighton has one of the most extensive Controlled Parking Zone systems in the UK — almost every residential street requires a parking permit or suspension for removal vehicles.',
      'Many properties in Kemptown and the North Laine are accessed via narrow alleys and basement steps, requiring specialist equipment.',
      'The steep hill from the seafront up to the station (and beyond to Preston Park) adds physical challenge to removals in central Brighton.',
      'Brighton is a popular weekend destination, so Saturday moves can coincide with heavy tourist traffic along the seafront.',
    ],
    averageCostRange: '£300 – £900',
    popularAreas: ['Kemptown', 'North Laine', 'Hove', 'Preston Park', 'Hanover', 'Seven Dials'],
    movingTips: [
      'Book a parking suspension through Brighton & Hove City Council as early as possible — the city\'s near-universal CPZ system means there\'s simply nowhere else for a removal van to stop.',
      'If your property is accessed via stairs or a basement, mention this upfront when getting quotes — it significantly affects the time and cost.',
      'Weekday moves are strongly recommended in Brighton to avoid seafront tourist traffic.',
    ],
    nearbyCities: ['london', 'southampton', 'reading', 'oxford', 'cambridge', 'bristol'],
    parkingNotes: 'Virtually the entire city is covered by Controlled Parking Zones — a parking suspension (£30–£60) is almost always required.',
    propertyTypes: 'Regency townhouses, Victorian terraces, seafront apartments, and modern new-builds in Hove.',
  },

  // ─── Edinburgh ───────────────────────────────────────────────────────────
  {
    slug: 'edinburgh',
    name: 'Edinburgh',
    county: 'City of Edinburgh',
    region: 'scotland',
    postcodeAreas: ['EH'],
    postcodeExample: 'EH1 1AA',
    population: '530,000',
    heroDescription:
      'Edinburgh is Scotland\'s capital and one of the most architecturally stunning cities in the UK. Moving here means navigating cobbled streets in the Old Town, tenement staircases in Marchmont and Bruntsfield, and the city\'s famously steep hills. During Festival season (August), the city is effectively gridlocked. MoveFox connects you with Edinburgh removal experts who know every close and wynd.',
    localInsights: [
      'Edinburgh\'s tenement flats — typically 3–5 storeys with no lift — are the most common property type and make removals physically demanding. Always factor in extra time.',
      'The Edinburgh Festival in August makes the city centre almost impossible for removal vehicles. Plan around it if you can.',
      'Cobbled streets in the Old Town, Stockbridge, and Dean Village can damage vehicles and make trolley use difficult.',
      'Parking is extremely limited in central Edinburgh — a parking bay suspension from the council is essential for most moves.',
      'Edinburgh\'s Low Emission Zone (LEZ) restricts non-compliant vehicles in the city centre.',
    ],
    averageCostRange: '£300 – £1,000',
    popularAreas: ['Stockbridge', 'Bruntsfield', 'Marchmont', 'Morningside', 'Leith', 'New Town'],
    movingTips: [
      'Never book a city centre move during the Edinburgh Festival (August) unless absolutely necessary — road closures and traffic make it extremely difficult.',
      'For tenement flats, get an accurate stair count to your removal company — the number of flights is the biggest cost factor in Edinburgh moves.',
      'Apply for a parking bay suspension from the City of Edinburgh Council at least 5 working days in advance.',
    ],
    nearbyCities: ['glasgow', 'aberdeen', 'newcastle', 'sunderland', 'york', 'leeds'],
    congestionNotes: 'Edinburgh\'s Low Emission Zone (LEZ) restricts the oldest, most polluting vehicles from the city centre.',
    parkingNotes: 'Central Edinburgh has very limited parking — a bay suspension from the council is essential for removal day.',
    propertyTypes: 'Georgian and Victorian tenement flats, New Town townhouses, modern waterfront apartments in Leith, and suburban bungalows.',
  },

  // ─── Glasgow ─────────────────────────────────────────────────────────────
  {
    slug: 'glasgow',
    name: 'Glasgow',
    county: 'City of Glasgow',
    region: 'scotland',
    postcodeAreas: ['G'],
    postcodeExample: 'G1 1AA',
    population: '635,000',
    heroDescription:
      'Glasgow is Scotland\'s largest city, with a distinctive sandstone tenement architecture and a sprawling footprint from the West End to the East End. The city offers exceptional value compared to Edinburgh, with a thriving arts scene and strong sense of community. MoveFox helps you find Glasgow removal companies who understand the city\'s tenements, one-way systems, and parking challenges.',
    localInsights: [
      'Glasgow\'s red sandstone tenement flats are iconic but present removal challenges — narrow communal closes, spiral staircases, and no lifts are standard.',
      'Glasgow\'s Low Emission Zone (LEZ) covers the city centre and fines non-compliant vehicles — verify your removal company\'s fleet compliance.',
      'The M8 motorway cuts through the city centre and is frequently congested, affecting cross-city moves.',
      'The West End (Byres Road, Hillhead, Hyndland) has extremely limited parking, especially during university term time.',
    ],
    averageCostRange: '£200 – £800',
    popularAreas: ['West End', 'Finnieston', 'Shawlands', 'Dennistoun', 'Merchant City', 'Hyndland'],
    movingTips: [
      'For tenement moves, measure your furniture against the dimensions of the communal close and stairwell — some larger items simply won\'t fit through.',
      'Check your removal company\'s LEZ compliance before booking — Glasgow actively enforces its Low Emission Zone with automatic number plate recognition cameras.',
    ],
    nearbyCities: ['edinburgh', 'aberdeen', 'newcastle', 'sunderland', 'leeds', 'manchester'],
    congestionNotes: 'Glasgow\'s Low Emission Zone (LEZ) covers the city centre — non-compliant vehicles face daily charges.',
    propertyTypes: 'Red sandstone tenement flats, converted townhouses, modern city centre apartments, and suburban semis.',
  },

  // ─── Cardiff ─────────────────────────────────────────────────────────────
  {
    slug: 'cardiff',
    name: 'Cardiff',
    county: 'City of Cardiff',
    region: 'wales',
    postcodeAreas: ['CF'],
    postcodeExample: 'CF10 1AA',
    population: '370,000',
    heroDescription:
      'Cardiff is the Welsh capital and the largest city in Wales, with a property market spanning Cardiff Bay waterfront apartments, Victorian terraces in Pontcanna and Canton, and family homes in Whitchurch and Cyncoed. The city offers excellent value compared to many English cities, and MoveFox connects you with reliable Cardiff removal companies for a smooth move.',
    localInsights: [
      'Cardiff\'s major events at the Principality Stadium cause significant city centre road closures on match and concert days — always check the events calendar.',
      'Cathays and Roath have high concentrations of student housing, making September and June peak moving months.',
      'Cardiff Bay apartments often have access restrictions, secure entry requirements, and limited lift availability.',
      'Street parking is heavily regulated in Pontcanna, Canton, and Cathays with Residents\' Parking Zones.',
    ],
    averageCostRange: '£200 – £750',
    popularAreas: ['Pontcanna', 'Canton', 'Cardiff Bay', 'Roath', 'Whitchurch', 'Cyncoed'],
    movingTips: [
      'Check the Principality Stadium events calendar before setting your moving date — Six Nations rugby days and major concerts cause widespread road closures.',
      'If moving to Cardiff Bay, confirm access arrangements and lift booking requirements with your building management in advance.',
    ],
    nearbyCities: ['swansea', 'bristol', 'bath', 'birmingham', 'southampton', 'exeter'],
    parkingNotes: 'Residents\' Parking Zones cover Pontcanna, Canton, Cathays, and parts of Roath.',
    propertyTypes: 'Victorian and Edwardian terraces, bay-front apartments, inter-war semis, and modern suburban estates.',
  },

  // ─── Oxford ──────────────────────────────────────────────────────────────
  {
    slug: 'oxford',
    name: 'Oxford',
    county: 'Oxfordshire',
    region: 'south-east',
    postcodeAreas: ['OX'],
    postcodeExample: 'OX1 1AA',
    population: '155,000',
    heroDescription:
      'Oxford is world-famous for its university, but it\'s also a thriving city with one of the most competitive property markets in the South East. Narrow medieval streets, extensive bus gates, and severe parking restrictions make removals here particularly challenging. MoveFox matches you with Oxford removal specialists who navigate the city\'s unique constraints every day.',
    localInsights: [
      'Oxford\'s bus gates and restricted access zones in the city centre mean many streets are off-limits to removal vehicles during the day.',
      'The proposed Zero Emission Zone in the city centre will add further restrictions for non-electric vehicles.',
      'Jericho, Summertown, and Headington are the most popular residential areas, each with their own parking and access quirks.',
      'Oxford has some of the highest property prices outside London, and the majority of central properties are terraced with no off-street parking.',
    ],
    averageCostRange: '£300 – £900',
    popularAreas: ['Jericho', 'Summertown', 'Headington', 'Cowley', 'Botley', 'Iffley'],
    movingTips: [
      'Check Oxford\'s bus gate locations and time restrictions before planning your removal route — getting caught means a fine and a lengthy detour.',
      'If moving in central Oxford, an early morning start (before 7am) is strongly recommended to avoid bus gate restrictions and daytime traffic.',
    ],
    nearbyCities: ['reading', 'london', 'milton-keynes', 'bristol', 'cambridge', 'southampton'],
    congestionNotes: 'Oxford\'s bus gates restrict general traffic on key city centre routes during the day. A Zero Emission Zone is being phased in.',
    propertyTypes: 'Victorian and Edwardian terraces, period college properties, modern apartments, and suburban family homes.',
  },

  // ─── Cambridge ───────────────────────────────────────────────────────────
  {
    slug: 'cambridge',
    name: 'Cambridge',
    county: 'Cambridgeshire',
    region: 'south-east',
    postcodeAreas: ['CB'],
    postcodeExample: 'CB1 1AA',
    population: '145,000',
    heroDescription:
      'Cambridge combines world-class academia with a beautiful historic centre, and its booming biotech sector has made it one of the fastest-growing cities in the UK. Moving here means dealing with narrow streets, limited parking, and high demand for removal services. MoveFox helps you compare trusted Cambridge movers who know the city inside out.',
    localInsights: [
      'Cambridge\'s historic core has extremely narrow streets — large removal vehicles often cannot access properties in areas like the Kite and Mill Road.',
      'The city is famously cycle-friendly, which means removal vehicles share roads with high volumes of cyclists — extra care and patience are needed.',
      'Parking is severely restricted across the entire city centre, and most residential streets have some form of controlled parking.',
      'The tech and biotech industry means many people relocate to Cambridge from overseas, and international removal services are in high demand.',
    ],
    averageCostRange: '£300 – £900',
    popularAreas: ['Mill Road', 'Newnham', 'Cherry Hinton', 'Trumpington', 'Chesterton', 'Romsey Town'],
    movingTips: [
      'If your property is in the historic centre, ask your removal company whether they have a smaller shuttle vehicle for narrow street access.',
      'Cambridge\'s Park & Ride system means the outskirts are often quicker to navigate than the centre — factor this into your route planning.',
    ],
    nearbyCities: ['peterborough', 'norwich', 'chelmsford', 'london', 'oxford', 'ipswich'],
    parkingNotes: 'Residents\' Parking Zones cover most of the city centre and surrounding streets. Dispensations are essential for removal vans.',
    propertyTypes: 'Victorian terraces, period townhouses, modern apartments in the station quarter, and new-builds on the city fringes.',
  },

  // ─── Reading ─────────────────────────────────────────────────────────────
  {
    slug: 'reading',
    name: 'Reading',
    county: 'Berkshire',
    region: 'south-east',
    postcodeAreas: ['RG'],
    postcodeExample: 'RG1 1AA',
    population: '230,000',
    heroDescription:
      'Reading is a major commercial hub in the Thames Valley, popular with London commuters thanks to its fast rail links. The town offers a mix of Victorian housing in the centre, modern apartments in the station quarter, and family homes in Caversham and Tilehurst. MoveFox helps you compare competitive quotes from reliable Reading removal companies.',
    localInsights: [
      'Reading\'s IDR (Inner Distribution Road) ring road creates a one-way system around the town centre that confuses drivers unfamiliar with the area.',
      'The station quarter redevelopment has added many high-rise apartments with specific loading bay requirements and moving time windows.',
      'Caversham, across the Thames, is connected by just two bridges — rush hour traffic can add significant time to cross-river moves.',
      'Reading Festival in late August causes major road closures and traffic disruption in the Richfield Avenue area.',
    ],
    averageCostRange: '£250 – £800',
    popularAreas: ['Caversham', 'Tilehurst', 'Woodley', 'Earley', 'Sonning', 'Whitley'],
    movingTips: [
      'If moving across the river to or from Caversham, avoid rush hour on the two bridges — or consider a route via the A4074 if loads allow.',
      'Avoid the August Bank Holiday weekend if possible — Reading Festival causes widespread traffic disruption.',
    ],
    nearbyCities: ['london', 'oxford', 'southampton', 'brighton', 'bristol', 'milton-keynes'],
    propertyTypes: 'Victorian terraces, modern station-quarter apartments, inter-war semis, and suburban family homes.',
  },

  // ─── Milton Keynes ───────────────────────────────────────────────────────
  {
    slug: 'milton-keynes',
    name: 'Milton Keynes',
    county: 'Buckinghamshire',
    region: 'south-east',
    postcodeAreas: ['MK'],
    postcodeExample: 'MK9 1AA',
    population: '250,000',
    heroDescription:
      'Milton Keynes is one of the UK\'s fastest-growing new towns, built on a distinctive grid road system with extensive green spaces and roundabouts — over 130 of them. Its modern housing stock and excellent road layout actually make it one of the easier cities for removals. MoveFox connects you with MK-based removal companies who know every grid square.',
    localInsights: [
      'Milton Keynes\' grid road system with its legendary roundabouts is actually very efficient for removal vehicles — wide roads and clear signage make navigation straightforward.',
      'Most MK properties are relatively modern (post-1970s) with garages, driveways, and wide streets, making loading and unloading much easier than in older cities.',
      'The Redway network of shared-use paths crosses many roads — removal teams need to watch for cyclists and pedestrians at crossing points.',
      'MK is centrally located with direct access to the M1, making it an efficient base for long-distance moves to London, Birmingham, or the North.',
    ],
    averageCostRange: '£200 – £700',
    popularAreas: ['Central Milton Keynes', 'Wolverton', 'Stony Stratford', 'Bletchley', 'Newport Pagnell', 'Woburn Sands'],
    movingTips: [
      'Take advantage of MK\'s grid road system — plan your route to stick to the main grid (H and V roads) for the fastest, most direct journey.',
      'MK\'s modern housing means fewer access challenges than most UK cities, but double-check if your estate has any width restrictions on approach roads.',
    ],
    nearbyCities: ['london', 'oxford', 'cambridge', 'leicester', 'nottingham', 'reading'],
    propertyTypes: 'Modern detached and semi-detached homes, new-build estates, town centre apartments, and older properties in Stony Stratford and Wolverton.',
  },

  // ─── York ────────────────────────────────────────────────────────────────
  {
    slug: 'york',
    name: 'York',
    county: 'North Yorkshire',
    region: 'north-east',
    postcodeAreas: ['YO'],
    postcodeExample: 'YO1 1AA',
    population: '210,000',
    heroDescription:
      'York is one of England\'s most historic cities, with medieval walls, cobbled streets, and a housing stock that ranges from timber-framed buildings in the Shambles to modern developments on the city\'s outskirts. Moving within the city walls presents unique challenges that only experienced local removal companies truly understand. MoveFox matches you with York movers who navigate these daily.',
    localInsights: [
      'York\'s city centre inside the walls has extremely narrow streets, many of which are pedestrianised or have weight and width restrictions for vehicles.',
      'The city floods regularly along the River Ouse and River Foss — if moving to a riverside property, check your insurer\'s flood risk requirements.',
      'York Racecourse events and the Christmas market cause significant traffic disruption on multiple weekends throughout the year.',
      'Properties within the city walls are often listed buildings with restrictions on modifications, affecting what furniture and fittings can be installed.',
    ],
    averageCostRange: '£250 – £800',
    popularAreas: ['Bishopthorpe', 'Fulford', 'Heworth', 'Acomb', 'The Groves', 'Clifton'],
    movingTips: [
      'For properties within the city walls, your removal company will likely need to use a smaller vehicle and possibly hand-carry items from the nearest accessible road.',
      'Check the York Racecourse and events calendar — race days cause major traffic disruption, particularly on the A1036 and Knavesmire area.',
    ],
    nearbyCities: ['leeds', 'hull', 'middlesbrough', 'sheffield', 'newcastle', 'bradford'],
    propertyTypes: 'Medieval and Georgian townhouses, Victorian terraces, post-war semis, and modern suburban estates.',
  },

  // ─── Coventry ────────────────────────────────────────────────────────────
  {
    slug: 'coventry',
    name: 'Coventry',
    county: 'West Midlands',
    region: 'midlands',
    postcodeAreas: ['CV'],
    postcodeExample: 'CV1 1AA',
    population: '370,000',
    heroDescription:
      'Coventry has undergone significant regeneration following its year as UK City of Culture in 2021, with new residential developments complementing the city\'s existing mix of post-war housing and suburban family homes. Its central location between Birmingham and Leicester, with excellent motorway access, makes it a practical choice for relocators. MoveFox finds you trusted Coventry removal companies.',
    localInsights: [
      'Coventry\'s ring road is one of the fastest urban dual carriageways in the UK but has notoriously confusing junctions — local knowledge helps.',
      'The city centre has undergone major pedestrianisation, limiting vehicle access for removals to early morning or evening time slots.',
      'Coventry\'s post-war rebuild means many properties are 1950s–1960s construction with different layouts to typical Victorian housing.',
      'Two universities (Coventry University and Warwick) drive high removal demand in student areas during September.',
    ],
    averageCostRange: '£200 – £700',
    popularAreas: ['Earlsdon', 'Styvechale', 'Cheylesmore', 'Finham', 'Canley', 'Tile Hill'],
    movingTips: [
      'Familiarise yourself (or your removal company) with the Coventry ring road junction numbering system — exits are numbered and easy to miss at speed.',
      'If moving into the city centre, arrange an early morning time slot to avoid pedestrianisation restrictions.',
    ],
    nearbyCities: ['birmingham', 'leicester', 'nottingham', 'oxford', 'milton-keynes', 'wolverhampton'],
    propertyTypes: 'Post-war housing, 1930s semis, Edwardian terraces in Earlsdon, and modern city centre apartments.',
  },

  // ─── Bournemouth ────────────────────────────────────────────────────────
  {
    slug: 'bournemouth',
    name: 'Bournemouth',
    county: 'Dorset',
    region: 'south-west',
    postcodeAreas: ['BH'],
    postcodeExample: 'BH1 1AA',
    population: '187,000',
    heroDescription:
      'Bournemouth is one of the South Coast\'s most popular places to live, offering a blend of seaside lifestyle and excellent transport links. With a mix of Victorian villas, modern apartments, and retirement properties, finding the right removal company who knows the area\'s narrow clifftop roads and seasonal traffic patterns is key to a stress-free move.',
    localInsights: [
      'Bournemouth\'s clifftop roads and chine access routes can be challenging for large removal vehicles — local companies know the best approach routes.',
      'Summer months see a massive influx of tourists, meaning road congestion and parking in central areas can be significantly worse from June to September.',
      'Many properties along the East and West Cliff are converted Victorian villas with multiple flights of stairs and no lift access.',
      'The Bournemouth, Christchurch and Poole conurbation has merged into one urban area, so moves within the BH postcode area are common and competitively priced.',
    ],
    averageCostRange: '£250 – £800',
    popularAreas: ['Westbourne', 'Boscombe', 'Southbourne', 'Winton', 'Charminster', 'Talbot Woods', 'Canford Cliffs'],
    movingTips: [
      'If moving during summer, book well in advance and consider a weekday to avoid the worst of the tourist traffic along the seafront.',
      'Properties on clifftop roads often have limited parking — arrange a parking suspension through BCP Council if there\'s no driveway.',
      'The A338 Wessex Way is the main artery into Bournemouth and is prone to rush-hour congestion — plan your removal van\'s route to avoid peak times.',
    ],
    nearbyCities: ['southampton', 'bath', 'bristol', 'brighton', 'exeter', 'portsmouth'],
    propertyTypes: 'Victorian villas and conversions, purpose-built retirement flats, modern seafront apartments, and suburban family homes.',
  },

  // ─── Middlesbrough ──────────────────────────────────────────────────────
  {
    slug: 'middlesbrough',
    name: 'Middlesbrough',
    county: 'North Yorkshire',
    region: 'north-east',
    postcodeAreas: ['TS'],
    postcodeExample: 'TS1 1AA',
    population: '140,000',
    heroDescription:
      'Middlesbrough sits at the heart of Teesside, offering some of the most affordable property prices in the UK. With a mix of Victorian terraces, inter-war semis, and new-build estates, the town\'s compact layout makes local moves quick and cost-effective. MoveFox connects you with trusted Teesside removal companies who know every corner of the TS postcode area.',
    localInsights: [
      'Middlesbrough has some of the most affordable housing in England, making it a popular destination for first-time buyers — removal demand is consistently high.',
      'The A66 and A19 provide excellent road links, but the Transporter Bridge and town centre one-way system can catch unfamiliar drivers off guard.',
      'Linthorpe Road and the town centre have restricted vehicle access during certain hours, which can affect removal van routing.',
      'Student moves around Teesside University in September and June add to seasonal demand.',
    ],
    averageCostRange: '£150 – £600',
    popularAreas: ['Linthorpe', 'Acklam', 'Nunthorpe', 'Marton', 'Coulby Newham', 'Hemlington'],
    movingTips: [
      'Take advantage of Middlesbrough\'s affordable removal rates by getting quotes from multiple local companies — competition keeps prices low.',
      'If moving to Nunthorpe or Marton, the roads are wider and easier for large vehicles, but Linthorpe\'s Victorian terraces may need a smaller van.',
    ],
    nearbyCities: ['newcastle', 'sunderland', 'york', 'leeds', 'hull', 'bradford'],
    propertyTypes: 'Victorian terraces, inter-war semis, 1960s estates, and modern new-build developments on the outskirts.',
  },

  // ─── Stoke-on-Trent ────────────────────────────────────────────────────
  {
    slug: 'stoke-on-trent',
    name: 'Stoke-on-Trent',
    county: 'Staffordshire',
    region: 'midlands',
    postcodeAreas: ['ST'],
    postcodeExample: 'ST1 1AA',
    population: '256,000',
    heroDescription:
      'Stoke-on-Trent — the Potteries — is actually six towns in one, each with its own centre and character. This unique layout means local moves are common and distances are short, but navigating between Hanley, Burslem, Tunstall, Fenton, Longton, and Stoke itself requires a removal company with genuine local knowledge.',
    localInsights: [
      'Stoke-on-Trent\'s six-town structure means you can move from one neighbourhood to another that feels completely different, all within a few miles.',
      'The A500 (D-Road) is the main route connecting the towns, but it\'s also one of the busiest roads in the Midlands — timing your move is important.',
      'Many properties near the old pottery works have been converted from industrial buildings, with unusual access requirements.',
      'House prices in the Potteries are well below the national average, attracting buy-to-let investors and first-time buyers in large numbers.',
    ],
    averageCostRange: '£150 – £550',
    popularAreas: ['Hanley', 'Burslem', 'Trentham', 'Penkhull', 'Hartshill', 'Newcastle-under-Lyme', 'Stone'],
    movingTips: [
      'The A500 can be gridlocked during rush hour — if your move involves crossing between the six towns, aim for a mid-morning start after 9:30am.',
      'Some of the older terraced streets in Burslem and Longton have very narrow access — confirm with your removal company that their vehicle will fit.',
    ],
    nearbyCities: ['birmingham', 'manchester', 'derby', 'nottingham', 'wolverhampton', 'sheffield'],
    propertyTypes: 'Victorian terraces, 1930s semis, converted pottery buildings, and modern estates on the outskirts.',
  },

  // ─── Bradford ───────────────────────────────────────────────────────────
  {
    slug: 'bradford',
    name: 'Bradford',
    county: 'West Yorkshire',
    region: 'north-east',
    postcodeAreas: ['BD'],
    postcodeExample: 'BD1 1AA',
    population: '370,000',
    heroDescription:
      'Bradford is West Yorkshire\'s second-largest city and one of the most affordable places to buy property in the North of England. Nestled in a natural bowl surrounded by hills, the city\'s steep gradients and mix of grand Victorian stone-built homes, terraced hillside streets, and modern estates present unique challenges that only experienced local movers can handle efficiently.',
    localInsights: [
      'Bradford is built on steep hills — some streets have gradients that make moving heavy furniture physically demanding, so an experienced local crew is essential.',
      'The city has the largest collection of Victorian-era listed buildings outside London, many of which are now converted into apartments with restricted access.',
      'Bradford\'s proximity to Leeds (just 9 miles) means many people move between the two cities for work, making the BD-to-LS corridor one of the busiest removal routes in Yorkshire.',
      'Saltaire, a UNESCO World Heritage Site within the Bradford district, has strict planning controls that can affect access and parking for removal vehicles.',
    ],
    averageCostRange: '£150 – £600',
    popularAreas: ['Saltaire', 'Ilkley', 'Bingley', 'Shipley', 'Baildon', 'Heaton', 'Manningham'],
    movingTips: [
      'If moving to one of Bradford\'s hillside terraces, check whether your removal company has experience with steep-gradient streets and stair-climbing equipment.',
      'The Bradford-Leeds commute is very common — if moving between the two, consider off-peak hours to avoid the A650/A647 rush-hour gridlock.',
    ],
    nearbyCities: ['leeds', 'sheffield', 'york', 'manchester', 'hull', 'middlesbrough'],
    propertyTypes: 'Victorian stone-built terraces, Edwardian villas, inter-war semis, and modern new-builds in surrounding villages.',
  },

  // ─── Sunderland ─────────────────────────────────────────────────────────
  {
    slug: 'sunderland',
    name: 'Sunderland',
    county: 'Tyne and Wear',
    region: 'north-east',
    postcodeAreas: ['SR'],
    postcodeExample: 'SR1 1AA',
    population: '277,000',
    heroDescription:
      'Sunderland is a proud coastal city on the River Wear, offering affordable property and excellent links to Newcastle and Durham. From the Victorian terraces of Roker and Ashbrooke to modern developments along the riverfront, Sunderland\'s removal market is competitive, with plenty of local companies vying to offer the best deal.',
    localInsights: [
      'The Wearmouth and Queen Alexandra bridges are the main crossing points over the Wear — both can bottleneck during peak hours, affecting cross-river moves.',
      'Sunderland\'s seafront areas like Roker and Seaburn are popular with families, but the narrow residential streets can be tricky for large removal vehicles.',
      'The city\'s extensive metro system (Tyne and Wear Metro) means many residents commute to Newcastle, making Sunderland-to-Newcastle one of the most common removal routes in the region.',
      'Property prices are significantly below the national average, attracting first-time buyers and investors.',
    ],
    averageCostRange: '£150 – £550',
    popularAreas: ['Ashbrooke', 'Roker', 'Seaburn', 'Cleadon', 'Fulwell', 'Barnes', 'Doxford Park'],
    movingTips: [
      'Plan your route to avoid the Wearmouth Bridge at rush hour — the Northern Spire bridge offers a faster crossing during peak times.',
      'Many Victorian properties in Ashbrooke and Roker are now split into flats — confirm access arrangements with your removal company in advance.',
    ],
    nearbyCities: ['newcastle', 'middlesbrough', 'york', 'leeds', 'edinburgh', 'bradford'],
    propertyTypes: 'Victorian terraces, Edwardian villas, 1930s semis, post-war council estates, and modern riverside apartments.',
  },

  // ─── Preston ────────────────────────────────────────────────────────────
  {
    slug: 'preston',
    name: 'Preston',
    county: 'Lancashire',
    region: 'north-west',
    postcodeAreas: ['PR'],
    postcodeExample: 'PR1 1AA',
    population: '145,000',
    heroDescription:
      'Preston is Lancashire\'s administrative capital and one of the newest cities in England, centrally positioned with excellent motorway and rail links to Manchester, Liverpool, and the Lake District. With a growing property market and a mix of historic terraces, suburban estates, and waterfront developments at the Preston Docks, MoveFox helps you find movers who know every part of the PR postcode.',
    localInsights: [
      'Preston\'s central location on the M6 and M55 makes it a natural hub for removals across Lancashire and into the Lake District.',
      'The city centre\'s one-way system can be confusing for out-of-area removal drivers — local companies know the shortcuts.',
      'Preston Docks has seen significant residential development in recent years, with many waterfront apartments requiring goods-lift bookings.',
      'Two universities (UCLan and the new Lancashire campus) mean September is peak removal season, particularly in Frenchwood and Plungington.',
    ],
    averageCostRange: '£150 – £600',
    popularAreas: ['Fulwood', 'Penwortham', 'Ashton-on-Ribble', 'Brookfield', 'Broughton', 'Ingol'],
    movingTips: [
      'Preston\'s M6 junction 31 and 32 access makes it an ideal staging post for long-distance moves — ask your removal company about overnight storage options.',
      'If moving to a Preston Docks apartment, book the building\'s goods lift well in advance as time slots fill up quickly.',
    ],
    nearbyCities: ['manchester', 'liverpool', 'leeds', 'sheffield', 'warrington', 'bradford'],
    propertyTypes: 'Victorian terraces, 1930s semis, modern dockside apartments, and new-build estates in Fulwood and Broughton.',
  },

  // ─── Hull ───────────────────────────────────────────────────────────────
  {
    slug: 'hull',
    name: 'Hull',
    county: 'East Riding of Yorkshire',
    region: 'north-east',
    postcodeAreas: ['HU'],
    postcodeExample: 'HU1 1AA',
    population: '260,000',
    heroDescription:
      'Hull — officially Kingston upon Hull — is a resilient port city on the Humber Estuary with some of the most affordable housing in the UK. Since being named UK City of Culture in 2017, Hull has seen significant regeneration in its Old Town and Fruit Market areas. With a mix of Victorian avenues, inter-war estates, and new waterfront living, MoveFox connects you with experienced Hull movers.',
    localInsights: [
      'Hull has a unique cream telephone box heritage and its own independent telephone network (KCOM) — don\'t forget to arrange broadband transfer when moving.',
      'The Humber Bridge toll (currently free for cars) means moves between Hull and North Lincolnshire are straightforward and cost-effective.',
      'The Fruit Market and Old Town regeneration has brought new apartments and loft conversions, many with restricted vehicle access in pedestrianised areas.',
      'Hull\'s location at the end of the M62 means it\'s a terminal point for many long-distance moves from West Yorkshire, Manchester, and Liverpool.',
    ],
    averageCostRange: '£150 – £550',
    popularAreas: ['The Avenues', 'Anlaby', 'Cottingham', 'Hessle', 'Beverley', 'Willerby', 'Kirk Ella'],
    movingTips: [
      'The Avenues area has tree-lined streets with restricted parking — arrange a suspension through Hull City Council if you need guaranteed space for the removal van.',
      'If moving from West Yorkshire or Greater Manchester, the M62 eastbound is quieter in the mornings — take advantage of the flow.',
    ],
    nearbyCities: ['york', 'leeds', 'sheffield', 'lincoln', 'middlesbrough', 'nottingham'],
    propertyTypes: 'Victorian avenues, inter-war semis, modern waterfront apartments in the Fruit Market, and suburban new-builds.',
  },

  // ─── Swansea ────────────────────────────────────────────────────────────
  {
    slug: 'swansea',
    name: 'Swansea',
    county: 'West Glamorgan',
    region: 'wales',
    postcodeAreas: ['SA'],
    postcodeExample: 'SA1 1AA',
    population: '246,000',
    heroDescription:
      'Swansea is Wales\'s second city, beautifully positioned on the sweep of Swansea Bay with the Gower Peninsula on its doorstep. The city offers excellent value for money compared to Cardiff, with a thriving waterfront redevelopment and characterful Victorian suburbs. MoveFox matches you with local movers who understand the area\'s coastal roads and hilly terrain.',
    localInsights: [
      'Swansea\'s hilly topography means many residential streets have steep gradients — experienced local movers with the right equipment are essential.',
      'The SA1 waterfront development has modern apartments that often require goods-lift bookings and have limited loading-bay availability.',
      'The Gower Peninsula (the UK\'s first Area of Outstanding Natural Beauty) has narrow lanes that can challenge large removal vehicles.',
      'Swansea University\'s Singleton and Bay campuses drive significant student removal demand in September and June.',
    ],
    averageCostRange: '£200 – £650',
    popularAreas: ['Mumbles', 'Sketty', 'Uplands', 'Brynmill', 'Killay', 'Dunvant', 'SA1 Waterfront'],
    movingTips: [
      'If moving to the Mumbles or Gower, check that your removal company has experience with narrow coastal lanes and steep driveways.',
      'The M4 corridor from Cardiff to Swansea can be congested, especially around Port Talbot — plan for delays if moving between the two cities.',
    ],
    nearbyCities: ['cardiff', 'bristol', 'bath', 'exeter', 'birmingham', 'bournemouth'],
    propertyTypes: 'Victorian bay-fronted terraces, Edwardian villas in Sketty, modern waterfront apartments, and coastal cottages in the Mumbles.',
  },

  // ─── Derby ──────────────────────────────────────────────────────────────
  {
    slug: 'derby',
    name: 'Derby',
    county: 'Derbyshire',
    region: 'midlands',
    postcodeAreas: ['DE'],
    postcodeExample: 'DE1 1AA',
    population: '257,000',
    heroDescription:
      'Derby sits at the southern edge of the Peak District, combining affordable Midlands living with easy access to stunning countryside. As the home of Rolls-Royce and a major employment hub, Derby attracts a steady flow of relocations. With a mix of Victorian terraces near the city centre, leafy suburbs like Allestree, and new-build developments, MoveFox helps you find the right mover for your Derby move.',
    localInsights: [
      'Derby\'s inner ring road can be confusing for first-time visitors — local removal companies navigate it daily and know the best loading points.',
      'The city sits at the junction of the A38, A50, and A52, giving excellent road links but also creating bottlenecks during peak hours.',
      'Derby has a significant Rolls-Royce and Toyota workforce, meaning corporate relocations are a regular feature of the local removal market.',
      'The Cathedral Quarter and Darley Abbey areas have conservation restrictions that may affect vehicle access and parking.',
    ],
    averageCostRange: '£200 – £650',
    popularAreas: ['Allestree', 'Littleover', 'Mickleover', 'Darley Abbey', 'Oakwood', 'Spondon'],
    movingTips: [
      'If relocating for work at Rolls-Royce or Toyota, many removal companies offer corporate packages — ask MoveFox to match you with companies experienced in corporate moves.',
      'The A38 between Derby and Birmingham is one of the busiest A-roads in England — avoid Friday afternoon moves at all costs.',
    ],
    nearbyCities: ['nottingham', 'leicester', 'birmingham', 'sheffield', 'stoke-on-trent', 'lincoln'],
    propertyTypes: 'Victorian terraces, 1930s semis, modern new-build estates, and converted mill buildings in Darley Abbey.',
  },

  // ─── Portsmouth ─────────────────────────────────────────────────────────
  {
    slug: 'portsmouth',
    name: 'Portsmouth',
    county: 'Hampshire',
    region: 'south-east',
    postcodeAreas: ['PO'],
    postcodeExample: 'PO1 1AA',
    population: '238,000',
    heroDescription:
      'Portsmouth is the UK\'s only island city, packed onto Portsea Island with a dense, vibrant mix of Victorian terraces, waterfront apartments, and naval heritage. The city\'s island geography creates unique removal challenges — limited access routes, narrow streets in Old Portsmouth, and high demand for parking. MoveFox connects you with local movers who know every corner of Pompey.',
    localInsights: [
      'Portsea Island has just three road access points (M275, Eastern Road, and Copnor Bridge), so timing is critical to avoid bottlenecks during your move.',
      'Old Portsmouth and Southsea have extremely narrow streets, with many properties having no off-street parking — a parking suspension is usually essential.',
      'Gunwharf Quays and the waterfront apartments often have strict moving time windows and require goods-lift bookings.',
      'The naval base means a significant military population, with regular postings driving a steady stream of removal demand.',
    ],
    averageCostRange: '£200 – £700',
    popularAreas: ['Southsea', 'Old Portsmouth', 'Gunwharf Quays', 'North End', 'Cosham', 'Drayton', 'Farlington'],
    movingTips: [
      'Avoid the M275 during morning and evening rush hours — the single motorway onto the island becomes heavily congested.',
      'For Southsea and Old Portsmouth moves, a smaller van may be necessary for the final stretch on narrow terraced streets, even if a larger vehicle handles the long-distance leg.',
    ],
    nearbyCities: ['southampton', 'brighton', 'bournemouth', 'reading', 'london', 'winchester'],
    parkingNotes: 'Most of Southsea and Old Portsmouth is resident-permit parking only — apply to Portsmouth City Council for a temporary removal van suspension.',
    propertyTypes: 'Dense Victorian terraces, Georgian townhouses in Old Portsmouth, modern waterfront apartments, and suburban semis in the north.',
  },

  // ─── Plymouth ───────────────────────────────────────────────────────────
  {
    slug: 'plymouth',
    name: 'Plymouth',
    county: 'Devon',
    region: 'south-west',
    postcodeAreas: ['PL'],
    postcodeExample: 'PL1 1AA',
    population: '264,000',
    heroDescription:
      'Plymouth is the South West\'s largest city, commanding stunning views over Plymouth Sound and the Tamar estuary. With a strong naval heritage, two universities, and a growing creative quarter in the Royal William Yard, the city offers diverse housing from grand Hoe-facing townhouses to affordable suburban estates. MoveFox matches you with reliable Devon movers who understand Plymouth\'s unique geography.',
    localInsights: [
      'Plymouth is relatively isolated — the A38 is the primary route in and out, and the Tamar Bridge/Torpoint Ferry connects to Cornwall. Long-distance moves need careful route planning.',
      'The Royal William Yard and Millbay regeneration areas have modern apartments with restricted vehicle access and tight turning circles.',
      'Plymouth\'s naval base (HMNB Devonport) is the largest in Western Europe, driving regular military relocations.',
      'The Barbican and Hoe areas have steep, cobbled streets that require specialist equipment for furniture removal.',
    ],
    averageCostRange: '£200 – £700',
    popularAreas: ['The Hoe', 'Barbican', 'Mutley', 'Peverell', 'Plymstock', 'Derriford', 'Royal William Yard'],
    movingTips: [
      'If moving from outside Devon, remember Plymouth is further than you think — allow extra time on the A38 from Exeter (45+ miles).',
      'Moves involving the Tamar Bridge or Torpoint Ferry to/from Cornwall should factor in crossing times and potential queues, especially in summer.',
    ],
    nearbyCities: ['exeter', 'bournemouth', 'bristol', 'bath', 'southampton', 'swindon'],
    propertyTypes: 'Regency townhouses on the Hoe, Victorian terraces in Mutley, modern dockyard conversions, and suburban new-builds.',
  },

  // ─── Luton ──────────────────────────────────────────────────────────────
  {
    slug: 'luton',
    name: 'Luton',
    county: 'Bedfordshire',
    region: 'south-east',
    postcodeAreas: ['LU'],
    postcodeExample: 'LU1 1AA',
    population: '239,000',
    heroDescription:
      'Luton sits just 30 miles north of London and has become increasingly popular with commuters priced out of the capital. With London Luton Airport on its doorstep, excellent M1 access, and fast rail links to St Pancras, the town has seen significant housing growth. MoveFox helps you find removal companies who navigate Luton\'s busy roads and diverse neighbourhoods with ease.',
    localInsights: [
      'Luton\'s proximity to London means many moves are between the LU and London postcodes — this is one of the most competitive removal corridors in the South East.',
      'Airport traffic can cause congestion on the A505 and surrounding roads, particularly during holiday periods.',
      'The town centre has undergone significant regeneration, with new apartment developments requiring goods-lift access and time-slot bookings.',
      'Luton\'s M1 Junction 10 and 11 access makes it easy for long-distance moves, but local traffic around the junctions can be heavy.',
    ],
    averageCostRange: '£200 – £700',
    popularAreas: ['Stockwood Park', 'Bramingham', 'Stopsley', 'Limbury', 'Leagrave', 'Round Green'],
    movingTips: [
      'If moving from London, avoid Friday evenings and bank holiday weekends when M1 traffic and airport congestion overlap.',
      'Many Luton removal companies offer competitive rates for the Luton-to-London corridor — compare at least three quotes to get the best deal.',
    ],
    nearbyCities: ['london', 'milton-keynes', 'cambridge', 'reading', 'oxford', 'northampton'],
    propertyTypes: 'Victorian terraces, inter-war semis, 1960s estates, and modern new-build developments.',
  },

  // ─── Wolverhampton ──────────────────────────────────────────────────────
  {
    slug: 'wolverhampton',
    name: 'Wolverhampton',
    county: 'West Midlands',
    region: 'midlands',
    postcodeAreas: ['WV'],
    postcodeExample: 'WV1 1AA',
    population: '254,000',
    heroDescription:
      'Wolverhampton is a proud Black Country city just 15 miles north-west of Birmingham, offering considerably more affordable housing than its larger neighbour. With a revitalised city centre, excellent rail links on the West Coast Main Line, and characterful suburbs like Tettenhall and Penn, Wolverhampton provides great value for families and first-time buyers. MoveFox connects you with local movers who know the West Midlands inside out.',
    localInsights: [
      'Wolverhampton\'s ring road can be busy during peak hours — local removal companies are familiar with alternative routes through the city.',
      'The Wolverhampton-Birmingham corridor is one of the busiest removal routes in the Midlands, with very competitive pricing.',
      'Tettenhall and Penn are the most sought-after residential areas, with larger Victorian and Edwardian properties that may require specialist handling.',
      'The city centre is undergoing significant regeneration around the Canalside and railway station areas.',
    ],
    averageCostRange: '£180 – £650',
    popularAreas: ['Tettenhall', 'Penn', 'Finchfield', 'Compton', 'Castlecroft', 'Bushbury'],
    movingTips: [
      'If you\'re moving between Wolverhampton and Birmingham, the A41 or A454 are often faster than the motorway during rush hour.',
      'Parking in the city centre is restricted — if moving to a city centre apartment, arrange access permits well in advance.',
    ],
    nearbyCities: ['birmingham', 'coventry', 'stoke-on-trent', 'derby', 'nottingham', 'leicester'],
    propertyTypes: 'Victorian villas in Tettenhall, inter-war semis, post-war estates, and modern city centre apartments.',
  },

  // ─── Swindon ────────────────────────────────────────────────────────────
  {
    slug: 'swindon',
    name: 'Swindon',
    county: 'Wiltshire',
    region: 'south-west',
    postcodeAreas: ['SN'],
    postcodeExample: 'SN1 1AA',
    population: '225,000',
    heroDescription:
      'Swindon has grown rapidly from its railway heritage roots into one of the fastest-expanding towns in the South West. Positioned at the junction of the M4 and A419, it offers quick access to London, Bristol, and the Cotswolds. With major employers like Honda, Intel, and Nationwide, Swindon sees a steady flow of corporate relocations alongside local moves. MoveFox helps you find trusted Wiltshire movers.',
    localInsights: [
      'Swindon\'s famous Magic Roundabout (five mini-roundabouts in one) is a landmark that bewilders newcomers but local removal drivers navigate it daily.',
      'The town\'s rapid expansion means many moves are into new-build estates on the outskirts — roads may not yet be on all sat-navs.',
      'M4 Junction 15 and 16 provide excellent motorway access, but the A419/A420 corridors into the town centre can be congested.',
      'Great Western Railway offers fast services to London Paddington (under 1 hour), making Swindon popular with London commuters.',
    ],
    averageCostRange: '£200 – £650',
    popularAreas: ['Old Town', 'Wroughton', 'Highworth', 'Blunsdon', 'Shaw', 'Coate'],
    movingTips: [
      'If you\'re moving to a new-build estate on the outskirts, double-check the address with your removal company — some new developments aren\'t fully mapped yet.',
      'The M4 between Swindon and Bristol is prone to delays at the Almondsbury Interchange — factor in extra time for cross-region moves.',
    ],
    nearbyCities: ['bath', 'bristol', 'oxford', 'reading', 'bournemouth', 'southampton'],
    propertyTypes: 'Railway-era terraces in Old Town, 1930s semis, extensive modern new-build estates, and Cotswold stone villages nearby.',
  },

  // ─── Warrington ─────────────────────────────────────────────────────────
  {
    slug: 'warrington',
    name: 'Warrington',
    county: 'Cheshire',
    region: 'north-west',
    postcodeAreas: ['WA'],
    postcodeExample: 'WA1 1AA',
    population: '210,000',
    heroDescription:
      'Warrington sits perfectly between Manchester and Liverpool, making it one of the most strategically located towns in the North West. With excellent M6, M62, and M56 motorway access, the town is a magnet for families wanting space and value without sacrificing city-centre commutes. MoveFox connects you with movers who handle everything from Warrington\'s leafy Cheshire suburbs to its new-build developments.',
    localInsights: [
      'Warrington\'s position at the crossroads of the M6, M62, and M56 makes it a natural hub for removals, but motorway junction congestion can be severe during peak hours.',
      'The town\'s two main crossings over the Manchester Ship Canal (Warrington Bridge and Cantilever Bridge) can create bottlenecks — local movers plan around them.',
      'Birchwood, Omega, and Chapelford are major new-build developments that have expanded the town significantly in recent years.',
      'Warrington\'s Cheshire postcode attracts families from Manchester and Liverpool looking for better value and larger properties.',
    ],
    averageCostRange: '£200 – £650',
    popularAreas: ['Stockton Heath', 'Grappenhall', 'Lymm', 'Appleton', 'Great Sankey', 'Birchwood'],
    movingTips: [
      'If commuting to Manchester or Liverpool, test the journey during rush hour before committing — the M62 can be unpredictable.',
      'Stockton Heath and Lymm are the premium areas with higher property values — expect removal quotes to reflect the larger property sizes here.',
    ],
    nearbyCities: ['manchester', 'liverpool', 'preston', 'sheffield', 'stoke-on-trent', 'birmingham'],
    propertyTypes: 'Victorian terraces in the town centre, Cheshire-style detached homes in Stockton Heath, and modern new-build estates.',
  },

  // ─── Aberdeen ───────────────────────────────────────────────────────────
  {
    slug: 'aberdeen',
    name: 'Aberdeen',
    county: 'Aberdeenshire',
    region: 'scotland',
    postcodeAreas: ['AB'],
    postcodeExample: 'AB10 1AA',
    population: '229,000',
    heroDescription:
      'Aberdeen — the Granite City — is Scotland\'s third-largest city and the energy capital of Europe. Built from distinctive silver-grey granite, the city has a unique character and a property market closely tied to the oil and gas industry. With regular corporate relocations, university moves, and a distinctive local housing stock, MoveFox matches you with experienced Aberdeen movers who understand the city\'s quirks.',
    localInsights: [
      'Aberdeen\'s granite-built tenements and townhouses are beautiful but heavy — stairwells are often narrow and stone steps can be unforgiving on furniture.',
      'The Aberdeen Western Peripheral Route (AWPR) has transformed access around the city, but Union Street and the city centre remain congested during peak hours.',
      'Oil and gas industry cycles directly affect the property and removal market — when oil prices rise, demand surges.',
      'Aberdeen is further north than many people realise — long-distance moves from England can take a full day each way.',
    ],
    averageCostRange: '£250 – £800',
    popularAreas: ['West End', 'Rosemount', 'Cults', 'Milltimber', 'Kingswells', 'Dyce', 'Old Aberdeen'],
    movingTips: [
      'If moving to Aberdeen from England, factor in the long drive time — many removal companies offer two-day moves with overnight storage.',
      'Granite tenements often have narrow communal stairwells — confirm your removal company has stair-climbing equipment and experienced porters.',
    ],
    nearbyCities: ['edinburgh', 'glasgow', 'newcastle', 'sunderland', 'middlesbrough', 'hull'],
    propertyTypes: 'Granite tenements, Victorian townhouses, modern oil-industry developments, and suburban bungalows.',
  },

  // ─── Norwich ────────────────────────────────────────────────────────────
  {
    slug: 'norwich',
    name: 'Norwich',
    county: 'Norfolk',
    region: 'east',
    postcodeAreas: ['NR'],
    postcodeExample: 'NR1 1AA',
    population: '144,000',
    heroDescription:
      'Norwich is East Anglia\'s cultural capital, a beautiful medieval city with a thriving independent spirit. With its famous lanes, two universities, and a property market that blends historic character homes with modern developments, Norwich is consistently rated as one of the best places to live in the UK. MoveFox connects you with East Anglian movers who navigate the city\'s medieval street plan with confidence.',
    localInsights: [
      'Norwich\'s medieval street plan means the city centre has many narrow, one-way streets that can challenge large removal vehicles.',
      'The Golden Triangle (between Unthank Road, Newmarket Road, and Earlham Road) is the most popular residential area, with tree-lined Victorian streets.',
      'Norwich is relatively isolated — the A11 and A47 are the main routes in and out, with no motorway access, which affects long-distance removal pricing.',
      'Two universities (UEA and NUA) drive student removal demand, particularly around the Golden Triangle and Earlham areas.',
    ],
    averageCostRange: '£200 – £650',
    popularAreas: ['Golden Triangle', 'Eaton', 'Thorpe St Andrew', 'Cringleford', 'Poringland', 'Drayton'],
    movingTips: [
      'Norwich\'s distance from the motorway network means longer journey times for cross-country moves — factor this into your schedule and budget.',
      'If moving to a property in the Norwich Lanes or city centre, your removal company may need to use a smaller van for the final approach.',
    ],
    nearbyCities: ['ipswich', 'cambridge', 'peterborough', 'colchester', 'chelmsford', 'london'],
    propertyTypes: 'Victorian terraces in the Golden Triangle, Georgian townhouses, converted shoe factories, and modern university-area developments.',
  },

  // ─── Northampton ────────────────────────────────────────────────────────
  {
    slug: 'northampton',
    name: 'Northampton',
    county: 'Northamptonshire',
    region: 'midlands',
    postcodeAreas: ['NN'],
    postcodeExample: 'NN1 1AA',
    population: '230,000',
    heroDescription:
      'Northampton is one of England\'s largest towns and sits at the crossroads of the M1, A45, and A43, giving it superb connectivity to London, Birmingham, and the East Midlands. With a reputation for affordable family housing and a rapidly expanding population, Northampton\'s removal market is busy year-round. MoveFox matches you with local companies who know the town\'s expanding suburbs and new developments.',
    localInsights: [
      'Northampton has expanded rapidly with large new-build estates at Upton, Collingtree, and Grange Park — some of these newer roads may not be on older sat-navs.',
      'The M1 Junctions 15, 15A, and 16 provide excellent access, but rush-hour traffic around the junctions can add significant time to your move.',
      'Northampton\'s shoe-making heritage means many converted industrial buildings in the town centre, some with unusual access requirements.',
      'The town\'s central location means removal companies here are experienced with long-distance moves in all directions.',
    ],
    averageCostRange: '£200 – £650',
    popularAreas: ['Abington', 'Weston Favell', 'Duston', 'Upton', 'Great Billing', 'Collingtree'],
    movingTips: [
      'Northampton\'s central UK location means you\'re rarely more than 2 hours from anywhere — take advantage of this for scheduling flexibility.',
      'If moving to one of the newer estates, check access road completion status with your developer before the moving day.',
    ],
    nearbyCities: ['milton-keynes', 'coventry', 'leicester', 'birmingham', 'luton', 'oxford'],
    propertyTypes: '1930s semis, Victorian terraces, extensive new-build estates, and converted boot and shoe factories.',
  },

  // ─── Peterborough ───────────────────────────────────────────────────────
  {
    slug: 'peterborough',
    name: 'Peterborough',
    county: 'Cambridgeshire',
    region: 'east',
    postcodeAreas: ['PE'],
    postcodeExample: 'PE1 1AA',
    population: '215,000',
    heroDescription:
      'Peterborough is one of England\'s fastest-growing cities, combining a magnificent Norman cathedral with rapid modern expansion. Sitting on the East Coast Main Line with sub-50-minute trains to London, it has become a magnet for London commuters seeking space and affordability. MoveFox helps you find movers who know Peterborough\'s expanding suburbs and new developments.',
    localInsights: [
      'Peterborough\'s rapid population growth means new housing estates are springing up constantly — Hampton, Stanground, and the Hamptons are among the largest new developments.',
      'The Peterborough Parkway system (a network of fast dual carriageways) makes cross-city moves quick, but can be confusing for newcomers.',
      'The city centre is largely pedestrianised around Cathedral Square, requiring careful access planning for central removals.',
      'Peterborough sits at the junction of the A1(M) and A47, providing excellent road links north, south, and east.',
    ],
    averageCostRange: '£180 – £600',
    popularAreas: ['Werrington', 'Bretton', 'Hampton', 'Longthorpe', 'Orton Waterville', 'Castor'],
    movingTips: [
      'If moving from London, the A1(M) is the most direct route but can be congested around Stevenage — allow extra time.',
      'Peterborough\'s parkway system is fast but signage can be confusing — give your removal company the postcode rather than a description of where you live.',
    ],
    nearbyCities: ['cambridge', 'norwich', 'leicester', 'northampton', 'lincoln', 'nottingham'],
    propertyTypes: 'New Town-era housing from the 1970s, Victorian terraces near the centre, and large modern new-build estates.',
  },

  // ─── Ipswich ────────────────────────────────────────────────────────────
  {
    slug: 'ipswich',
    name: 'Ipswich',
    county: 'Suffolk',
    region: 'east',
    postcodeAreas: ['IP'],
    postcodeExample: 'IP1 1AA',
    population: '140,000',
    heroDescription:
      'Ipswich is Suffolk\'s county town, offering a waterfront that rivals many larger cities and some of the most affordable property in the South East. With fast rail links to London Liverpool Street (just over an hour) and a charming blend of medieval, Victorian, and modern architecture, Ipswich is increasingly attracting London leavers. MoveFox connects you with Suffolk movers who know the area inside out.',
    localInsights: [
      'Ipswich Waterfront has been transformed with modern apartment developments, many requiring goods-lift bookings and having restricted vehicle access.',
      'The A12 and A14 are the main routes into Ipswich — the A14 Orwell Bridge can be closed in high winds, disrupting moves from the west.',
      'Ipswich is a popular destination for London commuters, making the Ipswich-London removal corridor well-served and competitively priced.',
      'The town centre has a medieval street layout in places, with narrow lanes around the Buttermarket and Ancient House.',
    ],
    averageCostRange: '£200 – £600',
    popularAreas: ['Waterfront', 'Christchurch Park', 'Rushmere St Andrew', 'Kesgrave', 'Martlesham', 'Woodbridge'],
    movingTips: [
      'Check the A14 Orwell Bridge status before your move — high-wind closures can add an hour to your journey if diverted through the town centre.',
      'If moving from London, midweek moves on the A12 corridor tend to be significantly cheaper and less traffic-affected than weekend moves.',
    ],
    nearbyCities: ['norwich', 'colchester', 'chelmsford', 'cambridge', 'peterborough', 'london'],
    propertyTypes: 'Medieval timber-framed buildings, Victorian terraces, modern waterfront apartments, and suburban new-builds.',
  },

  // ─── Exeter ─────────────────────────────────────────────────────────────
  {
    slug: 'exeter',
    name: 'Exeter',
    county: 'Devon',
    region: 'south-west',
    postcodeAreas: ['EX'],
    postcodeExample: 'EX1 1AA',
    population: '131,000',
    heroDescription:
      'Exeter is Devon\'s thriving capital city, combining Roman history with a vibrant university town atmosphere. As the gateway to both the English Riviera and Dartmoor, Exeter attracts a mix of families, retirees, and students. With steep hills, a compact historic centre, and growing suburbs, MoveFox matches you with Devon movers who handle Exeter\'s unique terrain.',
    localInsights: [
      'Exeter is built on seriously steep hills — Fore Street, Sidwell Street, and Pennsylvania Road all have gradients that demand experienced porters.',
      'The city centre has extensive pedestrianisation and restricted vehicle access, particularly around the Cathedral Quarter.',
      'Exeter University and Exeter St David\'s station area drive significant seasonal removal demand.',
      'The M5 terminates at Exeter, making it the last motorway stop before the A30/A38 to Cornwall and the South Devon coast.',
    ],
    averageCostRange: '£200 – £700',
    popularAreas: ['St Leonard\'s', 'Heavitree', 'Topsham', 'Pinhoe', 'Whipton', 'Alphington'],
    movingTips: [
      'If moving to one of Exeter\'s hillside streets, confirm your removal company has stair-climbing equipment and is comfortable with steep terrain.',
      'Topsham is a popular village within the Exeter area but has very narrow streets — a smaller van may be needed for the last mile.',
    ],
    nearbyCities: ['plymouth', 'bournemouth', 'bath', 'bristol', 'swindon', 'southampton'],
    propertyTypes: 'Georgian and Victorian terraces, Edwardian semis, thatched cottages in Topsham, and modern university-area developments.',
  },

  // ─── Chelmsford ─────────────────────────────────────────────────────────
  {
    slug: 'chelmsford',
    name: 'Chelmsford',
    county: 'Essex',
    region: 'east',
    postcodeAreas: ['CM'],
    postcodeExample: 'CM1 1AA',
    population: '180,000',
    heroDescription:
      'Chelmsford is Essex\'s only city and one of the most popular commuter destinations in the South East, with trains reaching London Liverpool Street in just 34 minutes. With a thriving high street, excellent schools, and a mix of period homes and modern developments, Chelmsford attracts a constant stream of London leavers. MoveFox helps you find movers experienced with the busy London-to-Essex corridor.',
    localInsights: [
      'Chelmsford\'s Army & Navy roundabout is one of the most congested junctions in Essex — your removal company should plan routes to avoid it during peak hours.',
      'The city has seen massive new-build development at Beaulieu Park (a new neighbourhood of 3,600 homes with its own future railway station).',
      'The A12 and A130 provide the main road links, but both can be heavily congested — the Chelmsford bypass helps for through-traffic.',
      'Chelmsford\'s fast London rail link means the London-to-Chelmsford removal corridor is one of the busiest in the South East.',
    ],
    averageCostRange: '£200 – £700',
    popularAreas: ['Moulsham', 'Broomfield', 'Writtle', 'Great Baddow', 'Springfield', 'Galleywood'],
    movingTips: [
      'If moving from London to Chelmsford, avoid the A12 during Friday evening rush — it becomes a car park from the Brentwood junction onwards.',
      'Beaulieu Park is still being built — check road access and site conditions with your removal company before moving day.',
    ],
    nearbyCities: ['colchester', 'london', 'ipswich', 'cambridge', 'luton', 'reading'],
    propertyTypes: 'Victorian terraces in Moulsham, Edwardian semis, 1930s homes, and large modern new-build developments.',
  },

  // ─── Colchester ─────────────────────────────────────────────────────────
  {
    slug: 'colchester',
    name: 'Colchester',
    county: 'Essex',
    region: 'east',
    postcodeAreas: ['CO'],
    postcodeExample: 'CO1 1AA',
    population: '110,000',
    heroDescription:
      'Colchester is Britain\'s oldest recorded town, with a rich history stretching back to Roman times. Now a thriving garrison town with a university, vibrant high street, and growing commuter population, Colchester offers a unique mix of ancient character and modern living. MoveFox connects you with Essex movers who handle everything from Dutch Quarter cottages to modern Garrison developments.',
    localInsights: [
      'Colchester\'s Roman street plan means the town centre has narrow, winding roads that can be challenging for large removal vehicles.',
      'The Dutch Quarter and Old Town have the most characterful properties but the tightest access — many streets are one-way or restricted.',
      'Colchester Garrison is one of the largest military bases in the UK, driving regular MoD and military family relocations.',
      'The A12 runs right past the town, providing good links to London and Ipswich, but Junction 28 and 29 are congestion hotspots.',
    ],
    averageCostRange: '£200 – £650',
    popularAreas: ['Lexden', 'Old Heath', 'Wivenhoe', 'West Mersea', 'Dutch Quarter', 'Garrison'],
    movingTips: [
      'If moving into the Dutch Quarter or Old Town, your removal company will likely need a smaller transit van for the final approach — discuss this in advance.',
      'Military families should ask about MoD removal allowances — many Colchester removal companies are experienced with military move protocols.',
    ],
    nearbyCities: ['ipswich', 'chelmsford', 'norwich', 'cambridge', 'london', 'peterborough'],
    propertyTypes: 'Tudor and Georgian townhouses, Victorian terraces, military housing, modern Garrison developments, and riverside homes in Wivenhoe.',
  },

  // ─── Lincoln ────────────────────────────────────────────────────────────
  {
    slug: 'lincoln',
    name: 'Lincoln',
    county: 'Lincolnshire',
    region: 'midlands',
    postcodeAreas: ['LN'],
    postcodeExample: 'LN1 1AA',
    population: '104,000',
    heroDescription:
      'Lincoln is a stunning cathedral city divided dramatically between the historic uphill area around the castle and cathedral, and the more modern downhill city centre and suburbs. This split-level geography creates unique removal challenges — Steep Hill is literally one of the steepest streets in England. MoveFox matches you with Lincolnshire movers who tackle the city\'s gradients daily.',
    localInsights: [
      'Lincoln\'s Steep Hill is one of the steepest residential streets in England — moving here requires specialist equipment and experienced porters.',
      'The uphill/downhill divide is a genuine consideration — properties at the top of the hill command a premium but are much harder to move into.',
      'Lincoln has relatively limited road links — the A46 and A15 are the main routes, and there\'s no direct motorway access, which affects long-distance removal costs.',
      'The university and cathedral area drive demand for smaller moves and student relocations.',
    ],
    averageCostRange: '£150 – £550',
    popularAreas: ['Uphill', 'Bailgate', 'West End', 'Nettleham', 'North Hykeham', 'Bracebridge Heath'],
    movingTips: [
      'If moving to the uphill area, discuss the Steep Hill challenge with your removal company upfront — they may need to charge extra for specialist equipment.',
      'Lincoln\'s lack of motorway access means moves to distant cities take longer than expected — plan your day accordingly.',
    ],
    nearbyCities: ['nottingham', 'sheffield', 'hull', 'peterborough', 'leicester', 'derby'],
    propertyTypes: 'Medieval and Georgian properties uphill, Victorian terraces, 1930s semis downhill, and modern new-builds on the outskirts.',
  },

  // ─── Bath ───────────────────────────────────────────────────────────────
  {
    slug: 'bath',
    name: 'Bath',
    county: 'Somerset',
    region: 'south-west',
    postcodeAreas: ['BA'],
    postcodeExample: 'BA1 1AA',
    population: '100,000',
    heroDescription:
      'Bath is one of England\'s most beautiful cities, a UNESCO World Heritage Site famous for its Georgian architecture, Roman Baths, and honey-coloured stone crescents. This beauty comes with removal challenges — narrow Georgian streets, strict conservation controls, and steep hillsides surrounding the city centre. MoveFox connects you with movers who treat Bath\'s precious properties with the care they deserve.',
    localInsights: [
      'Bath\'s World Heritage status means many streets have strict vehicle access restrictions and weight limits that affect large removal vehicles.',
      'The Royal Crescent, The Circus, and Lansdown areas have no off-street parking and extremely limited loading space — parking suspensions are essential.',
      'Bath sits in a bowl surrounded by steep hills — properties in Bathwick, Widcombe, and Combe Down require vehicles that can handle sharp gradients.',
      'The city\'s Clean Air Zone charges non-compliant vehicles entering the centre — check your removal company\'s fleet meets the standards.',
    ],
    averageCostRange: '£250 – £800',
    popularAreas: ['Bathwick', 'Widcombe', 'Bear Flat', 'Lansdown', 'Combe Down', 'Larkhall', 'Oldfield Park'],
    movingTips: [
      'Georgian properties often have narrow doorways and tight staircases — discuss furniture dimensions with your removal company and consider whether any items need dismantling.',
      'Apply for a parking suspension from Bath and North East Somerset Council well in advance — spaces near Georgian properties are extremely limited.',
      'The Bath Clean Air Zone means your removal company needs compliant vehicles — check this at booking stage to avoid surprise charges.',
    ],
    nearbyCities: ['bristol', 'swindon', 'bournemouth', 'exeter', 'cardiff', 'oxford'],
    parkingNotes: 'Most central Bath streets are residents\' parking only. A Council parking suspension is essential and should be arranged at least two weeks ahead.',
    congestionNotes: 'Bath\'s Clean Air Zone (CAZ) charges non-compliant vehicles entering the zone — up to £100/day for HGVs.',
    propertyTypes: 'Georgian townhouses and crescents, Regency villas, Victorian terraces in the suburbs, and modern developments on the outskirts.',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const CITY_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));
export const ALL_CITY_SLUGS = CITIES.map((c) => c.slug);
