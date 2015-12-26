import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import ModelForm from '../ModelForm';
import {Publisher} from './models';

const Types = React.PropTypes;

export const PublisherItem = props => {
    const {
        item: publisher,
        onEdit,
    } = props;
    const header = <strong>{publisher.name}</strong>;
    return (
        <li key={publisher.id}>
            <Panel header={header}>
                <dl>
                    <dt>Published Books</dt>
                    <dd>{publisher.books.map(book => book.name).join(', ')}</dd>
                    <dt>Published Authors</dt>
                    <dd>{publisher.authors.map(author => author.name).join(', ')}</dd>
                </dl>
                <PublisherForm id={publisher.id} initial={publisher} onSubmit={onEdit}/>
            </Panel>
        </li>
    );
};

PublisherItem.propTypes = {
    item: Types.object,
    onEdit: Types.func,
};

export const PublisherForm = props => {
    const passProps = Object.assign({
        fields: {
            name: {
                type: 'text',
            },
        },
    }, props);
    return <ModelForm {...passProps}/>;
};

PublisherForm.propTypes = {
    onSubmit: Types.func,
    initial: Types.object,
    modelClass: Types.func,
};

PublisherForm.defaultProps = {
    modelClass: Publisher,
};
