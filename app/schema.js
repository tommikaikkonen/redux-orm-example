import {Author, Book, Publisher, Genre} from './models';
import {Schema} from 'redux-orm';

const schema = new Schema();
schema.register(Author, Book, Publisher, Genre);

export default schema;
