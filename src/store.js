//import {createStore, applyMiddleware, combineReducers} from 'redux';
import {createStore, combineReducers} from 'redux';
import taskTreeReducer from './modules/tasktree';
//import rootSaga from './react-team-saga';
//import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';

let reducers = combineReducers({taskTree: taskTreeReducer});

//const sagaMiddleware = createSagaMiddleware();

export default function makeStore() {
    //const store = createStore(reducers, composeWithDevTools(
    //    applyMiddleware(sagaMiddleware)
    //));

    const store = createStore(reducers, composeWithDevTools());

    //sagaMiddleware.run(rootSaga);
    return store;
}
