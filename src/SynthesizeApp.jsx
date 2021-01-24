import React from 'react';
import ReactTable from 'react-table';
import { Table, ToggleButtonGroup, ToggleButton, ButtonGroup, Panel, ListGroup, ListGroupItem, Navbar, Nav, NavItem, NavDropdown, Grid, Row, Col, Button, DropdownButton, MenuItem, FormControl, Breadcrumb, Modal } from 'react-bootstrap';
import styles from './SynthesizeApp.css'

const synth = window.speechSynthesis

export class Synthesizer extends React.Component {
    constructor(props) {
        super(props)
        this.state = { speechText: '', warning: null }
    }

    speak = phrase => {
        if(synth.speaking) {
            console.error('speechSynthesis.speaking');
            return;
        }

        if(phrase !== '') {
            var utterThis = new SpeechSynthesisUtterance(phrase);
            utterThis.pitch = 0.8;
            utterThis.rate = 0.8;
            synth.speak(utterThis);
        }
    }

    setValue = value => this.setState({speechText: value})
    onChange = e => this.setValue(e.target.value)
    handleKeyPress = target => {
        if (target.charCode == 13) {
            this.submit();
        }
    }
    submit = () => this.speak(this.state.speechText);
    render = () => {
        return (
            <div>
                <h1>Speech synthesiser</h1>

                <p>Enter some text in the input below and press return  or the "play" button to hear it. change voices using the dropdown menu.</p>

                <FormControl
                    bsSize="large"
                    ref="synthInput"
                    type="text"
                    onChange={this.onChange}
                    onKeyPress={this.handleKeyPress}
                    value={this.state.speechText}
                />
                <Col sm={2}>
                    <Button bsSize="large" id="submitButton" onClick={ this.submit }>Play</Button>
                </Col>                              
            </div>
        )
    }
}