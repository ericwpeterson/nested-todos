import {expect} from 'chai';
import makeStore from '../src/store';
import { select, init } from '../src/modules/tasktree';
import {testTree} from '../src/testdata'

describe('testTree reducer', () => {

/*
    it('initializes from a JS object and is converted to an Immutable with the first item selected', () => {
        let store = makeStore();
        store.dispatch(init(testTree));
        let s = store.getState().taskTree.toJS();
        expect(s.tree.tasks[0].selected).to.equal(true);
    });

    it('initializes from a JS object and preserves the last item selected', () => {
        let store = makeStore();
        testTree.selectedItem = '0/1'
        store.dispatch(init(testTree));
        let s = store.getState().taskTree.toJS();
        expect(s.tree.tasks[0].children[1].selected).to.equal(true);
    });

    it('deselects last item when selecting an item', () => {
        let store = makeStore();
        testTree.selectedItem = '0/0/0'
        store.dispatch(init(testTree));
        let s = store.getState().taskTree.toJS();
        expect(s.tree.tasks[0].children[0].children[0].selected).to.equal(true);

        store.dispatch(select('0/1'));
        s = store.getState().taskTree.toJS();

        expect(s.tree.tasks[0].children[1].selected).to.equal(true);
        expect(s.tree.tasks[0].children[0].children[0].selected).to.equal(false);
    });
*/


    it('select sets the next item', () => {
        let store = makeStore();
        testTree.selectedItem = '0/0'
        store.dispatch(init(testTree));
        let s = store.getState().taskTree.toJS();
        console.log(s)
        expect(s.tree.tasks[0].children[0].selected).to.equal(true);


        //expect(s.tree.tasks[0].children[0].children[0].selected).to.equal(true);

        //store.dispatch(select('0/1'));
        //s = store.getState().taskTree.toJS();

        //expect(s.tree.tasks[0].children[1].selected).to.equal(true);
        //expect(s.tree.tasks[0].children[0].children[0].selected).to.equal(false);
    });

});
