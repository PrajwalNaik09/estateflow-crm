import { Lead, LeadStatus, PropertyCategory } from '../types';

// We use gviz/tq since it supports CORS natively, avoiding the need for proxy services in production
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1WIZDf107pz7GV2OwM9gh9XD6In26JnzFNqtjmTnL0F4/gviz/tq?tqx=out:csv';

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current = '';
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      row.push(current.trim());
      current = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (current || row.length > 0) {
        row.push(current.trim());
        rows.push(row);
        row = [];
        current = '';
      }
      if (char === '\r' && text[i + 1] === '\n') i++;
    } else {
      current += char;
    }
  }
  if (current || row.length > 0) {
    row.push(current.trim());
    rows.push(row);
  }
  return rows;
}

function parseDate(val: string): Date {
  if (!val) return new Date();
  const d = new Date(val);
  if (!isNaN(d.getTime())) return d;
  return new Date();
}

function mapPropertyType(val: string): PropertyCategory {
  const v = val.toLowerCase();
  if (v.includes('rent')) return 'Rented Apartment';
  if (v.includes('house') || v.includes('land')) return 'House/Land';
  return 'Apartment';
}

function stableId(name: string, phone: string, index: number): string {
  const raw = `${name}_${phone}_${index}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  return `lead_${Math.abs(hash)}`;
}

export async function fetchLeadsFromSheet(): Promise<Lead[]> {
  const response = await fetch(SHEET_CSV_URL);
  if (!response.ok) throw new Error(`Failed to fetch sheet: ${response.status}`);

  const text = await response.text();
  const rows = parseCSV(text);

  if (rows.length < 2) return [];

  const headers = rows[0].map(h =>
    h.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
  );

  const get = (row: string[], key: string): string => {
    const idx = headers.findIndex(h => h.includes(key));
    return idx >= 0 ? (row[idx] || '') : '';
  };

  const leads: Lead[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.every(cell => !cell)) continue;

    const timestamp = get(row, 'timestamp') || get(row, 'date') || get(row, 'time') || row[0] || '';
    const name      = get(row, 'full_name') || get(row, 'name') || '';
    const phone     = get(row, 'phone_number') || get(row, 'phone') || '';
    const email     = get(row, 'email') || '';
    const propType  = get(row, 'property_type') || get(row, 'property') || '';
    const location  = get(row, 'preferred_location') || get(row, 'location') || '';

    leads.push({
      id: stableId(name, phone, i),
      date: parseDate(timestamp),
      name,
      phoneNumber: phone,
      email,
      propertyType: mapPropertyType(propType),
      preferredLocation: location,
      status: LeadStatus.NEW,
      contactedPhone: false,
      contactedEmail: false,
    });
  }

  return leads.sort((a, b) => b.date.getTime() - a.date.getTime());
}
