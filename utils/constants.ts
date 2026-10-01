export const raceOptions = [
  { value: 'Arab', label: 'Arab' },
  { value: 'Black', label: 'Black' },
  { value: 'East Asian', label: 'East Asian' },
  { value: 'Indigenous American', label: 'Indigenous American' },
  {
    value: 'South Asian',
    label: 'South Asian',
  },
  { value: 'Southeast Asian', label: 'Southeast Asian' },
  { value: 'White', label: 'White' },
  { value: 'Two or More Races', label: 'Two or More Races' },
  { value: 'Undefined', label: 'Undefined' },
];

export const nationalityOptions = [
  { value: 'american', label: 'American' },
  { value: 'canadian', label: 'Canadian' },
  { value: 'british', label: 'British' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'indian', label: 'Indian' },
  { value: 'australian', label: 'Australian' },
  { value: 'mexican', label: 'Mexican' },
  { value: 'brazilian', label: 'Brazilian' },
  { value: 'nigerian', label: 'Nigerian' },
  { value: 'south_african', label: 'South African' },
];

export const ethnicityOptions = [
  { value: 'hispanic', label: 'Hispanic or Latino' },
  { value: 'non_hispanic', label: 'Not Hispanic or Latino' },
  { value: 'european', label: 'European' },
  { value: 'middle_eastern', label: 'Middle Eastern' },
  { value: 'african', label: 'African' },
  { value: 'asian', label: 'Asian' },
  { value: 'native_american', label: 'Native American' },
  { value: 'pacific_islander', label: 'Pacific Islander' },
  { value: 'mixed_ethnicity', label: 'Mixed Ethnicity' },
  { value: 'other', label: 'Other' },
];

export const LevelOneIndustries = [
  { value: 'hispanic', label: 'Hispanic or Latino' },
  { value: 'non_hispanic', label: 'Not Hispanic or Latino' },
];

