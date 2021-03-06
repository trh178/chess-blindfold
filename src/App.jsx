import React from 'react';
import ReactDOM from 'react-dom';
import styles from './App.css';
import { HelpBlock, Label, Form, FormGroup, ControlLabel, ToggleButtonGroup, ToggleButton, ButtonGroup, Panel, ListGroup, ListGroupItem, Navbar, Nav, NavItem, NavDropdown, Button, DropdownButton, MenuItem, FormControl, Breadcrumb, Modal, Grid, Row, Col } from 'react-bootstrap';
import Select from 'react-select'

import { AppNavbar } from './AppNavbar.jsx';
import { List } from 'immutable';
import { Board, MoveTable } from './ChessApp.jsx';
import { Recognizer } from './RecognitionApp.jsx';
import { Synthesizer } from './SynthesizeApp.jsx';

import { GameClient, startingFen, gameStatus } from './helpers.jsx'
import { getBest } from './engine.js'


/* The window to enter moves. There are currently two options:
(1) Click on buttons, one for each move
(2) Enter the move in a text field and hit enter - disabled by default

Through trial and error I noticed that the first option simply works better, especially
when using a phone.
*/
export class MoveEntry extends React.Component {
  constructor(props){
    super(props);
    this.state = { value: '', warning: null }
  }
  focus = () => {
    let node = ReactDOM.findDOMNode(this.refs.inputNode);
    if (node && node.focus instanceof Function) {
      node.focus();
    }
  }
  componentDidMount() {
    this.focus();
  }
  setValue = value => this.setState({value: value})
  onChange = e => this.setValue(e.target.value)
    handleKeyPress = target => {
      if (target.charCode == 13){
        this.submit();
      }
  }
  submit = () => this.makeMove(this.state.value);
  makeMove = move => {
    const moveValid = this.props.gameClient.isMoveValid(move);
    if (moveValid){
      this.props.makeMove(move);
      this.setState({ value: '', warning: null})
    }
    else {
      this.showWarning("Move is not valid");
    }
  }
  componentDidUpdate = (prevProps, prevState, snapshot) => {
    this.focus()
  }
  showWarning = warning => this.setState({warning: warning});
  /* Display the move according to the app settings.
  For instance, if the `showIfCheck` setting is `false`, then remove the "+" from any move
  */
  displayMove = move => {
    var formattedMove = move;
    if (!this.props.parentState.showIfMate) {
      formattedMove = formattedMove.replace("#", "+");
    }
    if (!this.props.parentState.showIfTakes) {
      formattedMove = formattedMove.replace("x", "");
    }
    if (!this.props.parentState.showIfCheck) {
      formattedMove = formattedMove.replace("+", "");
    }
    return formattedMove
  }
  render = () => {
    const moves = this.props.gameClient.client.moves();
    const buttonForMove = move => (
      <Col key={ move } xs={3} md={2}>
        <div className={styles.moveButton} onClick={ () => this.props.makeMove(move) }>{ this.displayMove(move) }</div>
      </Col>
    )
    const input = !this.props.enterMoveByKeyboard ? 
        <Row style={{ marginLeft: 0, marginRight: 10 }}>
          { moves.map(buttonForMove) }
        </Row> :
        <div>
          <Row style={{ marginLeft: 0, marginRight: 0 }}>
            <Col sm={4} smOffset={4}>
              <FormControl
                bsSize="large"
                ref="inputNode"
                type="text"
                onChange={ this.onChange }
                onKeyPress={this.handleKeyPress}
                value={ this.state.value }
              />
            </Col>
            <Col sm={2}>
              <Button bsSize="large" id="submitButton" onClick={ this.submit }>Submit</Button>
            </Col>
          </Row>
          <Row style={{ marginLeft: 0, marginRight: 0 }}>
            <Col sm={6} smOffset={4}>
              <HelpBlock bsStyle="warning" style= {{ color: "red" }} > { this.state.warning } </HelpBlock>
            </Col>
          </Row>
        </div>
    return (<div>{ input }</div>)
  }
}


const resetState = () => {
  const gameClient = new GameClient();
  return {
    moves: List([])
  , gameClient: gameClient
  , colorToMoveWhite: true
  , showBoard: false
  , showType: "make"
  }
}

