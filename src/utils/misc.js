import dateFns, { isSameDay, isSameWeek, isSameMonth, isSameYear } from 'date-fns'

const formatTimeSpent = (intervalArray) => {
    const sum = intervalArray.reduce(function(intervals, b) { return intervals + b; }, 0);
    const days = Math.floor(sum / (1000 * 60 * 60 * 24));
    const hours = Math.floor((sum - (1000 * 60 * 60 * 24 * days)) / (1000 * 60 * 60));
    const minutes = Math.floor((sum - (1000 * 60 * 60 * 24 * days) - (1000 * 60 * 60 * hours)) / (1000 * 60))

    let daysString = ''
    let hoursString = ''
    let minutesString = ''
    if(days != 0){
        daysString = `${days} day${days % 10 == 1 ? "" : "s"},`
    }
    if(hours != 0){
        hoursString = `${hours} hour${hours % 10 == 1 ? "" : "s"},`
    }
    if(minutes != 0){
        minutesString = `${minutes} minute${minutes % 10 == 1 ? "" : "s"}`
    }
     
    return `${daysString} ${hoursString} ${minutesString}`;
}

export const getTimeSpentTotal = (intervals) => {
    let intervalArray = []
    for(let i=0;i<intervals.length;i++){
        intervalArray.push(intervals[i].interval)
    }

    return formatTimeSpent(intervalArray)
}

export const getTimeSpentWeek = (intervals) => {
    let thisWeekIntervals = []

    for(let i=0;i<intervals.length;i++){
        const current = new Date()
        const same = isSameWeek(intervals[i].date, current)
        if(same){
            thisWeekIntervals.push(intervals[i].interval)
        }
    }

    return formatTimeSpent(thisWeekIntervals)
}

export const getTimeSpentMonth = (intervals) => {
    let thisMonthIntervals = []

    for(let i=0;i<intervals.length;i++){
        const current = new Date()
        const same = isSameMonth(intervals[i].date, current)
        if(same){
            thisMonthIntervals.push(intervals[i].interval)
        }
    }

    return formatTimeSpent(thisMonthIntervals)
}

export const getTimeSpentToday = (intervals) => {
    let thisDayIntervals = []

    for(let i=0;i<intervals.length;i++){
        const current = new Date()
        const same = isSameDay(intervals[i].date, current)
        if(same){
            thisDayIntervals.push(intervals[i].interval)
        }
    }
    return formatTimeSpent(thisDayIntervals)
}

export const testFunction = (date) => {
    let today = false
    let thisWeek = false
    let thisMonth = false
    let year = false

    if(isSameDay(parseInt(date), new Date())){
        today = true
    }
    if(isSameWeek(parseInt(date), new Date())){
        thisWeek = true
    }
    if(isSameMonth(parseInt(date), new Date())){
        thisMonth = true
    }
    if(isSameYear(parseInt(date), new Date())){
        year = true
    }

    return `today: ${today}, week ${thisWeek}, month ${thisMonth}, year ${year}`
}

/**
 * takes Task as parameter
 * 
 * return sum of all intervals
 */
export const getIntervalSum = (task) => {
    let intervalArray = []
    for(let i=0;i<task.intervals.length;i++){
        intervalArray.push(task.intervals[i].interval)
    }
    return intervalArray.reduce(function(intervals, b) { return intervals + b; }, 0);
}





