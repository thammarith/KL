import { DEFAULT_CURRENCY } from './currency';

// ISO 3166-1 alpha-2 country codes mapped to their official currencies
// Only includes officially assigned code elements
const countryCurrencies: Record<string, { code: string; name: string }> = {
	XX: { code: DEFAULT_CURRENCY, name: 'Unkown currency' },

	// A
	AF: { code: 'AFN', name: 'Afghan afghani' }, // Afghanistan
	AL: { code: 'ALL', name: 'Albanian lek' }, // Albania
	DZ: { code: 'DZD', name: 'Algerian dinar' }, // Algeria
	AD: { code: 'EUR', name: 'Euro' }, // Andorra
	AO: { code: 'AOA', name: 'Angolan kwanza' }, // Angola
	AG: { code: 'XCD', name: 'East Caribbean dollar' }, // Antigua and Barbuda
	AR: { code: 'ARS', name: 'Argentine peso' }, // Argentina
	AM: { code: 'AMD', name: 'Armenian dram' }, // Armenia
	AU: { code: 'AUD', name: 'Australian dollar' }, // Australia
	AT: { code: 'EUR', name: 'Euro' }, // Austria
	AZ: { code: 'AZN', name: 'Azerbaijani manat' }, // Azerbaijan

	// B
	BS: { code: 'BSD', name: 'Bahamian dollar' }, // Bahamas
	BH: { code: 'BHD', name: 'Bahraini dinar' }, // Bahrain
	BD: { code: 'BDT', name: 'Bangladeshi taka' }, // Bangladesh
	BB: { code: 'BBD', name: 'Barbadian dollar' }, // Barbados
	BY: { code: 'BYN', name: 'Belarusian ruble' }, // Belarus
	BE: { code: 'EUR', name: 'Euro' }, // Belgium
	BZ: { code: 'BZD', name: 'Belize dollar' }, // Belize
	BJ: { code: 'XOF', name: 'West African CFA franc' }, // Benin
	BT: { code: 'BTN', name: 'Bhutanese ngultrum' }, // Bhutan
	BO: { code: 'BOB', name: 'Bolivian boliviano' }, // Bolivia
	BA: { code: 'BAM', name: 'Bosnia and Herzegovina convertible mark' }, // Bosnia and Herzegovina
	BW: { code: 'BWP', name: 'Botswana pula' }, // Botswana
	BR: { code: 'BRL', name: 'Brazilian real' }, // Brazil
	BN: { code: 'BND', name: 'Brunei dollar' }, // Brunei
	BG: { code: 'BGN', name: 'Bulgarian lev' }, // Bulgaria
	BF: { code: 'XOF', name: 'West African CFA franc' }, // Burkina Faso
	BI: { code: 'BIF', name: 'Burundian franc' }, // Burundi

	// C
	CV: { code: 'CVE', name: 'Cape Verdean escudo' }, // Cabo Verde
	KH: { code: 'KHR', name: 'Cambodian riel' }, // Cambodia
	CM: { code: 'XAF', name: 'Central African CFA franc' }, // Cameroon
	CA: { code: 'CAD', name: 'Canadian dollar' }, // Canada
	CF: { code: 'XAF', name: 'Central African CFA franc' }, // Central African Republic
	TD: { code: 'XAF', name: 'Central African CFA franc' }, // Chad
	CL: { code: 'CLP', name: 'Chilean peso' }, // Chile
	CN: { code: 'CNY', name: 'Chinese yuan' }, // China
	CO: { code: 'COP', name: 'Colombian peso' }, // Colombia
	KM: { code: 'KMF', name: 'Comorian franc' }, // Comoros
	CG: { code: 'XAF', name: 'Central African CFA franc' }, // Congo
	CD: { code: 'CDF', name: 'Congolese franc' }, // Congo, Democratic Republic of the
	CR: { code: 'CRC', name: 'Costa Rican colón' }, // Costa Rica
	CI: { code: 'XOF', name: 'West African CFA franc' }, // Côte d'Ivoire
	HR: { code: 'EUR', name: 'Euro' }, // Croatia
	CU: { code: 'CUP', name: 'Cuban peso' }, // Cuba
	CY: { code: 'EUR', name: 'Euro' }, // Cyprus
	CZ: { code: 'CZK', name: 'Czech koruna' }, // Czech Republic

	// D
	DK: { code: 'DKK', name: 'Danish krone' }, // Denmark
	DJ: { code: 'DJF', name: 'Djiboutian franc' }, // Djibouti
	DM: { code: 'XCD', name: 'East Caribbean dollar' }, // Dominica
	DO: { code: 'DOP', name: 'Dominican peso' }, // Dominican Republic

	// E
	EC: { code: 'USD', name: 'United States dollar' }, // Ecuador
	EG: { code: 'EGP', name: 'Egyptian pound' }, // Egypt
	SV: { code: 'USD', name: 'United States dollar' }, // El Salvador
	GQ: { code: 'XAF', name: 'Central African CFA franc' }, // Equatorial Guinea
	ER: { code: 'ERN', name: 'Eritrean nakfa' }, // Eritrea
	EE: { code: 'EUR', name: 'Euro' }, // Estonia
	SZ: { code: 'SZL', name: 'Swazi lilangeni' }, // Eswatini
	ET: { code: 'ETB', name: 'Ethiopian birr' }, // Ethiopia

	// F
	FJ: { code: 'FJD', name: 'Fijian dollar' }, // Fiji
	FI: { code: 'EUR', name: 'Euro' }, // Finland
	FR: { code: 'EUR', name: 'Euro' }, // France

	// G
	GA: { code: 'XAF', name: 'Central African CFA franc' }, // Gabon
	GM: { code: 'GMD', name: 'Gambian dalasi' }, // Gambia
	GE: { code: 'GEL', name: 'Georgian lari' }, // Georgia
	DE: { code: 'EUR', name: 'Euro' }, // Germany
	GH: { code: 'GHS', name: 'Ghanaian cedi' }, // Ghana
	GR: { code: 'EUR', name: 'Euro' }, // Greece
	GD: { code: 'XCD', name: 'East Caribbean dollar' }, // Grenada
	GT: { code: 'GTQ', name: 'Guatemalan quetzal' }, // Guatemala
	GN: { code: 'GNF', name: 'Guinean franc' }, // Guinea
	GW: { code: 'XOF', name: 'West African CFA franc' }, // Guinea-Bissau
	GY: { code: 'GYD', name: 'Guyanese dollar' }, // Guyana

	// H
	HT: { code: 'HTG', name: 'Haitian gourde' }, // Haiti
	HN: { code: 'HNL', name: 'Honduran lempira' }, // Honduras
	HU: { code: 'HUF', name: 'Hungarian forint' }, // Hungary

	// I
	IS: { code: 'ISK', name: 'Icelandic króna' }, // Iceland
	IN: { code: 'INR', name: 'Indian rupee' }, // India
	ID: { code: 'IDR', name: 'Indonesian rupiah' }, // Indonesia
	IR: { code: 'IRR', name: 'Iranian rial' }, // Iran
	IQ: { code: 'IQD', name: 'Iraqi dinar' }, // Iraq
	IE: { code: 'EUR', name: 'Euro' }, // Ireland
	IL: { code: 'ILS', name: 'Israeli new shekel' }, // Israel
	IT: { code: 'EUR', name: 'Euro' }, // Italy

	// J
	JM: { code: 'JMD', name: 'Jamaican dollar' }, // Jamaica
	JP: { code: 'JPY', name: 'Japanese yen' }, // Japan
	JO: { code: 'JOD', name: 'Jordanian dinar' }, // Jordan

	// K
	KZ: { code: 'KZT', name: 'Kazakhstani tenge' }, // Kazakhstan
	KE: { code: 'KES', name: 'Kenyan shilling' }, // Kenya
	KI: { code: 'AUD', name: 'Australian dollar' }, // Kiribati
	KP: { code: 'KPW', name: 'North Korean won' }, // Korea, Democratic People's Republic of
	KR: { code: 'KRW', name: 'South Korean won' }, // Korea, Republic of
	KW: { code: 'KWD', name: 'Kuwaiti dinar' }, // Kuwait
	KG: { code: 'KGS', name: 'Kyrgyzstani som' }, // Kyrgyzstan

	// L
	LA: { code: 'LAK', name: 'Lao kip' }, // Lao People's Democratic Republic
	LV: { code: 'EUR', name: 'Euro' }, // Latvia
	LB: { code: 'LBP', name: 'Lebanese pound' }, // Lebanon
	LS: { code: 'LSL', name: 'Lesotho loti' }, // Lesotho
	LR: { code: 'LRD', name: 'Liberian dollar' }, // Liberia
	LY: { code: 'LYD', name: 'Libyan dinar' }, // Libya
	LI: { code: 'CHF', name: 'Swiss franc' }, // Liechtenstein
	LT: { code: 'EUR', name: 'Euro' }, // Lithuania
	LU: { code: 'EUR', name: 'Euro' }, // Luxembourg

	// M
	MG: { code: 'MGA', name: 'Malagasy ariary' }, // Madagascar
	MW: { code: 'MWK', name: 'Malawian kwacha' }, // Malawi
	MY: { code: 'MYR', name: 'Malaysian ringgit' }, // Malaysia
	MV: { code: 'MVR', name: 'Maldivian rufiyaa' }, // Maldives
	ML: { code: 'XOF', name: 'West African CFA franc' }, // Mali
	MT: { code: 'EUR', name: 'Euro' }, // Malta
	MH: { code: 'USD', name: 'United States dollar' }, // Marshall Islands
	MR: { code: 'MRU', name: 'Mauritanian ouguiya' }, // Mauritania
	MU: { code: 'MUR', name: 'Mauritian rupee' }, // Mauritius
	MX: { code: 'MXN', name: 'Mexican peso' }, // Mexico
	FM: { code: 'USD', name: 'United States dollar' }, // Micronesia
	MD: { code: 'MDL', name: 'Moldovan leu' }, // Moldova
	MC: { code: 'EUR', name: 'Euro' }, // Monaco
	MN: { code: 'MNT', name: 'Mongolian tögrög' }, // Mongolia
	ME: { code: 'EUR', name: 'Euro' }, // Montenegro
	MA: { code: 'MAD', name: 'Moroccan dirham' }, // Morocco
	MZ: { code: 'MZN', name: 'Mozambican metical' }, // Mozambique
	MM: { code: 'MMK', name: 'Burmese kyat' }, // Myanmar

	// N
	NA: { code: 'NAD', name: 'Namibian dollar' }, // Namibia
	NR: { code: 'AUD', name: 'Australian dollar' }, // Nauru
	NP: { code: 'NPR', name: 'Nepalese rupee' }, // Nepal
	NL: { code: 'EUR', name: 'Euro' }, // Netherlands
	NZ: { code: 'NZD', name: 'New Zealand dollar' }, // New Zealand
	NI: { code: 'NIO', name: 'Nicaraguan córdoba' }, // Nicaragua
	NE: { code: 'XOF', name: 'West African CFA franc' }, // Niger
	NG: { code: 'NGN', name: 'Nigerian naira' }, // Nigeria
	MK: { code: 'MKD', name: 'Macedonian denar' }, // North Macedonia
	NO: { code: 'NOK', name: 'Norwegian krone' }, // Norway

	// O
	OM: { code: 'OMR', name: 'Omani rial' }, // Oman

	// P
	PK: { code: 'PKR', name: 'Pakistani rupee' }, // Pakistan
	PW: { code: 'USD', name: 'United States dollar' }, // Palau
	PS: { code: 'ILS', name: 'Israeli new shekel' }, // Palestine, State of
	PA: { code: 'PAB', name: 'Panamanian balboa' }, // Panama
	PG: { code: 'PGK', name: 'Papua New Guinean kina' }, // Papua New Guinea
	PY: { code: 'PYG', name: 'Paraguayan guaraní' }, // Paraguay
	PE: { code: 'PEN', name: 'Peruvian sol' }, // Peru
	PH: { code: 'PHP', name: 'Philippine peso' }, // Philippines
	PL: { code: 'PLN', name: 'Polish złoty' }, // Poland
	PT: { code: 'EUR', name: 'Euro' }, // Portugal

	// Q
	QA: { code: 'QAR', name: 'Qatari riyal' }, // Qatar

	// R
	RO: { code: 'RON', name: 'Romanian leu' }, // Romania
	RU: { code: 'RUB', name: 'Russian ruble' }, // Russian Federation
	RW: { code: 'RWF', name: 'Rwandan franc' }, // Rwanda

	// S
	KN: { code: 'XCD', name: 'East Caribbean dollar' }, // Saint Kitts and Nevis
	LC: { code: 'XCD', name: 'East Caribbean dollar' }, // Saint Lucia
	VC: { code: 'XCD', name: 'East Caribbean dollar' }, // Saint Vincent and the Grenadines
	WS: { code: 'WST', name: 'Samoan tālā' }, // Samoa
	SM: { code: 'EUR', name: 'Euro' }, // San Marino
	ST: { code: 'STN', name: 'São Tomé and Príncipe dobra' }, // Sao Tome and Principe
	SA: { code: 'SAR', name: 'Saudi riyal' }, // Saudi Arabia
	SN: { code: 'XOF', name: 'West African CFA franc' }, // Senegal
	RS: { code: 'RSD', name: 'Serbian dinar' }, // Serbia
	SC: { code: 'SCR', name: 'Seychellois rupee' }, // Seychelles
	SL: { code: 'SLE', name: 'Sierra Leonean leone' }, // Sierra Leone
	SG: { code: 'SGD', name: 'Singapore dollar' }, // Singapore
	SK: { code: 'EUR', name: 'Euro' }, // Slovakia
	SI: { code: 'EUR', name: 'Euro' }, // Slovenia
	SB: { code: 'SBD', name: 'Solomon Islands dollar' }, // Solomon Islands
	SO: { code: 'SOS', name: 'Somali shilling' }, // Somalia
	ZA: { code: 'ZAR', name: 'South African rand' }, // South Africa
	SS: { code: 'SSP', name: 'South Sudanese pound' }, // South Sudan
	ES: { code: 'EUR', name: 'Euro' }, // Spain
	LK: { code: 'LKR', name: 'Sri Lankan rupee' }, // Sri Lanka
	SD: { code: 'SDG', name: 'Sudanese pound' }, // Sudan
	SR: { code: 'SRD', name: 'Surinamese dollar' }, // Suriname
	SE: { code: 'SEK', name: 'Swedish krona' }, // Sweden
	CH: { code: 'CHF', name: 'Swiss franc' }, // Switzerland
	SY: { code: 'SYP', name: 'Syrian pound' }, // Syrian Arab Republic

	// T
	TW: { code: 'TWD', name: 'New Taiwan dollar' }, // Taiwan
	TJ: { code: 'TJS', name: 'Tajikistani somoni' }, // Tajikistan
	TZ: { code: 'TZS', name: 'Tanzanian shilling' }, // Tanzania
	TH: { code: 'THB', name: 'Thai baht' }, // Thailand
	TL: { code: 'USD', name: 'United States dollar' }, // Timor-Leste
	TG: { code: 'XOF', name: 'West African CFA franc' }, // Togo
	TO: { code: 'TOP', name: 'Tongan paʻanga' }, // Tonga
	TT: { code: 'TTD', name: 'Trinidad and Tobago dollar' }, // Trinidad and Tobago
	TN: { code: 'TND', name: 'Tunisian dinar' }, // Tunisia
	TR: { code: 'TRY', name: 'Turkish lira' }, // Turkey
	TM: { code: 'TMT', name: 'Turkmenistan manat' }, // Turkmenistan
	TV: { code: 'AUD', name: 'Australian dollar' }, // Tuvalu

	// U
	UG: { code: 'UGX', name: 'Ugandan shilling' }, // Uganda
	UA: { code: 'UAH', name: 'Ukrainian hryvnia' }, // Ukraine
	AE: { code: 'AED', name: 'United Arab Emirates dirham' }, // United Arab Emirates
	GB: { code: 'GBP', name: 'Pound sterling' }, // United Kingdom
	US: { code: 'USD', name: 'United States dollar' }, // United States
	UY: { code: 'UYU', name: 'Uruguayan peso' }, // Uruguay
	UZ: { code: 'UZS', name: "Uzbekistani so'm" }, // Uzbekistan

	// V
	VU: { code: 'VUV', name: 'Vanuatu vatu' }, // Vanuatu
	VE: { code: 'VES', name: 'Venezuelan bolívar' }, // Venezuela
	VN: { code: 'VND', name: 'Vietnamese đồng' }, // Viet Nam

	// Y
	YE: { code: 'YER', name: 'Yemeni rial' }, // Yemen

	// Z
	ZM: { code: 'ZMW', name: 'Zambian kwacha' }, // Zambia
	ZW: { code: 'ZWL', name: 'Zimbabwean dollar' }, // Zimbabwe
};

export const getCurrencyByCountryCode = (
	countryCode: string
): { code: string; name: string } | undefined =>
	countryCurrencies[countryCode as keyof typeof countryCurrencies];