/* Obtaining the starting state for a new game.
The starting state is not the same as the reset state, because we want
some properties, e.g. the Stockfish level, to persist throughout games.
The reset state does not contain these properties, so we need to add them 
here.
*/
var startingState = () => {
  var state = resetState()
  state['ownColorWhite'] = true
  state['skillLevel'] = 0
  state['showIfMate'] = false
  state['showIfTakes'] = true
  state['showIfCheck'] = true
  state['enterMoveByKeyboard'] = false;
  return state
}


/* Get the stockfish levels in terms of Elo rating.
Stockfish levels range from 0 (1100 Elo) to 20 (3100 Elo)
These are really very rough heuristics, but should be close enough for 
our purposes.
*/
const getStockfishLevels = () => {
  var values = [];
  const numLevels = 20;
  const minElo = 1100;
  const maxElo = 3100;
  for (var i=0; i<=numLevels; i++){
    const elo = Math.floor((minElo + (maxElo - minElo) * (i / numLevels)) / 100) * 100;
    values.push({value: i, label: elo})
  }
  return values
}

/* Displays the window to change settings */
export class SettingsWindow extends React.Component {
  constructor(props){
    super(props);
  }
  render = () => {
    const values = getStockfishLevels()

    /* Obtain the toggle button to turn a property on or off */
    const buttonForProperty = (name, display) => {
      return (
        <Row>
          <Col xs={6}>
            <div>{ display }</div>
          </Col>
          <Col xs={6}>
            <ToggleButtonGroup justified type="radio" name="options" value={ this.props.parentState[name] } onChange={value => this.props.setProperty(name, value)}>
              <ToggleButton value={ true }>Yes</ToggleButton>
              <ToggleButton value={ false }>No</ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Row>
      )
    }

    const hr = <hr style={{ height: "2px", border: "0 none", color: "lightGray", backgroundColor: "lightGray" }}/>
    const displaySettings = this.props.parentState.enterMoveByKeyboard ? null :
      <div>
        { hr }
        { buttonForProperty('showIfMate', 'Show if move is mate') }
        { hr }
        { buttonForProperty('showIfCheck', 'Show if move is check') }
        { hr }
        { buttonForProperty('showIfTakes', 'Show is move is taking piece') }
      </div>

    return (
      <div>
        <Row>
          <Col xs={6}>
            <div> Stockfish strength (Elo): </div>
          </Col>
          <Col xs={6}>
            <Select
              clearable={ false }
              value={ this.props.skillLevel }
              onChange={ this.props.setSkill }
              options={ values }
            />
          </Col>
        </Row>
        { hr }
        <Row>
          <Col xs={6}>
            <div> You play: </div>
          </Col>
          <Col xs={6}>
            <ToggleButtonGroup justified type="radio" name="options" value={ this.props.ownColorWhite } onChange={this.props.setOwnColor}>
              <ToggleButton value={ true }>White</ToggleButton>
              <ToggleButton value={ false }>Black</ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Row>
        { hr }
        { buttonForProperty('enterMoveByKeyboard', 'Enter moves by keyboard') }
        { displaySettings }
      </div>
    )
  }
}

/* The statuswindow provides the status of the games and the last moves
by the player and the computer */
export class StatusWindow extends React.Component {
  constructor(props){
    super(props);
  }
  render = () => {
    const humanText = this.props.humanMove ? (<div><span>You played </span><Label>{ this.props.humanMove }</Label></div>): <span>Make your move!</span>
    const computerText = this.props.computerMove ? (<div><span>Computer played </span><Label>{ this.props.computerMove }</Label></div>): <span>Computer is waiting...</span>
    const style = { height:"50px", fontSize: "200%", textAlign: "center", marginTop: 10}
    return (
      <div>
        <Row style= { style }>
          <Label bsStyle={ this.props.status[2] }> { this.props.status[1] } </Label>
        </Row>
        <Row style= { style }>
          { humanText }
        </Row>
        <Row style={ style }>
          { computerText }
        </Row>
      </div>
    )
  }
}

