import React, { Component } from 'react';
import { connect } from 'react-redux';
import { init } from '../modules/tasktree';
import Tree from '../components/Tree';
import TaskForm from '../components/TaskForm';
import { testTree } from '../testdata'

let mainContainerStyle = {
    minHeight: window.innerHeight,
    height: window.height,
    display: 'flex',
    flexDirection: 'row'
};

class App extends Component {

    componentWillMount() {
        this.props.init(testTree);
    }

    render() {


        let taskTree = this.props.taskTree.toJS()

        if ( taskTree.tree ) {
            let form = this.props.taskTree.getIn(taskTree.taskFormPath).toJS();
            return (
                <div style={mainContainerStyle}>
                    <Tree tasks={taskTree.tree} />
                    <TaskForm form={form}  />
                </div>
            );
        } else {
            return (
                <div style={mainContainerStyle}>
                </div>
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        taskTree: state.taskTree
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        init: (tree) => {
            dispatch(init(tree));
        },
    };
};

const AppContainer = connect(mapStateToProps,mapDispatchToProps)(App);
export default AppContainer;
