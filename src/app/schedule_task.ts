import { Calendar } from "primeng/calendar";

export interface Schedule{
    id?:string;
    schedule_name?:string ;
    schedule_type?: string;
    trigger?: string;
    crete_time?: string;
    modify_time?:string;
    status?:string;
}
export interface ScheduleTask {
    mode?:string;
    start_date?:Calendar;
    start_time?:Calendar;
    command?:string;
    parameters?:string;
}