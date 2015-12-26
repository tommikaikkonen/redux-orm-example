import {Book} from './books/models';
import {Author} from './authors/models';
import {Publisher} from './publishers/models';
import {Genre} from './genres/models';
import {Schema} from 'redux-orm';

const schema = new Schema();
schema.register(Author, Book, Publisher, Genre);

export default schema;
