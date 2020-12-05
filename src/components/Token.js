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

const posFixa ={
    /* CONSTANTES PARA OS OPERADORES */
	 MAIS_UNARIO : "+u",
	 MENOS_UNARIO : "-u",
	 NAO : "nao",
	 MULTIPLICACAO: "*",
	 DIVISAO : "div",
	 MAIS : "+",
	 MENOS : "-",
	 MAIOR : ">",
	 MENOR : "<",
	 MENOR_IGUAL : "<=",
	 MAIOR_IGUAL : ">=",
	 IGUAL : "=",
	 DIFERENTE : "!=",
	 E : "e",
	 OU : "ou",
};
const tokenMachine = {
    ALLOC : "ALLOC",
    DALLOC : "DALLOC",
    LDV : "LDV",
    ADD : "ADD",
    SUB : "SUB",
    MULT : "MULT",
    DIVI : "DIVI",
    AND : "AND",
    OR : "OR",
    CME : "CME",
    CMEQ : "CMEQ",
    CMA : "CMA",
    CMAQ : "CMAQ",
    CEQ : "CEQ",
    CDIF : "CDIF",
    INV : "INV",
    NEG : "NEG",
    LDC : "LDC",
    RETURN : "RETURN",
    RETURNF : "RETURNF",
    START : "START",
    HLT : "HLT",
    JMP : "JMP",
    JMPF : "JMPF",
    NULL : "NULL",
    STR : "STR",
    CALL : "CALL",
    RD : "RD",
    PRN : "PRN",
   
    LABEL : "L",
   
   /* OUTRAS CONSTANTES */
   
    EMPTY : ""
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

export { Token, tokenSymbols,tokenMachine,posFixa };