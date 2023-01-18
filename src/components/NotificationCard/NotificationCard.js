import Component from "../../core/Component.js";
import NotificationManager from "../../core/NotificationManager.js";

class NotificationCard extends Component {
    initialize() {
        const { notification } = this.props;
        this.state = {
            timeDeltaMin: NotificationCard.calcDeltaMin(notification),
        }
        this.refreshAuto();
    }

    refreshAuto() {
        const isConnected = this.$target.isConnected;
        const { notification } = this.props;
        if (isConnected) {
            setTimeout(() => {
                this.setState({ timeDeltaMin:
                        NotificationCard.calcDeltaMin(notification) });
                this.refreshAuto();
            }, 60000);
        }
    }

    static calcDeltaMin(notification) {
        return Math.floor((Date.now() - notification.timestamp) / 60000);
    }

    template() {
        const { timeDeltaMin } = this.state ;
        const { notification } = this.props;
        const spanInner = this.getSpanInnerText();
        return `
        <div>🥳</div>
        <div>
            <h4>@${notification.author}</h4>
            <span>${spanInner}</span>
            <p>${timeDeltaMin}분 전</p>
        </div>
        `;
    }

    getSpanInnerText() {
        const notificationTypes = NotificationManager.notificationTypes;
        const { notification } = this.props;
        let spanInner;
        switch (notification.type) {
            case notificationTypes.ADD:
                spanInner = `<b>${notification.to}</b>에 <b>${notification.name}</b>을 등록하였습니다.`
                break;
            case notificationTypes.DELETE:
                spanInner = `<b>${notification.from}</b>에서 <b>${notification.name}</b>을 삭제하였습니다.`
                break;
            case notificationTypes.MOVE:
                spanInner = `<b>${notification.name}</b>을 <b>${notification.from}</b>에서 <b>${notification.to}</b>으로 이동하였습니다.`
                break;
            case notificationTypes.UPDATE:
                spanInner = `<b>${notification.from}</b>를 <b>${notification.to}</b>으로 수정하였습니다.`
                break;
        }
        return spanInner;
    }
}

export default NotificationCard;