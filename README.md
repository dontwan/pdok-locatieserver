# 🗺️ PDOK Locatieserver TypeScript Client

A lightweight, type-safe client for the [PDOK Locatieserver API](https://api.pdok.nl/bzk/locatieserver/search/v3_1/ui/).  
It provides simple functions for querying PDOK’s geocoding endpoints (`free`, `suggest`, `lookup`, `reverse`) and utilities for filtering and working with structured location documents.

View [PDOK Locatieserver documentation](https://github.com/PDOK/locatieserver/wiki/API-Locatieserver) for more information.

---

## 🚀 Features

- ✅ Written in **TypeScript** — fully type-safe  
- ✅ Supports all PDOK locatieserver API types (`free`, `suggest`, `lookup`, `reverse`)  
- ✅ Includes typed response models for addresses, cities, municipalities, streets, and zipcodes  
- ✅ Utility filters for quickly narrowing results  
- ✅ Minimal and dependency-free

---

## 📦 Installation

```bash
npm install pdok-locatieserver
# or
yarn add pdok-locatieserver
# or
pnpm install pdok-locatieserver
```

## 🧩 Usage

### Free API

The Free API offers the option of free search (classic geocoding), where the API returns results directly based on the search query without
the intervention of suggestions.

```ts
import {findLocations} from 'pdok-locatieserver';
const result = await findLocations({api: 'free', q: 'Zwolle'});
```

### Suggest API

The Suggest API offers the possibility to enter a search query (or part of one), after which suggestions are returned.

```ts
import {findLocations} from 'pdok-locatieserver';
const result = await findLocations({api: 'suggest', q: 'Zwolle'});
```

### Lookup API

Once a choice has been made based on suggestions from the Suggest API, the Lookup API is called, which returns, among other things, a (simplified) geometry of the search query.

```ts
import {findLocations} from 'pdok-locatieserver';
const result = await findLocations({api: 'lookup', id: 'gem-effca2786db69e038aca18fc3b0f4b21'});
```

### Reverse API

The Reverse API offers the possibility to specify a location (point geometry) and then receive various data in a range around this location.

```ts
import {findLocations} from 'pdok-locatieserver';
const result = await findLocations({api: 'reverse', q: 'Zwolle'});
```

## 🛠️ Utilities

Each PDOK response can contain a mix of document types. Use these utility to filter only the documents you need:

```ts
const {doc} = await findLocations({api: 'free', q: 'Zwolle'});
filterDocumentsByAddress(docs);      // → Array<AddressDocument>
filterDocumentsByCity(docs);         // → Array<CityDocument>
filterDocumentsByMunicipality(docs); // → Array<MunicipalityDocument>
filterDocumentsByStreet(docs);       // → Array<StreetDocument>
filterDocumentsByZipcode(docs);      // → Array<ZipcodeDocument>
```

Or use the generic version:

```ts
import { filterDocumentsBy } from 'pdok-locatieserver';
filterDocumentsBy('weg', docs);      // Array<StreetDocument>
```

## 🧱 Type System

The library includes detailed TypeScript interfaces for all PDOK locatieserver document types:

```ts
type DocumentType = 'adres' | 'gemeente' | 'woonplaats' | 'weg' | 'postcode'

interface Document {
  type: DocumentType
  // ...
}
```

Each subtype (`AddressDocument`, `CityDocument`, etc.) contains strongly typed fields such as `straatnaam`, `woonplaatsnaam`, `postcode`, and more.

## 🧾 License

MIT — Created with ❤️ for developers who need simple and typed access to the PDOK Locatieserver API.
