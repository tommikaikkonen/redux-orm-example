import React, {Component} from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Button from 'react-bootstrap/lib/Button';
import Label from 'react-bootstrap/lib/Label';
import { connect } from 'react-redux';
import schema from './schema';
import {
    BookForm,
    AuthorForm,
    PublisherForm,
    GenreForm,
} from './formComponents';

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

            const books = genre.bookSet.plain.map(book => book.name);
            const onEdit = this.onEdit.bind(this);
            const onDelete = this.onDelete.bind(this, genre.id);
            const footer = <Button bsStyle="danger" onClick={onDelete}>Delete</Button>;
            return (
                <li key={genre.getId()}>
                    <Panel header={header} footer={footer}>
                        <strong>Books in this genre:</strong><br/>
                        {books.join(', ')}
                        <GenreForm instance={genre} onSubmit={onEdit}/>
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
    genres: React.PropTypes.arrayOf(React.PropTypes.object),
    onEdit: Types.func,
    onDelete: Types.func,
};

class PublisherViewer extends ModelViewer {
    render() {
        const publishers = this.props.publishers.map(publisher => {
            const header = <strong>{publisher.name}</strong>;

            const books = publisher.bookSet.plain.map(book => book.name);
            const authors = publisher.authors.plain.map(author => author.name);
            const onEdit = this.onEdit.bind(this);
            return (
                <li key={publisher.getId()}>
                    <Panel header={header}>
                        <dl>
                            <dt>Published Books</dt>
                            <dd>{books.join(', ')}</dd>
                            <dt>Published Authors</dt>
                            <dd>{authors.join(', ')}</dd>
                        </dl>
                        <PublisherForm instance={publisher} onSubmit={onEdit}/>
                    </Panel>
                </li>
            );
        });
        return <ul className="list-unstyled">{publishers}</ul>;
    }
}

PublisherViewer.propTypes = {
    publishers: React.PropTypes.arrayOf(React.PropTypes.object),
};

class AuthorViewer extends ModelViewer {
    render() {
        const authors = this.props.authors.map(author => {
            const header = <strong>{author.name}</strong>;

            const genres = author.writesGenres().map(genreName => {
                return <span key={genreName}><Label bsStyle="primary">{genreName}</Label>&nbsp;</span>;
            });
            const onEdit = this.onEdit.bind(this);
            const onDelete = this.onDelete.bind(this, author.id);
            const footer = <Button bsStyle="danger" onClick={onDelete}>Delete</Button>;
            return (
                <li key={author.getId()}>
                    <Panel header={header} footer={footer}>
                        <dl>
                            <dt>Genres Written In</dt>
                            <dd>{genres}</dd>
                        </dl>
                        <AuthorForm instance={author} onSubmit={onEdit}/>
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
    authors: React.PropTypes.arrayOf(React.PropTypes.object),
};

class BookViewer extends ModelViewer {
    render() {
        const books = this.props.children;
        const bookObjs = books.map(book => {
            const onDelete = this.onDelete.bind(this, book.id);
            const onEdit = this.onEdit.bind(this);
            const authors = book.authors.plain.map(author => author.name);
            const genres = book.genres.plain.map(genre => {
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
            return (
                <li key={book.getId()}>
                    <Panel header={header} footer={footer}>
                        <dl>
                            <dt>Published by</dt>
                            <dd>{book.publisher.name}</dd>
                            <dt>Genres</dt>
                            <dd>{genres}</dd>
                            <dt>Authors</dt>
                            <dd>{authors.join(', ')}</dd>
                        </dl>
                        <BookForm instance={book} onSubmit={onEdit}/>
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
    children: React.PropTypes.arrayOf(React.PropTypes.object),
    onEdit: React.PropTypes.func,
    onDelete: React.PropTypes.func,
};

class App extends Component {
    onSelectView(viewName) {
        this.props.dispatch({
            type: 'SELECT_VIEW',
            payload: viewName,
        });
    }

    get orm() {
        return schema.from(this.props.orm);
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
        const books = this.orm.Book.all();

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
                <BookForm onSubmit={onCreate}/>,
                <h2>List of Books</h2>
                <BookViewer onDelete={onDelete} onEdit={onEdit}>
                    {books}
                </BookViewer>
            </div>
        );
    }


    renderAuthors() {
        const authors = this.orm.Author.all();
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
                <AuthorViewer authors={authors} onDelete={onDelete} onEdit={onEdit}/>
            </div>
        );
    }

    renderPublishers() {
        const publishers = this.orm.Publisher.all();

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
                <PublisherViewer publishers={publishers} onDelete={onDelete} onEdit={onEdit}/>
            </div>
        );
    }

    renderGenres() {
        const genres = this.orm.Genre.all();
        const onCreate = (pl) => {
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
        const onEdit = (props) => {
            this.props.dispatch({
                type: 'UPDATE_GENRE',
                payload: props,
            });
        };
        return (
            <div>
                <GenreForm onSubmit={onCreate}/>
                <GenreViewer genres={genres} onDelete={onDelete} onEdit={onEdit}/>
            </div>
        );
    }

    render() {
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
    orm: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    view: React.PropTypes.string,
};

function select(state) {
    return state;
}

export default connect(select)(App);
