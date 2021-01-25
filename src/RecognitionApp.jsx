import React from 'react';
import ReactTable from 'react-table';
import { Table, ToggleButtonGroup, ToggleButton, ButtonGroup, Panel, ListGroup, ListGroupItem, Navbar, Nav, NavItem, NavDropdown, Grid, Row, Col, Button, DropdownButton, MenuItem, FormControl, Breadcrumb, Modal } from 'react-bootstrap';
import styles from './RecognitionApp.css'

import { Grammar, Grammer } from './grammar.jsx'

const SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
const SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList

const recognition = new SpeechRecognition()
const speechRecognitionList = new SpeechGrammarList()

export class Recognizer extends React.Component {
    constructor(props) {
        super(props)       
    }
    testSpeech = () => {
        var grammar = new Grammar();
        var phraseElemnt = document.getElementById("phraseWidget");
        var resultElement = document.getElementById("resultWidget");
        var outputElement = document.getElementById("outputWidget");

        var phrase = grammar.whichPhrase();
        phraseElemnt.textContent = phrase;
        resultElement.textContent = "right or wrong?";
        outputElement.textContent = "diagnostic msg";

        var gString = grammar.asString(phrase);
        speechRecognitionList.addFromString(gString, 1);
        recognition.grammars = speechRecognitionList;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.start();

        recognition.onresult = function(event) {
            var speechResult = event.results[0][0].transcript.toLowerCase();
            outputElement.textContent = 'Speech received: ' + speechResult + '.';
            if(speechResult === phrase) {
                resultElement.textContent = 'I heard the correct phrase!';
                resultElement.style.background = 'lime';
            } else {
                resultElement.textContent = 'That didn\'t sound right.';
                resultElement.style.background = 'red';
            }
        
            console.log('Confidence: ' + event.results[0][0].confidence);
        }
        
        recognition.onspeechend = () => {
            recognition.stop();
        }

        recognition.onerror = () => {
            outputElement.textContent = 'Error occurred in recognition: ' + event.error;
        }
    }

    render = () => {
        return (
        <div id="recognizerWidget" className={styles.recognizer}>
            <h1>Phrase matcher</h1>
            <p>Press the button then say the phrase to test the recognition.</p>

            <button onClick={ () => this.testSpeech() }>Start new test</button>

            <div>
                <p id="phraseWidget" className={styles.phrase}>Phrase...</p>
                <p id="resultWidget">Right or wrong?</p>
                <p id="outputWidget" className={styles.output}>...diagnostic messages</p>
            </div>            
        </div> )
    }
}
