# redux-orm Example App

This is a (visually very) crude non-async CRUD app that provides an example of redux-orm usage. It's not an ideal app in the sense that lots of things could be abstracted here - but the code should be relatively easy to digest to give you a sense of `redux-orm` and its possibilities.

[Try the Example Book Database app in action.](http://tommikaikkonen.github.io/redux-orm-example/). Open up the console to see the store diff and incoming App props after each dispatch.

![Screenshot of the Example App](https://raw.githubusercontent.com/tommikaikkonen/redux-orm-example/master/screenshot.png)

## Reading the Source Code

At the heart of `redux-orm` are the model declarations. They are declared in [app/models.js](app/models.js). You can use ES6 class inheritance to build your model definitions; just don't register your abstract models to the schema. This app uses one abstract model: `CRUDModel`. It defines a CRUD-enabled reducer that helps with boilerplate (each model takes three action types, create, update and remove. The action type is in the form `{{ action }}_{{ modelname }}`, for example `CREATE_BOOK`). Then `Book`, `Author`, `Genre` and `Publisher` subclass from `CRUDModel`.

Each of the concrete models has a `validate` classmethod. This doesn't relate to `redux-orm` at all; it provides no validation services. We just call the `validate` classmethod in the app forms. Models are a convenient place to put business logic closely related to them.

The concrete models define their fields. `Book` has many `Author`s, many `Genre`s and one `Publisher`. They define some helping methods. For example, `Author` has a `writesGenres` method, that returns an array of all the genres his or her books are included in. Likewise `Publisher` has an `authors` method that returns a `QuerySet` of all the authors that have published a book with that `Publisher` instance. At the end of [app/models.js](app/models.js) we register the models to a new `Schema` instance and export it along with the models. You could also do this in a separate schema file.

You can use other reducers normally with `redux-orm`, see the one simple reducer defined in [app/reducers.js](app/reducers.js). It manages the current view (Books, Authors, Publishers, Genres) of the app.

To pass data to React components, we specify selectors in [app/selectors.js](app/selectors.js). They take the ORM state branch as an input and output plain JS. When a selector runs for the first time, it checks which Models' state branches were accessed. On subsequent runs, the selector first checks if those branches have changed -- if not, it just returns the previous result. This way you can use the `PureRenderMixin` in your React components for great performance.

React components are declared in [app/components.jsx](app/components.jsx). `react-bootstrap` is utilized for presentational components. A `ModelViewer` component is declared for each model, which displays a list of the model instances in the Redux store, and an edit form with each instance. The form components are declared in [app/formComponents.jsx](app/formComponents.jsx), with one abstract `ModelForm` and concrete `Form`s for each model class. `ModelForm` is a quick general-use component that renders the proper `Input` elements provided by `react-bootstrap` for the related fields declared in a model class, in addition to other, normal field types supplied in `props`.

Finally, the main `App` component is at the end of [app/components.jsx](app/components.jsx). It renders the navigation sidebar, and the main content by using a switch statement on the current view name, and calling the correct sub-render method (`renderBooks`, `renderPublishers` etc.).

Each of the sub-render methods pass on the dispatch-calling functions (onCreate, onEdit, onDelete).

[app/index.js](app/index.js) bootstraps the `redux-orm` state with initial data, creates the root Redux reducer and store, applies middleware.