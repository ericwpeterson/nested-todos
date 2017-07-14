import Immutable, { Map } from 'immutable';

export const FETCH_STATE = {
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    ERROR: 'ERROR',
    IDLE: 'IDLE',
};

// Actions
export const INIT   = 'tasktree/INIT';
export const NEXT   = 'tasktree/NEXT';
export const BACK   = 'tasktree/BACK';
export const SELECT = 'tasktree/SELECT';
export const CHECK_FORM_ITEM  = 'tasktree/CHECK_FORM_ITEM';

//this map is going to be dynamically generated
const DEFAULT_STATE = Map({});

export default function (state = DEFAULT_STATE, action) {
    let ret;
    let selectedItem;

    switch (action.type) {

        case INIT:
            ret = state.set('tree', Immutable.fromJS(action.tree));
            ret = _select(ret, '0', true);
            return ret;

        case NEXT:
            let nextItem = state.get('nextItem');
            selectedItem = state.getIn(['tree', 'selectedItem']);
            ret = _select(state,selectedItem,false);
            return _select(ret,nextItem,true);

        case BACK:
            let lastItem = state.get('lastItem');
            selectedItem = state.getIn(['tree', 'selectedItem']);
            ret = _select(state,selectedItem,false);
            return _select(ret,lastItem,true);

        case SELECT:
            selectedItem = state.getIn(['tree', 'selectedItem']);
            ret = _select(state,selectedItem,false);
            return _select(ret,action.itemPath,true);

        case CHECK_FORM_ITEM:
            return state;

        default:
            return state;
    }
}

//private functions

let _getIndexFromPath = (path) => {
    let pathArray = Immutable.fromJS(path).toJS();
    let index = pathArray.pop();
    return +index;
}

let _getParentPath = (path) => {
    let pathArray = Immutable.fromJS(path).toJS();

    if ( pathArray.length === 3 ) {
        pathArray.pop();
    } else {
        pathArray.pop();
        pathArray.pop();
    }

    return pathArray;
}

let _getNextSibling = (state, index, path) => {
    let pathArray = Immutable.fromJS(path).toJS();

    if ( pathArray.length === 2 ) {
        //base case
        let children = state.getIn( pathArray ).toJS();
        if ( children.length > index+1 ) {
            pathArray.push('' + (index+1));
            return pathArray;
        } else {
            return [0]
        }
    } else {
        pathArray.push('children');
        let children = state.getIn( pathArray ).toJS();
        if (children.length > index+1 ) {
            pathArray.push('' + (index+1));
            return pathArray;
        } else {
            //remove the trailing children item
            pathArray.pop();
            let parent = _getParentPath( pathArray );
            let myIndex = _getIndexFromPath( pathArray );
            let nextSibling = _getNextSibling(state, myIndex, parent);
            return nextSibling;
        }

    }
}


let pathToString = (_path) => {

    let path = ''
    for ( let i = 0; i < _path.length; i++ ) {
        let item = _path[i];

        if ( item !== 'tree' && item !== 'tasks' && item !== 'children'  ) {
        //if ( item !== 'tree' && item !== 'tasks' && item !== 'children'  ) {
            path += item;

            if ( i !== (_path.length - 1) ) {
                path += '/';
            }
        }
    }

    return path;
}

let _getNextNode = (state, _pathArray) => {
    let pathArray = Immutable.fromJS(_pathArray).toJS();

    let children = state.getIn( pathArray ).toJS();

    //children are next items
    if (children.length > 0 ) {
        pathArray.push('0');
        return pathToString(pathArray);
    } else {
        //otherwise siblings are the the next item
        //if we have no siblings we need to work our way back up the tree
        //remove the children item
        pathArray.pop();

        let parent = _getParentPath( pathArray );
        let myIndex = _getIndexFromPath( pathArray );
        let nextSibling = _getNextSibling(state, myIndex, parent);
        return pathToString(nextSibling);
    }
}


let _getPreviousNode = (state, _pathArray) => {
    let pathArray = Immutable.fromJS(_pathArray).toJS();

    if ( pathArray[pathArray.length-1] === 'children' ) {
        pathArray.pop();
    }

    let parent = _getParentPath( pathArray );
    let myIndex = _getIndexFromPath( pathArray );

    if( pathToString(parent) === '' ) {
        return '0'
    }

    if ( +myIndex === 0  ) {
        return pathToString(parent);
    } else {
        parent.push('children');
        parent.push(''+ (myIndex - 1));
        return pathToString(parent);
    }
}


let _select = (state, path, selected) => {
    let ret = state;
    let tokens = path.split('/');
    let pathArray = ['tree', 'children'];

    for ( let i=0; i< tokens.length; i++ ) {
        pathArray.push(tokens[i]);
        pathArray.push('children');
    }

    //precompute next and previous items
    if ( selected ) {
        let lastItem = _getPreviousNode(ret, pathArray);
        ret = ret.set('lastItem', lastItem);
        let nextItem = _getNextNode(ret, pathArray);
        ret = ret.set('nextItem', nextItem);
    }

    //pop off last children item
    pathArray.pop()
    pathArray.push('selected');

    ret = ret.setIn(pathArray, selected);

    if ( selected ) {
        ret = ret.setIn(['tree', 'selectedItem'], path );
        //pop off last 'selected' item
        pathArray.pop()
        pathArray.push('taskForm')
        ret = ret.set('taskFormPath', pathArray );
    }

    return ret;
}


// Action Creators
export function init(tree) {
    return {
        type: INIT,
        tree: tree
    }
}

export function next() {
    return {
        type: NEXT
    };
}

export function back() {
    return {
        type: BACK
    };
}

export function select(itemPath) {
    return {
        type: SELECT,
        itemPath: itemPath
    };
}

export function checkFormItem(itemPath) {
    return {
        type: CHECK_FORM_ITEM
    };
}
