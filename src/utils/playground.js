const myList = [56, 23,]
const allTasksTest = [
    {
      id: 1,
      name: 'coding',
      intervals: [{
        id: 11,
        date: 1550094364000,
        interval: 1435879
      }, {
        id: 22,
        date: 1550164936000,
        interval: 2681900
      }, {
        id: 33,
        date: 1550050698000,
        interval: 2159344
      }, {
        id: 44,
        date: 1550151202000,
        interval: 4898356
      }, {
        id: 55,
        date: 1549957161000,
        interval: 2037793
      }, {
        id: 13,
        date: 1550094364000,
        interval: 1435879
      },{
        id: 14,
        date: 1550094364000,
        interval: 1435879
      },{
        id: 15,
        date: 1550094364000,
        interval: 1435879
      },{
        id: 17,
        date: 1550094364000,
        interval: 1435879
      },]
    },
    {
      id: 2,
      name: 'reading',
      intervals: [{
        id: 11,
        date: 1550094364000,
        interval: 1435879
      }, {
        id: 22,
        date: 1550164936000,
        interval: 2681900
      }, {
        id: 33,
        date: 1550050698000,
        interval: 2159344
      }, {
        id: 44,
        date: 1550151202000,
        interval: 4898356
      }, {
        id: 55,
        date: 1549957161000,
        interval: 2037793
      }, {
        id: 34,
        date: 1550050698000,
        interval: 2159344
      }, {
        id: 35,
        date: 1550050698000,
        interval: 2159344
      }]
    },
    {
      id: 3,
      name: 'jogging',
      intervals: [{
        id: 22,
        date: 1550164936000,
        interval: 2681900
      }, {
        id: 33,
        date: 1550050698000,
        interval: 2159344
      }, {
        id: 44,
        date: 1550151202000,
        interval: 4898356
      }, {
        id: 55,
        date: 1549957161000,
        interval: 2037793
      }]
    },
    {
      id: 4,
      name: 'learning spanish',
      intervals:[{
        id: 11,
        date: 1550094364000,
        interval: 1435879
      }, {
        id: 22,
        date: 1550164936000,
        interval: 2681900
      }, {
        id: 33,
        date: 1550050698000,
        interval: 2159344
      }, {
        id: 44,
        date: 1550151202000,
        interval: 4898356
      }]
    },
    {
      id: 5,
      name: 'gym',
      intervals:[{
        id: 11,
        date: 1550094364000,
        interval: 1435879
      }, {
        id: 22,
        date: 1550164936000,
        interval: 2681900
      }, {
        id: 33,
        date: 1550050698000,
        interval: 2159344
      }, {
        id: 44,
        date: 1550151202000,
        interval: 4898356
      }, {
        id: 55,
        date: 1549957161000,
        interval: 2037793
      },{
        id: 56,
        date: 1549957161000,
        interval: 2037793
      }, {
        id: 57,
        date: 1549957161000,
        interval: 2037793
      }]
    }
  ]

const getIntervalSum = (task) => {
    let intervalArray = []
    for(let i=0;i<task.intervals.length;i++){
        intervalArray.push(task.intervals[i].interval)
    }
    return intervalArray.reduce(function(intervals, b) { return intervals + b; }, 0);
}
const getChartTaskList = (taskList, size) => {
    let chartTaskList = []

    for(i=0;i<taskList.length;i++){
        chartTaskList.push({
        id: taskList[i].id,
        name: taskList[i].name,
        timeSpent: getIntervalSum(taskList[i])
    })
}

    let sorted = chartTaskList.sort(function(a, b) {
    return b.timeSpent - a.timeSpent
    })

  let sized = []

  for(i=0;i<sorted.length;i++){
    sized.push(sorted[i])
    if(sized.length >= size){
      break;
    }
  }

  console.log(JSON.stringify(sized));
  
}

//getChartTaskList(allTasksTest, 2)

const mapTest = (array) => {
  return array.map((value, index) => ({
    value,
    svg: {
      fill: `fill ${index}`
    },
    key: `pie-${index}`
  }))
}

console.log(JSON.stringify(mapTest(myList)));

