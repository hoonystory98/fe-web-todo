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
        this.addEvent(DragManager.dragEventTypes.END, '*', this.onDragFinished.bind(this));
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
        DragManager.setDraggableDatasetComponentName('TodoCard');
        DragManager.initialize();
    }

    onDragFinished(ev) {
        const $dragStartTodoCard = ev.dragStartedElement;
        const $lastCollapsedTodoCard = ev.lastCollapsedElement;
        if (!$lastCollapsedTodoCard)
            return;
        const srcTodoId = parseInt($dragStartTodoCard.dataset.todoId);
        const dstTodoId = parseInt($lastCollapsedTodoCard.dataset.todoId);
        const dstColumnId = parseInt($lastCollapsedTodoCard.dataset.columnId);
        TodoDatabase.moveTodo(srcTodoId, dstTodoId, dstColumnId);
        this.render();
    }
}

export default App;