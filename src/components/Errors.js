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