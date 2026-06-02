import type { DateTime } from "luxon";
import Time from "./Time.ts";

export interface QuietHoursData {
    start: string;
    end: string;
    timezone: string;
};

export default class QuietHours {
    private start: Time;
    private end: Time;
    private timezone: string;

    public constructor(data: QuietHoursData) {
        this.start = new Time(data.start);
        this.end = new Time(data.end);
        this.timezone = data.timezone;
    }

    public get data(): QuietHoursData {
        return {
            start: this.start.getAsString(), 
            end: this.end.getAsString(),
            timezone: this.timezone,
        };
    }

    public includes(datetime: DateTime): boolean {
        const [start, end] = this.getInterval(datetime);
        return datetime >= start && datetime < end;
    }

    public getInterval(date: DateTime): [DateTime, DateTime] {
        const zonedDate = date.setZone(this.timezone);
        let start = zonedDate.set({ hour: this.start.hours, minute: this.start.minutes });
        let end = zonedDate.set({ hour: this.end.hours, minute: this.end.minutes });

        if (start > end) {
            if (zonedDate.hour < 12) {
                start = start.plus({ day: -1 });
            } else {
                end = end.plus({ day: 1 });
            }
        }

        return [start, end];
    }
}
