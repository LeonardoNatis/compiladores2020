// Constante com nome do símbolo e seu respectivo valor de símbolo
// const tokenSymbols = [
//     { programa: 'sprograma' },
//     { inicio: 'sinicio' },
//     { fim: 'sfim' },
//     { procedimento: 'sprocedimento' },
//     { funcao: 'sfuncao' },
//     { se: 'sse' },
//     { entao: 'sentao' },
//     { senao: 'ssenao' },
//     { enquanto: 'senquanto' },
//     { faca: 'sfaca' },
//     { ':=': 'satribuicao' },
//     { escreva: 'sescreva' },
//     { leia: 'sleia' },
//     { var: 'svar' },
//     { inteiro: 'sinteiro' },
//     { booleano: 'sbooleano' },
//     { verdadeiro: 'sverdadeiro' },
//     { false: 'sfalso' },
//     { identificador: 'sidentificador' },
//     { numero: 'snumero' },
//     { '.': 'sponto' },
//     { ';': 'sponto_virgula' },
//     { ',': 'svirgula' },
//     { '(': 'sabre_parenteses' },
//     { ')': 'sfecha_parenteses' },
//     { '>': 'smaior' },
//     { '>=': 'smaiorig' },
//     { '=': 'sig' },
//     { '<': 'smenor' },
//     { '<=': 'smenorig' },
//     { '!=': 'sdif' },
//     { '+': 'smais' },
//     { '-': 'smenos' },
//     { '*': 'smult' },
//     { div: 'sdiv' },
//     { e: 'se' },
//     { ou: 'sou' },
//     { nao: 'snao' },
//     { ':': 'sdoispontos' }
// ];

const tokenSymbols = {
    programa: 'sprograma',
    inicio: 'sinicio' ,
    fim: 'sfim',
    procedimento: 'sprocedimento',
    funcao: 'sfuncao',
    se: 'sse',
    entao: 'sentao',
    senao: 'ssenao',
    enquanto: 'senquanto',
    faca: 'sfaca',
    ':=': 'satribuicao',
    escreva: 'sescreva',
    leia: 'sleia',
    var: 'svar',
    inteiro: 'sinteiro',
    booleano: 'sbooleano',
    verdadeiro: 'sverdadeiro',
    false: 'sfalso',
    identificador: 'sidentificador',
    numero: 'snumero',
    '.': 'sponto',
    ';': 'sponto_virgula',
    ',': 'svirgula',
    '(': 'sabre_parenteses',
    ')': 'sfecha_parenteses',
    '>': 'smaior',
    '>=': 'smaiorig',
    '=': 'sig',
    '<': 'smenor',
    '<=': 'smenorig',
    '!=': 'sdif',
    '+': 'smais',
    '-': 'smenos',
    '*': 'smult',
    div: 'sdiv',
    e: 'se',
    ou: 'sou',
    nao: 'snao',
    ':': 'sdoispontos'
};

class Token {
    // Construtor da classe de Token, onde se a criação do usuário tiver já o símbolo, pega o símbolo fornecido, senão atribui de acordo com o mapeamento da função setSymbol
    constructor(lexema, line, symbol) {
        this._lexema = lexema;
        this._line = line;
        
        symbol ? this._symbol = symbol : this.setSymbol(lexema);
    }

    // setSymbol(lex) {  // usa-se a constante que tem mapeado todos os símbolos, e atribui seu símbolo correspondente ao símbolo do objeto
    //     switch(lex) {
    //         case 'programa':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case 'inicio':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case 'fim':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case 'procedimento':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case 'funcao':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case 'se':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case 'entao':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case 'senao':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case 'enquanto':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case 'faca':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case ':=':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case 'escreva':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case 'leia':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case 'var':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case 'inteiro':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case 'booleano':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case 'verdadeiro':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case 'falso':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case '.':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case ';':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case ',':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case '(':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case ')':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case '>':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case '>=':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case '=':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case '<':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case '<=':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case '!=':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case '+':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case '-':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case '*':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case 'div':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case 'e':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case 'ou':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case 'nao':
    //             this._symbol = tokenSymbols[lex];
    //             break;
    //         case ':':
    //             this._symbol = tokenSymbols[lex];
    //             break;                                                                                                                                      
    //         default: // No caso de nenhum dos outros símbolos, ou seja, o lexema tem um símbolo de identificador ou número
    //             const identifierRegex = /[a-zA-Z]/g;
    //             this._symbol = lex.match(identifierRegex) ? this._symbol = tokenSymbols['identificador'] : this._symbol = tokenSymbols['numero'];
    //             break;
    //     }
    // }

    setSymbol(lex) {
        if (tokenSymbols.hasOwnProperty(lex)) {
            this._symbol = tokenSymbols[lex];
        } else {
            const identifierRegex = /[a-zA-Z]/g;
            this._symbol = lex.match(identifierRegex) ? tokenSymbols['identificador'] : tokenSymbols['numero'];
        }
    }
}

export { Token, tokenSymbols };