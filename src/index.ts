import {ApiOptions, Document, Response, DocumentType, SuccessResponse, ApiType} from './types';

function createBaseUrl(type: ApiType) {
	return `https://api.pdok.nl/bzk/locatieserver/search/v3_1/${type}`;
}

function buildQueryString(options: Omit<ApiOptions, 'api'>): string {
	const params = Object.entries(options).reduce((params, [key, value]) => {
		if (!value) {
			return params;
		}

		if (Array.isArray(value)) {
			value.forEach((value) => {
				if (value) {
					params.append(key, key === 'type' ? `type=${value}` : String(value));
				}
			});
		} else {
			params.append(key, String(value));
		}

		return params;
	}, new URLSearchParams());

	return params.toString();
}

export async function findLocations<Options extends ApiOptions>({
	api,
	...options
}: Options): Promise<Response> {
	const url = `${createBaseUrl(api)}?${buildQueryString(options)}`;
	const result = await fetch(url, {method: 'GET', headers: {Accept: 'application/json'}});

	if (!result.ok) {
		throw result;
	}

	const {response} = (await result.json()) as SuccessResponse;
	return response;
}

export function filterDocumentsBy<Type extends DocumentType>(
	type: Type,
	documents: Array<Document>
): Array<Extract<Document, {type: Type}>> {
	return documents.filter((document): document is Extract<Document, {type: Type}> => {
		return document.type === type;
	});
}

export const filterDocumentsByAddress = (docs: Document[]) => filterDocumentsBy('adres', docs);

export const filterDocumentsByCity = (docs: Document[]) => filterDocumentsBy('woonplaats', docs);

export const filterDocumentsByMunicipality = (docs: Document[]) =>
	filterDocumentsBy('gemeente', docs);

export const filterDocumentsByStreet = (docs: Document[]) => filterDocumentsBy('weg', docs);

export const filterDocumentsByZipcode = (docs: Document[]) => filterDocumentsBy('postcode', docs);
