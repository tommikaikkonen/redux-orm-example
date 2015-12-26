import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Panel from 'react-bootstrap/lib/Panel';
import Label from 'react-bootstrap/lib/Label';
import ModelForm from '../ModelForm';
import {Book} from './models';

const Types = React.PropTypes;

export const BookItem = props => {
    const {
        item: book,
        onDelete,
        onEdit,
    } = props;

    const genres = book.genres.map(genre => {
        return (
            <span key={genre.name}>
                <Label bsStyle="primary">
                    {genre.name}
                </Label>
                &nbsp;
            </span>
        );
    });
    const header = <strong>{book.name}</strong>;
    const footer = (
        <div>
            <Button bsStyle="danger" onClick={onDelete}>Delete</Button>
        </div>
    );
    const formProps = {
        initial: book,
        onSubmit: onEdit,
        authorChoices: props.authorChoices,
        publisherChoices: props.publisherChoices,
        genreChoices: props.genreChoices,
    };

    return (
        <li key={book.id}>
            <Panel header={header} footer={footer}>
                <dl>
                    <dt>Published by</dt>
                    <dd>{book.publisher.name}</dd>
                    <dt>Genres</dt>
                    <dd>{genres}</dd>
                    <dt>Authors</dt>
                    <dd>{book.authors.map(author => author.name).join(', ')}</dd>
                </dl>
                <BookForm {...formProps}/>
            </Panel>
        </li>
    );
};

BookItem.propTypes = {
    item: Types.object,
    onEdit: Types.func,
    onDelete: Types.func,
    authorChoices: Types.arrayOf(Types.object).isRequired,
    publisherChoices: Types.arrayOf(Types.object).isRequired,
    genreChoices: Types.arrayOf(Types.object).isRequired,
};

export const BookForm = props => {
    const passProps = Object.assign({
        fields: {
            name: {
                type: 'text',
            },
            authors: {
                type: 'many',
                choices: props.authorChoices,
            },
            publisher: {
                type: 'fk',
                choices: props.publisherChoices,
            },
            genres: {
                type: 'many',
                choices: props.genreChoices,
            },
        },
    }, props);
    return <ModelForm {...passProps}/>;
};

BookForm.propTypes = {
    onSubmit: Types.func,
    initial: Types.object,
    authorChoices: Types.arrayOf(Types.object),
    publisherChoices: Types.arrayOf(Types.object),
    genreChoices: Types.arrayOf(Types.object),
};

BookForm.defaultProps = {
    modelClass: Book,
};
