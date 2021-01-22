import React from 'react';
import ReactTable from 'react-table';
import { Table, ToggleButtonGroup, ToggleButton, ButtonGroup, Panel, ListGroup, ListGroupItem, Navbar, Nav, NavItem, NavDropdown, Grid, Row, Col, Button, DropdownButton, MenuItem, FormControl, Breadcrumb, Modal } from 'react-bootstrap';

export class Recognizer extends React.Component {
    constructor(props) {
        super(props)
    }

    render = () => {
        <div>
            <h1>Phrase matcher</h1>
            <p>Press the button then say the phrase to test the recognition.</p>

            <button>Start new test</button>

            <div>
                <p class="phrase">Phrase...</p>
                <p class="result">Right or wrong?</p>
                <p class="output">...diagnostic messages</p>
            </div>            
        </div>
    }
}
