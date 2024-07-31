export interface Menu {
  PathName: string;
  name: string;
  shortName?: string;
  id?: string;
  icon?: string;
  activeIcon?: string;
}

export interface SideMenu extends Menu {
  description: string;
}

export interface SettingMenu extends Menu {
  sideMenu: SideMenu[];
}

export interface OrderListTapType {
  id: number;
  name: string;
  type: 'all' | 'checked' | 'unchecked' | 'failed';
}

export interface TableListTapType extends Omit<OrderListTapType, 'type'> {
  type: 'all' | 'taken' | 'untaken';
}

export interface SearchFilterMenuType {
  id: number;
  name: string;
  value: string[];
}

export interface LabelsType {
  name: 'best' | 'new' | 'hit' | 'sale' | 'md';
  text: string;
  icon: any;
}

export interface QuickSettingType {
  name: string;
  description: string;
  status: boolean;
  quickSetting: string;
  open: string;
  close: string;
}
