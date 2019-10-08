import Realm from 'realm';
import uuidv4 from 'uuid/v4';
import { isSameDay, isSameWeek, isSameMonth } from 'date-fns'

const schemaVersion = 3;

const IntervalSchema = {
    name: 'Interval',
    primaryKey: 'id',
    properties: {
        id: 'string',
        date: 'date',
        interval: 'int',
    }
}

const GoalSchema = {
    name: 'Goal',
    primaryKey: 'id',
    properties: {
        id: 'string',
        taskId: 'string',
        progress: 'int',
        target: 'int',
        type: 'string', // daily/weekly/monthly
        reminder: 'bool',
        lastReset: 'date',
    }
}

const TaskSchema = {
    name: 'Task',
    primaryKey: 'id',
    properties: {
        id: 'string',
        name: 'string',
        intervals: 'Interval[]',
    }
}

// Tasks

const addTask = (name) => {
    return new Promise((resolve, reject) => {
        const uuid = uuidv4();
        const intervals = [];
        Realm.open({schema: [TaskSchema, IntervalSchema, GoalSchema], schemaVersion})
        .then(realm => {
            try{
                realm.write(() => {
                    const task = realm.create('Task', {id: uuid, name, intervals});
                    resolve(uuid) // or task
                });
            } catch (e){
                reject(e);
            }
        }).catch(error => {
            reject(error)
        })
    })
}

const findTaskById = (id) => {
    return new Promise((resolve, reject) => {
        Realm.open({schema: [TaskSchema, IntervalSchema, GoalSchema], schemaVersion})
        .then(realm => {
            // get task
            let tasks = realm.objects('Task');
            let task = tasks.filtered(`id = "${id}"`);
            // check for empty object
            if(task[0]){
                resolve(task[0]);
            }else{
                reject("task not found");
            }
        }).catch(error => {
            reject(error)
        })
    })
}

const getTaskList = () => {
    return new Promise((resolve, reject) => {
        Realm.open({schema: [TaskSchema, IntervalSchema, GoalSchema], schemaVersion})
        .then(realm => {
            let tasks = realm.objects('Task');
            const emptyList = []
            if(tasks[0]){
                resolve(tasks);
            }else{
                resolve(emptyList)
            }
        }).catch(error => {
            reject(error)
        })
    })
}

const deleteTaskWithId = (id) => {
    return new Promise((resolve, reject) => {
        Realm.open({schema: [TaskSchema, IntervalSchema, GoalSchema], schemaVersion})
        .then(realm => {
            // get task
            let tasks = realm.objects('Task');
            let task = tasks.filtered(`id = "${id}"`);
            // check for empty object
            if(task[0]){
                try{
                    realm.write(() => {
                        realm.delete(task[0]);
                        resolve('task deleted');
                    })
                }catch(e){
                    reject(e)
                }
            }else{
                reject('task not found')
            }
        }).catch(error => {
            reject(error)
        })
    }) 
}

const deleteAllTasks = () => {
    return new Promise((resolve, reject) => {
        Realm.open({schema: [TaskSchema, IntervalSchema, GoalSchema], schemaVersion})
        .then(realm => {
            try{
                let tasks = realm.objects('Task');
                realm.write(() => {
                    realm.delete(tasks);
                    resolve('all tasks deleted');
                })
            }catch(e){
                reject(e);
            }
        }).catch(error => {
            reject(error)
        })
    })
}

const addTaskInterval = (id, interval) => {
    return new Promise((resolve, reject) => {
        Realm.open({schema: [TaskSchema, IntervalSchema, GoalSchema], schemaVersion})
        .then(realm => {
            const uuid = uuidv4();
            const date = new Date();
            // get task
            let tasks = realm.objects('Task');
            let task = tasks.filtered(`id = "${id}"`);
            if(task[0]){
                try{
                    realm.write(() => {
                        task[0].intervals.push({id: uuid, date, interval})
                        resolve(`interval added: ${interval}, date: ${date}`)
                    })
                }catch(e){
                    reject(e)
                }
            }else{
                reject('task not found')
            }
            
        }).catch(error => {
            reject(error)
        })
    })
}

const editTaskName = (id, name) => {
    return new Promise((resolve, reject) => {
        Realm.open({schema: [TaskSchema, IntervalSchema, GoalSchema], schemaVersion})
        .then(realm => {
            // get task
            let tasks = realm.objects('Task');
            let task = tasks.filtered(`id = "${id}"`);
            if(task[0]){
                try{
                    realm.write(() => {
                        task[0].name = name
                        resolve(`task name updated`)
                    })
                }catch(e){
                    reject(e)
                }
            }else{
                reject('task not found')
            }
            
        }).catch(error => {
            reject(error)
        })
    })
}

// Goals
const addGoal = (newGoal) => {
    // create validation for newGoal objects
    // * only 1 object of each type (daily, weekly, monthly) can be added
    // * maximum of 3 goals
    // * goal target should Not be 0
    return new Promise((resolve, reject) => {
        const uuid = uuidv4()
        const today = new Date()
        const goal = {
            id: uuid,
            taskId: newGoal.taskId,
            progress: 0,
            target: newGoal.target,
            type: newGoal.type,
            reminder: newGoal.reminder,
            lastReset: today,
        }
        Realm.open({schema: [TaskSchema, IntervalSchema, GoalSchema], schemaVersion})
        .then(realm => {
            try{
                realm.write(() => {
                    // if(goal.target == ''){
                    //     reject("couldn't add new goal, goal target can't be 0")
                    // }
                    // validate goal for dupelicate
                    const addedGoal = realm.create('Goal', goal)
                    resolve(uuid)
                })
            }catch(e){
                reject(e)
            }
        }).catch(error => {
            reject(error)
        })
    })
}