/* The main app, which pulls in all the other windows. */
export class App extends React.Component {
  constructor(props){
    super(props);
    this.state = startingState()
  }
  reset = () => this.setState(resetState(), this.makeComputerMove)
  componentDidUpdate = (prevProps, prevState, snapshot) => {
    var table = document.getElementById("moveTable");
    if (table != null && "scrollHeight" in table){
      console.log("scroll");
      table.scrollTop = table.scrollHeight;
    }
  }
  makeMove = move => {
    const newMoves = this.state.moves.push(move);
    this.state.gameClient.move(move, {sloppy: true});
    // If automoving is enabled, my move leads to a move by the computer.
    const nextMoveCallback = this.props.autoMove ? this.makeComputerMove : () => {}
    const newState = { moves: newMoves, colorToMoveWhite: !this.state.colorToMoveWhite }
    this.setState(newState, nextMoveCallback);
  }
  isPlayersMove = () => this.state.ownColorWhite == this.state.colorToMoveWhite
  makeComputerMove = () => {
    // Only make a computer move if it's not the player's turn
    if (this.isPlayersMove()){
      return 
    }
    const fen = this.state.gameClient.client.fen()
    getBest(this.state.skillLevel, fen, this.makeMove)
  }
  shownElement = () => {
    switch (this.state.showType) {
      case "make": return this.makeMoveElement()
      case "moves": return this.moveTableElement()
      case "board": return this.boardElement()
      case "settings": return this.settingsElement()
      case "stt": return this.sttElement()
      case "tts": return this.ttsElement()
    }
  }
  getLastMove = (offsetTrue, offsetFalse) => () => {
    const history = this.state.gameClient.client.history()
    const offset = !this.isPlayersMove() ? offsetTrue : offsetFalse
    return history[history.length - offset];
  }
  getLastComputerMove = this.getLastMove(2, 1)
  getLastHumanMove = this.getLastMove(1, 2)
  makeMoveElement = () => (
    <div>
      <StatusWindow status={ this.state.gameClient.getStatus() } humanMove = { this.getLastHumanMove() } computerMove = { this.getLastComputerMove() }/>
      <Row>
        <MoveEntry 
          enterMoveByKeyboard={ this.state.enterMoveByKeyboard } 
          gameClient={ this.state.gameClient } 
          makeMove={ this.makeMove }
          parentState = { this.state }
        />
      </Row>
      <Row style= {{ marginTop: 20}}>
        { this.state.gameClient.getStatus() == gameStatus.starting ? null :
          <Col xs={6} xsOffset={3}>
            <Button bsStyle="warning" block id="resetButton" onClick={ this.reset }>Start new game</Button>
          </Col>
        }
      </Row>
    </div>
  )
  sttElement = () => <Recognizer />
  ttsElement = () => <Synthesizer />
  boardElement = () => <Board fen={ this.state.gameClient.client.fen() }/>
  handleChange = value => this.setState({ showType: value })
  moveTableElement = () => <MoveTable pgn={ this.state.gameClient.client.pgn() }/>
  setSkill = skill => this.setState({ skillLevel: skill.value })
  setOwnColor = isWhite => this.setState({ ownColorWhite: isWhite }, this.makeComputerMove)
  setProperty = (name, value) => {
    var newState = {}
    newState[name] = value
    this.setState(newState);
  }
  settingsElement = () => <SettingsWindow 
    skillLevel={ this.state.skillLevel }
    setSkill={ this.setSkill } 
    ownColorWhite={ this.state.ownColorWhite } 
    setOwnColor= { this.setOwnColor }
    setProperty = { this.setProperty }
    parentState = { this.state }
  />
  render = () => {
    return (
      <div>
        <AppNavbar/>
        <Grid>
          <Row>
            <Col sm={6} smOffset={3}>
              <Row>
                <ToggleButtonGroup justified type="radio" name="options" value={ this.state.showType } onChange={this.handleChange}>
                  <ToggleButton value={"make"}>Play</ToggleButton>
                  <ToggleButton value={"moves"}>Moves</ToggleButton>
                  <ToggleButton value={"board"}>Board</ToggleButton>
                  <ToggleButton value={"settings"}>Settings</ToggleButton>
                  <ToggleButton value={"stt"}>Recognition</ToggleButton>
                  <ToggleButton value={"tts"}>Synthesize</ToggleButton>
                </ToggleButtonGroup>
              </Row>
              <div style={{ marginTop: 10 }}>
                { this.shownElement() } 
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

App.defaultProps = {
  showInput: false
}
