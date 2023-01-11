const DragManager = {
    draggableComponentName: undefined,
    draggableIdentifierName: undefined,
    draggingStyle: '',
    $dragstartComponent: undefined,
    $draggingComponent: undefined,
    dragstartInnerPos: {
        x: undefined,
        y: undefined
    },
    onDraggableCollapse: ($dragStart, $dragOver) => {},
    setDraggableDatasetComponentName(componentName) {
        this.draggableComponentName = componentName;
    },
    setDraggableDatasetIdentifierName(identifierName) {
        this.draggableIdentifierName = identifierName;
    },

    __mousedownEventListener(ev) {
        const $target = ev.target.closest(`[data-component="${this.draggableComponentName}"]`);
        if (!$target || $target.classList.contains(this.BLOCK_DRAG_CLASS))
            return;
        this.$dragstartComponent = $target;
        this.dragstartInnerPos = {
            x: ev.clientX - $target.offsetLeft,
            y: ev.clientY - $target.offsetTop
        };
    },

    __mousemoveEventListener(ev) {
        if (!this.$dragstartComponent)
            return;
        const { movementX, movementY } = ev;
        if (!this.$draggingComponent &&
            vectorNorm({ x: movementX, y: movementY }) > MOVEMENT_THRESHOLD) {
            this.$draggingComponent = document.createElement('dragging');
            this.$draggingComponent.innerHTML = this.$dragstartComponent.outerHTML;
            this.$draggingComponent.style.position = 'absolute';
            this.$draggingComponent.style.zIndex = '999';
            document.body.appendChild(this.$draggingComponent);
            this.$dragstartComponent.classList.add('dragstart');
        }
        if (this.$draggingComponent) {
            this.$draggingComponent.style.left = `${ev.clientX - this.dragstartInnerPos.x}px`;
            this.$draggingComponent.style.top = `${ev.clientY - this.dragstartInnerPos.y}px`;
        }
    },

    __mouseupEventListener(ev) {
        if (this.$dragstartComponent) {
            this.$dragstartComponent.classList.remove('dragstart');
            this.$dragstartComponent = null;
        }
        if (this.$draggingComponent) {
            this.$draggingComponent.remove();
            this.$draggingComponent = null;
        }
    },

    initialize() {
        document.addEventListener('mousedown', DragManager.__mousedownEventListener.bind(this));
        document.addEventListener('mousemove', DragManager.__mousemoveEventListener.bind(this));
        document.addEventListener('mouseup', DragManager.__mouseupEventListener.bind(this));
    },
    BLOCK_DRAG_CLASS: 'blockDrag'
};

const MOVEMENT_THRESHOLD = 5;

function vectorNorm({x, y}) {
    return Math.sqrt(x * x + y * y);
}

export default DragManager;