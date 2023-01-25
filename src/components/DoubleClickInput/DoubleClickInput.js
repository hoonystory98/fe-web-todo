import Component from "../../core/Component.js";

class DoubleClickInput extends Component {
    initialize() {
        this.state = { value: this.props.value };
        this.addEvent('dblclick', 'input', this.startEdit.bind(this));
        this.addEvent('focusout', 'input', this.endEdit.bind(this));
        this.addEvent('keyup', 'input', this.onKeyPress.bind(this));
    }

    startEdit() {
        const $input = this.$target.querySelector('input');
        const endPos = $input.value.length;
        $input.removeAttribute('readonly');
        $input.setSelectionRange(endPos, endPos);
        $input.focus();
    }

    endEdit() {
        const { value } = this.state;
        const { onValueChanged } = this.props;
        const $input = this.$target.querySelector('input');
        $input.setAttribute('readonly', '');
        if ($input.value.length) {
            onValueChanged($input.value);
        } else {
            $input.value = value;
        }
        this.setState({ value: $input.value });
    }

    onKeyPress(e) {
        const $input = this.$target.querySelector('input');
        if (e.keyCode === 13) {
            $input.blur();
        }
        this.fitWidth();
    }

    template() {
        const { placeholder } = this.props;
        const { value } = this.state;
        return `
        <input type="text" class="double-click-input" value="${value}" placeholder="${placeholder}" onmousedown="return false;" readonly>
        `
    }

    fitWidth() {
        const $input = this.$target.querySelector('input');
        if (!$input.value.length) {
            $input.style.width = '155px';
            return;
        }
        $input.style.width = '0';
        $input.style.width = `${$input.scrollWidth + 10}px`;
    }

    mounted() {
        this.fitWidth();
    }
}

export default DoubleClickInput;