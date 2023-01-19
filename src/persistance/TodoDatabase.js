const getUser = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('user');
}
const BASE_URL = 'http://localhost:3000';
const TODO_URI = BASE_URL + '/todos';
const COLUMN_URI = BASE_URL + '/columns';
const NOTIFICATION_URI = BASE_URL + '/notifications'

/**
 * @typedef {{id: number|undefined, name: string|undefined, author: string|undefined, description: string|undefined}} TodoEntity
 * @typedef {{id: number|undefined, name: string|undefined, todoIds: number[]|undefined}} ColumnEntity
 */

/**
 * @param {ColumnEntity} column
 * @returns {Promise<ColumnEntity[]>}
 */
const getColumns = async (column={}) => {
    const getColumnRes = await fetch(COLUMN_URI + getQueryString(column),
        { cache: "no-store" });
    const columns = await getColumnRes.json();
    columns.forEach((col, idx) => {
        columns[idx] = {...col, todoIds: JSON.parse(col.todoIds)};
    });
    return columns;
}

/**
 * @param {ColumnEntity} column
 * @returns {Promise<ColumnEntity>}
 */
const postColumn = async (column) => {
    const newColumnRes = await fetch(COLUMN_URI, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ name: column.name, todoIds: "[]" })
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
        body: JSON.stringify({ ...column, todoIds: JSON.stringify(column.todoIds)})
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
    const newTodoRes = await fetch(TODO_URI, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ ...todo, author: getUser() })
    });
    return await newTodoRes.json();
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
 * @param {NotificationEntity} notification
 * @returns {Promise<NotificationEntity[]>}
 */
const getNotifications = async (notification={}) => {
    const getNotificationsRes = await fetch(NOTIFICATION_URI + getQueryString(notification),
        { cache: "no-store" });
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
    return '?' + (data.author ? `&author=${data.author}` : '');
}

const TodoDatabase = {
    getColumns,
    postColumn,
    patchColumn,
    getTodos,
    postTodo,
    patchTodo,
    getNotifications,
    postNotification
}

export default TodoDatabase;