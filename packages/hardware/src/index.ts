export type DeviceType =
  | 'THERMAL_PRINTER'
  | 'KITCHEN_PRINTER'
  | 'CASH_DRAWER'
  | 'BARCODE_SCANNER'
  | 'CUSTOMER_DISPLAY'
  | 'OTHER';

export interface DeviceDescriptor {
  deviceId: string;
  type: DeviceType;
  name: string;
  connection: 'USB' | 'SERIAL' | 'NETWORK' | 'BLUETOOTH';
}
