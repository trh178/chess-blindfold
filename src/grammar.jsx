export class Grammar {
    constructor(props) {        
    }
    asString = () => {
        return "\
            #JSGF V1.0;\
            grammar blindfold.chess.commands;\
            <row> = one | two | three | four | five | six | seven | eight;\
            <col> = a | b | c | d | e | f | g | h;\
            <promote> = queen | rook | knight | bishop;\
            <pair> = rook | knight | bishop;\
            <ck> = check | checkmate;\
            <eat> = captures | takes | capture | take;\
            <menu_command> = resign |\
                [please] show [board] position |\
                new game\
                exit [[the] program];\
            <move_command> = queen [<eat>] <col> <row> [<ck>] |\
                king [<eat>] <col> <row> |\
                castle | castle king side | castle queen side |\
                <pair> [<col>|<row>] [<eat>] <col> <row> [<ck>] |\
                [pawn] [<eat>] <col> <row> [<promote>] [<check>];\
            public <command> = <menu_command> | <move_command>;\
        "
    }
}