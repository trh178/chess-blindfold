import React from 'react';
import ReactTable from 'react-table';
import { Table, ToggleButtonGroup, ToggleButton, ButtonGroup, Panel, ListGroup, ListGroupItem, Navbar, Nav, NavItem, NavDropdown, Grid, Row, Col, Button, DropdownButton, MenuItem, FormControl, Breadcrumb, Modal } from 'react-bootstrap';
import styles from './RecognitionApp.css'

const SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
const SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList

const recognition = new SpeechRecognition()
const speechRecognitionList = new SpeechGrammarList()

export class Recognizer extends React.Component {
    constructor(props) {
        super(props)

        this.phrases = [
            'I love to sing because it\'s fun',
            'where are you going',
            'can I call you tomorrow',
            'why did you talk while I was talking',
            'she enjoys reading books and playing games',
            'where are you going',
            'have a great day',
            'she sells seashells on the seashore'
        ];        
    }
    randomPhrase = () => {
        var number = Math.floor(Math.random() * this.phrases.length);
        return number;        
    }
    testSpeech = () => {
        var phraseElemnt = document.getElementById("phraseWidget");
        var resultElement = document.getElementById("resultWidget");
        var outputElement = document.getElementById("outputWidget");

        var phrase = this.phrases[this.randomPhrase()];
        phrase = phrase.toLowerCase();
        phraseElemnt.textContent = phrase;
        resultElement.textContent = "right or wrong?";
        outputElement.textContent = "diagnostic msg";

        var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase +';';
        speechRecognitionList.addFromString(grammar, 1);
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
