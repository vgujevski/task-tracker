import Realm from 'realm';
import uuidv4 from 'uuid/v4';

const schemaVersion = 1;

const IntervalSchema = {
    name: 'Interval',
    primaryKey: 'id',
    properties: {
        id: 'string',
        date: 'date',
        interval: 'long',
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

const addTask = (name) => {
    return new Promise((resolve, reject) => {
        const uuid = uuidv4();
        const intervals = [];
        Realm.open({schema: [TaskSchema, IntervalSchema], schemaVersion})
        .then(realm => {
            try{
                realm.write(() => {
                    const task = realm.create('Task', {uuid, name, intervals});
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
        const uuid = uuidv4();
        const intervals = [];
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
                    realm.delete(task[0]);
                    resolve('task deleted');
                }catch(e){
                    reject(e);
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
                        task[0].intervals.push({uuid, date, interval})
                        resolve(`interval added: ${interval}`)
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

export {
    addTask,
    addTaskInterval,
    findTaskById,
    getTaskList,
    deleteTaskWithId,
    deleteAllTasks,
}

