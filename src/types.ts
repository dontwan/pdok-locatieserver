export type DocumentType = 'adres' | 'gemeente' | 'woonplaats' | 'weg' | 'postcode';

interface BaseDocument<Type extends DocumentType> {
	id: string;
	identificatie: string;
	bron: string;
	type: Type;
	score?: number;
}

export interface AddressDocument extends BaseDocument<'adres'> {
	woonplaatscode: string;
	woonplaatsnaam: string;
	gemeentecode: string;
	gemeentenaam: string;
	provinciecode: string;
	provincienaam: string;
	provincieafkorting: string;
	waterschapsnaam?: string;
	waterschapscode?: string;
	wijkcode?: string;
	wijknaam?: string;
	buurtcode?: string;
	buurtnaam?: string;
	openbareruimte_id?: string;
	openbareruimtetype?: string;
	straatnaam: string;
	straatnaam_verkort?: string;
	huisnummer: number;
	huisletter?: string;
	huisnummertoevoeging?: string;
	huis_nlt?: string;
	postcode: string;
	adresseerbaarobject_id?: string;
	nummeraanduiding_id?: string;
	centroide_ll: string;
	centroide_rd: string;
	rdf_seealso: string;
	gekoppeld_perceel?: string[];
	weergavenaam: string;
}

export interface MunicipalityDocument extends BaseDocument<'gemeente'> {
	gemeentecode: string;
	gemeentenaam: string;
	weergavenaam: string;
	provinciecode: string;
	provincienaam: string;
	provincieafkorting: string;
	centroide_ll: string;
	centroide_rd: string;
}

export interface CityDocument extends BaseDocument<'woonplaats'> {
	woonplaatscode: string;
	woonplaatsnaam: string;
	gemeentecode: string;
	gemeentenaam: string;
	provinciecode: string;
	provincienaam: string;
	provincieafkorting: string;
	centroide_ll: string;
	centroide_rd: string;
	rdf_seealso: string;
	weergavenaam: string;
}

export interface StreetDocument extends BaseDocument<'weg'> {
	openbareruimte_id: string;
	straatnaam: string;
	straatnaam_verkort?: string;
	openbareruimtetype: string;
	woonplaatscode: string;
	woonplaatsnaam: string;
	gemeentecode: string;
	gemeentenaam: string;
	provinciecode: string;
	provincienaam: string;
	provincieafkorting: string;
	nwb_id?: string;
	centroide_ll: string;
	centroide_rd: string;
	rdf_seealso: string;
	weergavenaam: string;
}

export interface ZipcodeDocument extends BaseDocument<'postcode'> {
	openbareruimte_id: string;
	woonplaatscode: string;
	woonplaatsnaam: string;
	gemeentecode: string;
	gemeentenaam: string;
	provinciecode: string;
	provincienaam: string;
	provincieafkorting: string;
	postcode: string;
	straatnaam: string;
	straatnaam_verkort?: string;
	openbareruimtetype: string;
	centroide_ll: string;
	centroide_rd: string;
	weergavenaam: string;
}

export type Document =
	| AddressDocument
	| MunicipalityDocument
	| CityDocument
	| StreetDocument
	| ZipcodeDocument;

export type ApiType = 'free' | 'lookup' | 'reverse' | 'suggest';

interface BaseOptions<Api extends ApiType> {
	api: Api;
	fl?: string;
	fq?: Array<string>;
}

export interface FreeApiOptions extends BaseOptions<'free'> {
	q?: string;
	lat?: number;
	lon?: number;
	df?: string;
	qf?: string;
	bq?: Array<string>;
	start?: number;
	rows?: number;
	sort?: string;
}

export interface LookupApiOptions extends BaseOptions<'lookup'> {
	id: string;
}

export interface ReverseApiOptions extends BaseOptions<'reverse'> {
	x?: number;
	y?: number;
	lat?: number;
	lon?: number;
	type?: Array<DocumentType> | '*';
	distance?: number;
	start?: number;
	rows?: number;
}

export interface SuggestApiOptions extends BaseOptions<'suggest'> {
	q: string;
	lat?: number;
	lon?: number;
	qf?: string;
	bq?: Array<string>;
	start?: number;
	rows?: number;
	sort?: string;
}

export type ApiOptions = FreeApiOptions | LookupApiOptions | ReverseApiOptions | SuggestApiOptions;

export interface Response<Doc extends Document = Document> {
	docs: Array<Doc>;
	numFound: number;
	numFoundExact: boolean;
	start: number;
	maxScore: number;
}

export interface SuccessResponse<Doc extends Document = Document> {
	response: Response<Doc>;
}

export interface ErrorResponse {
	error: {
		metadata: Array<string>;
		msg: string;
		code: number;
	};
}
