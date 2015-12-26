import React, {Component} from 'react';
import Input from 'react-bootstrap/lib/Input';
import ButtonInput from 'react-bootstrap/lib/ButtonInput';

const Types = React.PropTypes;

class ModelFormBase extends Component {
    constructor(props) {
        super(props);
        const state = {};

        state[this.props.modelClass.idAttribute] = this.props.id;
        const initial = props.initial;

        if (initial) {
            Object.assign(state, initial);
        }

        for (const fieldName in props.fields) { // eslint-disable-line
            const field = props.fields[fieldName];
            if (initial) {
                switch (field.type) {
                case 'many':
                    state[fieldName] = initial[fieldName].map(item => item.id);
                    break;
                case 'fk':
                    state[fieldName] = initial[fieldName].id;
                    break;
                default:
                    state[fieldName] = initial[fieldName];
                }
            } else {
                switch (field.type) {
                case 'many':
                    state[fieldName] = [];
                    break;
                case 'fk':
                    state[fieldName] = null;
                    break;
                case 'text':
                    state[fieldName] = '';
                    break;
                default:
                    null;
                }
            }
        }
        this.state = state;
    }

    onSubmit(event) {
        event.preventDefault();

        const submitProps = this.getFieldData();

        if (this.validate(submitProps)) {
            this.props.onSubmit(submitProps);
        }
    }

    onChange(field) {
        const el = this.fieldComponents[field];
        const value = el.getValue();
        this.setState({[field]: value});
    }

    getFieldValue(key) {
        if (this.state.hasOwnProperty(key)) {
            return this.state[key];
        }
        return null;
    }

    getFieldData() {
        const submitProps = {};
        const idAttr = this.props.modelClass.idAttribute;
        const intParser = id => parseInt(id, 10);
        for (const key in this.props.fields) { // eslint-disable-line
            const val = this.state[key];
            const field = this.props.fields[key];

            if (field.type === 'many') {
                submitProps[key] = val.map(intParser);
            } else if (field.type === 'fk') {
                submitProps[key] = intParser(val);
            } else {
                submitProps[key] = val;
            }
        }
        if (this.props.initial) {
            submitProps[idAttr] = this.state[idAttr];
        }
        return submitProps;
    }

    validate(data) {
        if (this.props.validate) {
            return this.props.validate(data);
        }
        return true;
    }

    render() {
        this.fieldComponents = {};

        const fieldEls = [];

        for (const key in this.props.fields) { // eslint-disable-line
            const field = this.props.fields[key];
            const fieldProps = {
                key,
                label: key,
                onChange: this.onChange.bind(this, key),
                ref: (ref) => this.fieldComponents[key] = ref,
                value: this.getFieldValue(key),
            };
            switch (field.type) {
            case 'many':
                Object.assign(fieldProps, {
                    type: 'select',
                    multiple: true,
                });
                break;
            case 'fk':
                Object.assign(fieldProps, {
                    type: 'select',
                });
                break;
            case 'text':
                Object.assign(fieldProps, {
                    type: 'text',
                });
                break;
            default:
                null;
            }

            if (field.choices) {
                fieldProps.children = field.choices.map(choice => {
                    return <option value={choice.id} key={choice.id}>{choice.name}</option>;
                });
            }

            fieldEls.push(<Input {...fieldProps}/>);
        }

        const onSubmit = this.onSubmit.bind(this);

        const submitDisabled = !this.validate(this.getFieldData());

        return (
            <form>
                {fieldEls}
                <ButtonInput type="submit" disabled={submitDisabled} value="Save" onClick={onSubmit}/>
            </form>
        );
    }
}

ModelFormBase.propTypes = {
    modelClass: Types.func.isRequired,
    fields: Types.object,
    onSubmit: Types.func,
    initial: Types.object,
    validate: Types.func,
    id: Types.any,
};

ModelFormBase.defaultProps = {
    fields: {},
    onSubmit: () => undefined,
};

const ModelForm = props => {
    const modelClass = props.modelClass;
    const passProps = {
        modelClass,
        fields: props.fields,
        initial: props.initial,
        onSubmit: props.onSubmit,
        validate: modelClass.validate.bind(modelClass),
    };
    const modelName = modelClass.modelName;
    const heading = props.initial ? 'Edit' : `Add a ${modelName}`;

    return (
        <div>
            <h2>{heading}</h2>
            <ModelFormBase {...passProps}/>
        </div>
    );
};

ModelForm.propTypes = {
    onSubmit: Types.func,
    initial: Types.object,
    modelClass: Types.func,
    fields: Types.object.isRequired,
};

export default ModelForm;
