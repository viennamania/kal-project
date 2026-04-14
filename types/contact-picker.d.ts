type ContactProperty = "address" | "email" | "icon" | "name" | "tel";

interface ContactAddress {
  addressLine?: string[];
  city?: string;
  country?: string;
  dependentLocality?: string;
  organization?: string;
  phone?: string;
  postalCode?: string;
  recipient?: string;
  region?: string;
  sortingCode?: string;
}

interface ContactInfo {
  address?: ContactAddress[];
  email?: string[];
  icon?: Blob[];
  name?: string[];
  tel?: string[];
}

interface ContactsManager {
  getProperties(): Promise<ContactProperty[]>;
  select(properties: ContactProperty[], options?: { multiple?: boolean }): Promise<ContactInfo[]>;
}

interface Navigator {
  contacts?: ContactsManager;
}

interface Window {
  ContactsManager?: unknown;
}
