export class TimeParseError extends Error {};

export function parseTime(time: string): [number, number, string] {
    const matches = /^(\d\d):(\d\d)/.exec(time);

    if (!matches) {
        throw new TimeParseError('Неверный формат времени');
    }

    const parsedTime = matches[0];
    const hours = Number(matches[1]);
    const minutes = Number(matches[2]);

    if (hours > 23 || minutes > 59) {
        throw new TimeParseError('Неверный формат времени');
    }

    return [hours, minutes, parsedTime];
}

export default class Time {
    public hours: number;
    public minutes: number;

    private time: string;

    constructor(time: string) {
        const [hours, minutes, value] = parseTime(time);
        this.time = value;
        this.hours = hours;
        this.minutes = minutes;
    }

    public valueOf(): number {
        return this.minutesFromDayStart();
    }

    public minutesFromDayStart(): number {
        return this.hours * 60 + this.minutes;
    }

    public getAsString(): string {
        return this.time;
    }
}
