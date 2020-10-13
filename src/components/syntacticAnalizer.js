import { myFile } from "./File";
import { Token, tokenSymbols } from "./Token";
import { analyseLexic } from './lexicAnalyzer';
import { syntacticErrors } from './Errors';

function analyzeSyntactic(file) {
    let theFile = file;
    let lexicTokens = analyseLexic(theFile);  // passa por todos os tokens léxicos
    let result = [];

    // Lexico(Token)
    let currentToken = lexicTokens.shift();

    // se token.simbolo = sprograma
    if (currentToken._symbol === tokenSymbols['programa']) {
        // Lexico(Token)
        currentToken = lexicTokens.shift();

        // se token.simbolo = sidentificador
        if (currentToken._symbol === tokenSymbols['identificador']) {
            // Lexico(Token)
            currentToken = lexicTokens.shift();

            // se token.simbolo = spontovirgula
            if (currentToken._symbol === tokenSymbols[';']) {
                analyseBlock();

                // se token.simbolo = sponto
                if (currentToken._symbol === tokenSymbols['.']) {

                    // se fim do arquivo ou é comentário

                    if (lexicTokens.shift()) {
                        result.push({
                            errorName: "SyntacticError",
                            errorMessage: syntacticErrors.UNEXPECTED_CHARACTER,
                            errorLine: theFile.getCurLine()
                        });
                        return result;
                    }

                } else { // senão ERRO -> faltando token ponto
                    result.push({
                        errorName: "SyntacticError",
                        errorMessage: syntacticErrors.EXPECTING_DOT,
                        errorLine: theFile.getCurLine()
                    });
                    return result;
                }

            } else { // senão ERRO -> faltando token ponto e vírgula
                result.push({
                    errorName: "SyntacticError",
                    errorMessage: syntacticErrors.EXPECTING_SEMICOLON,
                    errorLine: theFile.getCurLine()
                });
                return result;
            }

        } else { // senão ERRO -> faltando nome do programa
            result.push({
                errorName: "SyntacticError",
                errorMessage: syntacticErrors.MISSING_PROGRAM_NAME,
                errorLine: theFile.getCurLine()
            });
            return result;
        }

    } else { // senão ERRO -> faltando token programa
        result.push({
            errorName: "SyntacticError",
            errorMessage: syntacticErrors.MISSING_PROGRAM_TOKEN,
            errorLine: theFile.getCurLine()
        });
        return result;
    }

    function analyseBlock() {
        currentToken = lexicTokens.shift();

        analyseVariableStage();
        analyseSubroutines();
        analyseCommands();
    }

    function analyseVariableStage() {
        if (currentToken._symbol === tokenSymbols['var']) {
            currentToken = lexicTokens.shift();

            if (currentToken._symbol === tokenSymbols['identificador']) {

                while (currentToken._symbol === tokenSymbols['identificador']) {
                    analyseVariableDeclaration();

                    if (currentToken._symbol === tokenSymbols[';']) {
                        currentToken = lexicTokens.shift();
                    } else {
                        result.push({
                            errorName: "SyntacticError",
                            errorMessage: syntacticErrors.EXPECTING_SEMICOLON,
                            errorLine: theFile.getCurLine()
                        });
                        return result;
                    }

                }

            } else {
                result.push({
                    errorName: "SyntacticError",
                    errorMessage: syntacticErrors.INVALID_VARIABLE_NAME,
                    errorLine: theFile.getCurLine()
                });
                return result;
            }
        }
    }

    function analyseVariableDeclaration() {
        do {

            if (currentToken._symbol === tokenSymbols['identificador']) {
                currentToken = lexicTokens.shift();

                if (currentToken._symbol === tokenSymbols[','] || currentToken._symbol === tokenSymbols[':']) {
                    
                    if (currentToken._symbol === tokenSymbols[',']) {
                        currentToken = lexicTokens.shift();

                        if (currentToken._symbol === tokenSymbols[':']) {
                            result.push({
                                errorName: "SyntacticError",
                                errorMessage: syntacticErrors.INVALID_VARIABLE_DECLARATION,
                                errorLine: theFile.getCurLine()
                            });
                            return result;
                        }
                    }

                } else {
                    result.push({
                        errorName: "SyntacticError",
                        errorMessage: syntacticErrors.INVALID_VARIABLE_DECLARATION,
                        errorLine: theFile.getCurLine()
                    });
                    return result;
                }

            } else {
                result.push({
                    errorName: "SyntacticError",
                    errorMessage: syntacticErrors.INVALID_VARIABLE_NAME,
                    errorLine: theFile.getCurLine()
                });
                return result;
            }

        } while (currentToken._symbol === tokenSymbols[':']);

        currentToken = lexicTokens.shift();
        analyseType();
    }

    function analyseType() {
        if (currentToken._symbol !== tokenSymbols['inteiro'] || currentToken._symbol !== tokenSymbols['booleano']) {
            result.push({
                errorName: "SyntacticError",
                errorMessage: syntacticErrors.INVALID_DATA_TYPE,
                errorLine: theFile.getCurLine()
            });
            return result;
        }

        currentToken = lexicTokens.shift();
    }

    function analyseCommands() {
        if (currentToken._symbol === tokenSymbols['inicio']) {
            currentToken = lexicTokens.shift();

            analyseSimpleCommand();

            while (currentToken._symbol !== tokenSymbols['fim']) {
                if (currentToken._symbol === tokenSymbols[';']) {

                    currentToken = lexicTokens.shift();

                    if (currentToken._symbol !== tokenSymbols['fim']) {
                        analyseSimpleCommand();
                    }

                } else {
                    result.push({
                        errorName: "SyntacticError",
                        errorMessage: syntacticErrors.NOT_A_STATEMENT,
                        errorLine: theFile.getCurLine()
                    });
                }
            }

            currentToken = lexicTokens.shift();

        } else {
            result.push({
                errorName: "SyntacticError",
                errorMessage: syntacticErrors.UNEXPECTED_CHARACTER,
                errorLine: theFile.getCurLine()
            });
            return result;
        }
    }

    function analyseSimpleCommand() {

    }

    function analyseSubroutines() {

    }

    return result;
}

export { analyzeSyntactic };