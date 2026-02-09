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
    nearbyCities: ['brighton', 'reading', 'cambridge', 'oxford', 'southampton', 'milton-keynes'],
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
    nearbyCities: ['liverpool', 'leeds', 'sheffield', 'york', 'birmingham', 'newcastle'],
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
    nearbyCities: ['coventry', 'nottingham', 'leicester', 'manchester', 'sheffield', 'bristol'],
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
    nearbyCities: ['manchester', 'leeds', 'sheffield', 'birmingham', 'cardiff', 'newcastle'],
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
    nearbyCities: ['sheffield', 'york', 'manchester', 'newcastle', 'nottingham', 'liverpool'],
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
    nearbyCities: ['leeds', 'nottingham', 'manchester', 'york', 'birmingham', 'leicester'],
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
    nearbyCities: ['cardiff', 'oxford', 'southampton', 'birmingham', 'reading', 'brighton'],
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
    nearbyCities: ['leeds', 'sheffield', 'manchester', 'york', 'edinburgh', 'glasgow'],
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
    nearbyCities: ['leicester', 'birmingham', 'sheffield', 'leeds', 'cambridge', 'milton-keynes'],
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
    nearbyCities: ['brighton', 'reading', 'oxford', 'bristol', 'london', 'cardiff'],
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
    nearbyCities: ['glasgow', 'newcastle', 'leeds', 'manchester', 'york', 'sheffield'],
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
    nearbyCities: ['edinburgh', 'newcastle', 'leeds', 'manchester', 'liverpool', 'cardiff'],
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
    nearbyCities: ['bristol', 'birmingham', 'london', 'southampton', 'oxford', 'liverpool'],
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
    nearbyCities: ['london', 'oxford', 'milton-keynes', 'nottingham', 'leicester', 'reading'],
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
    nearbyCities: ['leeds', 'sheffield', 'newcastle', 'manchester', 'nottingham', 'edinburgh'],
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
    nearbyCities: ['birmingham', 'leicester', 'nottingham', 'oxford', 'milton-keynes', 'bristol'],
    propertyTypes: 'Post-war housing, 1930s semis, Edwardian terraces in Earlsdon, and modern city centre apartments.',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const CITY_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]));
export const ALL_CITY_SLUGS = CITIES.map((c) => c.slug);
