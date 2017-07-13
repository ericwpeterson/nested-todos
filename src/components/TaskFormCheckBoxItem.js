import React, { Component } from 'react';
import PropTypes from 'prop-types';

//import {Button} from 'react-bootstrap'
//import {Glyphicon} from 'react-bootstrap'


class TaskFormCheckBoxItem extends Component {
    render() {
        return (
            <div className='taskFormCheckBoxItem'>
                {this.props.taskItem.label}
            </div>
        );
    }
}

TaskFormCheckBoxItem.propTypes = {
    taskItem: PropTypes.object.isRequired,
};

export default TaskFormCheckBoxItem;
