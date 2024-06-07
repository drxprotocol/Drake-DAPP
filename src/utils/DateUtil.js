import moment from 'moment';
import { getQueryValue } from './URLUtil';

// get current time(unit: second), and time travel if necessary.
export function myMoment(date) {
    let dateMoment = moment(date);

    // e.g http://localhost:9024/farm/421610/0x96056089B8BfC1c03e7AF8fE3dAc5843cda67219?timeTravel=14_days
    let timeTravel = getQueryValue('timeTravel');
    if (!timeTravel) {
        return dateMoment;
    }

    let targetTime = timeTravel.split('_');
    if (targetTime.length !== 2) {
        return dateMoment;
    }

    return dateMoment.add(targetTime[1], targetTime[0]);
}

export function defaultDateFormat(moment) {
    return moment.format('MMM DD, yyyy');
}

export function defaultTimeFormat(moment) {
    return moment.format('MMM DD, yyyy HH:mm:ss');
}

export function utcToLocalTime(date) {
    let utcOffset = date.utcOffset();
    let utc = moment(date.valueOf()).add(utcOffset, 'minutes');
    return utc;
}

export function utcToLocalTimestamp(date) {
    let utc = utcToLocalTime(date).unix();
    return utc;
}

export function toUTCTime(date) {
    let utcOffset = date.utcOffset();
    let utc = moment(date.valueOf()).subtract(utcOffset, 'minutes');
    return utc;
}

export function toUTCTimestamp(date) {
    let utc = toUTCTime(date).unix();
    return utc;
}

export function daysLeftFormat(endTimeSecond, _isShort, _overContent) {
    let isShort = _isShort === undefined ? true : _isShort;
    let overContent = _overContent || 'closed';

    let now = myMoment();
    let endTime = moment(endTimeSecond * 1000);

    const timeUnitFormat = (number, unit) => {
        return `${number} ${unit}${number > 1 ? `s` : ''}`;
    };

    let leftMSeconds = endTime.diff(now);
    if (leftMSeconds <= 0) {
        return {
            over: true,
            endTime: endTime,
            daysLeft: overContent,
            secondsLeft: 0,
        };
    } else {
        let leftDaysNumber = endTime.diff(myMoment(), 'days');

        let endDay = now.add(leftDaysNumber, 'days');
        let leftHours = endTime.diff(endDay, 'hours');

        endDay = endDay.add(leftHours, 'hours');
        let leftMinutes = endTime.diff(endDay, 'minutes');

        endDay = endDay.add(leftMinutes, 'minutes');
        let leftSeconds = endTime.diff(endDay, 'seconds');

        let daysLeft = '';
        let daysLeftShort = '';
        if (leftDaysNumber > 0) {
            daysLeft = isShort
                ? `${timeUnitFormat(Math.abs(leftDaysNumber), 'day')}`
                : `${timeUnitFormat(Math.abs(leftDaysNumber), 'day')} ${timeUnitFormat(Math.abs(leftHours), 'hour')}`;
            daysLeftShort = `${timeUnitFormat(Math.abs(leftDaysNumber), 'day')}`;
        } else if (leftHours > 0) {
            daysLeft = isShort
                ? `${timeUnitFormat(Math.abs(leftHours), 'hour')}`
                : `${timeUnitFormat(Math.abs(leftHours), 'hour')} ${timeUnitFormat(Math.abs(leftMinutes), 'minute')}`;
            daysLeftShort = `${timeUnitFormat(Math.abs(leftHours), 'hour')}`;
        } else if (leftMinutes > 0) {
            daysLeft = isShort
                ? `${timeUnitFormat(Math.abs(leftMinutes), 'minute')}`
                : `${timeUnitFormat(Math.abs(leftMinutes), 'minute')} ${timeUnitFormat(
                    Math.abs(leftSeconds),
                    'second',
                )}`;
            daysLeftShort = `${timeUnitFormat(Math.abs(leftMinutes), 'minute')}`;
        } else {
            daysLeft = `${leftSeconds} seconds`;
            daysLeftShort = `${leftSeconds} seconds`;
        }

        return {
            over: false,
            endTime: endTime,
            daysLeft: daysLeft,
            daysLeftShort: daysLeftShort,
            secondsLeft: leftMSeconds / 1000,
        };
    }
}
