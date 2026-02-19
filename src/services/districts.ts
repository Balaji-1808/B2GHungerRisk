// Tamil Nadu Districts and their Blocks

export interface District {
    code: number;
    name: string;
    blocks: string[];
}

export interface SchoolData {
    name: string;
    block: string;
    district: string;
    udiseCode: string;
}

export const DISTRICTS: District[] = [
    {
        code: 1,
        name: 'Kanchipuram',
        blocks: [
            'Kanchipuram',
            'Walajabad',
            'Uthiramerur',
            'Sriperumbudur',
            'Kundrathur',
            'Thiruporur',
            'Kattankolathur',
            'Thirukalukundram',
            'Thomas Malai',
            'Acharapakkam',
            'Madurantakam',
            'Lathur',
            'Chithamur'
        ]
    },
    {
        code: 2,
        name: 'Tiruvallur',
        blocks: [
            'Villivakkam',
            'Puzhal',
            'Minjur',
            'Sholavaram',
            'Gummidipoondi',
            'Tiruvalangadu',
            'Tiruttani',
            'Pallipet',
            'R.K.Pet',
            'Tiruvallur',
            'Poondi',
            'Kadambathur',
            'Ellapuram',
            'Poonamallee'
        ]
    },
    {
        code: 3,
        name: 'Cuddalore',
        blocks: [
            'Cuddalore',
            'Annagramam',
            'Panruti',
            'Kurinjipadi',
            'Kattumannar Koil',
            'Kumaratchi',
            'Keerapalayam',
            'Melbhuvanagiri',
            'Parangipettai',
            'Vridhachalam',
            'Kammapuram',
            'Nallur',
            'Mangalur'
        ]
    },
    {
        code: 4,
        name: 'Villupuram',
        blocks: [
            'Tirukollur',
            'Mugaiyur',
            'T.V. Nallur',
            'Tirunavalur',
            'Ulundurpet',
            'Kanai',
            'Koliyanur',
            'Kandamangalam',
            'Vikkiravandi',
            'Olakkur',
            'Mailam',
            'Merkanam'
        ]
    }
];

