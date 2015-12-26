import React from 'react';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import {createStructuredSelector} from 'reselect';
import { connect } from 'react-redux';
import Component from 'react-pure-render/component';

import {
    BookForm,
    BookItem,
    bookSelector,
    bookChoices,
} from './books';

import {
    AuthorForm,
    AuthorItem,
    authorSelector,
    authorChoices,
} from './authors';

import {
    PublisherForm,
    PublisherItem,
    publisherSelector,
    publisherChoices,
} from './publishers';

import {
    GenreForm,
    GenreItem,
    genreSelector,
    genreChoices,
} from './genres';

const Types = React.PropTypes;

// Returns a React component that displays a list of items
// along with edit and delete actions.
const itemListFactory = (ItemComponent, additionalPropsToPass = []) => {
    const ItemList = props => {
        const items = props.items.map(item => {
            const itemProps = {
                key: item.id,
                item,
            };
            if (props.onEdit) itemProps.onEdit = props.onEdit;
            if (props.onDelete) {
                itemProps.onDelete = props.onDelete.bind(null, item.id);
            }

            additionalPropsToPass.forEach(propName => {
                itemProps[propName] = props[propName];
            });
            return <ItemComponent {...itemProps}/>;
        });
        return <ul className="list-unstyled">{items}</ul>;
    };
    ItemList.propTypes = {
        items: Types.arrayOf(Types.object).isRequired,
        onEdit: Types.func,
        onDelete: Types.func,
    };
    return ItemList;
};

const GenreList = itemListFactory(GenreItem);
const PublisherList = itemListFactory(PublisherItem);
const AuthorList = itemListFactory(AuthorItem);
const BookList = itemListFactory(BookItem, ['authorChoices', 'publisherChoices', 'genreChoices']);

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

    renderItems(modelName) {
        const upperCaseModelName = modelName.toUpperCase();
        const actionNames = {
            create: `CREATE_${upperCaseModelName}`,
            update: `UPDATE_${upperCaseModelName}`,
            remove: `REMOVE_${upperCaseModelName}`,
        };
        const onCreate = payload => {
            this.props.dispatch({
                type: actionNames.create,
                payload,
            });
        };
        const onEdit = payload => {
            this.props.dispatch({
                type: actionNames.update,
                payload,
            });
        };
        const onDelete = payload => {
            this.props.dispatch({
                type: actionNames.remove,
                payload,
            });
        };

        switch (modelName) {
        case 'Book':
            return (
                <div>
                    <BookForm
                        onSubmit={onCreate}
                        authorChoices={this.props.authorChoices}
                        publisherChoices={this.props.publisherChoices}
                        genreChoices={this.props.genreChoices}/>,
                    <h2>List of Books</h2>
                    <BookList
                        onDelete={onDelete}
                        onEdit={onEdit}
                        items={this.props.books}
                        authorChoices={this.props.authorChoices}
                        publisherChoices={this.props.publisherChoices}
                        genreChoices={this.props.genreChoices}/>
                </div>
            );
        case 'Author':
            return (
                <div>
                    <AuthorForm onSubmit={onCreate}/>
                    <AuthorList items={this.props.authors} onDelete={onDelete} onEdit={onEdit}/>
                </div>
            );
        case 'Publisher':
            return (
                <div>
                    <PublisherForm onSubmit={onCreate}/>
                    <PublisherList
                        items={this.props.publishers}
                        onDelete={onDelete}
                        onEdit={onEdit}/>
                </div>
            );
        case 'Genre':
            return (
                <div>
                    <GenreForm onSubmit={onCreate}/>
                    <GenreList
                        items={this.props.genres}
                        onDelete={onDelete}
                        onEdit={onEdit}/>
                </div>
            );
        default:
            return <div/>;
        }
    }

    render() {
        console.log('Incoming props on App render:');
        console.log(this.props);
        let subView;

        switch (this.props.view) {
        case 'Books':
            subView = this.renderItems('Book');
            break;
        case 'Authors':
            subView = this.renderItems('Author');
            break;
        case 'Publishers':
            subView = this.renderItems('Publisher');
            break;
        case 'Genres':
            subView = this.renderItems('Genre');
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
