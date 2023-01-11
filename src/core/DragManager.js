const DragManager = {
    draggableComponentName: undefined,
    draggingStyle: '',
    $dragstartComponent: undefined,
    $draggingComponent: undefined,
    dragstartInnerPos: {
        x: undefined,
        y: undefined
    },
    onDraggableCollapse: ($dragStart, $dragOver) => {},
    onDragFinished: () => {},

    setDraggableDatasetComponentName(componentName) {
        this.draggableComponentName = componentName;
    },
    setDraggableCollapsedListener(listener) {
        this.onDraggableCollapse = listener;
    },
    setDragFinishedListener(listener) {
        this.onDragFinished = listener;
    },

    __mousedownEventListener(ev) {
        const $target = findClosestComponent(ev.target, this.draggableComponentName);
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
            this.$draggingComponent.style.pointerEvents = 'none';
            document.body.appendChild(this.$draggingComponent);
            this.$dragstartComponent.classList.add('dragstart');
        }
        if (this.$draggingComponent) {
            this.$draggingComponent.style.left = `${ev.clientX - this.dragstartInnerPos.x}px`;
            this.$draggingComponent.style.top = `${ev.clientY - this.dragstartInnerPos.y}px`;

            const $collapsedComponentTarget = findClosestComponent(ev.target, this.draggableComponentName);
            if ($collapsedComponentTarget && this.onDraggableCollapse) {
                this.onDraggableCollapse(this.$dragstartComponent, $collapsedComponentTarget);
            }
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
            this.onDragFinished();
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

function findClosestComponent($child, componentName) {
    return $child.closest(`[data-component="${componentName}"]`);
}

export default DragManager;