export const GoodsIndustriesData: Industry[] = [
  {
    label: 'Natural Resources and Mining',
    value: 'Natural Resources and Mining',
    subIndustries: [
      {
        label: 'Crop Production',
        value: 'Crop Production',
        subIndustries: [
          {
            label: 'Oilseed and Grain Farming',
            value: 'Oilseed and Grain Farming',
          },
          {
            label: 'Vegetable and Melon Farming',
            value: 'Vegetable and Melon Farming',
          },
          {
            label: 'Fruit and Tree Nut Farming',
            value: 'Fruit and Tree Nut Farming',
          },
          {
            label: 'Greenhouse, Nursery, and Floriculture Production',
            value: 'Greenhouse, Nursery, and Floriculture Production',
          },
          { label: 'Other Crop Farming', value: 'Other Crop Farming' },
          {
            label: 'Support Activities for Crop Production',
            value: 'Support Activities for Crop Production',
          },
        ],
      },
      {
        label: 'Animal Production and Aquaculture',
        value: 'Animal Production and Aquaculture',
        subIndustries: [
          {
            label: 'Cattle Ranching and Farming',
            value: 'Cattle Ranching and Farming',
          },
          {
            label: 'Hog and Pig Farming',
            value: 'Hog and Pig Farming',
          },
          {
            label: 'Sheep and Goat Farming',
            value: 'Sheep and Goat Farming',
          },
          {
            label: 'Poultry and Egg Production',
            value: 'Poultry and Egg Production',
          },
          {
            label: 'Other Animal Production',
            value: 'Other Animal Production',
          },
          {
            label: 'Support Activities for Animal Production',
            value: 'Support Activities for Animal Production',
          },
        ],
      },
      {
        label: 'Forestry and Logging',
        value: 'Forestry and Logging',
        subIndustries: [
          {
            label: 'Timber Tract Operations',
            value: 'Timber Tract Operations',
          },
          {
            label: 'Forest Nurseries and Gathering of Forest Products',
            value: 'Forest Nurseries and Gathering of Forest Products',
          },
          {
            label: 'Support Activities for Forestry',
            value: 'Support Activities for Forestry',
          },
        ],
      },
      {
        label: 'Fishing, Hunting and Trapping',
        value: 'Fishing, Hunting and Trapping',
        subIndustries: [
          {
            label: 'Fishing',
            value: 'Fishing',
          },
          {
            label: 'Hunting and Trapping',
            value: 'Hunting and Trapping',
          },
        ],
      },
      {
        label: 'Mining, Quarrying, and Oil and Gas Extraction',
        value: 'Mining, Quarrying, and Oil and Gas Extraction',
        subIndustries: [
          {
            label: 'Oil and Gas Extraction',
            value: 'Oil and Gas Extraction',
          },
          {
            label: 'Coal Mining',
            value: 'Coal Mining',
          },
          {
            label: 'Metal Ore Mining',
            value: 'Metal Ore Mining',
          },
          {
            label: 'Nonmetallic Mineral Mining and Quarrying',
            value: 'Nonmetallic Mineral Mining and Quarrying',
          },
          {
            label: 'Support Activities for Mining',
            value: 'Support Activities for Mining',
          },
        ],
      },
    ],
  },
  {
    label: 'Construction',
    value: 'Construction',
    subIndustries: [
      {
        label: 'Construction of Buildings',
        value: 'Construction of Buildings',
        subIndustries: [
          {
            label: 'Residential Building Construction',
            value: 'Residential Building Construction',
          },
          {
            label: 'Nonresidential Building Construction',
            value: 'Nonresidential Building Construction',
          },
        ],
      },
      {
        label: 'Heavy and Civil Engineering Construction',
        value: 'Heavy and Civil Engineering Construction',
        subIndustries: [
          {
            label: 'Utility System Construction',
            value: 'Utility System Construction',
          },
          {
            label: 'Land Subdivision',
            value: 'Land Subdivision',
          },
          {
            label: 'Highway, Street, and Bridge Construction',
            value: 'Highway, Street, and Bridge Construction',
          },
          {
            label: 'Other Heavy and Civil Engineering Construction',
            value: 'Other Heavy and Civil Engineering Construction',
          },
        ],
      },
      {
        label: 'Specialty Trade Contractors',
        value: 'Specialty Trade Contractors',
        subIndustries: [
          {
            label: 'Foundation, Structure, and Building Exterior Contractors',
            value: 'Foundation, Structure, and Building Exterior Contractors',
          },
          {
            label: 'Building Equipment Contractors',
            value: 'Building Equipment Contractors',
          },
          {
            label: 'Building Finishing Contractors',
            value: 'Building Finishing Contractors',
          },
          {
            label: 'Other Specialty Trade Contractors',
            value: 'Other Specialty Trade Contractors',
          },
        ],
      },
    ],
  },
  {
    label: 'Manufacturing',
    value: 'Manufacturing',
    subIndustries: [
      {
        label: 'Food Manufacturing',
        value: 'Food Manufacturing',
        subIndustries: [
          {
            label: 'Animal Food Manufacturing',
            value: 'Animal Food Manufacturing',
          },
          {
            label: 'Grain and Oilseed Milling',
            value: 'Grain and Oilseed Milling',
          },
          {
            label: 'Sugar and Confectionery Product Manufacturing',
            value: 'Sugar and Confectionery Product Manufacturing',
          },
          {
            label:
              'Fruit and Vegetable Preserving and Specialty Food Manufacturing',
            value:
              'Fruit and Vegetable Preserving and Specialty Food Manufacturing',
          },
          {
            label: 'Dairy Product Manufacturing',
            value: 'Dairy Product Manufacturing',
          },
          {
            label: 'Animal Slaughtering and Processing',
            value: 'Animal Slaughtering and Processing',
          },
          {
            label: 'Seafood Product Preparation and Packaging',
            value: 'Seafood Product Preparation and Packaging',
          },
          {
            label: 'Bakeries',
            value: 'Bakeries',
          },
          {
            label: 'Other Food Manufacturing',
            value: 'Other Food Manufacturing',
          },
        ],
      },
      {
        label: 'Beverage and Tobacco Product Manufacturing',
        value: 'Beverage and Tobacco Product Manufacturing',
        subIndustries: [
          {
            label: 'Beverage Manufacturing',
            value: 'Beverage Manufacturing',
          },
          {
            label: 'Tobacco Manufacturing',
            value: 'Tobacco Manufacturing',
          },
        ],
      },
      {
        label: 'Textile Mills & Apparel Manufacturing',
        value: 'Textile Mills & Apparel Manufacturing',
        subIndustries: [
          {
            label: 'Fiber, Yarn, and Thread Mills',
            value: 'Fiber, Yarn, and Thread Mills',
          },
          {
            label: 'Textile and Fabric Finishing and Fabric Coating Mills',
            value: 'Textile and Fabric Finishing and Fabric Coating Mills',
          },
          {
            label: 'Textile Furnishings Mills',
            value: 'Textile Furnishings Mills',
          },
          {
            label: 'Other Textile Product Mills',
            value: 'Other Textile Product Mills',
          },
          {
            label: 'Apparel Knitting Mills',
            value: 'Apparel Knitting Mills',
          },
          {
            label: 'Cut and Sew Apparel Manufacturing',
            value: 'Cut and Sew Apparel Manufacturing',
          },
          {
            label: 'Apparel Accessories and Other Apparel Manufacturing',
            value: 'Apparel Accessories and Other Apparel Manufacturing',
          },
        ],
      },
      {
        label: 'Leather and Allied Product Manufacturing',
        value: 'Leather and Allied Product Manufacturing',
        subIndustries: [
          {
            label: 'Leather and Hide Tanning and Finishing',
            value: 'Leather and Hide Tanning and Finishing',
          },
          {
            label: 'Footwear Manufacturing',
            value: 'Footwear Manufacturing',
          },
          {
            label: 'Other Leather and Allied Product Manufacturing',
            value: 'Other Leather and Allied Product Manufacturing',
          },
        ],
      },
      {
        label: 'Wood Product Manufacturing',
        value: 'Wood Product Manufacturing',
        subIndustries: [
          {
            label: 'Sawmills and Wood Preservation',
            value: 'Sawmills and Wood Preservation',
          },
          {
            label: 'Veneer, Plywood, and Engineered Wood Product Manufacturing',
            value: 'Veneer, Plywood, and Engineered Wood Product Manufacturing',
          },
          {
            label: 'Other Wood Product Manufacturing',
            value: 'Other Wood Product Manufacturing',
          },
        ],
      },
      {
        label: 'Paper Manufacturing',
        value: 'Paper Manufacturing',
        subIndustries: [
          {
            label: 'Pulp, Paper, and Paperboard Mills',
            value: 'Pulp, Paper, and Paperboard Mills',
          },
          {
            label: 'Converted Paper Product Manufacturing',
            value: 'Converted Paper Product Manufacturing',
          },
        ],
      },
      {
        label: 'Printing and Related Support Activities',
        value: 'Printing and Related Support Activities',
        subIndustries: [],
      },
      {
        label: 'Petroleum and Coal Products Manufacturing',
        value: 'Petroleum and Coal Products Manufacturing',
        subIndustries: [],
      },
      {
        label: 'Chemical Manufacturing',
        value: 'Chemical Manufacturing',
        subIndustries: [
          {
            label: 'Basic Chemical Manufacturing',
            value: 'Basic Chemical Manufacturing',
          },
          {
            label:
              'Resin, Synthetic Rubber, and Artificial Synthetic Fibers and Filaments Manufacturing',
            value:
              'Resin, Synthetic Rubber, and Artificial Synthetic Fibers and Filaments Manufacturing',
          },
          {
            label:
              'Pesticide, Fertilizer, and Other Agricultural Chemical Manufacturing',
            value:
              'Pesticide, Fertilizer, and Other Agricultural Chemical Manufacturing',
          },
          {
            label: 'Pharmaceutical and Medicine Manufacturing',
            value: 'Pharmaceutical and Medicine Manufacturing',
          },
          {
            label: 'Paint, Coating, and Adhesive Manufacturing',
            value: 'Paint, Coating, and Adhesive Manufacturing',
          },
          {
            label:
              'Soap, Cleaning Compound, and Toilet Preparation Manufacturing',
            value:
              'Soap, Cleaning Compound, and Toilet Preparation Manufacturing',
          },
          {
            label: 'Other Chemical Product and Preparation Manufacturing',
            value: 'Other Chemical Product and Preparation Manufacturing',
          },
        ],
      },
      {
        label: 'Plastics and Rubber Products Manufacturing',
        value: 'Plastics and Rubber Products Manufacturing',
        subIndustries: [
          {
            label: 'Plastics Product Manufacturing',
            value: 'Plastics Product Manufacturing',
          },
          {
            label: 'Rubber Product Manufacturing',
            value: 'Rubber Product Manufacturing',
          },
        ],
      },
      {
        label: 'Nonmetallic Mineral Product Manufacturing',
        value: 'Nonmetallic Mineral Product Manufacturing',
        subIndustries: [
          {
            label: 'Clay Product and Refractory Manufacturing',
            value: 'Clay Product and Refractory Manufacturing',
          },
          {
            label: 'Glass and Glass Product Manufacturing',
            value: 'Glass and Glass Product Manufacturing',
          },
          {
            label: 'Cement and Concrete Product Manufacturing',
            value: 'Cement and Concrete Product Manufacturing',
          },
          {
            label: 'Lime and Gypsum Product Manufacturing',
            value: 'Lime and Gypsum Product Manufacturing',
          },
          {
            label: 'Other Nonmetallic Mineral Product Manufacturing',
            value: 'Other Nonmetallic Mineral Product Manufacturing',
          },
        ],
      },
      {
        label: 'Primary Metal Manufacturing',
        value: 'Primary Metal Manufacturing',
        subIndustries: [
          {
            label: 'Iron and Steel Mills and Ferroalloy Manufacturing',
            value: 'Iron and Steel Mills and Ferroalloy Manufacturing',
          },
          {
            label: 'Steel Product Manufacturing from Purchased Steel',
            value: 'Steel Product Manufacturing from Purchased Steel',
          },
          {
            label: 'Alumina and Aluminum Production and Processing',
            value: 'Alumina and Aluminum Production and Processing',
          },
          {
            label:
              'Nonferrous Metal (except Aluminum) Production and Processing',
            value:
              'Nonferrous Metal (except Aluminum) Production and Processing',
          },
          {
            label: 'Foundries',
            value: 'Foundries',
          },
        ],
      },
      {
        label: 'Fabricated Metal Product Manufacturing',
        value: 'Fabricated Metal Product Manufacturing',
        subIndustries: [
          {
            label: 'Forging and Stamping',
            value: 'Forging and Stamping',
          },
          {
            label: 'Cutlery and Hand-Tool Manufacturing',
            value: 'Cutlery and Hand-Tool Manufacturing',
          },
          {
            label: 'Architectural and Structural Metals Manufacturing',
            value: 'Architectural and Structural Metals Manufacturing',
          },
          {
            label: 'Boiler, Tank, and Shipping Container Manufacturing',
            value: 'Boiler, Tank, and Shipping Container Manufacturing',
          },
          {
            label: 'Hardware Manufacturing',
            value: 'Hardware Manufacturing',
          },
          {
            label: 'Spring and Wire Product Manufacturing',
            value: 'Spring and Wire Product Manufacturing',
          },
          {
            label:
              'Machine Shops; Turned Product; and Screw, Nut, and Bolt Manufacturing',
            value:
              'Machine Shops; Turned Product; and Screw, Nut, and Bolt Manufacturing',
          },
          {
            label: 'Coating, Engraving, Heat Treating, and Allied Activities',
            value: 'Coating, Engraving, Heat Treating, and Allied Activities',
          },
          {
            label: 'Other Fabricated Metal Product Manufacturing',
            value: 'Other Fabricated Metal Product Manufacturing',
          },
        ],
      },
      {
        label: 'Machinery Manufacturing',
        value: 'Machinery Manufacturing',
        subIndustries: [
          {
            label:
              'Agriculture, Construction, and Mining Machinery Manufacturing',
            value:
              'Agriculture, Construction, and Mining Machinery Manufacturing',
          },
          {
            label: 'Industrial Machinery Manufacturing',
            value: 'Industrial Machinery Manufacturing',
          },
          {
            label: 'Commercial and Service Industry Machinery Manufacturing',
            value: 'Commercial and Service Industry Machinery Manufacturing',
          },
          {
            label:
              'Ventilation, Heating, Air-Conditioning, and Commercial Refrigeration Equipment Manufacturing',
            value:
              'Ventilation, Heating, Air-Conditioning, and Commercial Refrigeration Equipment Manufacturing',
          },
          {
            label: 'Metalworking Machinery Manufacturing',
            value: 'Metalworking Machinery Manufacturing',
          },
          {
            label:
              'Engine, Turbine, and Power Transmission Equipment Manufacturing',
            value:
              'Engine, Turbine, and Power Transmission Equipment Manufacturing',
          },
          {
            label: 'Other General Purpose Machinery Manufacturing',
            value: 'Other General Purpose Machinery Manufacturing',
          },
        ],
      },
      {
        label: 'Computer and Electronic Product Manufacturing',
        value: 'Computer and Electronic Product Manufacturing',
        subIndustries: [
          {
            label: 'Computer and Peripheral Equipment Manufacturing',
            value: 'Computer and Peripheral Equipment Manufacturing',
          },
          {
            label: 'Communications Equipment Manufacturing',
            value: 'Communications Equipment Manufacturing',
          },
          {
            label: 'Audio and Video Equipment Manufacturing',
            value: 'Audio and Video Equipment Manufacturing',
          },
          {
            label: 'Semiconductor and Other Electronic Component Manufacturing',
            value: 'Semiconductor and Other Electronic Component Manufacturing',
          },
          {
            label:
              'Navigational, Measuring, Electromedical, and Control Instruments Manufacturing',
            value:
              'Navigational, Measuring, Electromedical, and Control Instruments Manufacturing',
          },
          {
            label: 'Manufacturing and Reproducing Magnetic and Optical Media',
            value: 'Manufacturing and Reproducing Magnetic and Optical Media',
          },
        ],
      },
      {
        label: 'Electrical Equipment, Appliance, and Component Manufacturing',
        value: 'Electrical Equipment, Appliance, and Component Manufacturing',
        subIndustries: [
          {
            label: 'Electric Lighting Equipment Manufacturing',
            value: 'Electric Lighting Equipment Manufacturing',
          },
          {
            label: 'Household Appliance Manufacturing',
            value: 'Household Appliance Manufacturing',
          },
          {
            label: 'Electrical Equipment Manufacturing',
            value: 'Electrical Equipment Manufacturing',
          },
          {
            label: 'Other Electrical Equipment and Component Manufacturing',
            value: 'Other Electrical Equipment and Component Manufacturing',
          },
        ],
      },
      {
        label: 'Transportation Equipment Manufacturing',
        value: 'Transportation Equipment Manufacturing',
        subIndustries: [
          {
            label: 'Motor Vehicle Manufacturing',
            value: 'Motor Vehicle Manufacturing',
          },
          {
            label: 'Motor Vehicle Body and Trailer Manufacturing',
            value: 'Motor Vehicle Body and Trailer Manufacturing',
          },
          {
            label: 'Motor Vehicle Parts Manufacturing',
            value: 'Motor Vehicle Parts Manufacturing',
          },
          {
            label: 'Aerospace Product and Parts Manufacturing',
            value: 'Aerospace Product and Parts Manufacturing',
          },
          {
            label: 'Railroad Rolling Stock Manufacturing',
            value: 'Railroad Rolling Stock Manufacturing',
          },
          {
            label: 'Ship and Boat Building',
            value: 'Ship and Boat Building',
          },
          {
            label: 'Other Transportation Equipment Manufacturing',
            value: 'Other Transportation Equipment Manufacturing',
          },
        ],
      },
      {
        label: 'Furniture and Related Product Manufacturing',
        value: 'Furniture and Related Product Manufacturing',
        subIndustries: [
          {
            label:
              'Household and Institutional Furniture and Kitchen Cabinet Manufacturing',
            value:
              'Household and Institutional Furniture and Kitchen Cabinet Manufacturing',
          },
          {
            label: 'Office Furniture (including Fixtures) Manufacturing',
            value: 'Office Furniture (including Fixtures) Manufacturing',
          },
          {
            label: 'Other Furniture Related Product Manufacturing',
            value: 'Other Furniture Related Product Manufacturing',
          },
        ],
      },
      {
        label: 'Miscellaneous Manufacturing',
        value: 'Miscellaneous Manufacturing',
        subIndustries: [
          {
            label: 'Medical Equipment and Supplies Manufacturing',
            value: 'Medical Equipment and Supplies Manufacturing',
          },
          {
            label: 'Other Miscellaneous Manufacturing',
            value: 'Other Miscellaneous Manufacturing',
          },
        ],
      },
    ],
  },
];

