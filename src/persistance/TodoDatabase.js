const database = {
    notifications: [
        {
            author: 'randomlee',
            name: 'test name',
            from: 'test col1',
            to: 'test col2',
            action: '등록',
            timestamp: 1673169047861,
            id: 0
        }
    ],
    columns: [
        {
            name: "오늘 할 일",
            id: 0
        },
        {
            name: "내일 할 일",
            id: 1
        },
        {
            name: "모레 할 일",
            id: 2
        }
    ],
    todos: [
        {
            author: "randomlee",
            name: "인사하기",
            description: "안녕하세용!!!\n반갑습니다~~",
            columnId: 0,
            id: 0
        },
        {
            author: "randomlee",
            name: "밥먹기",
            description: "옴뇸뇸",
            columnId: 0,
            id: 1
        },
        {
            author: "randomlee",
            name: "잠자기",
            description: "쿨쿨쿨",
            columnId: 0,
            id: 2
        }
    ]
};

const getUser = () => {
    return `randomlee`;
}

const TodoDatabase = {
    notify(notification) {
        database.notifications.unshift(notification);
        this.notificationListener(notification);
    },
    notificationListener() {},
    setNotificationListener(callback) {
        this.notificationListener = callback;
    },
    findAllNotificationIds() {
        return [
            ...database.notifications.map(notification => notification.id)
        ];
    },
    findNotificationById(notificationId) {
        return {
            ...database.notifications.find(notification => notification.id === notificationId)
        };
    },
    findAllColumnIds() {
        return [
            ...database.columns.map(column => column.id)
        ];
    },
    findColumnById(columnId) {
        return {
            ...database.columns.find(column => column.id === columnId)
        };
    },
    updateColumnNameById(columnId, newName) {
        const column = database.columns.find(column => column.id === columnId);
        column.name = newName;
        return true;
    },
    addNewColumn() {
        const column = { name: "New Column", id: Date.now() };
        database.columns.push(column);
        return column;
    },
    deleteColumnById(columnId) {
        const idx = database.columns.findIndex(column => column.id === columnId);
        database.columns.splice(idx, 1);
        return true;
    },
    findTodoById(todoId) {
        return database.todos.find(todo => todo.id === todoId);
    },
    findTodoIdsByColumnId(columnId) {
        return database.todos.filter(todo => todo.columnId === columnId)
            .map(todo => todo.id);
    },
    addNewTodo(columnId, name, description) {
        const todo = {
            author: getUser(),
            name,
            description,
            columnId,
            id: Date.now()
        };
        database.todos.unshift(todo);
        const { name:columnName } = database.columns.find(column => column.id === columnId);
        const notification = {
            author: getUser(),
            name: name,
            from: '',
            to: columnName,
            action: '등록',
            timestamp: Date.now(),
            id: Date.now()
        };
        database.notifications.unshift(notification);
        this.notify(notification);
        return todo.id;
    },
    updateTodo({ id, name, description }) {
        const originTodo = database.todos.find(todo => todo.id === id);
        const originName = originTodo.name;
        originTodo.name = name;
        originTodo.description = description;
        const notification = {
            author: getUser(),
            name: '',
            from: originName,
            to: name,
            action: '수정',
            timestamp: Date.now(),
            id: Date.now()
        };
        this.notify(notification);
    },
    moveTodo(srcTodoId, dstTodoId, columnId=-1) {
        if (srcTodoId === dstTodoId)
            return;
        const srcIndex = database.todos.findIndex(({ id }) => id === srcTodoId);
        const srcTodo = database.todos.splice(srcIndex, 1)[0];
        const srcColumnName = this.findColumnById(srcTodo.columnId).name;
        if (dstTodoId < 0) {
            srcTodo.columnId = columnId;
            database.todos.push(srcTodo);
        } else {
            const dstIndex = database.todos.findIndex(({ id }) => id === dstTodoId);
            const dstTodo = database.todos[dstIndex];
            srcTodo.columnId = dstTodo.columnId;
            database.todos.splice(dstIndex, 0, srcTodo);
        }
        const dstColumnName = this.findColumnById(srcTodo.columnId).name;
        const notification = {
            author: getUser(),
            name: srcTodo.name,
            from: srcColumnName,
            to: dstColumnName,
            action: '이동',
            timestamp: Date.now(),
            id: Date.now()
        };
        this.notify(notification);
    }
}

export default TodoDatabase;