// Constante que possui os erros sintáticos com qual erro e mensagem de erro correspondente
const syntacticErrors = {
    EXPECTING_DOT: 'Ponto (.) não encontrado',
    EXPECTING_SEMICOLON: 'Faltando ponto e vírgula (;)',
    EXPECTING_OPEN_PARENTHESIS: 'Falta o abre parênteses',
    EXPECTING_CLOSE_PARENTHESIS: 'Falta o fecha parênteses',
    EXPECTING_FAÇA_TOKEN: `Token 'faça' não encontrado`,
    EXPECTING_ENTAO_TOKEN: `Token 'entao' não encontrado`,
    EXPECTING_COLON: 'Faltando dois pontos (:)',
    MISSING_PROGRAM_NAME: 'Faltando o nome do programa',
    MISSING_PROGRAM_TOKEN: 'Token de programa não encontrado',
    INVALID_VARIABLE_NAME: 'Nome de variável inválida',
    INVALID_VARIABLE_DECLARATION: 'Declaração de variável inválida',
    INVALID_DATA_TYPE: 'Tipo de dado inválido',
    INVALID_READ_COMMAND: `Comando 'leia' inválido`,
    INVALID_WRITE_COMMAND: `Comando 'escreva' inválido`,
    INVALID_PROCEDURE_DECLARATION: 'Declaração de procedimento inválida',
    INVALID_FUNCTION_DECLARATION: 'Declaração de função inválida',
    INVALID_EXPRESSION: 'Expressão inválida',
    DUPLICATED_VARIABLE: 'Variável duplicada',
    DUPLICATED_PROCEDURE: 'Procedimento duplicado',
    DUPLICATED_FUNCTION: 'Função duplicada',
    NOT_A_STATEMENT: 'Comando inválido',
    UNEXPECTED_CHARACTER: 'Caractere não esperado',
    IDENTIFIER_NOT_DECLARED: 'Identificador não declarado',
}

// Constante que possui os erros léxicos com qual erro e mensagem de erro correspondente
const lexicErrors = {
    INVALID_CHARACTER: 'Caracter inválido',
    UNCLOSED_COMMENT: 'Comentário não foi fechado'
}

// Constante que possui o erro de arquivo
const fileErrors = {
    UNEXPECTED_END_OF_FILE: 'ERRO DE ARQUIVO: Fim do arquivo inesperado'
}

// Classe de erros léxicos, mas decidi não usar
class lexicError extends Error {
    // Classe específica para erro léxico
    constructor(message, lineNumber) {
        super(message);
        this._name = "LexicError";
        this._lexic_message = message;
        this._lexic_lineNumber = lineNumber;
    }
   

    getMessage() {
        throw lexicErrors[this._lexic_message];
    }
}

// Classe de erros do arquivo, mas decidi não usar
class fileError extends Error {
    constructor(message, lineNumber) {
        super(lineNumber);
        this._file_message = message;
    }

    getMessage() {
        return fileErrors[this._file_message];
    }
}

export { fileErrors, lexicErrors };
export { syntacticErrors };