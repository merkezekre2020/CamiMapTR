import axios from 'axios';
import type { Mosque } from '../types';

// The Overpass API endpoint
const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

// A query to get mosques in Turkey
// For performance in this example, we might limit it or fetch just a bounding box if it's too large.
// Fetching all mosques in Turkey might be a massive dataset, so let's try a bounded approach or fetch nodes with amenity=place_of_worship and religion=muslim.
// Turkey bounding box approx: [35.8, 25.6, 42.1, 44.8]
// Alternatively, we use area code for Turkey.
// Area code for Turkey is 3600174737

const buildQuery = () => `
  [out:json][timeout:25];
  area(id:3600174737)->.searchArea;
  (
    node["amenity"="place_of_worship"]["religion"="muslim"](area.searchArea);
  );
  out body 5000;
`;
// Limit to 5000 for initial loading performance and avoid browser freeze.

export const fetchMosques = async (): Promise<Mosque[]> => {
  try {
    const response = await axios.post(
      OVERPASS_API_URL,
      `data=${encodeURIComponent(buildQuery())}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const elements = response.data.elements || [];

    // Map Overpass data to our Mosque type
    const mosques: Mosque[] = elements.map((el: any) => {
      const tags = el.tags || {};

      // Determine a rough type based on tags
      let type = 'Modern';
      if (tags.historic === 'yes' || tags.historic === 'monument' || tags.start_date && parseInt(tags.start_date) < 1923) {
        type = 'Tarihi';
      }

      return {
        id: el.id,
        lat: el.lat,
        lon: el.lon,
        name: tags.name || tags['name:tr'] || 'Bilinmeyen Cami',
        type: type,
        buildYear: tags.start_date || 'Bilinmiyor',
        description: tags.description || tags.note || 'Açıklama bulunmuyor.',
      };
    });

    // Filter out mosques without a proper name for a cleaner list
    return mosques.filter(m => m.name !== 'Bilinmeyen Cami');
  } catch (error) {
    console.error('Error fetching mosques from Overpass API:', error);
    return [];
  }
};
