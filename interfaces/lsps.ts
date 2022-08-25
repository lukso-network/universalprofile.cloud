// Interfaces related to LSP

export interface Image {
  url: string;
  hash: string;
  width: number;
  height: number;
  hashFunction: string;
}

export interface Asset {
  hash: string;
  url: string;
  hashFunction: string;
  fileType: string;
}

export interface Link {
  title: string;
  url: string;
}

// https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-4-DigitalAsset-Metadata.md
export interface LSP4Metadata {
  LSP4Metadata: {
    description: string;
    links: Link[];
    images: Image[][];
    assets: Asset[];
    icons: Image[];
  };
}

// https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-3-UniversalProfile-Metadata.md
export interface LSP3Profile {
  LSP3Profile: {
    name: string;
    description: string;
    links: Link[];
    tags: string[];
    profileImage: Image[];
    backgroundImage: Image[];
  };
}

export enum LSPType {
  LSP7 = 'LSP7',
  LSP8 = 'LSP8',
  Unknown = 'Unknown',
}
