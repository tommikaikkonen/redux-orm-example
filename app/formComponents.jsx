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
        if (props.instance) {
            const instance = props.instance;
            const state = Object.assign({}, instance._fields);

            const Model = props.modelClass;
            for (const fieldName in Model.fields) { // eslint-disable-line
                const field = Model.fields[fieldName];
                if (field instanceof ManyToMany) {
                    state[fieldName] = instance[fieldName].idArr.map(id => id.toString());
                } else if (field instanceof ForeignKey || field instanceof OneToOne) {
                    const val = instance[fieldName];
                    if (val !== null) {
                        state[fieldName] = val.getId().toString();
                    } else {
                        state[fieldName] = null;
                    }
                }
            }
            this.state = state;
        } else {
            this.state = {};
        }
    }

    onSubmit(event) {
        event.preventDefault();

        const submitProps = Object.assign({}, this.state);
        const intParser = id => parseInt(id, 10);
        for (const key in this.state) { // eslint-disable-line
            const val = this.state[key];
            if (isArray(val)) {
                submitProps[key] = val.map(intParser);
            }
        }

        this.props.onSubmit(submitProps);
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

    render() {
        const modelClass = this.props.modelClass;
        const relatedFields = modelClass.fields;
        this.fieldComponents = {};

        const fieldEls = [];

        for (const key in relatedFields) { // eslint-disable-line
            const field = relatedFields[key];

            const relatedModel = this.getModel(field.toModelName);
            const options = relatedModel.all().map(modelInst => {
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

        return (
            <form>
                {fieldEls}
                <ButtonInput type="submit" value="Save" onClick={onSubmit}/>
            </form>
        );
    }
}

ModelFormBase.propTypes = {
    modelClass: Types.func.isRequired,
    fields: Types.object,
    onSubmit: Types.func,
    instance: Types.object,
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
};

export class AuthorForm extends Component {
    render() {
        const props = Object.assign({
            fields: {
                name: {
                    type: 'text',
                },
            },
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
    render() {
        const props = Object.assign({
            fields: {
                name: {
                    type: 'text',
                },
            },
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
    render() {
        const props = Object.assign({
            fields: {
                name: {
                    type: 'text',
                },
            },
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
    render() {
        const props = Object.assign({
            fields: {
                name: {
                    type: 'text',
                },
            },
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
