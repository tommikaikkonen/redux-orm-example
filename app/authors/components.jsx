import React from 'react';
import Label from 'react-bootstrap/lib/Label';
import Panel from 'react-bootstrap/lib/Panel';
import Button from 'react-bootstrap/lib/Button';
import ModelForm from '../ModelForm';
import {Author} from './models';

const Types = React.PropTypes;

export const AuthorItem = props => {
    const {
        item: author,
        onEdit,
        onDelete,
    } = props;

    const header = <strong>{author.name}</strong>;

    const genres = author.genres.map(genre => {
        return (
            <span key={genre}>
                <Label bsStyle="primary">{genre}</Label>&nbsp;
            </span>);
    });
    const footer = <Button bsStyle="danger" onClick={onDelete}>Delete</Button>;
    return (
        <li key={author.id}>
            <Panel header={header} footer={footer}>
                <dl>
                    <dt>Genres Written In</dt>
                    <dd>{genres}</dd>
                </dl>
                <AuthorForm id={author.id} initial={author} onSubmit={onEdit}/>
            </Panel>
        </li>
    );
};

AuthorItem.propTypes = {
    item: Types.object,
    onEdit: Types.func,
    onDelete: Types.func,
};

export const AuthorForm = props => {
    const passProps = Object.assign({
        fields: {
            name: {
                type: 'text',
            },
        },
    }, props);
    return <ModelForm {...passProps}/>;
};

AuthorForm.propTypes = {
    onSubmit: Types.func,
    initial: Types.object,
};

AuthorForm.defaultProps = {
    modelClass: Author,
};
