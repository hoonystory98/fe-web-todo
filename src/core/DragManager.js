const DragManager = {
    draggableComponentName: undefined,
    draggingStyle: '',
    $dragstartComponent: undefined,
    $draggingComponent: undefined,
    dragstartInnerPos: {
        x: undefined,
        y: undefined
    },
    $lastCollapsedComponent: undefined,

    setDraggableDatasetComponentName(componentName) {
        this.draggableComponentName = componentName;
    },

    __mousedownEventListener(ev) {
        this.$lastCollapsedComponent = null;
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
            if ($collapsedComponentTarget) {
                if ($collapsedComponentTarget === this.$dragstartComponent)
                    return;
                this.$lastCollapsedComponent = $collapsedComponentTarget;
                $collapsedComponentTarget.dispatchEvent(new MyDragEvent(
                    DragManager.dragEventTypes.COLLAPSED,
                    this.$dragstartComponent,
                    $collapsedComponentTarget
                ));
            }
        }
    },

    __mouseupEventListener(ev) {
        const dragEvent = new MyDragEvent(
            DragManager.dragEventTypes.END,
            this.$dragstartComponent,
            this.$lastCollapsedComponent
        );
        ev.target.dispatchEvent(dragEvent);
        if (this.$dragstartComponent) {
            this.$dragstartComponent.dispatchEvent(dragEvent);
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

    BLOCK_DRAG_CLASS: 'block-drag',
    dragEventTypes: {
        COLLAPSED: 'mydragcollapsed',
        END: 'mydragend'
    }
};

class MyDragEvent extends CustomEvent {
    constructor(type, $start, $lastCollapsed) {
        super(type, { bubbles: true });
        this.dragStartedElement = $start;
        this.lastCollapsedElement = $lastCollapsed;
    }
}

const MOVEMENT_THRESHOLD = 5;

function vectorNorm({x, y}) {
    return Math.sqrt(x * x + y * y);
}

function findClosestComponent($child, componentName) {
    return $child.closest(`[data-component="${componentName}"]`);
}

export default DragManager;