import Realm from 'realm';
import uuidv4 from 'uuid/v4';

const schemaVersion = 1;

const IntervalSchema = {
    name: 'Interval',
    primaryKey: 'id',
    properties: {
        id: 'string',
        date: 'date',
        interval: 'int',
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

const GoalSchema = {
    name: 'Goal',
    primaryKey: 'id',
    properties: {
        id: 'string',
        taskId: 'string',
        name: 'string',
        current: 'int',
        target: 'int',
        type: 'string',
        reminder: 'boolean',
    }
}

const addTask = (name) => {
    return new Promise((resolve, reject) => {
        const uuid = uuidv4();
        const intervals = [];
        Realm.open({schema: [TaskSchema, IntervalSchema], schemaVersion})
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
        Realm.open({schema: [TaskSchema, IntervalSchema], schemaVersion})
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
        Realm.open({schema: [TaskSchema, IntervalSchema], schemaVersion})
        .then(realm => {
            let tasks = realm.objects('Task');
            if(tasks[0]){
                resolve(tasks);
            }else{
                reject("no tasks found.");
            }
        }).catch(error => {
            reject(error)
        })
    })
}

const deleteTaskWithId = (id) => {
    return new Promise((resolve, reject) => {
        Realm.open({schema: [TaskSchema, IntervalSchema], schemaVersion})
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
                reject('task not found/')
            }
        }).catch(error => {
            reject(error)
        })
    }) 
}

const deleteAllTasks = () => {
    return new Promise((resolve, reject) => {
        Realm.open({schema: [TaskSchema, IntervalSchema], schemaVersion})
        .then(realm => {
            try{
                let tasks = realm.objects('Task');
                realm.delete(tasks);
                resolve('all tasks deleted');
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
        Realm.open({schema: [TaskSchema, IntervalSchema], schemaVersion})
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
        Realm.open({schema: [TaskSchema, IntervalSchema], schemaVersion})
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

const addGoal = (newGoal) => {
    // TODO complete
}

const getTaskGoals = (taskId) => {
    return new Promise((resolve, reject) => {
        Realm.open({schema: [GoalSchema], schemaVersion})
            .then(realm => {
                let allGoals = realm.objects('Goal')
                let taskGoals = allGoals.filtered(`taskId = "${taskId}"`)
                if(taskGoals[0]){
                    resolve(taskGoals)
                }else{
                    reject('no goals found for this task')
                }
            }).catch(error => {
                reject(error)
            })
    })
}

const getGoals = () => {
    return new Promise((resolve, reject) => {
        Realm.open({schema: [GoalSchema], schemaVersion})
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

const editGoal = (id, newGoal) => {
    // TODO complete
}

const deleteGoal = (id) => {
    // TODO complete
}

export {
    addTask,
    addTaskInterval,
    findTaskById,
    getTaskList,
    deleteTaskWithId,
    deleteAllTasks,
    editTaskName,
}