// Comprehensive list of schools for all districts
export const SCHOOLS_DATABASE: SchoolData[] = [
    // Kanchipuram District Schools
    { name: 'GHS Kanchipuram Main', block: 'Kanchipuram', district: 'Kanchipuram', udiseCode: '33010100101' },
    { name: 'GHSS Kanchipuram Central', block: 'Kanchipuram', district: 'Kanchipuram', udiseCode: '33010100102' },
    { name: 'GMS Kanchipuram North', block: 'Kanchipuram', district: 'Kanchipuram', udiseCode: '33010100103' },
    { name: 'PUMS Kanchipuram East', block: 'Kanchipuram', district: 'Kanchipuram', udiseCode: '33010100104' },
    
    { name: 'GHS Walajabad', block: 'Walajabad', district: 'Kanchipuram', udiseCode: '33010200101' },
    { name: 'GHSS Walajabad Central', block: 'Walajabad', district: 'Kanchipuram', udiseCode: '33010200102' },
    { name: 'GMS Walajabad South', block: 'Walajabad', district: 'Kanchipuram', udiseCode: '33010200103' },
    
    { name: 'GHS Uthiramerur', block: 'Uthiramerur', district: 'Kanchipuram', udiseCode: '33010300101' },
    { name: 'GHSS Uthiramerur Main', block: 'Uthiramerur', district: 'Kanchipuram', udiseCode: '33010300102' },
    { name: 'GMS Uthiramerur West', block: 'Uthiramerur', district: 'Kanchipuram', udiseCode: '33010300103' },
    
    { name: 'GHS Sriperumbudur', block: 'Sriperumbudur', district: 'Kanchipuram', udiseCode: '33010400101' },
    { name: 'GHSS Sriperumbudur Central', block: 'Sriperumbudur', district: 'Kanchipuram', udiseCode: '33010400102' },
    { name: 'GMS Sriperumbudur North', block: 'Sriperumbudur', district: 'Kanchipuram', udiseCode: '33010400103' },
    
    { name: 'GHS Kundrathur', block: 'Kundrathur', district: 'Kanchipuram', udiseCode: '33010500101' },
    { name: 'GHSS Kundrathur Main', block: 'Kundrathur', district: 'Kanchipuram', udiseCode: '33010500102' },
    
    { name: 'GHS Thiruporur', block: 'Thiruporur', district: 'Kanchipuram', udiseCode: '33010600101' },
    { name: 'GHSS Thiruporur Central', block: 'Thiruporur', district: 'Kanchipuram', udiseCode: '33010600102' },
    
    { name: 'GHS Kattankolathur', block: 'Kattankolathur', district: 'Kanchipuram', udiseCode: '33010700101' },
    { name: 'GHSS Kattankolathur Main', block: 'Kattankolathur', district: 'Kanchipuram', udiseCode: '33010700102' },
    
    { name: 'GHS Thirukalukundram', block: 'Thirukalukundram', district: 'Kanchipuram', udiseCode: '33010800101' },
    { name: 'GHSS Thirukalukundram Central', block: 'Thirukalukundram', district: 'Kanchipuram', udiseCode: '33010800102' },
    
    { name: 'GHS Thomas Malai', block: 'Thomas Malai', district: 'Kanchipuram', udiseCode: '33010900101' },
    { name: 'GHSS Thomas Malai Main', block: 'Thomas Malai', district: 'Kanchipuram', udiseCode: '33010900102' },
    
    { name: 'GHS Acharapakkam', block: 'Acharapakkam', district: 'Kanchipuram', udiseCode: '33011000101' },
    { name: 'GHSS Acharapakkam Central', block: 'Acharapakkam', district: 'Kanchipuram', udiseCode: '33011000102' },
    
    { name: 'GHS Madurantakam', block: 'Madurantakam', district: 'Kanchipuram', udiseCode: '33011100101' },
    { name: 'GHSS Madurantakam Main', block: 'Madurantakam', district: 'Kanchipuram', udiseCode: '33011100102' },
    
    { name: 'GHS Lathur', block: 'Lathur', district: 'Kanchipuram', udiseCode: '33011200101' },
    { name: 'GHSS Lathur Central', block: 'Lathur', district: 'Kanchipuram', udiseCode: '33011200102' },
    
    { name: 'GHS Chithamur', block: 'Chithamur', district: 'Kanchipuram', udiseCode: '33011300101' },
    { name: 'GHSS Chithamur Main', block: 'Chithamur', district: 'Kanchipuram', udiseCode: '33011300102' },

    // Tiruvallur District Schools
    { name: 'GHS Villivakkam', block: 'Villivakkam', district: 'Tiruvallur', udiseCode: '33020100101' },
    { name: 'GHSS Villivakkam Central', block: 'Villivakkam', district: 'Tiruvallur', udiseCode: '33020100102' },
    { name: 'GMS Villivakkam North', block: 'Villivakkam', district: 'Tiruvallur', udiseCode: '33020100103' },
    
    { name: 'GHS Puzhal', block: 'Puzhal', district: 'Tiruvallur', udiseCode: '33020200101' },
    { name: 'GHSS Puzhal Main', block: 'Puzhal', district: 'Tiruvallur', udiseCode: '33020200102' },
    
    { name: 'GHS Minjur', block: 'Minjur', district: 'Tiruvallur', udiseCode: '33020300101' },
    { name: 'GHSS Minjur Central', block: 'Minjur', district: 'Tiruvallur', udiseCode: '33020300102' },
    
    { name: 'GHS Sholavaram', block: 'Sholavaram', district: 'Tiruvallur', udiseCode: '33020400101' },
    { name: 'GHSS Sholavaram Main', block: 'Sholavaram', district: 'Tiruvallur', udiseCode: '33020400102' },
    
    { name: 'GHS Gummidipoondi', block: 'Gummidipoondi', district: 'Tiruvallur', udiseCode: '33020500101' },
    { name: 'GHSS Gummidipoondi Central', block: 'Gummidipoondi', district: 'Tiruvallur', udiseCode: '33020500102' },
    
    { name: 'GHS Tiruvalangadu', block: 'Tiruvalangadu', district: 'Tiruvallur', udiseCode: '33020600101' },
    { name: 'GHSS Tiruvalangadu Main', block: 'Tiruvalangadu', district: 'Tiruvallur', udiseCode: '33020600102' },
    
    { name: 'GHS Tiruttani', block: 'Tiruttani', district: 'Tiruvallur', udiseCode: '33020700101' },
    { name: 'GHSS Tiruttani Central', block: 'Tiruttani', district: 'Tiruvallur', udiseCode: '33020700102' },
    
    { name: 'GHS Pallipet', block: 'Pallipet', district: 'Tiruvallur', udiseCode: '33020800101' },
    { name: 'GHSS Pallipet Main', block: 'Pallipet', district: 'Tiruvallur', udiseCode: '33020800102' },
    
    { name: 'GHS R.K.Pet', block: 'R.K.Pet', district: 'Tiruvallur', udiseCode: '33020900101' },
    { name: 'GHSS R.K.Pet Central', block: 'R.K.Pet', district: 'Tiruvallur', udiseCode: '33020900102' },
    
    { name: 'GHS Tiruvallur', block: 'Tiruvallur', district: 'Tiruvallur', udiseCode: '33021000101' },
    { name: 'GHSS Tiruvallur Main', block: 'Tiruvallur', district: 'Tiruvallur', udiseCode: '33021000102' },
    
    { name: 'GHS Poondi', block: 'Poondi', district: 'Tiruvallur', udiseCode: '33021100101' },
    { name: 'GHSS Poondi Central', block: 'Poondi', district: 'Tiruvallur', udiseCode: '33021100102' },
    
    { name: 'GHS Kadambathur', block: 'Kadambathur', district: 'Tiruvallur', udiseCode: '33021200101' },
    { name: 'GHSS Kadambathur Main', block: 'Kadambathur', district: 'Tiruvallur', udiseCode: '33021200102' },
    
    { name: 'GHS Ellapuram', block: 'Ellapuram', district: 'Tiruvallur', udiseCode: '33021300101' },
    { name: 'GHSS Ellapuram Central', block: 'Ellapuram', district: 'Tiruvallur', udiseCode: '33021300102' },
    
    { name: 'GHS Poonamallee', block: 'Poonamallee', district: 'Tiruvallur', udiseCode: '33021400101' },
    { name: 'GHSS Poonamallee Main', block: 'Poonamallee', district: 'Tiruvallur', udiseCode: '33021400102' },

    // Cuddalore District Schools
    { name: 'GHS Cuddalore', block: 'Cuddalore', district: 'Cuddalore', udiseCode: '33030100101' },
    { name: 'GHSS Cuddalore Central', block: 'Cuddalore', district: 'Cuddalore', udiseCode: '33030100102' },
    { name: 'GMS Cuddalore North', block: 'Cuddalore', district: 'Cuddalore', udiseCode: '33030100103' },
    
    { name: 'GHS Annagramam', block: 'Annagramam', district: 'Cuddalore', udiseCode: '33030200101' },
    { name: 'GHSS Annagramam Main', block: 'Annagramam', district: 'Cuddalore', udiseCode: '33030200102' },
    
    { name: 'GHS Panruti', block: 'Panruti', district: 'Cuddalore', udiseCode: '33030300101' },
    { name: 'GHSS Panruti Central', block: 'Panruti', district: 'Cuddalore', udiseCode: '33030300102' },
    
    { name: 'GHS Kurinjipadi', block: 'Kurinjipadi', district: 'Cuddalore', udiseCode: '33030400101' },
    { name: 'GHSS Kurinjipadi Main', block: 'Kurinjipadi', district: 'Cuddalore', udiseCode: '33030400102' },
    
    { name: 'GHS Kattumannar Koil', block: 'Kattumannar Koil', district: 'Cuddalore', udiseCode: '33030500101' },
    { name: 'GHSS Kattumannar Koil Central', block: 'Kattumannar Koil', district: 'Cuddalore', udiseCode: '33030500102' },
    
    { name: 'GHS Kumaratchi', block: 'Kumaratchi', district: 'Cuddalore', udiseCode: '33030600101' },
    { name: 'GHSS Kumaratchi Main', block: 'Kumaratchi', district: 'Cuddalore', udiseCode: '33030600102' },
    
    { name: 'GHS Keerapalayam', block: 'Keerapalayam', district: 'Cuddalore', udiseCode: '33030700101' },
    { name: 'GHSS Keerapalayam Central', block: 'Keerapalayam', district: 'Cuddalore', udiseCode: '33030700102' },
    
    { name: 'GHS Melbhuvanagiri', block: 'Melbhuvanagiri', district: 'Cuddalore', udiseCode: '33030800101' },
    { name: 'GHSS Melbhuvanagiri Main', block: 'Melbhuvanagiri', district: 'Cuddalore', udiseCode: '33030800102' },
    
    { name: 'GHS Parangipettai', block: 'Parangipettai', district: 'Cuddalore', udiseCode: '33030900101' },
    { name: 'GHSS Parangipettai Central', block: 'Parangipettai', district: 'Cuddalore', udiseCode: '33030900102' },
    
    { name: 'GHS Vridhachalam', block: 'Vridhachalam', district: 'Cuddalore', udiseCode: '33031000101' },
    { name: 'GHSS Vridhachalam Main', block: 'Vridhachalam', district: 'Cuddalore', udiseCode: '33031000102' },
    
    { name: 'GHS Kammapuram', block: 'Kammapuram', district: 'Cuddalore', udiseCode: '33031100101' },
    { name: 'GHSS Kammapuram Central', block: 'Kammapuram', district: 'Cuddalore', udiseCode: '33031100102' },
    
    { name: 'GHS Nallur', block: 'Nallur', district: 'Cuddalore', udiseCode: '33031200101' },
    { name: 'GHSS Nallur Main', block: 'Nallur', district: 'Cuddalore', udiseCode: '33031200102' },
    
    { name: 'GHS Mangalur', block: 'Mangalur', district: 'Cuddalore', udiseCode: '33031300101' },
    { name: 'GHSS Mangalur Central', block: 'Mangalur', district: 'Cuddalore', udiseCode: '33031300102' },

    // Villupuram District Schools
    { name: 'GHS Tirukollur', block: 'Tirukollur', district: 'Villupuram', udiseCode: '33040100101' },
    { name: 'GHSS Tirukollur Central', block: 'Tirukollur', district: 'Villupuram', udiseCode: '33040100102' },
    { name: 'GMS Tirukollur North', block: 'Tirukollur', district: 'Villupuram', udiseCode: '33040100103' },
    
    { name: 'GHS Mugaiyur', block: 'Mugaiyur', district: 'Villupuram', udiseCode: '33040200101' },
    { name: 'GHSS Mugaiyur Main', block: 'Mugaiyur', district: 'Villupuram', udiseCode: '33040200102' },
    
    { name: 'GHS T.V. Nallur', block: 'T.V. Nallur', district: 'Villupuram', udiseCode: '33040300101' },
    { name: 'GHSS T.V. Nallur Central', block: 'T.V. Nallur', district: 'Villupuram', udiseCode: '33040300102' },
    
    { name: 'GHS Tirunavalur', block: 'Tirunavalur', district: 'Villupuram', udiseCode: '33040400101' },
    { name: 'GHSS Tirunavalur Main', block: 'Tirunavalur', district: 'Villupuram', udiseCode: '33040400102' },
    
    { name: 'GHS Ulundurpet', block: 'Ulundurpet', district: 'Villupuram', udiseCode: '33040500101' },
    { name: 'GHSS Ulundurpet Central', block: 'Ulundurpet', district: 'Villupuram', udiseCode: '33040500102' },
    
    { name: 'GHS Kanai', block: 'Kanai', district: 'Villupuram', udiseCode: '33040600101' },
    { name: 'GHSS Kanai Main', block: 'Kanai', district: 'Villupuram', udiseCode: '33040600102' },
    
    { name: 'GHS Koliyanur', block: 'Koliyanur', district: 'Villupuram', udiseCode: '33040700101' },
    { name: 'GHSS Koliyanur Central', block: 'Koliyanur', district: 'Villupuram', udiseCode: '33040700102' },
    
    { name: 'GHS Kandamangalam', block: 'Kandamangalam', district: 'Villupuram', udiseCode: '33040800101' },
    { name: 'GHSS Kandamangalam Main', block: 'Kandamangalam', district: 'Villupuram', udiseCode: '33040800102' },
    
    { name: 'GHS Vikkiravandi', block: 'Vikkiravandi', district: 'Villupuram', udiseCode: '33040900101' },
    { name: 'GHSS Vikkiravandi Central', block: 'Vikkiravandi', district: 'Villupuram', udiseCode: '33040900102' },
    
    { name: 'GHS Olakkur', block: 'Olakkur', district: 'Villupuram', udiseCode: '33041000101' },
    { name: 'GHSS Olakkur Main', block: 'Olakkur', district: 'Villupuram', udiseCode: '33041000102' },
    
    { name: 'GHS Mailam', block: 'Mailam', district: 'Villupuram', udiseCode: '33041100101' },
    { name: 'GHSS Mailam Central', block: 'Mailam', district: 'Villupuram', udiseCode: '33041100102' },
    
    { name: 'GHS Merkanam', block: 'Merkanam', district: 'Villupuram', udiseCode: '33041200101' },
    { name: 'GHSS Merkanam Main', block: 'Merkanam', district: 'Villupuram', udiseCode: '33041200102' },
];

export const getDistrictByName = (name: string): District | undefined => {
    return DISTRICTS.find(d => d.name === name);
};

export const getBlocksByDistrict = (districtName: string): string[] => {
    const district = getDistrictByName(districtName);
    return district ? district.blocks : [];
};

export const getAllDistrictNames = (): string[] => {
    return DISTRICTS.map(d => d.name);
};

export const getSchoolsByDistrict = (districtName: string): SchoolData[] => {
    return SCHOOLS_DATABASE.filter(s => s.district === districtName);
};

export const getSchoolsByBlock = (districtName: string, blockName: string): SchoolData[] => {
    return SCHOOLS_DATABASE.filter(s => s.district === districtName && s.block === blockName);
};

export const searchSchools = (query: string, districtName?: string): SchoolData[] => {
    const lowerQuery = query.toLowerCase();
    let schools = SCHOOLS_DATABASE;
    
    if (districtName) {
        schools = schools.filter(s => s.district === districtName);
    }
    
    return schools.filter(s => 
        s.name.toLowerCase().includes(lowerQuery) ||
        s.udiseCode.includes(query) ||
        s.block.toLowerCase().includes(lowerQuery)
    );
};
