import React from 'react';
import ReactTable from 'react-table';
import { Table, ToggleButtonGroup, ToggleButton, ButtonGroup, Panel, ListGroup, ListGroupItem, Navbar, Nav, NavItem, NavDropdown, Grid, Row, Col, Button, DropdownButton, MenuItem, FormControl, Breadcrumb, Modal } from 'react-bootstrap';
import styles from './RecognitionApp.css'

export class Recognizer extends React.Component {
    constructor(props) {
        super(props)
    }

    render = () => {
        return (
        <div id="recognizerWidget" className={styles.recognizer}>
            <h1>Phrase matcher</h1>
            <p>Press the button then say the phrase to test the recognition.</p>

            <button>Start new test</button>

            <div>
                <p id="phraseWidget" className={styles.phrase}>Phrase...</p>
                <p class="result">Right or wrong?</p>
                <p id="outputWidget" className={styles.output}>...diagnostic messages</p>
            </div>            
        </div> )
    }
}
