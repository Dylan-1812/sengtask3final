export interface ParkFacility {
  name: string
  icon: string
  description?: string
}

export interface ParkRules {
  offLeashAreas: boolean
  offLeashHours?: string
  dogWaterAccess: boolean
  bagDispenserAvailable: boolean
  sizeRestrictions?: string
}

export interface ParkAccessibility {
  parking: boolean
  publicTransport: boolean
  wheelchairAccessible: boolean
  nearbyAmenities: string[]
}

export interface Park {
  id: number
  name: string
  slug: string
  location: string
  coordinates: {
    latitude: number
    longitude: number
  }
  rating: number
  reviews: number
  image: string
  facilities: ParkFacility[]
  rules: ParkRules
  accessibility: ParkAccessibility
  description: string
  longDescription?: string
  distance?: string
  address: string
  hours: string
  phone?: string
  website?: string
  size: string
  terrain: string[]
  popularTimes?: {
    morning: number
    afternoon: number
    evening: number
    weekend: number
  }
  bestFor?: string[]
}

export const parkFacilities: Record<string, ParkFacility> = {
  offLeash: {
    name: "Off-leash area",
    icon: "square",
    description: "Designated area where dogs can run without a leash",
  },
  fenced: {
    name: "Fully fenced",
    icon: "square",
    description: "Secure fencing around the entire off-leash area",
  },
  waterFountain: {
    name: "Water fountains",
    icon: "droplet",
    description: "Fresh water available for dogs and owners",
  },
  dogWater: {
    name: "Dog water station",
    icon: "droplet",
    description: "Dedicated water stations for dogs",
  },
  seating: {
    name: "Seating areas",
    icon: "armchair",
    description: "Benches and seating for owners",
  },
  shade: {
    name: "Shaded areas",
    icon: "umbrella",
    description: "Trees or structures providing shade",
  },
  parking: {
    name: "Parking",
    icon: "car",
    description: "Dedicated parking spaces available",
  },
  toilets: {
    name: "Toilets",
    icon: "bath",
    description: "Public restrooms on site",
  },
  cafe: {
    name: "Cafe nearby",
    icon: "coffee",
    description: "Coffee or food available close to the park",
  },
  playground: {
    name: "Playground",
    icon: "toy",
    description: "Children's play equipment",
  },
  agility: {
    name: "Agility equipment",
    icon: "activity",
    description: "Dog agility or exercise equipment",
  },
  wasteBags: {
    name: "Waste bags",
    icon: "trash",
    description: "Dog waste bag dispensers available",
  },
  picnicArea: {
    name: "Picnic areas",
    icon: "utensils",
    description: "Tables and spaces for picnics",
  },
  bbq: {
    name: "BBQ facilities",
    icon: "flame",
    description: "Public BBQ equipment available",
  },
  beach: {
    name: "Beach access",
    icon: "waves",
    description: "Access to dog-friendly beach area",
  },
  swimArea: {
    name: "Swimming area",
    icon: "swim",
    description: "Safe water area for dogs to swim",
  },
  walkingTrails: {
    name: "Walking trails",
    icon: "footprints",
    description: "Designated walking paths",
  },
  lighting: {
    name: "Night lighting",
    icon: "lamp",
    description: "Illumination for evening visits",
  },
  smallDogArea: {
    name: "Small dog area",
    icon: "dog",
    description: "Separate area for small breeds",
  },
}

