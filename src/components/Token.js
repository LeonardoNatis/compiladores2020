// Constante com nome do símbolo e seu respectivo valor de símbolo

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
    falso: 'sfalso',
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