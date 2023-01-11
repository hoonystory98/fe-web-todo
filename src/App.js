import Component from "./core/Component.js";
import Header from "./components/Header/Header.js";
import AddColumnButton from "./components/AddColumnButton/AddColumnButton.js";
import TodoHolder from "./components/TodoHolder/TodoHolder.js";
import TodoDatabase from "./persistance/TodoDatabase.js";
import DragManager from "./core/DragManager.js";

class App extends Component {
    initialize() {
        this.initializeDragFeature();
        this.state = {
            columnIds: TodoDatabase.findAllColumnIds()
        }
    }

    template() {
        const columnIds = [ ...this.state.columnIds ];
        return `
        <div data-component="Header"></div>
        <div data-component="AddColumnButton"></div>
        <div id="article">
        ${columnIds.map((_, idx) => `
            <div data-component="TodoHolder" data-index="${idx}"></div>
        `).join('')}
        </div>
        `;
    }

    mounted() {
        const $header = this.$target.querySelector('[data-component="Header"]');
        new Header($header);

        const $addColBtn = this.$target.querySelector('[data-component="AddColumnButton"]');
        const addColumn = this.addColumn.bind(this);
        new AddColumnButton($addColBtn, { addColumn });

        const $todoHolders = this.$target.querySelectorAll('[data-component="TodoHolder"]');
        const columnIds = [ ...this.state.columnIds ];
        $todoHolders.forEach($todoHolder => {
            const idx = parseInt($todoHolder.dataset.index);
            const columnId = columnIds[idx];
            new TodoHolder($todoHolder, { columnId });
        });
    }

    addColumn() {
        const newColumn = TodoDatabase.addNewColumn();
        const newColumnIds = [ ...this.state.columnIds ];
        newColumnIds.push(newColumn.id);
        this.setState({ columnIds: newColumnIds });
    }

    initializeDragFeature() {
        let startTodoId, endTodoId, endColumnId;
        DragManager.setDraggableDatasetComponentName('TodoCard');
        DragManager.setDraggableCollapsedListener(($start, $over) => {
            if ($start.dataset.todoId === $over.dataset.todoId) {
                return;
            }
            startTodoId = parseInt($start.dataset.todoId);
            endTodoId = parseInt($over.dataset.todoId);
            endColumnId = parseInt($over.dataset.columnId);
            this.updateTodoPosition($start, $over);
        });
        DragManager.setDragFinishedListener(() => {
            if (startTodoId === undefined || endTodoId === undefined)
                return;
            TodoDatabase.moveTodo(startTodoId, endTodoId, endColumnId);
            this.render();
        });
        DragManager.initialize();
    }

    updateTodoPosition($start, $over) {
        if ($start.dataset.todoId !== $over.dataset.todoId) {
            $over.parentElement.insertBefore($start, $over);
        }
    }
}

export default App;