// Export both names for compatibility
export const sydneyDogParks: Park[] = [
  {
    id: 1,
    name: "Parramatta Park",
    slug: "parramatta-park",
    location: "Parramatta, NSW",
    coordinates: {
      latitude: -33.815,
      longitude: 151.0017,
    },
    rating: 4.7,
    reviews: 892,
    image: "/placeholder.svg?height=400&width=600&text=Parramatta+Park",
    facilities: [
      parkFacilities.offLeash,
      parkFacilities.waterFountain,
      parkFacilities.seating,
      parkFacilities.shade,
      parkFacilities.parking,
      parkFacilities.toilets,
      parkFacilities.cafe,
      parkFacilities.wasteBags,
      parkFacilities.picnicArea,
      parkFacilities.walkingTrails,
      parkFacilities.playground,
    ],
    rules: {
      offLeashAreas: true,
      offLeashHours: "All hours in designated areas",
      dogWaterAccess: true,
      bagDispenserAvailable: true,
    },
    accessibility: {
      parking: true,
      publicTransport: true,
      wheelchairAccessible: true,
      nearbyAmenities: ["Cafes", "Restaurants", "Parramatta CBD"],
    },
    description: "Historic park with extensive off-leash areas and beautiful river views.",
    longDescription:
      "Parramatta Park is a 85-hectare heritage-listed park offering multiple off-leash areas for dogs. The park features the Domain Creek off-leash area and several other designated zones where dogs can run freely. With its rich history dating back to 1858, the park combines heritage buildings with modern facilities. The Parramatta River runs through the park, providing scenic walking trails and water access for dogs.",
    distance: "1.2 km",
    address: "Pitt Street, Parramatta, NSW 2150",
    hours: "Open 24 hours",
    phone: "(02) 9895 7777",
    website: "https://www.parramattapark.com.au/",
    size: "85 hectares (210 acres)",
    terrain: ["Open fields", "River frontage", "Heritage gardens", "Walking paths"],
    popularTimes: {
      morning: 5,
      afternoon: 4,
      evening: 4,
      weekend: 5,
    },
    bestFor: ["Historic walks", "River access", "Large dogs", "Training"],
  },
  {
    id: 2,
    name: "Lake Parramatta Reserve",
    slug: "lake-parramatta-reserve",
    location: "North Parramatta, NSW",
    coordinates: {
      latitude: -33.7889,
      longitude: 151.0167,
    },
    rating: 4.6,
    reviews: 654,
    image: "/placeholder.svg?height=400&width=600&text=Lake+Parramatta",
    facilities: [
      parkFacilities.offLeash,
      parkFacilities.waterFountain,
      parkFacilities.seating,
      parkFacilities.shade,
      parkFacilities.parking,
      parkFacilities.toilets,
      parkFacilities.wasteBags,
      parkFacilities.walkingTrails,
      parkFacilities.picnicArea,
      parkFacilities.bbq,
    ],
    rules: {
      offLeashAreas: true,
      offLeashHours: "Before 9am and after 4pm",
      dogWaterAccess: true,
      bagDispenserAvailable: true,
    },
    accessibility: {
      parking: true,
      publicTransport: false,
      wheelchairAccessible: true,
      nearbyAmenities: ["Kiosk", "Picnic areas"],
    },
    description: "Scenic lake reserve with bushland trails and designated off-leash times.",
    longDescription:
      "Lake Parramatta Reserve offers a peaceful bushland setting around a beautiful lake. The reserve features designated off-leash hours where dogs can explore the natural environment safely. Multiple walking trails of varying difficulty wind through native bushland, providing excellent exercise for both dogs and owners. The lake area offers water access for dogs during off-leash times, and the reserve includes several picnic areas perfect for family outings.",
    distance: "3.8 km",
    address: "Lake Parramatta Road, North Parramatta, NSW 2151",
    hours: "6:00 AM - 6:00 PM",
    phone: "(02) 9806 5050",
    size: "70 hectares (173 acres)",
    terrain: ["Lake", "Bushland trails", "Open areas", "Natural paths"],
    popularTimes: {
      morning: 5,
      afternoon: 3,
      evening: 4,
      weekend: 5,
    },
    bestFor: ["Nature walks", "Swimming dogs", "Bushland exploration", "Quiet exercise"],
  },
  {
    id: 3,
    name: "Granville Park",
    slug: "granville-park",
    location: "Granville, NSW",
    coordinates: {
      latitude: -33.8317,
      longitude: 151.0139,
    },
    rating: 4.4,
    reviews: 423,
    image: "/placeholder.svg?height=400&width=600&text=Granville+Park",
    facilities: [
      parkFacilities.offLeash,
      parkFacilities.fenced,
      parkFacilities.waterFountain,
      parkFacilities.dogWater,
      parkFacilities.seating,
      parkFacilities.shade,
      parkFacilities.parking,
      parkFacilities.wasteBags,
      parkFacilities.agility,
      parkFacilities.smallDogArea,
    ],
    rules: {
      offLeashAreas: true,
      offLeashHours: "All hours",
      dogWaterAccess: true,
      bagDispenserAvailable: true,
    },
    accessibility: {
      parking: true,
      publicTransport: true,
      wheelchairAccessible: true,
      nearbyAmenities: ["Shops", "Train station"],
    },
    description: "Fully fenced dog park with separate areas for small and large dogs.",
    longDescription:
      "Granville Park features a purpose-built, fully fenced off-leash dog area that's perfect for safe, supervised play. The park includes separate sections for small and large dogs, ensuring comfortable play for all sizes. Agility equipment is available for active dogs, and multiple water stations keep pets hydrated. The park's central location near Granville train station makes it easily accessible, and ample parking is available for those driving.",
    distance: "2.1 km",
    address: "Carlton Street, Granville, NSW 2142",
    hours: "6:00 AM - 8:00 PM",
    phone: "(02) 9895 0777",
    size: "2 hectares (5 acres)",
    terrain: ["Fenced areas", "Grass surface", "Agility course"],
    popularTimes: {
      morning: 4,
      afternoon: 5,
      evening: 4,
      weekend: 5,
    },
    bestFor: ["Small dogs", "Nervous dogs", "Agility training", "Safe play"],
  },
  {
    id: 4,
    name: "Merrylands Park",
    slug: "merrylands-park",
    location: "Merrylands, NSW",
    coordinates: {
      latitude: -33.8372,
      longitude: 150.9889,
    },
    rating: 4.5,
    reviews: 567,
    image: "/placeholder.svg?height=400&width=600&text=Merrylands+Park",
    facilities: [
      parkFacilities.offLeash,
      parkFacilities.waterFountain,
      parkFacilities.seating,
      parkFacilities.shade,
      parkFacilities.parking,
      parkFacilities.toilets,
      parkFacilities.wasteBags,
      parkFacilities.picnicArea,
      parkFacilities.playground,
      parkFacilities.walkingTrails,
    ],
    rules: {
      offLeashAreas: true,
      offLeashHours: "All hours in designated areas",
      dogWaterAccess: true,
      bagDispenserAvailable: true,
    },
    accessibility: {
      parking: true,
      publicTransport: true,
      wheelchairAccessible: true,
      nearbyAmenities: ["Shopping center", "Cafes", "Library"],
    },
    description: "Community park with large off-leash area and excellent family facilities.",
    longDescription:
      "Merrylands Park is a well-maintained community space featuring a large designated off-leash area where dogs can exercise freely. The park combines recreational facilities for families with excellent amenities for dog owners. Multiple walking paths wind through the park, and the adjacent playground makes it perfect for families with children and pets. The park's location near Merrylands shopping center provides convenient access to cafes and shops.",
    distance: "4.2 km",
    address: "Burnett Street, Merrylands, NSW 2160",
    hours: "Open 24 hours",
    phone: "(02) 9840 9840",
    size: "12 hectares (30 acres)",
    terrain: ["Open fields", "Paved paths", "Grassy areas", "Playground area"],
    popularTimes: {
      morning: 4,
      afternoon: 4,
      evening: 3,
      weekend: 5,
    },
    bestFor: ["Family outings", "Community events", "Regular exercise", "Social dogs"],
  },
  {
    id: 5,
    name: "Westmead Park",
    slug: "westmead-park",
    location: "Westmead, NSW",
    coordinates: {
      latitude: -33.8067,
      longitude: 150.9878,
    },
    rating: 4.3,
    reviews: 389,
    image: "/placeholder.svg?height=400&width=600&text=Westmead+Park",
    facilities: [
      parkFacilities.offLeash,
      parkFacilities.waterFountain,
      parkFacilities.seating,
      parkFacilities.shade,
      parkFacilities.parking,
      parkFacilities.toilets,
      parkFacilities.wasteBags,
      parkFacilities.walkingTrails,
      parkFacilities.lighting,
    ],
    rules: {
      offLeashAreas: true,
      offLeashHours: "6:00 AM - 8:00 PM",
      dogWaterAccess: true,
      bagDispenserAvailable: true,
    },
    accessibility: {
      parking: true,
      publicTransport: true,
      wheelchairAccessible: true,
      nearbyAmenities: ["Hospital", "Medical precinct", "Cafes"],
    },
    description: "Well-lit park with evening access and proximity to Westmead medical precinct.",
    longDescription:
      "Westmead Park offers a convenient location near the major medical precinct with excellent lighting for evening visits. The park features a designated off-leash area that's well-maintained and regularly patrolled. Walking trails connect to the broader Westmead area, and the park's lighting system allows for safe evening exercise. The proximity to Westmead Hospital and the medical precinct makes it popular with healthcare workers and local residents.",
    distance: "5.1 km",
    address: "Hawkesbury Road, Westmead, NSW 2145",
    hours: "6:00 AM - 10:00 PM",
    phone: "(02) 9845 3333",
    size: "8 hectares (20 acres)",
    terrain: ["Open areas", "Paved paths", "Landscaped gardens", "Lit walkways"],
    popularTimes: {
      morning: 3,
      afternoon: 4,
      evening: 5,
      weekend: 4,
    },
    bestFor: ["Evening walks", "Medical precinct workers", "Well-lit exercise", "Regular visits"],
  },
]

// Export with both names for compatibility
export const parramattaDogParks = sydneyDogParks
