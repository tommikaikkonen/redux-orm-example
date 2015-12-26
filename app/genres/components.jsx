import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Panel from 'react-bootstrap/lib/Panel';
import ModelForm from '../ModelForm';
import {Genre} from './models';

const Types = React.PropTypes;

export const GenreItem = props => {
    const {
        item: genre,
        onEdit,
        onDelete,
    } = props;

    const header = <strong>{genre.name}</strong>;
    const footer = <Button bsStyle="danger" onClick={onDelete}>Delete</Button>;
    return (
        <li key={genre.id}>
            <Panel header={header} footer={footer}>
                <strong>Books in this genre:</strong><br/>
                {genre.books.map(book => book.name).join(', ')}
                <GenreForm initial={genre} onSubmit={onEdit}/>
            </Panel>
        </li>
    );
};

GenreItem.propTypes = {
    item: Types.object.isRequired,
    onEdit: Types.func,
    onDelete: Types.func,
};

export const GenreForm = props => {
    const passProps = Object.assign({
        fields: {
            name: {
                type: 'text',
            },
        },
    }, props);
    return <ModelForm {...passProps}/>;
};

GenreForm.propTypes = {
    modelClass: Types.func,
    onSubmit: Types.func,
    initial: Types.object,
};
GenreForm.defaultProps = {
    modelClass: Genre,
};
