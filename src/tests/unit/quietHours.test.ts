import { test, expect } from "vitest";
import { DateTime } from "luxon";
import QuietHours from "../../domain/QuietHours.ts";
import { TimeParseError } from "../../domain/Time.ts";

test('quiet hours value object', () => {
    const datetime = DateTime.fromISO('2026-01-10T12:00+03:00');

    const quietHours = new QuietHours({
        start: '23:00',
        end: '09:00',
        timezone: 'Europe/Moscow',
    });

    const interval = quietHours.getInterval(datetime);
    expect(interval).toBeInstanceOf(Array);
    expect(interval.length).toBe(2);
    expect(interval[0]).toBeInstanceOf(DateTime);
    expect(interval[1]).toBeInstanceOf(DateTime);
});

test('quet hours with wrong time will throw error', () => {
    const data = {
        start: '25:00',
        end: '09:00',
        timezone: 'Europe/Moscow',
    };

    expect(() => {
        new QuietHours({ ...data, start: '25:00' });
    }).toThrow(TimeParseError);

    expect(() => {
        new QuietHours({ ...data, end: '09:60' });
    }).toThrow(TimeParseError);

    expect(() => {
        new QuietHours({ ...data, start: '' });
    }).toThrow(TimeParseError);
});

test('quiet hours interval is correct when start time implied as previous day to end time', () => {
    const datetime = DateTime.fromISO('2026-01-10T12:00+03:00');

    const quietHours = new QuietHours({
        start: '23:00',
        end: '09:00',
        timezone: 'Europe/Moscow',
    });

    const [start, end] = quietHours.getInterval(datetime);
    expect(start < end).toBeTruthy();
    expect(start.day).toBe(10);
    expect(end.day).toBe(11);
});

test('quiet hours interval is correct when start and end time on the same day', () => {
    const datetime = DateTime.fromISO('2026-01-10T12:00+03:00');

    const quietHours = new QuietHours({
        start: '01:00',
        end: '09:00',
        timezone: 'Asia/Yekaterinburg',
    });

    const [start, end] = quietHours.getInterval(datetime);
    expect(start < end).toBeTruthy();
    expect(start.day).toBe(10);
    expect(end.day).toBe(10);
});

test('quiet hours can determine if datetime includes in its interval', () => {
    const times = {
        day: [
            DateTime.fromISO('2026-01-10T22:00+03:00'),
            DateTime.fromISO('2026-01-11T09:00+03:00'),
        ],
        night: [
            DateTime.fromISO('2026-01-10T23:00+03:00'),
            DateTime.fromISO('2026-01-11T08:00+03:00'),
        ],
    };

    const quietHours = new QuietHours({
        start: '23:00',
        end: '09:00',
        timezone: 'Europe/Moscow',
    });

    expect(quietHours.includes(times.night[0])).toBeTruthy();
    expect(quietHours.includes(times.night[1])).toBeTruthy();
    expect(quietHours.includes(times.day[0])).toBeFalsy();
    expect(quietHours.includes(times.day[1])).toBeFalsy();
});

test('quiet hours can work with different timezones', () => {
    const datetime = DateTime.fromISO('2026-01-10T08:00+03:00');
    const start = '23:00';
    const end = '09:00';
    const moscowTimezone = 'Europe/Moscow'; // +03:00
    const yekaterinburgTimezone = 'Asia/Yekaterinburg'; // +05:00
    let quietHours: QuietHours;

    quietHours = new QuietHours({ start, end, timezone: moscowTimezone });
    expect(quietHours.includes(datetime)).toBeTruthy();

    quietHours = new QuietHours({ start, end, timezone: yekaterinburgTimezone });
    expect(quietHours.includes(datetime)).toBeFalsy();
});
