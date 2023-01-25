/**
 * @typedef {{id: number|undefined, type: string|undefined, name: string|undefined, from: string|undefined, to: string|undefined, author: string|undefined, timestamp: number|undefined}} NotificationEntity
 */

const NotificationManager = {
    notificationTargetComponentName: undefined,

    setNotificationTargetComponentName(componentName) {
        this.notificationTargetComponentName = componentName;
    },

    /**
     * @param {NotificationEntity} notification
     * @returns {NotificationEntity|undefined}
     */
    async makeNotification(notification) {
        const notificationTargetComponent =
            document.querySelector(`[data-component="${this.notificationTargetComponentName}"]`);
        if (!notificationTargetComponent)
            return;
        const timestamp = Date.now();
        const newNotification = { ...notification, timestamp };
        notificationTargetComponent.dispatchEvent(new NotificationEvent(newNotification));
        return newNotification;
    },

    initialize() {
    },

    get notificationTypes() {
        return {
            ADD: "add",
            MOVE: "move",
            UPDATE: "update",
            DELETE: "delete"
        }
    },

    get notificationEventType() {
        return 'mynotificationevent';
    }
};

class NotificationEvent extends CustomEvent {
    constructor(notification) {
        super(NotificationManager.notificationEventType, { bubbles: true });
        this.notification = notification;
    }
}

export default NotificationManager;