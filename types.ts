
export enum DeviceType {
  ANDROID = 'Android',
  IOS = 'iOS',
  WINDOWS = 'Windows',
  MAC = 'macOS',
  OTHER = 'Other'
}

export interface TrackedDevice {
  id: string;
  name: string;
  type: DeviceType;
  lastSeen: string;
  battery: number;
  latitude: number;
  longitude: number;
  status: 'online' | 'offline';
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
  };
}