/**
 * @description get list of goals filtered by taskId
 * 
 * Every time list is pulled from database, a check will be performed.
 * 
 * Goals expire if the target amount is not met during selected period (type: daily/weekly/monthly)
 * If goal is expired, current progress will be set back to 0 and
 * LateReset will be updated with the current date.
 * 
 * @param {string} taskId
 * @returns {promise} list of goal objects, empty list if no goals match taskId
 */
const getTaskGoals = (taskId) => {
    return new Promise((resolve, reject) => {
        Realm.open({schema: [TaskSchema, IntervalSchema, GoalSchema], schemaVersion})
            .then(realm => {
                let allGoals = realm.objects('Goal')
                let taskGoals = allGoals.filtered(`taskId = "${taskId}"`)
                const emptyList = []
                
                if(taskGoals[0]){
                       // Perform a check for expired goals
                       // Reset progress and LastReset if needed 
                    taskGoals.forEach(goal => {
                       const today = new Date()
                        switch (goal.type) {
                            case 'daily':
                                if(!isSameDay(goal.lastReset, today)){
                                    try{
                                        realm.write(() => {
                                            //reset progress
                                            //set lastReset to today
                                            goal.progress = 0
                                            goal.lastReset = today
                                            //break;
                                        })
                                    }catch(e){
                                        console.log(e);
                                    }
                                }
                                break;
                            case 'weekly':
                                if(!isSameWeek(goal.lastReset, today)){
                                    try{
                                        realm.write(() => {
                                            //reset progress
                                            //set lastReset to today
                                            goal.progress = 0
                                            goal.lastReset = today
                                            //break;
                                        })
                                    }catch(e){
                                        console.log(e);
                                    }
                                }
                                break;
                            case 'monthly':
                                if(!isSameMonth(goal.lastReset, today)){
                                    try{
                                        realm.write(() => {
                                            //reset progress
                                            //set lastReset to today
                                            goal.progress = 0
                                            goal.lastReset = today
                                            //break;
                                        })
                                    }catch(e){
                                        console.log(e);
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                    });
                    resolve(taskGoals)
                }else{
                    resolve(emptyList)
                }
            }).catch(error => {
                reject(error)
            })
    })
}

/**
 * @description get list of all goals
 * 
 * @returns {promise} list of goal objects, empty list if no goals were found
 */
const getGoals = () => {
    return new Promise((resolve, reject) => {
        Realm.open({schema: [TaskSchema, IntervalSchema, GoalSchema], schemaVersion})
            .then(realm => {
                let allGoals = realm.objects('Goal')
                if(allGoals[0]){
                    resolve(allGoals)
                }else{
                    reject('no goals found')
                }
            }).catch(error => {
                reject(error)
            })     
    })
}


const addProgressToGoal = (id, progress) => {
    return new Promise((resolve, reject) => {
        Realm.open({schema: [TaskSchema, IntervalSchema, GoalSchema], schemaVersion})
        .then(realm => {
            const goals = realm.objects('Goal')
            const goal = goals.filtered(`id = "${id}"`)
            if(goal[0]){
                try{
                    realm.write(() => {
                        goal[0].progress = goal[0].progress + progress
                        resolve(progress)
                    })
                }catch(e){
                    reject(e)
                }
            }else{
                reject('goal was not found')
            }
        }).catch(error => {
            reject(error)
        })
    })
}

const addProgressToMultipleGoals = (ids, progress) => {
    return new Promise((resolve, reject) => {
        Realm.open({schema: [TaskSchema, IntervalSchema, GoalSchema], schemaVersion})
        .then(realm => {          
            if(ids[0]){
                // add progress to all IDs in the list
                try{
                    realm.write(() => {
                        
                    })
                }catch(e){
                    reject(e)
                }
            }else{
                reject('no goals to update.')
            }
        }).catch(error => {
            reject(error)
        })
    })
}

const deleteGoal = (id) => {
    return new Promise((resolve, reject) => {
        Realm.open({schema: [TaskSchema, IntervalSchema, GoalSchema], schemaVersion})
        .then(realm => {
            let goals = realm.objects('Goal')
            let goal = goals.filtered(`id = "${id}"`)
            if(goal[0]){
                try{
                    realm.write(() => {
                        realm.delete(goal[0])
                        resolve('goal deleted')
                    })
                }catch(e){
                    reject(e)
                }
            }else{
                reject('goal not found')
            }
        }).catch(error => {
            reject(error)
        })
    })
}

const deleteAllGoals = () => {
    return new Promise((resolve, reject) => {
        Realm.open({schema: [TaskSchema, IntervalSchema, GoalSchema], schemaVersion})
        .then(realm => {
            try{
                let goals = realm.objects('Goal')
                realm.write(() => {
                    realm.delete(goals)
                    resolve('all goals deleted')
                })
            }catch(e){

            }
        }).catch(error => {
            reject(error)
        })
    })
}

// checking task for already existing goals of same type
const validateNewGoalDupelicate = (taskId, newGoal) => {
    var isValid = true
    getTaskGoals(taskId).then(goalList => {
        goalList.forEach(goal => {
            if(goal.type === newGoal.type){
                isValid = false
            }
        });
    }).catch(error => {

    })

    return isValid
}

export {
    addTask,
    addTaskInterval,
    findTaskById,
    getTaskList,
    deleteTaskWithId,
    deleteAllTasks,
    editTaskName,
    addGoal,
    getTaskGoals,
    getGoals,
    addProgressToGoal,
    deleteGoal,
    deleteAllGoals,
}