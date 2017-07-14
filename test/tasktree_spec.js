import {expect} from 'chai';
import makeStore from '../src/store';
import { select, init, next, back } from '../src/modules/tasktree';
import {testTree} from '../src/testdata'

describe('testTree reducer', () => {

    it('initializes from a JS object and is converted to an Immutable with the first item selected', () => {
        let store = makeStore();
        store.dispatch(init(testTree));
        let s = store.getState().taskTree.toJS();
        expect(s.tree.children[0].selected).to.equal(true);
    });

    it('deselects last item when selecting an item', () => {
        let store = makeStore();

        store.dispatch(init(testTree));
        store.dispatch(select('0/0/0'));
        let s = store.getState().taskTree.toJS();
        expect(s.tree.children[0].children[0].children[0].selected).to.equal(true);
        store.dispatch(select('0/1'));
        s = store.getState().taskTree.toJS();
        expect(s.tree.children[0].children[1].selected).to.equal(true);
        expect(s.tree.children[0].children[0].children[0].selected).to.equal(false);
    });

    it('select sets the next item', () => {
        let store = makeStore();
        store.dispatch(init(testTree));
        store.dispatch(select('0/0'));
        let s = store.getState().taskTree.toJS();
        //console.log(s)
        expect(s.nextItem).to.equal('0/0/0');
    });

    it('select sets the previous item', () => {
        let store = makeStore();
        store.dispatch(init(testTree));
        store.dispatch(select('0/0'));
        let s = store.getState().taskTree.toJS();
        expect(s.lastItem).to.equal('0');
        //expect(s.selectedItem).to.equal('0/0');
    });

    it('next moves to the next child item', () => {
        let store = makeStore();
        store.dispatch(init(testTree));
        store.dispatch(select('0/0'));
        store.dispatch(next());
        let s = store.getState().taskTree.toJS();
        expect(s.tree.children[0].children[0].children[0].selected).to.equal(true);
    });

    it('next moves to the parents next sibling when current item has no children', () => {
        let store = makeStore();
        store.dispatch(init(testTree));
        store.dispatch(select('0/0/0/0'));
        store.dispatch(next());
        let s = store.getState().taskTree.toJS();
        expect(s.tree.children[0].children[0].children[1].selected).to.equal(true);
    });

    it('next moves to the roots next sibling when current item has no children', () => {
        let store = makeStore();
        store.dispatch(init(testTree));
        store.dispatch(select('0/1/0/0'));
        store.dispatch(next());
        let s = store.getState().taskTree.toJS();
        expect(s.tree.children[1].selected).to.equal(true);
    });

    it('next iterates the tree and when it gets to the end starts all over again from beginning', () => {
        let store = makeStore();
        store.dispatch(init(testTree));

        for ( let i = 0; i < 100; i++ ) {
            store.dispatch(next());
        }

        let s = store.getState().taskTree.toJS();
        expect(s.tree.children[0].children[0].children[1].selected).to.equal(true);
    });

    it('back moves backwards up the tree', () => {
        let store = makeStore();
        store.dispatch(init(testTree));
        store.dispatch(select('0/0'));
        store.dispatch(back());
        let s = store.getState().taskTree.toJS();
        expect(s.tree.children[0].selected).to.equal(true);
    });

    it('back moves backwards up the tree and dead ends at 0', () => {
        let store = makeStore();
        store.dispatch(init(testTree));
        store.dispatch(select('0/0/0/0'));

        for ( let i = 0; i < 100; i++ ) {
            store.dispatch(back());
        }
        let s = store.getState().taskTree.toJS();
        expect(s.tree.children[0].selected).to.equal(true);
    });
});
