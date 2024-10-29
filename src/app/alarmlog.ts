export interface Alarmstatistices {
  alarm_count?: Alarmcount;
  alarm_list?: Alarmlist[];
}
export interface portlink24 {
  alarm_count?:number;
  symbol_name1?:string;
}
export interface portlink {
  alarm_count?:number,
  strDeviceName?:string,
  strLocation?: string,
  strName?:string,
  strDesc?:string
};
export interface Alarmlist {
  iRCAlarmLogID: number;
  iLevel: number;
  strUptime: string;
  strIPAddress: string;
  strName: string;
  strDeviceName: string;
  iRCNETypeID: string;
  iRCNetNodeID: number;
}

export interface Alarmcount {
  total_alarm?: number;
  critical_alarm?: number;
  major_alarm?: number;
  minor_alarm?: number;
  warning_alarm?: number;
  unknown_alarm?: number;
}

export interface AlarmMarker {
  index: number;
  iRCAlarmLogID: number;
  iRCNetNodeID: number;
  iRCAlarmID: number;
  iRCNETypeID: string;
  iLevel: number;
  strUptime: string;
  strDeviceName: string;
  strIPAddress: string;
  strLocation: string;
  strName: string;
  SYMBOL_ID: number;
  latitude: number;
  longitude: number;
  icon_path: string;
}