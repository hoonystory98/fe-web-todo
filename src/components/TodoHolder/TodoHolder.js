import Component from "../../core/Component.js";
import TodoDatabase from "../../persistance/TodoDatabase.js";
import TodoCard from "../TodoCard/TodoCard.js";
import DoubleClickInput from "../DoubleClickInput/DoubleClickInput.js";
import TodoAddForm from "../TodoAddForm/TodoAddForm.js";

class TodoHolder extends Component {
    initialize() {
        this.state = { todos: [] }
        this.addEvent('click', '.add-todo-btn', this.addBtnClicked.bind(this));

        const { todos, column } = this.props;
        this.setState({
            todos: TodoHolder.getTopologySorted(todos)
        });
    }

    template() {
        const { column } = this.props;
        const { todos } = this.state;
        return `
        <div class="todoholder-header">
            <div class="todoholder-colinfo">
                <div data-component="DoubleClickInput"></div>
                <div class="count-circle">
                    <h4>${todos.length}</h4>
                </div>
            </div>
            <div class="todoholder-headerbtn-wrapper">
                <button class="add-todo-btn">
                    <svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.105709 7.53033L0.105709 6.46967H6.46967V0.105713H7.53033V6.46967H13.8943V7.53033H7.53033V13.8943H6.46967V7.53033H0.105709Z"/>
                    </svg>
                </button>
                <button class="delete-column-btn">
                    <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 11.25L0.75 10.5L5.25 6L0.75 1.5L1.5 0.750004L6 5.25L10.5 0.750004L11.25 1.5L6.75 6L11.25 10.5L10.5 11.25L6 6.75L1.5 11.25Z"/>
                    </svg>
                </button>        
            </div>
        </div>
        <article class="todoholder-actual">
        <div data-component="TodoAddForm" hidden></div>
        ${todos.map(({ id }) => `
           <div data-component="TodoCard" data-todo-id="${id}" data-column-id="${column.id}"></div>
        `).join('')}
        <div data-component="TodoCard" data-todo-id="-1" data-column-id="${column.id}"></div>
        </article>
        `
    }

    mounted() {
        this.mountColumnNameInput();
        this.mountAddForm();
        this.mountTodoCards();
    }

    mountColumnNameInput() {
        const { column } = this.props;
        const $doubleClickInput = this.$target.querySelector('[data-component="DoubleClickInput"]');
        new DoubleClickInput($doubleClickInput, {
            value: column.name,
            placeholder: '칼럼 이름을 입력하세요',
            onValueChanged: this.updateColumnName.bind(this)
        });
    }

    mountTodoCards() {
        const { column } = this.props;
        const { todos } = this.state;
        const $actualHolder = this.$target.querySelector('.todoholder-actual');
        const $todoCards = this.$target.querySelectorAll(`[data-component="TodoCard"]`);
        $todoCards.forEach($todoCard => {
            const todoId = parseInt($todoCard.dataset.todoId);
            const todo = todos.find(todo => todo.id === todoId) || { id: -1, columnId: column.id };
            new TodoCard($todoCard, { todo, $actualHolder, onTodoMoved: this.updateMovedTodo.bind(this) });
        });
    }

    mountAddForm() {
        const $todoAddForm = this.$target.querySelector('[data-component="TodoAddForm"]');
        new TodoAddForm($todoAddForm, {
            addTodo: this.addTodo.bind(this),
            addCancel: this.addBtnClicked.bind(this)
        });
    }

    addBtnClicked() {
        const $addForm = this.$target.querySelector('[data-component="TodoAddForm"]');
        const checked = !$addForm.toggleAttribute('hidden');
        const $button = this.$target.querySelector('.add-todo-btn');
        $button.style.fill = checked ? '#0075DE' : '#010101';
    }

    addTodo(name, description) {
        const columnId = this.props.column.id;
        TodoDatabase.postTodo({ name, description, columnId }).then(todo => {
            const todos = [ todo, ...this.state.todos ];
            this.setState({ todos });
        });
    }

    updateColumnName(newName) {
        const { column } = this.props;
        TodoDatabase.patchColumn({...column, name: newName}).then(console.log);
    }

    updateMovedTodo(movedTodo) {
        const todos = [ ...this.state.todos ];
        const beforeMovedTodo = todos.find(todo => todo.id === movedTodo.id);
        if (beforeMovedTodo) {
            const beforeMovedIdx = todos.indexOf(beforeMovedTodo);
            todos.splice(beforeMovedIdx, 1);
        }

        const thisHolderColumnId = this.props.column.id;
        if (movedTodo.columnId === thisHolderColumnId) {
            const insertionIdx = todos.findIndex(todo => movedTodo.nextId === todo.id);
            if (insertionIdx < 0)
                todos.push(movedTodo);
            else
                todos.splice(insertionIdx, 0, movedTodo);
        }

        this.setState({ todos });
    }

    static getTopologySorted(todos) {
        let tail = -1;
        const newTodos = [];
        while (true) {
            const lastTodo = todos.find(todo => todo.nextId === tail);
            if (!lastTodo)
                break;
            newTodos.unshift(lastTodo);
            tail = lastTodo.id;
        }
        return newTodos;
    }
}

export default TodoHolder;