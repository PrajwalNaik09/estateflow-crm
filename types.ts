
export enum LeadStatus {
  NEW = 'New Lead',
  FOLLOW_UP = 'Follow-up',
  CALLED = 'Qualified',
  NOT_CONTACTED = 'Not Received',
  NOT_INTERESTED = 'Not Interested'
}

export type PropertyCategory = 'Rented Apartment' | 'Apartment' | 'House/Land';

export interface Lead {
  id: string;
  date: Date;
  name: string;
  phoneNumber: string;
  email: string;
  propertyType: PropertyCategory;
  preferredLocation: string;
  status: LeadStatus;
  contactedPhone: boolean;
  contactedEmail: boolean;
}

export type TimeFilter = 'Daily' | 'Weekly' | 'Monthly';

export interface StatMetric {
  label: string;
  value: number;
  trend?: number;
}