export const servicesIndustriesData: Industry[] = [
  {
    label: 'Trade, Transportation, and Utilities',
    value: 'Trade, Transportation, and Utilities',
    subIndustries: [
      {
        label: 'Retail Trade',
        value: 'Retail Trade',
        subIndustries: [
          {
            label: 'Motor Vehicle and Parts Dealers',
            value: 'Motor Vehicle and Parts Dealers',
          },
          {
            label: 'Furniture and Home Furnishings Stores',
            value: 'Furniture and Home Furnishings Stores',
          },
          {
            label: 'Electronics and Appliance Stores',
            value: 'Electronics and Appliance Stores',
          },
          {
            label:
              'Building Material and Garden Equipment and Supplies Dealers',
            value:
              'Building Material and Garden Equipment and Supplies Dealers',
          },
          {
            label: 'Food and Beverage Stores',
            value: 'Food and Beverage Stores',
          },
          {
            label: 'Health and Personal Care Stores',
            value: 'Health and Personal Care Stores',
          },
          {
            label: 'Gasoline Stations',
            value: 'Gasoline Stations',
          },
          {
            label: 'Clothing and Clothing Accessories Stores',
            value: 'Clothing and Clothing Accessories Stores',
          },
          {
            label: 'Nonstore Retailers',
            value: 'Nonstore Retailers',
            subIndustries: [
              {
                label: 'Electronic Shopping',
                value: 'Electronic Shopping',
              },
              {
                label: 'Mail-Order Houses',
                value: 'Mail-Order Houses',
              },
              {
                label: 'Vending Machine Operators',
                value: 'Vending Machine Operators',
              },
              {
                label: 'Direct Selling Establishments',
                value: 'Direct Selling Establishments',
              },
            ],
          },
          {
            label: 'Sporting Goods, Hobby, Book, and Music Stores',
            value: 'Sporting Goods, Hobby, Book, and Music Stores',
          },
          {
            label: 'General Merchandise Stores',
            value: 'General Merchandise Stores',
          },
          {
            label: 'Miscellaneous Store Retailers',
            value: 'Miscellaneous Store Retailers',
            subIndustries: [
              {
                label: 'Florists',
                value: 'Florists',
              },
              {
                label: 'Office Supplies, Stationery, and Gift Stores',
                value: 'Office Supplies, Stationery, and Gift Stores',
              },
              {
                label: 'Used Merchandise Stores',
                value: 'Used Merchandise Stores',
              },
              {
                label: 'Other Miscellaneous Store Retailers',
                value: 'Other Miscellaneous Store Retailers',
              },
            ],
          },
        ],
      },
      {
        label: 'Transportation and Warehousing',
        value: 'Transportation and Warehousing',
        subIndustries: [
          {
            label: 'Air Transportation',
            value: 'Air Transportation',
            subIndustries: [
              {
                label: 'Scheduled Air Transportation',
                value: 'Scheduled Air Transportation',
              },
              {
                label: 'Nonscheduled Air Transportation',
                value: 'Nonscheduled Air Transportation',
              },
            ],
          },
          {
            label: 'Rail Transportation',
            value: 'Rail Transportation',
          },
          {
            label: 'Water Transportation',
            value: 'Water Transportation',
            subIndustries: [
              {
                label:
                  'Deep Sea, Coastal, and Great Lakes Water Transportation',
                value:
                  'Deep Sea, Coastal, and Great Lakes Water Transportation',
              },
              {
                label: 'Inland Water Transportation',
                value: 'Inland Water Transportation',
              },
            ],
          },
          {
            label: 'Transit and Ground Passenger Transportation',
            value: 'Transit and Ground Passenger Transportation',
            subIndustries: [
              {
                label: 'Urban Transit Systems',
                value: 'Urban Transit Systems',
              },
              {
                label: 'Interurban and Rural Bus Transportation',
                value: 'Interurban and Rural Bus Transportation',
              },
              {
                label: 'Taxi and Limousine Service',
                value: 'Taxi and Limousine Service',
              },
              {
                label: 'School and Employee Bus Transportation',
                value: 'School and Employee Bus Transportation',
              },
              {
                label: 'Charter Bus Industry',
                value: 'Charter Bus Industry',
              },
              {
                label: 'Other Transit and Ground Passenger Transportation',
                value: 'Other Transit and Ground Passenger Transportation',
              },
            ],
          },
          {
            label: 'Pipeline Transportation',
            value: 'Pipeline Transportation',
            subIndustries: [
              {
                label: 'Pipeline Transportation of Crude Oil',
                value: 'Pipeline Transportation of Crude Oil',
              },
              {
                label: 'Pipeline Transportation of Natural Gas',
                value: 'Pipeline Transportation of Natural Gas',
              },
              {
                label: 'Other Pipeline Transportation',
                value: 'Other Pipeline Transportation',
              },
            ],
          },
          {
            label: 'Support Activities for Transportation',
            value: 'Support Activities for Transportation',
            subIndustries: [
              {
                label: 'Support Activities for Air Transportation',
                value: 'Support Activities for Air Transportation',
              },
              {
                label: 'Support Activities for Rail Transportation',
                value: 'Support Activities for Rail Transportation',
              },
              {
                label: 'Support Activities for Water Transportation',
                value: 'Support Activities for Water Transportation',
              },
              {
                label: 'Support Activities for Road Transportation',
                value: 'Support Activities for Road Transportation',
              },
              {
                label: 'Freight Transportation Arrangement',
                value: 'Freight Transportation Arrangement',
              },
              {
                label: 'Other Support Activities for Transportation',
                value: 'Other Support Activities for Transportation',
              },
            ],
          },
          {
            label: 'Warehousing and Storage',
            value: 'Warehousing and Storage',
          },
        ],
      },
      {
        label: 'Utilities',
        value: 'Utilities',
        subIndustries: [
          {
            label: 'Electric Power Generation, Transmission and Distribution',
            value: 'Electric Power Generation, Transmission and Distribution',
          },
          {
            label: 'Natural Gas Distribution',
            value: 'Natural Gas Distribution',
          },
          {
            label: 'Water, Sewage and Other Systems',
            value: 'Water, Sewage and Other Systems',
          },
        ],
      },
    ],
  },
  {
    label: 'Information',
    value: 'Information',
    subIndustries: [
      {
        label: 'Publishing Industries (except Internet)',
        value: 'Publishing Industries (except Internet)',
        subIndustries: [
          {
            label: 'Newspaper, Periodical, Book, and Directory Publishers',
            value: 'Newspaper, Periodical, Book, and Directory Publishers',
          },
          {
            label: 'Software Publishers',
            value: 'Software Publishers',
          },
        ],
      },
      {
        label: 'Motion Picture and Sound Recording Industries',
        value: 'Motion Picture and Sound Recording Industries',
        subIndustries: [
          {
            label: 'Motion Picture and Video Industries',
            value: 'Motion Picture and Video Industries',
          },
          {
            label: 'Sound Recording Industries',
            value: 'Sound Recording Industries',
          },
        ],
      },
      {
        label: 'Broadcasting (except Internet)',
        value: 'Broadcasting (except Internet)',
        subIndustries: [
          {
            label: 'Radio and Television Broadcasting',
            value: 'Radio and Television Broadcasting',
          },
          {
            label: 'Cable and Other Subscription Programming',
            value: 'Cable and Other Subscription Programming',
          },
        ],
      },
      {
        label: 'Data Processing, Hosting, and Related Services',
        value: 'Data Processing, Hosting, and Related Services',
      },
      {
        label: 'Other Information Services',
        value: 'Other Information Services',
        subIndustries: [
          {
            label: 'Internet Publishing and Broadcasting',
            value: 'Internet Publishing and Broadcasting',
          },
          {
            label: 'Telecommunications',
            value: 'Telecommunications',
            subIndustries: [
              {
                label: 'Wired Telecommunications Carriers',
                value: 'Wired Telecommunications Carriers',
              },
              {
                label:
                  'Wireless Telecommunications Carriers (except Satellite)',
                value:
                  'Wireless Telecommunications Carriers (except Satellite)',
              },
              {
                label: 'Telecommunications Resellers',
                value: 'Telecommunications Resellers',
              },
              {
                label: 'Satellite Telecommunications',
                value: 'Satellite Telecommunications',
              },
              {
                label: 'Cable and Other Program Distribution',
                value: 'Cable and Other Program Distribution',
              },
              {
                label: 'Other Telecommunications',
                value: 'Other Telecommunications',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: 'Financial Activities',
    value: 'Financial Activities',
    subIndustries: [
      {
        label: 'Finance and Insurance',
        value: 'Finance and Insurance',
        subIndustries: [
          {
            label: 'Monetary Authorities - Central Bank',
            value: 'Monetary Authorities - Central Bank',
          },
          {
            label: 'Credit Intermediation and Related Activities',
            value: 'Credit Intermediation and Related Activities',
            subIndustries: [
              {
                label: 'Depository Credit Intermediation',
                value: 'Depository Credit Intermediation',
              },
              {
                label: 'Nondepository Credit Intermediation',
                value: 'Nondepository Credit Intermediation',
              },
              {
                label: 'Activities Related to Credit Intermediation',
                value: 'Activities Related to Credit Intermediation',
              },
            ],
          },
          {
            label:
              'Securities, Commodity Contracts, and Other Financial Investments and Related Activities',
            value:
              'Securities, Commodity Contracts, and Other Financial Investments and Related Activities',
            subIndustries: [
              {
                label:
                  'Securities and Commodity Contracts Intermediation and Brokerage',
                value:
                  'Securities and Commodity Contracts Intermediation and Brokerage',
              },
              {
                label: 'Securities and Commodity Exchanges',
                value: 'Securities and Commodity Exchanges',
              },
              {
                label: 'Other Financial Investment Activities',
                value: 'Other Financial Investment Activities',
              },
            ],
          },
          {
            label: 'Insurance Carriers and Related Activities',
            value: 'Insurance Carriers and Related Activities',
            subIndustries: [
              {
                label: 'Insurance Carriers',
                value: 'Insurance Carriers',
              },
              {
                label:
                  'Agencies, Brokerages, and Other Insurance Related Activities',
                value:
                  'Agencies, Brokerages, and Other Insurance Related Activities',
              },
            ],
          },
          {
            label: 'Insurance and Employee Benefit Funds',
            value: 'Insurance and Employee Benefit Funds',
          },
          {
            label: 'Other Investment Pools and Funds',
            value: 'Other Investment Pools and Funds',
          },
        ],
      },
      {
        label: 'Real Estate and Rental and Leasing',
        value: 'Real Estate and Rental and Leasing',
        subIndustries: [
          {
            label: 'Real Estate',
            value: 'Real Estate',
            subIndustries: [
              {
                label: 'Lessors of Real Estate',
                value: 'Lessors of Real Estate',
              },
              {
                label: 'Offices of Real Estate Agents and Brokers',
                value: 'Offices of Real Estate Agents and Brokers',
              },
              {
                label: 'Activities Related to Real Estate',
                value: 'Activities Related to Real Estate',
              },
            ],
          },
          {
            label: 'Rental and Leasing Services',
            value: 'Rental and Leasing Services',
            subIndustries: [
              {
                label: 'Automotive Equipment Rental and Leasing',
                value: 'Automotive Equipment Rental and Leasing',
              },
              {
                label: 'Consumer Goods Rental',
                value: 'Consumer Goods Rental',
              },
              {
                label: 'General Rental Centers',
                value: 'General Rental Centers',
              },
              {
                label:
                  'Commercial and Industrial Machinery and Equipment Rental and Leasing',
                value:
                  'Commercial and Industrial Machinery and Equipment Rental and Leasing',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: 'Professional and Business Services',
    value: 'Professional and Business Services',
    subIndustries: [
      {
        label: 'Professional and Technical Services',
        value: 'Professional and Technical Services',
        subIndustries: [
          {
            label: 'Legal Services',
            value: 'Legal Services',
          },
          {
            label:
              'Accounting, Tax Preparation, Bookkeeping, and Payroll Services',
            value:
              'Accounting, Tax Preparation, Bookkeeping, and Payroll Services',
          },
          {
            label: 'Architectural, Engineering, and Related Services',
            value: 'Architectural, Engineering, and Related Services',
          },
          {
            label: 'Specialized Design Services',
            value: 'Specialized Design Services',
          },
          {
            label: 'Computer Systems Design and Related Services',
            value: 'Computer Systems Design and Related Services',
          },
          {
            label: 'Management and Technical Consulting Services',
            value: 'Management and Technical Consulting Services',
          },
          {
            label: 'Advertising and Related Services',
            value: 'Advertising and Related Services',
          },
          {
            label: 'Other Professional and Technical Services',
            value: 'Other Professional and Technical Services',
          },
        ],
      },
      {
        label: 'Management of Companies and Enterprises',
        value: 'Management of Companies and Enterprises',
      },
      {
        label: 'Administrative, Support and Remediation Services',
        value: 'Administrative, Support and Remediation Services',
        subIndustries: [
          {
            label: 'Office Administrative Services',
            value: 'Office Administrative Services',
          },
          {
            label: 'Facilities Support Services',
            value: 'Facilities Support Services',
          },
          {
            label: 'Employment Services',
            value: 'Employment Services',
          },
          {
            label: 'Business Support Services',
            value: 'Business Support Services',
          },
          {
            label: 'Travel Arrangement and Reservation Services',
            value: 'Travel Arrangement and Reservation Services',
          },
          {
            label: 'Investigation and Security Services',
            value: 'Investigation and Security Services',
          },
          {
            label: 'Services to Buildings and Dwellings',
            value: 'Services to Buildings and Dwellings',
          },
          {
            label: 'Other Support Services',
            value: 'Other Support Services',
          },
        ],
      },
    ],
  },
  {
    label: 'Education and Health Services',
    value: 'Education and Health Services',
    subIndustries: [
      {
        label: 'Educational Services',
        value: 'Educational Services',
      },
      {
        label: 'Health Care and Social Assistance',
        value: 'Health Care and Social Assistance',
        subIndustries: [
          {
            label: 'Ambulatory Health Care Services',
            value: 'Ambulatory Health Care Services',
          },
          {
            label: 'Hospitals',
            value: 'Hospitals',
            subIndustries: [
              {
                label: 'General Medical and Surgical Hospitals',
                value: 'General Medical and Surgical Hospitals',
              },
              {
                label: 'Psychiatric and Substance Abuse Hospitals',
                value: 'Psychiatric and Substance Abuse Hospitals',
              },
              {
                label:
                  'Specialty (except Psychiatric and Substance Abuse) Hospitals',
                value:
                  'Specialty (except Psychiatric and Substance Abuse) Hospitals',
              },
            ],
          },
          {
            label: 'Nursing and Residential Care Facilities',
            value: 'Nursing and Residential Care Facilities',
            subIndustries: [
              {
                label: 'Nursing Care Facilities',
                value: 'Nursing Care Facilities',
              },
              {
                label:
                  'Residential Mental Retardation, Mental Health and Substance Abuse Facilities',
                value:
                  'Residential Mental Retardation, Mental Health and Substance Abuse Facilities',
              },
              {
                label: 'Community Care Facilities for the Elderly',
                value: 'Community Care Facilities for the Elderly',
              },
              {
                label: 'Other Residential Care Facilities',
                value: 'Other Residential Care Facilities',
              },
            ],
          },
          {
            label: 'Social Assistance',
            value: 'Social Assistance',
            subIndustries: [
              {
                label: 'Individual and Family Services',
                value: 'Individual and Family Services',
              },
              {
                label:
                  'Community Food and Housing, and Emergency and Other Relief Services',
                value:
                  'Community Food and Housing, and Emergency and Other Relief Services',
              },
              {
                label: 'Vocational Rehabilitation Services',
                value: 'Vocational Rehabilitation Services',
              },
              {
                label: 'Child Day Care Services',
                value: 'Child Day Care Services',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: 'Leisure and Hospitality',
    value: 'Leisure and Hospitality',
    subIndustries: [
      {
        label: 'Arts, Entertainment, and Recreation',
        value: 'Arts, Entertainment, and Recreation',
        subIndustries: [
          {
            label: 'Performing Arts Companies',
            value: 'Performing Arts Companies',
          },
          {
            label: 'Spectator Sports',
            value: 'Spectator Sports',
          },
          {
            label: 'Promoters of Performing Arts, Sports, and Similar Events',
            value: 'Promoters of Performing Arts, Sports, and Similar Events',
          },
          {
            label:
              'Agents and Managers for Artists, Athletes, Entertainers, and Other Public Figures',
            value:
              'Agents and Managers for Artists, Athletes, Entertainers, and Other Public Figures',
          },
          {
            label: 'Independent Artists, Writers, and Performers',
            value: 'Independent Artists, Writers, and Performers',
          },
          {
            label: 'Amusement Parks and Arcades',
            value: 'Amusement Parks and Arcades',
          },
          {
            label: 'Gambling Industries',
            value: 'Gambling Industries',
          },
          {
            label: 'Other Amusement and Recreation Industries',
            value: 'Other Amusement and Recreation Industries',
          },
        ],
      },
      {
        label: 'Accommodation',
        value: 'Accommodation',
        subIndustries: [
          {
            label: 'Traveler Accommodation',
            value: 'Traveler Accommodation',
            subIndustries: [
              {
                label: 'RV (Recreational Vehicle) Parks and Recreational Camps',
                value: 'RV (Recreational Vehicle) Parks and Recreational Camps',
              },
              {
                label: 'Rooming and Boarding Houses',
                value: 'Rooming and Boarding Houses',
              },
            ],
          },
          {
            label: 'Food Services and Drinking Places',
            value: 'Food Services and Drinking Places',
            subIndustries: [
              {
                label: 'Full-Service Restaurants',
                value: 'Full-Service Restaurants',
              },
              {
                label: 'Limited-Service Eating Places',
                value: 'Limited-Service Eating Places',
              },
              {
                label: 'Special Food Services',
                value: 'Special Food Services',
              },
              {
                label: 'Drinking Places (Alcoholic Beverages)',
                value: 'Drinking Places (Alcoholic Beverages)',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: 'Other Services (except Public Administration)',
    value: 'Other Services (except Public Administration)',
    subIndustries: [
      {
        label: 'Repair and Maintenance',
        value: 'Repair and Maintenance',
        subIndustries: [
          {
            label: 'Automotive Repair and Maintenance',
            value: 'Automotive Repair and Maintenance',
          },
          {
            label: 'Electronic and Precision Equipment Repair and Maintenance',
            value: 'Electronic and Precision Equipment Repair and Maintenance',
          },
          {
            label:
              'Commercial and Industrial Machinery and Equipment (except Automotive and Electronic) Repair and Maintenance',
            value:
              'Commercial and Industrial Machinery and Equipment (except Automotive and Electronic) Repair and Maintenance',
          },
          {
            label: 'Personal and Household Goods Repair and Maintenance',
            value: 'Personal and Household Goods Repair and Maintenance',
          },
        ],
      },
      {
        label: 'Personal and Laundry Services',
        value: 'Personal and Laundry Services',
        subIndustries: [
          {
            label: 'Personal Care Services',
            value: 'Personal Care Services',
          },
          {
            label: 'Death Care Services',
            value: 'Death Care Services',
          },
          {
            label: 'Drycleaning and Laundry Services',
            value: 'Drycleaning and Laundry Services',
          },
          {
            label: 'Other Personal Services',
            value: 'Other Personal Services',
          },
        ],
      },
      {
        label:
          'Religious, Grantmaking, Civic, Professional, and Similar Organizations',
        value:
          'Religious, Grantmaking, Civic, Professional, and Similar Organizations',
        subIndustries: [
          {
            label: 'Religious Organizations',
            value: 'Religious Organizations',
          },
          {
            label: 'Grantmaking and Giving Services',
            value: 'Grantmaking and Giving Services',
          },
          {
            label: 'Social Advocacy Organizations',
            value: 'Social Advocacy Organizations',
          },
          {
            label: 'Civic and Social Organizations',
            value: 'Civic and Social Organizations',
          },
          {
            label:
              'Business, Professional, Labor, Political, and Similar Organizations',
            value:
              'Business, Professional, Labor, Political, and Similar Organizations',
          },
        ],
      },
    ],
  },
];

export const filterSorts = [
  {
    label: 'Primary Sort',
    options: [
      { value: 'Reviews', label: 'Reviews' },
      { value: 'Ratings', label: 'Ratings' },
      { value: 'Size', label: 'Size' },
      { value: 'BlackOwnedPercent', label: '(%) BlackOwnedPercent' },
      { value: 'Year', label: 'Years In Business' },
      { value: 'CompanyName', label: 'Name' },
    ],
  },
  {
    label: 'Secondary Sort',
    options: [
      { value: 'Reviews', label: 'Reviews' },
      { value: 'Ratings', label: 'Ratings' },
      { value: 'Size', label: 'Size' },
      { value: 'BlackOwnedPercent', label: '(%) BlackOwnedPercent' },
      { value: 'Year', label: 'Years In Business' },
      { value: 'CompanyName', label: 'Name' },
    ],
  },
  {
    label: 'Tertiary Sort',
    options: [
      { value: 'Reviews', label: 'Reviews' },
      { value: 'Ratings', label: 'Ratings' },
      { value: 'Size', label: 'Size' },
      { value: 'BlackOwnedPercent', label: '(%) BlackOwnedPercent' },
      { value: 'Year', label: 'Years In Business' },
      { value: 'CompanyName', label: 'Name' },
    ],
  },
  {
    label: 'Quaternary Sort',
    options: [
      { value: 'Reviews', label: 'Reviews' },
      { value: 'Ratings', label: 'Ratings' },
      { value: 'Size', label: 'Size' },
      { value: 'BlackOwnedPercent', label: '(%) BlackOwnedPercent' },
      { value: 'Year', label: 'Years In Business' },
      { value: 'CompanyName', label: 'Name' },
    ],
  },
];

export const filterCities = [
  {
    title: 'Algeria',
    options: [
      { id: 'All', label: 'All' },
      { id: 'Algiers', label: 'Algiers' },
      { id: 'Annaba', label: 'Annaba' },
      { id: 'Batna', label: 'Batna' },
    ],
  },
  { title: 'Cameroon', options: [] },
  { title: 'Ethiopia', options: [] },
  { title: 'Lesotho', options: [] },
  { title: 'Mauritania', options: [] },
  { title: 'Nigeria', options: [] },
  { title: 'South Africa', options: [] },
];

export const filterTypes = [
  {
    title: 'Business Opportunity Type',
    options: [
      {
        id: 'Seeking',
        label: 'Seeking',
      },
      { id: 'Facilitate', label: 'Facilitate' },
    ],
  },
  {
    title: 'Matches Type',
    options: [
      {
        id: 2,
        label: 'Co-Founder',
      },
      { id: 3, label: 'Board of Directors Member' },
    ],
  },
];

export const filterLocations = [
  {
    title: 'Locations',
    options: [
      {
        id: 'Atlanta, GA',
        label: 'Atlanta, GA',
      },
      { id: 'Massachusetts, USA', label: 'Massachusetts, USA' },
      {
        id: 'Weissnatberg, USA',
        label: 'Weissnatberg, USA',
      },
      {
        id: 'Manuelamouth, USA',
        label: 'Manuelamouth, USA',
      },
    ],
  },
];

export const welcomeMessage =
  "Thanks for joining! You're going to love it here! To start using the site, you first need to create your profile. Let's get started!";

export const feedTypes = {
  MostActiveChatterOfTheYear: 'MostActiveChatterOfTheYear',
  MostActiveChatterOfTheMonth: 'MostActiveChatterOfTheMonth',
  MostActiveChatterOfTheWeek: 'MostActiveChatterOfTheWeek',
  MostFavoritedProfileOfTheDay: 'MostFavoritedProfileOfTheDay',
  MostFavoritedProfileOfTheWeek: 'MostFavoritedProfileOfTheWeek',
  MostFavoritedProfileOfTheYear: 'MostFavoritedProfileOfTheYear',
  MostReviewedProfileOfTheDay: 'MostReviewedProfileOfTheDay',
  MostReviewedProfileOfTheWeek: 'MostReviewedProfileOfTheWeek',
  MostReviewedProfileOfTheYear: 'MostReviewedProfileOfTheYear',
  MostFollowedProfileOfTheDay: 'MostFollowedProfileOfTheDay',
  MostFollowedProfileOfTheWeek: 'MostFollowedProfileOfTheWeek',
  MostFollowedProfileOfTheYear: 'MostFollowedProfileOfTheYear',
  NewUsersMilestone: 'NewUsersMilestone',
  NewProfileCreated: 'NewProfileCreated',
  NewCOFounderOppertunityCreated: 'NewCOFounderOppertunityCreated',
  NewBoardOfMemberOppertunityCreated: 'NewBoardOfMemberOppertunityCreated',
  NewSeekingOpportunityCreated: 'NewJobSeekingOppertunityCreated',
  NewOfferingOpportunityCreated: 'NewOfferingOpportunityCreated',
  CampaignGoalReached: 'CampaignGoalReached',
  NewIndividualsDiscountCreated: 'NewIndividualsDiscountCreated',
  NewBusinessDiscountCreated: 'NewBusinessDiscountCreated',
  NewDiscountCreated: 'NewDiscountCreated',
  WelcomeType: 'WelcomeType',
  NewCampaignCreated: 'NewCampaignCreated',
  NewProjectCreated: 'NewProjectCreated',
  NewProjectPostCreated: 'NewProjectPostCreated',
  ProjectUpdated: 'ProjectUpdated',
  ProjectPostUpdated: 'ProjectPostUpdated',
  Inspo: 'Inspo',
  CalenderEvent: 'CalenderEvent',
  TodayEvent: 'TodayEvent',
  News: 'News'
};

