import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Button from 'react-bootstrap/lib/Button';
import Label from 'react-bootstrap/lib/Label';
import {createStructuredSelector} from 'reselect';
import { connect } from 'react-redux';
import Component from 'react-pure-render/component';

import {
    BookForm,
    AuthorForm,
    PublisherForm,
    GenreForm,
} from './formComponents';

import {
    bookSelector,
    authorSelector,
    publisherSelector,
    genreSelector,
    bookChoices,
    authorChoices,
    publisherChoices,
    genreChoices,
} from './selectors';

const Types = React.PropTypes;

class ModelViewer extends Component {
    onEdit(vals) {
        this.props.onEdit(vals);
    }

    onDelete(id) {
        this.props.onDelete(id);
    }
}

ModelViewer.propTypes = {
    onEdit: Types.func,
    onDelete: Types.func,
};

class GenreViewer extends ModelViewer {
    render() {
        const genres = this.props.genres.map(genre => {
            const header = <strong>{genre.name}</strong>;

            const onEdit = this.onEdit.bind(this);
            const onDelete = this.onDelete.bind(this, genre.id);
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
        });
        return (
            <div>
                <ul className="list-unstyled">{genres}</ul>
            </div>
        );
    }
}

GenreViewer.propTypes = {
    genres: Types.arrayOf(Types.object).isRequired,
    onEdit: Types.func,
    onDelete: Types.func,
};

class PublisherViewer extends ModelViewer {
    render() {
        const publishers = this.props.publishers.map(publisher => {
            const header = <strong>{publisher.name}</strong>;
            const onEdit = this.onEdit.bind(this);

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
        });
        return <ul className="list-unstyled">{publishers}</ul>;
    }
}

PublisherViewer.propTypes = {
    publishers: Types.arrayOf(Types.object).isRequired,
};

class AuthorViewer extends ModelViewer {
    render() {
        const authors = this.props.authors.map(author => {
            const header = <strong>{author.name}</strong>;

            const genres = author.genres.map(genre => {
                return (
                    <span key={genre}>
                        <Label bsStyle="primary">{genre}</Label>&nbsp;
                    </span>);
            });
            const onEdit = this.onEdit.bind(this);
            const onDelete = this.onDelete.bind(this, author.id);
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
        });
        return (
            <div>
                <ul className="list-unstyled">{authors}</ul>
            </div>
        );
    }
}
AuthorViewer.propTypes = {
    authors: Types.arrayOf(Types.object).isRequired,
};

class BookViewer extends ModelViewer {
    render() {
        const books = this.props.books;
        const bookObjs = books.map(book => {
            const onDelete = this.onDelete.bind(this, book.id);
            const onEdit = this.onEdit.bind(this);
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
                authorChoices: this.props.authorChoices,
                publisherChoices: this.props.publisherChoices,
                genreChoices: this.props.genreChoices,
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
                </li>);
        });
        return (
            <div>
                <ul className="list-unstyled">
                    {bookObjs}
                </ul>
            </div>
        );
    }
}

BookViewer.propTypes = {
    books: Types.arrayOf(Types.object).isRequired,
    onEdit: Types.func,
    onDelete: Types.func,
};

class App extends Component {
    onSelectView(viewName) {
        this.props.dispatch({
            type: 'SELECT_VIEW',
            payload: viewName,
        });
    }

    renderSidebarNav() {
        const selectView = this.onSelectView.bind(this);
        const viewNames = ['Books', 'Authors', 'Publishers', 'Genres'];
        const viewItems = viewNames.map(name => {
            return (
                <NavItem eventKey={name} key={name}>
                    {name}
                </NavItem>
            );
        });
        return (
            <Nav bsStyle="pills" stacked onSelect={selectView} activeKey={this.props.view}>
                {viewItems}
            </Nav>
        );
    }

