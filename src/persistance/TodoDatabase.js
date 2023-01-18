const getUser = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('user');
}
const BASE_URL = 'http://localhost:3000';
const TODO_URI = BASE_URL + '/todos';
const COLUMN_URI = BASE_URL + '/columns';
const NOTIFICATION_URI = BASE_URL + '/notifications'

/**
 * @typedef {{id: number|undefined, name: string|undefined, author: string|undefined, description: string|undefined, columnId: number|undefined, nextId: number|undefined}} TodoEntity
 * @typedef {{id: number|undefined, name: string|undefined, headTodoId: number|undefined}} ColumnEntity
 */

/**
 * @param {ColumnEntity} column
 * @returns {Promise<ColumnEntity[]>}
 */
const getColumns = async (column={}) => {
    const getColumnRes = await fetch(COLUMN_URI + getQueryString(column), {
        cache: "no-store"
    });
    return await getColumnRes.json();
}

/**
 * @param {ColumnEntity} column
 * @returns {Promise<ColumnEntity>}
 */
const postColumn = async (column) => {
    const newColumnRes = await fetch(COLUMN_URI, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ name: column.name, headTodoId: column.headTodoId })
    });
    return await newColumnRes.json();
}

/**
 * @param {ColumnEntity} column
 * @returns {Promise<ColumnEntity>}
 */
const patchColumn = async (column) => {
    const patchColumnRes = await fetch(`${COLUMN_URI}/${column.id}`, {
        method: 'PATCH',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(column)
    });
    return await patchColumnRes.json();
}

/**
 * @param {TodoEntity} todo
 * @returns {Promise<TodoEntity[]>}
 */
const getTodos = async (todo={}) => {
    const getTodosRes = await fetch(TODO_URI + getQueryString(todo), {
        cache: "no-store"
    });
    return await getTodosRes.json();
}

/**
 * @param {TodoEntity} todo
 * @returns {Promise<TodoEntity|false>}
 */
const postTodo = async (todo) => {
    const column = (await getColumns({ id: todo.columnId }))[0];
    if (!column) return false;
    todo.nextId = column.headTodoId;
    const newTodoRes = await fetch(TODO_URI, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ ...todo, author: getUser() })
    });
    const newTodo = await newTodoRes.json();
    await patchColumn({ id: column.id, headTodoId: newTodo.id });
    return newTodo;
};

/**
 * @param {TodoEntity} todo
 * @returns {Promise<TodoEntity>}
 */
const patchTodo = async (todo) => {
    const patchTodoRes = await fetch(`${TODO_URI}/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(todo)
    });
    return await patchTodoRes.json();
}

/**
 * @param {number} srcTodoId
 * @param {number} dstTodoId
 * @param {number} dstColumnId
 * @returns {Promise<TodoEntity|false>}
 */
const moveTodo = async (srcTodoId, dstTodoId, dstColumnId) => {
    let srcTodo = (await getTodos({ id: srcTodoId }))[0];
    if (!(srcTodo = await forceCloseTodo(srcTodo)))
        return false;
    const dstPrevTodoFound = (await getTodos({ columnId: dstColumnId, nextId: dstTodoId }))[0];
    if (dstPrevTodoFound) {
        await patchTodo({ id: dstPrevTodoFound.id, nextId: srcTodo.id });
    } else {
        await patchColumn({ id: dstColumnId, headTodoId: srcTodo.id });
    }
    return await patchTodo(
        { id: srcTodo.id, columnId: dstColumnId, nextId: dstTodoId });
}

/**
 * @param {TodoEntity} todo
 * @returns {Promise<TodoEntity>}
 */
const forceCloseTodo = async (todo) => {
    const prevTodoFound = (await getTodos({ columnId: todo.columnId, nextId: todo.id }))[0];
    if (prevTodoFound) {
        await patchTodo({ id: prevTodoFound.id, nextId: todo.nextId });
    } else {
        await patchColumn({ id: todo.columnId, headTodoId: todo.nextId });
    }
    return await patchTodo({ id: todo.id, columnId: 0, nextId: 0 });
}

/**
 * @param {NotificationEntity} notification
 * @returns {Promise<NotificationEntity[]>}
 */
const getNotifications = async (notification={}) => {
    const getNotificationsRes = await fetch(NOTIFICATION_URI + getQueryString(notification), {
        cache: "no-store"
    });
    return await getNotificationsRes.json();
};

/**
 * @param {NotificationEntity} notification
 * @returns {Promise<NotificationEntity>}
 */
const postNotification = async (notification) => {
    const newNotificationRes = await fetch(NOTIFICATION_URI, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ ...notification, author: getUser() })
    });
    return await newNotificationRes.json();
};

/**
 * @param {TodoEntity|ColumnEntity} data
 * @returns {string}
 */
const getQueryString = (data) => {
    if (data.id)
        return `?id=${data.id}`;
    return '?' + (data.columnId ? `&columnId=${data.columnId}` : '')
        + (data.nextId ? `&nextId=${data.nextId}` : '');
}

const TodoDatabase = {
    getColumns,
    postColumn,
    patchColumn,
    getTodos,
    postTodo,
    patchTodo,
    moveTodo,
    getNotifications,
    postNotification
}

export default TodoDatabase;