import Component from "./core/Component.js";
import Header from "./components/Header/Header.js";
import AddColumnButton from "./components/AddColumnButton/AddColumnButton.js";
import TodoHolder from "./components/TodoHolder/TodoHolder.js";
import TodoDatabase from "./persistance/TodoDatabase.js";
import DragManager from "./core/DragManager.js";

class App extends Component {
    initialize() {
        this.initializeDragFeature();
        this.state = { columns: [] };
        TodoDatabase.getColumns().then(columns => {
            this.setState({ columns });
        });
    }

    template() {
        const { columns } = this.state;
        return `
<!--        <div data-component="Header"></div>-->
        <div data-component="AddColumnButton"></div>
        <div id="article">
        ${columns.map((_, idx) => `
            <div data-component="TodoHolder" data-index="${idx}"></div>
        `).join('')}
        </div>
        `;
    }

    mounted() {
        // const $header = this.$target.querySelector('[data-component="Header"]');
        // new Header($header);

        const $addColBtn = this.$target.querySelector('[data-component="AddColumnButton"]');
        new AddColumnButton($addColBtn, { addColumn: this.addColumn.bind(this) });

        const $todoHolders = this.$target.querySelectorAll('[data-component="TodoHolder"]');
        const { columns } = this.state;
        $todoHolders.forEach($todoHolder => {
            const idx = parseInt($todoHolder.dataset.index);
            const column = columns[idx];
            TodoDatabase.getTodos({ columnId: column.id }).then(todos => {
                new TodoHolder($todoHolder, { todos, column });
            });
        });
    }

    addColumn() {
        TodoDatabase.postColumn({ name: 'New Column' }).then(column => {
            const columns = [ ...this.state.columns, column ];
            this.setState({ columns });
        });
    }

    initializeDragFeature() {
        DragManager.setDraggableDatasetComponentName('TodoCard');
        DragManager.initialize();
    }
}

export default App;