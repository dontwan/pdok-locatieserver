import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {
	findLocations,
	filterDocumentsBy,
	filterDocumentsByAddress,
	filterDocumentsByCity,
	filterDocumentsByMunicipality,
	filterDocumentsByStreet,
	filterDocumentsByZipcode
} from './index';
import type {
	Document,
	AddressDocument,
	CityDocument,
	MunicipalityDocument,
	StreetDocument,
	ZipcodeDocument
} from './types';

const mockResponse = (data: unknown, ok = true, status = 200): Response => {
	return {
		ok,
		status,
		statusText: ok ? 'OK' : 'Bad Request',
		json: async () => data,
		text: async () => JSON.stringify(data)
	} as Response;
};

beforeEach(() => {
	vi.spyOn(global, 'fetch').mockResolvedValue(
		mockResponse({response: {docs: [], numFound: 0, numFoundExact: true, start: 0, maxScore: 0}})
	);
});

afterEach(() => vi.restoreAllMocks());

describe('buildQueryString and findLocations', () => {
	it('builds correct URL with query parameters', async () => {
		await findLocations({api: 'free', q: 'Hello world', fq: ['type:adres', 'bron:BAG'], rows: 5});

		const [url] = vi.mocked(fetch).mock.calls[0] as Array<string>;
		expect(url).toContain('q=Hello+world');
		expect(url).toContain('fq=type%3Aadres');
		expect(url).toContain('rows=5');
		expect(url).toContain('free');
	});

	it('skips undefined or empty values in query string', async () => {
		await findLocations({api: 'free', q: ''});

		const [fetchCall] = vi.mocked(fetch).mock.calls[0] as Array<string>;
		expect(fetchCall).not.toContain('q=');
		expect(fetchCall).toContain('free?');
	});

	it('returns parsed response on success', async () => {
		const documents: Array<Document> = [
			{
				bron: 'BAG',
				identificatie: '1182',
				provinciecode: 'PV23',
				woonplaatscode: '1182',
				type: 'woonplaats',
				woonplaatsnaam: 'Zwolle',
				provincienaam: 'Overijssel',
				centroide_ll: 'POINT(6.11836361 52.51868565)',
				gemeentecode: '0193',
				rdf_seealso: 'http://bag.basisregistraties.overheid.nl/bag/id/woonplaats/1182',
				weergavenaam: 'Zwolle, Zwolle, Overijssel',
				provincieafkorting: 'OV',
				centroide_rd: 'POINT(204627.572 503696.798)',
				id: 'wpl-a8f4a8d4f99885875ce49612a732d2c2',
				gemeentenaam: 'Zwolle',
				score: 9.605669
			}
		];

		vi.mocked(fetch).mockResolvedValueOnce(
			mockResponse({
				response: {docs: documents, numFound: 1, numFoundExact: true, start: 0, maxScore: 1.0}
			})
		);

		const {docs} = await findLocations({api: 'free', q: 'Zwolle'});
		expect(docs).toHaveLength(1);
		expect(docs[0]!.type).toBe('woonplaats');
	});

	it('throws on non-OK HTTP responses', async () => {
		vi.mocked(fetch).mockResolvedValueOnce(mockResponse({error: 'fail'}, false, 400));
		await expect(findLocations({api: 'free', q: 'bad'})).rejects.toThrowError();
	});
});

describe('filterDocumentsBy and wrappers', () => {
	const documents: Array<Document> = [
		{id: '1', type: 'adres'} as AddressDocument,
		{id: '2', type: 'woonplaats'} as CityDocument,
		{id: '3', type: 'gemeente'} as MunicipalityDocument,
		{id: '4', type: 'weg'} as StreetDocument,
		{id: '5', type: 'postcode'} as ZipcodeDocument
	];

	it('filters by document type correctly', () => {
		const result = filterDocumentsBy('adres', documents);
		expect(result).toHaveLength(1);
		expect(result[0]!.type).toBe('adres');
	});

	it('returns empty array if type not found', () => {
		const result = filterDocumentsBy(
			'gemeente',
			documents.filter(({type}) => type !== 'gemeente')
		);
		expect(result).toHaveLength(0);
	});

	it('wrapper functions return correct typed arrays', () => {
		expect(filterDocumentsByAddress(documents)[0]!.type).toBe('adres');
		expect(filterDocumentsByCity(documents)[0]!.type).toBe('woonplaats');
		expect(filterDocumentsByMunicipality(documents)[0]!.type).toBe('gemeente');
		expect(filterDocumentsByStreet(documents)[0]!.type).toBe('weg');
		expect(filterDocumentsByZipcode(documents)[0]!.type).toBe('postcode');
	});
});
