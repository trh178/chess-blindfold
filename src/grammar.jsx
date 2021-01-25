export class Grammar {
    constructor(props) {
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
    whichPhrase = () => {
        var phrase = this.phrases[this.randomPhrase()];
        phrase = phrase.toLowerCase();
        return phrase;
    }
    asString = gString => {
        
        return '#JSGF V1.0; grammar phrase; public <phrase> = ' + gString +';';
    }
}