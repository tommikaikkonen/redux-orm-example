import React, {Component} from 'react';
import {ForeignKey, ManyToMany, OneToOne} from 'redux-orm/lib/fields';
import {
    Book,
    Author,
    Publisher,
    Genre,
} from './models';
import Input from 'react-bootstrap/lib/Input';
import ButtonInput from 'react-bootstrap/lib/ButtonInput';
import isArray from 'lodash/lang/isArray';

const Types = React.PropTypes;

class ModelFormBase extends Component {
    constructor(props) {
        super(props);
        const Model = props.modelClass;
        const instance = props.instance;

        const state = {};
        if (instance) {
            Object.assign(state, instance._fields);
        }

        for (const fieldName in Model.fields) { // eslint-disable-line
            const field = Model.fields[fieldName];
            if (field instanceof ManyToMany) {
                if (instance) {
                    state[fieldName] = instance[fieldName].idArr.map(id => id.toString());
                } else {
                    state[fieldName] = [];
                }
            } else if (field instanceof ForeignKey || field instanceof OneToOne) {
                if (instance) {
                    const val = instance[fieldName];
                    if (val !== null) {
                        state[fieldName] = val.getId().toString();
                    } else {
                        state[fieldName] = null;
                    }
                } else {
                    state[fieldName] = null;
                }
            }
        }

        for (const fieldName in this.props.fields) { // eslint-disable-line
            if (!state.hasOwnProperty(fieldName)) {
                state[fieldName] = '';
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

    getModel(modelName) {
        return this.props.modelClass.session[modelName];
    }

    getFieldValue(key) {
        if (this.state.hasOwnProperty(key)) {
            return this.state[key];
        }
        return null;
    }

    getFieldData() {
        const submitProps = Object.assign({}, this.state);
        const intParser = id => parseInt(id, 10);
        for (const key in this.state) { // eslint-disable-line
            const val = this.state[key];
            if (isArray(val)) {
                submitProps[key] = val.map(intParser);
            }
        }
        return submitProps;
    }

    getOptionsForModelName(modelName) {
        const relatedModel = this.getModel(modelName);
        return relatedModel.all();
    }

    validate(data) {
        if (this.props.validate) {
            return this.props.validate(data);
        }
        return true;
    }

    render() {
        const modelClass = this.props.modelClass;
        const relatedFields = modelClass.fields;
        this.fieldComponents = {};

        const fieldEls = [];

        for (const key in relatedFields) { // eslint-disable-line
            const field = relatedFields[key];

            const optionsQs = this.getOptionsForModelName(field.toModelName);
            const options = optionsQs.map(modelInst => {
                const id = modelInst.getId();
                return <option value={id} key={id}>{modelInst.toString()}</option>;
            });

            const changeHandler = this.onChange.bind(this, key);
            let props;
            if (field instanceof ForeignKey || field instanceof OneToOne) {
                props = {
                    key: key,
                    type: 'select',
                    value: this.getFieldValue(key),
                    label: key,
                    onChange: changeHandler,
                    ref: (ref) => this.fieldComponents[key] = ref,
                };
                options.splice(0, 0, <option value={null} key={null}>No Option Chosen</option>);
            } else if (field instanceof ManyToMany) {
                props = {
                    key: key,
                    type: 'select',
                    value: this.getFieldValue(key),
                    label: key,
                    onChange: changeHandler,
                    multiple: true,
                    ref: (ref) => this.fieldComponents[key] = ref,
                };
            }

            fieldEls.push(
                <Input {...props}>
                    {options}
                </Input>
            );
        }

        for (const key in this.props.fields) { // eslint-disable-line
            const field = Object.assign({
                ref: (ref) => this.fieldComponents[key] = ref,
                label: key,
                value: this.getFieldValue(key),
                key: key,
                onChange: () => this.onChange(key),
            }, this.props.fields[key]);

            fieldEls.push(<Input {...field}/>);
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
    instance: Types.object,
    validate: Types.func,
};

ModelFormBase.defaultProps = {
    fields: {},
    onSubmit: () => undefined,
};

export class ModelForm extends Component {
    onSubmit(vals) {
        this.props.onSubmit(vals);
    }

    render() {
        const instance = this.props.instance;
        const modelClass = instance ? instance.getClass() : this.props.modelClass;
        const props = {
            modelClass,
            fields: this.props.fields,
            instance,
            onSubmit: this.onSubmit.bind(this),
            validate: this.props.validate,
        };
        const modelName = modelClass.modelName;
        const heading = instance ? 'Edit' : `Add a ${modelName}`;

        return (
            <div>
                <h2>{heading}</h2>
                <ModelFormBase {...props}/>
            </div>
        );
    }
}
ModelForm.propTypes = {
    onSubmit: Types.func,
    instance: Types.object,
    modelClass: Types.func,
    fields: Types.object.isRequired,
    validate: Types.func,
};

export class AuthorForm extends Component {
    validate(data) {
        if (data.name && data.name.length > 0) {
            return true;
        }
        return false;
    }

    render() {
        const props = Object.assign({
            fields: {
                name: {
                    type: 'text',
                },
            },
            validate: this.validate,
        }, this.props);
        return <ModelForm {...props}/>;
    }
}
AuthorForm.propTypes = {
    onSubmit: Types.func,
    instance: Types.object,
};
AuthorForm.defaultProps = {
    modelClass: Author,
};

export class GenreForm extends Component {
    validate(data) {
        if (data.name && data.name.length > 0) {
            return true;
        }
        return false;
    }

    render() {
        const props = Object.assign({
            fields: {
                name: {
                    type: 'text',
                },
            },
            validate: this.validate,
        }, this.props);
        return <ModelForm {...props}/>;
    }
}
GenreForm.propTypes = {
    onSubmit: Types.func,
    instance: Types.object,
};
GenreForm.defaultProps = {
    modelClass: Genre,
};

export class PublisherForm extends Component {
    validate(data) {
        if (data.name && data.name.length > 0) {
            return true;
        }
        return false;
    }

    render() {
        const props = Object.assign({
            fields: {
                name: {
                    type: 'text',
                },
            },
            validate: this.validate,
        }, this.props);
        return <ModelForm {...props}/>;
    }
}
PublisherForm.propTypes = {
    onSubmit: Types.func,
    instance: Types.object,
};
PublisherForm.defaultProps = {
    modelClass: Publisher,
};

export class BookForm extends Component {
    validate(data) {
        const hasName = data.name && data.name.length > 0;
        const hasPublisher = data.publisher !== null;
        const hasGenres = data.genres.length > 0;
        const hasAuthors = data.authors.length > 0;

        if (hasName && hasPublisher && hasGenres && hasAuthors) {
            return true;
        }
        return false;
    }

    render() {
        const props = Object.assign({
            fields: {
                name: {
                    type: 'text',
                },
            },
            validate: this.validate,
        }, this.props);
        return <ModelForm {...props}/>;
    }
}
BookForm.propTypes = {
    onSubmit: Types.func,
    instance: Types.object,
};
BookForm.defaultProps = {
    modelClass: Book,
};
