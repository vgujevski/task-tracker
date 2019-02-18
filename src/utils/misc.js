import dateFns, { isSameDay, isSameWeek, isSameMonth } from 'date-fns'

const formatTimeSpent = (intervalArray) => {
    const sum = intervalArray.reduce(function(intervals, b) { return intervals + b; }, 0);
    const days = Math.floor(sum / (1000 * 60 * 60 * 24));
    const hours = Math.floor((sum - (1000 * 60 * 60 * 24 * days)) / (1000 * 60 * 60));
    const minutes = Math.floor((sum - (1000 * 60 * 60 * 24 * days) - (1000 * 60 * 60 * hours)) / (1000 * 60))
     
    return `${days} day${days % 10 == 1 ? "" : "s"}, ${hours} hour${hours % 10 == 1 ? "" : "s"}, ${minutes} minute${minutes % 10 == 1 ? "" : "s"}`;
}

export const getTimeSpentTotal = (intervals) => {
    let intervalArray = []
    for(let i=0;i<intervals.length;i++){
        intervalArray.push(intervals[i].interval)
    }
    const sum = intervalArray.reduce(function(intervals, b) { return intervals + b; }, 0);
    const days = Math.floor(sum / (1000 * 60 * 60 * 24));
    const hours = Math.floor((sum - (1000 * 60 * 60 * 24 * days)) / (1000 * 60 * 60));
    const minutes = Math.floor((sum - (1000 * 60 * 60 * 24 * days) - (1000 * 60 * 60 * hours)) / (1000 * 60))
     
    return formatTimeSpent(intervalArray)
}

export const getTimeSpentWeek = (intervals) => {
    let thisWeekIntervals = []

    for(let i=0;i<intervals.length;i++){
        if(isSameWeek(intervals[i].date, new Date())){
            thisWeekIntervals.push(intervals[i].interval)
        }
    }

    return formatTimeSpent(thisWeekIntervals)
}

export const getTimeSpentMonth = (intervals) => {
    let thisMonthIntervals = []

    for(let i=0;i<intervals.length;i++){
        if(isSameMonth(intervals[i].date, new Date())){
            thisWeekIntervals.push(intervals[i].interval)
        }
    }

    return formatTimeSpent(thisMonthIntervals)
}

export const getTimeSpentToday = (intervals) => {
    let thisDayIntervals = []

    for(let i=0;i<intervals.length;i++){
        if(isSameDay(intervals[i].date, new Date())){
            thisWeekIntervals.push(intervals[i].interval)
        }
    }

    return formatTimeSpent(thisDayIntervals)
}