    renderBooks() {
        const onCreate = (pl) => {
            this.props.dispatch({
                type: 'CREATE_BOOK',
                payload: pl,
            });
        };

        const onEdit = (props) => {
            this.props.dispatch({
                type: 'UPDATE_BOOK',
                payload: props,
            });
        };
        const onDelete = (id) => {
            this.props.dispatch({
                type: 'REMOVE_BOOK',
                payload: id,
            });
        };

        return (
            <div>
                <BookForm
                    onSubmit={onCreate}
                    authorChoices={this.props.authorChoices}
                    publisherChoices={this.props.publisherChoices}
                    genreChoices={this.props.genreChoices}/>,
                <h2>List of Books</h2>
                <BookViewer
                    onDelete={onDelete}
                    onEdit={onEdit}
                    books={this.props.books}
                    authorChoices={this.props.authorChoices}
                    publisherChoices={this.props.publisherChoices}
                    genreChoices={this.props.genreChoices}/>
            </div>
        );
    }


    renderAuthors() {
        const onCreate = (pl) => {
            this.props.dispatch({
                type: 'CREATE_AUTHOR',
                payload: pl,
            });
        };

        const onDelete = id => {
            this.props.dispatch({
                type: 'REMOVE_AUTHOR',
                payload: id,
            });
        };
        const onEdit = (props) => {
            this.props.dispatch({
                type: 'UPDATE_AUTHOR',
                payload: props,
            });
        };

        return (
            <div>
                <AuthorForm onSubmit={onCreate}/>
                <AuthorViewer authors={this.props.authors} onDelete={onDelete} onEdit={onEdit}/>
            </div>
        );
    }

    renderPublishers() {
        const onCreate = (pl) => {
            this.props.dispatch({
                type: 'CREATE_PUBLISHER',
                payload: pl,
            });
        };

        const onDelete = id => {
            this.props.dispatch({
                type: 'REMOVE_PUBLISHER',
                payload: id,
            });
        };
        const onEdit = (props) => {
            this.props.dispatch({
                type: 'UPDATE_PUBLISHER',
                payload: props,
            });
        };
        return (
            <div>
                <PublisherForm onSubmit={onCreate}/>
                <PublisherViewer publishers={this.props.publishers} onDelete={onDelete} onEdit={onEdit}/>
            </div>
        );
    }

    renderGenres() {
        const onCreate = pl => {
            this.props.dispatch({
                type: 'CREATE_GENRE',
                payload: pl,
            });
        };

        const onDelete = id => {
            this.props.dispatch({
                type: 'REMOVE_GENRE',
                payload: id,
            });
        };
        const onEdit = props => {
            this.props.dispatch({
                type: 'UPDATE_GENRE',
                payload: props,
            });
        };
        return (
            <div>
                <GenreForm onSubmit={onCreate}/>
                <GenreViewer genres={this.props.genres} onDelete={onDelete} onEdit={onEdit}/>
            </div>
        );
    }

    render() {
        console.log('Incoming props on App render:');
        console.log(this.props);
        let subView;

        switch (this.props.view) {
        case 'Books':
            subView = this.renderBooks();
            break;
        case 'Authors':
            subView = this.renderAuthors();
            break;
        case 'Publishers':
            subView = this.renderPublishers();
            break;
        case 'Genres':
            subView = this.renderGenres();
            break;
        default:
            subView = <div/>;
        }
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h1>Book Database</h1>
                        <hr/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        {this.renderSidebarNav()}
                    </div>
                    <div className="col-md-9">
                        {subView}
                    </div>
                </div>
            </div>
        );
    }
}

App.propTypes = {
    books: Types.arrayOf(Types.object),
    bookChoices: Types.arrayOf(Types.object),
    authors: Types.arrayOf(Types.object),
    authorChoices: Types.arrayOf(Types.object),
    publishers: Types.arrayOf(Types.object),
    publisherChoices: Types.arrayOf(Types.object),
    genres: Types.arrayOf(Types.object),
    genreChoices: Types.arrayOf(Types.object),
    dispatch: React.PropTypes.func,
    view: React.PropTypes.string,
};

const modelsSelector = createStructuredSelector({
    books: bookSelector,
    authors: authorSelector,
    publishers: publisherSelector,
    genres: genreSelector,
    bookChoices,
    authorChoices,
    publisherChoices,
    genreChoices,
});

const appSelector = state => {
    const models = modelsSelector(state.orm);
    const view = state.view;
    return {
        ...models,
        view,
    };
};

export default connect(appSelector)(App);
