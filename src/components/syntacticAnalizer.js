import { myFile } from "./File";
import { Token, tokenSymbols } from "./Token";
import { analyseLexic } from './lexicAnalyzer';
import { syntacticErrors } from './Errors';

function analyzeSyntactic(file) {
    let theFile = file;
    let lexicTokens = analyseLexic(theFile);  // passa por todos os tokens léxicos

    let auxTokenList = lexicTokens;
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
                analyzeBlock();

                // se token.simbolo = sponto
                if (currentToken._symbol === tokenSymbols['.']) {

                    // se fim do arquivo ou é comentário

                    if (lexicTokens.shift()) {
                        result.push({
                            errorName: "SyntacticError",
                            errorMessage: syntacticErrors.UNEXPECTED_CHARACTER,
                            errorLine: currentToken._line
                        });
                        return result;
                    }

                    // falta verificar array de tokens do léxico e imprimir erro no caso do Sintático todo estar OK

                } else { // senão ERRO -> faltando token ponto
                    result.push({
                        errorName: "SyntacticError",
                        errorMessage: syntacticErrors.EXPECTING_DOT,
                        errorLine: currentToken._line
                    });
                    return result;
                }

            } else { // senão ERRO -> faltando token ponto e vírgula
                result.push({
                    errorName: "SyntacticError",
                    errorMessage: syntacticErrors.EXPECTING_SEMICOLON,
                    errorLine: currentToken._line
                });
                return result;
            }

        } else { // senão ERRO -> faltando nome do programa
            result.push({
                errorName: "SyntacticError",
                errorMessage: syntacticErrors.MISSING_PROGRAM_NAME,
                errorLine: currentToken._line
            });
            return result;
        }

    } else { // senão ERRO -> faltando token programa
        result.push({
            errorName: "SyntacticError",
            errorMessage: syntacticErrors.MISSING_PROGRAM_TOKEN,
            errorLine: currentToken._line
        });
        return result;
    }

    function analyzeBlock() {
        currentToken = lexicTokens.shift();

        analyzeVariableStage();
        analyzeSubroutines();
        analyzeCommands();
    }

    function analyzeVariableStage() {
        if (currentToken._symbol === tokenSymbols['var']) {
            currentToken = lexicTokens.shift();

            if (currentToken._symbol === tokenSymbols['identificador']) {

                while (currentToken._symbol === tokenSymbols['identificador']) {
                    analyzeVariableDeclaration();

                    if (currentToken._symbol === tokenSymbols[';']) {
                        currentToken = lexicTokens.shift();
                    } else {
                        result.push({
                            errorName: "SyntacticError",
                            errorMessage: syntacticErrors.EXPECTING_SEMICOLON,
                            errorLine: currentToken._line
                        });
                        return result;
                    }

                }

            } else {
                result.push({
                    errorName: "SyntacticError",
                    errorMessage: syntacticErrors.INVALID_VARIABLE_NAME,
                    errorLine: currentToken._line
                });
                return result;
            }
        }
    }

    function analyzeVariableDeclaration() {
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
                                errorLine: currentToken._line
                            });
                            return result;
                        }
                    }

                } else {
                    result.push({
                        errorName: "SyntacticError",
                        errorMessage: syntacticErrors.INVALID_VARIABLE_DECLARATION,
                        errorLine: currentToken._line
                    });
                    return result;
                }

            } else {
                result.push({
                    errorName: "SyntacticError",
                    errorMessage: syntacticErrors.INVALID_VARIABLE_NAME,
                    errorLine: currentToken._line
                });
                return result;
            }

        } while (currentToken._symbol === tokenSymbols[':']);

        currentToken = lexicTokens.shift();
        analyzeType();
    }

    function analyzeType() {
        if (currentToken._symbol !== tokenSymbols['inteiro'] || currentToken._symbol !== tokenSymbols['booleano']) {
            result.push({
                errorName: "SyntacticError",
                errorMessage: syntacticErrors.INVALID_DATA_TYPE,
                errorLine: currentToken._line
            });
            return result;
        }

        currentToken = lexicTokens.shift();
    }

    function analyzeCommands() {
        if (currentToken._symbol === tokenSymbols['inicio']) {
            currentToken = lexicTokens.shift();

            analyzeSimpleCommand();

            while (currentToken._symbol !== tokenSymbols['fim']) {
                if (currentToken._symbol === tokenSymbols[';']) {

                    currentToken = lexicTokens.shift();

                    if (currentToken._symbol !== tokenSymbols['fim']) {
                        analyzeSimpleCommand();
                    }

                } else {
                    result.push({
                        errorName: "SyntacticError",
                        errorMessage: syntacticErrors.NOT_A_STATEMENT,
                        errorLine: currentToken._line
                    });
                    return result;
                }
            }

            currentToken = lexicTokens.shift();

        } else {
            result.push({
                errorName: "SyntacticError",
                errorMessage: syntacticErrors.UNEXPECTED_CHARACTER,
                errorLine: currentToken._line
            });
            return result;
        }
    }

    function analyzeSimpleCommand() {
        if (currentToken._symbol === tokenSymbols['identificador']) {
            analyzeAttributionProcedureCall();
        } else if (currentToken._symbol === tokenSymbols['se']) {
            analyzeIf();
        } else if (currentToken._symbol === tokenSymbols['enquanto']) {
            analyzeWhile();
        } else if (currentToken._symbol === tokenSymbols['leia']) {
            analyzeRead();
        } else if (currentToken._symbol === tokenSymbols['escreva']) {
            analyzeWrite();
        } else {
            analyzeCommands();
        }
    }

    function analyzeAttributionProcedureCall() {
        currentToken = lexicTokens.shift();

        if (currentToken._symbol === tokenSymbols[':=']) {
            analyzeAttribution();
        } else {
            analyzeProcedureCall();
        }
    }

    function analyzeRead() {
        currentToken = lexicTokens.shift();

        if (currentToken._symbol === tokenSymbols['(']) {
            currentToken = lexicTokens.shift();

            if (currentToken._symbol === tokenSymbols['identificador']) {
                currentToken = lexicTokens.shift();
                
                if (currentToken._symbol === tokenSymbols[')']) {
                    currentToken = lexicTokens.shift();
                } else {
                    result.push({
                        errorName: "SyntacticError",
                        errorMessage: syntacticErrors.EXPECTING_CLOSE_PARENTHESIS,
                        errorLine: currentToken._line
                    });
                    return result;
                }
            } else {
                result.push({
                    errorName: "SyntacticError",
                    errorMessage: syntacticErrors.INVALID_READ_COMMAND,
                    errorLine: currentToken._line
                });
                return result;
            }
        } else {
            result.push({
                errorName: "SyntacticError",
                errorMessage: syntacticErrors.EXPECTING_OPEN_PARENTHESIS,
                errorLine: currentToken._line
            });
            return result;
        }
    }

    function analyzeWrite() {
        currentToken = lexicTokens.shift();

        if (currentToken._symbol === tokenSymbols['(']) {
            currentToken = lexicTokens.shift();

            if (currentToken._symbol === tokenSymbols['identificador']) {
                currentToken = lexicTokens.shift();
                
                if (currentToken._symbol === tokenSymbols[')']) {
                    currentToken = lexicTokens.shift();
                } else {
                    result.push({
                        errorName: "SyntacticError",
                        errorMessage: syntacticErrors.EXPECTING_CLOSE_PARENTHESIS,
                        errorLine: currentToken._line
                    });
                    return result;
                }
            } else {
                result.push({
                    errorName: "SyntacticError",
                    errorMessage: syntacticErrors.INVALID_READ_COMMAND,
                    errorLine: currentToken._line
                });
                return result;
            }
        } else {
            result.push({
                errorName: "SyntacticError",
                errorMessage: syntacticErrors.EXPECTING_OPEN_PARENTHESIS,
                errorLine: currentToken._line
            });
            return result;
        }
    }

    function analyzeWhile() {
        currentToken = lexicTokens.shift();

        analyzeExpression();

        if (currentToken._symbol === tokenSymbols['faca']) {
            currentToken = lexicTokens.shift();

            analyzeSimpleCommand();
        } else {
            result.push({
                errorName: "SyntacticError",
                errorMessage: syntacticErrors.EXPECTING_FAÇA_TOKEN,
                errorLine: currentToken._line
            });
            return result;
        }
    }

    function analyzeIf() {
        currentToken = lexicTokens.shift();

        analyzeExpression();

        if (currentToken._symbol === tokenSymbols['entao']) {
            currentToken = lexicTokens.shift();

            analyzeSimpleCommand();

            if (currentToken._symbol === tokenSymbols['senao']) {
                currentToken = lexicTokens.shift();

                analyzeSimpleCommand();
            }
        } else {
            result.push({
                errorName: "SyntacticError",
                errorMessage: syntacticErrors.EXPECTING_ENTAO_TOKEN,
                errorLine: currentToken._line
            });
            return result;
        }
    }

    function analyzeSubroutines() {
        let flag = 0;

        if (currentToken._symbol === tokenSymbols['procedimento'] || currentToken._symbol === tokenSymbols['funcao']) {
            // TODO: Code generating
            flag = 1;
        }

        while (currentToken._symbol === tokenSymbols['procedimento'] || currentToken._symbol === tokenSymbols['funcao']) {
            if (currentToken._symbol === tokenSymbols['procedimento']) {
                analyzeProcedureDeclaration();
            } else {
                analyzeFunctionDeclaration();
            }

            if (currentToken._symbol === tokenSymbols[';']) {
                currentToken = lexicTokens.shift();
            } else {
                result.push({
                    errorName: "SyntacticError",
                    errorMessage: syntacticErrors.EXPECTING_SEMICOLON,
                    errorLine: currentToken._line
                });
                return result;
            }

            if (flag === 1) {
                // TODO: Code generating
            }
        }
    }

    function analyzeProcedureDeclaration() {
        currentToken = lexicTokens.shift();

        if (currentToken._symbol === tokenSymbols['identificador']) {
            currentToken = lexicTokens.shift();

            if (currentToken._symbol === tokenSymbols[';']) {
                analyzeBlock();
            } else {
                result.push({
                    errorName: "SyntacticError",
                    errorMessage: syntacticErrors.EXPECTING_SEMICOLON,
                    errorLine: currentToken._line
                });
                return result;    
            }
        } else {
            result.push({
                errorName: "SyntacticError",
                errorMessage: syntacticErrors.INVALID_PROCEDURE_DECLARATION,
                errorLine: currentToken._line
            });
            return result;
        }
    }

    function analyzeFunctionDeclaration() {
        currentToken = lexicTokens.shift();

        if (currentToken._symbol === tokenSymbols['identificador']) {
            currentToken = lexicTokens.shift();

            if (currentToken._symbol === tokenSymbols[':']) {
                currentToken = lexicTokens.shift();

                if (currentToken._symbol === tokenSymbols['inteiro'] || currentToken._symbol === tokenSymbols['booleano']) {
                    currentToken = lexicTokens.shift();

                    if (currentToken._symbol === tokenSymbols[';']) {
                        analyzeBlock();
                    }
                } else {
                    result.push({
                        errorName: "SyntacticError",
                        errorMessage: syntacticErrors.INVALID_FUNCTION_DECLARATION,
                        errorLine: currentToken._line
                    });
                    return result;
                }
            } else {
                result.push({
                    errorName: "SyntacticError",
                    errorMessage: syntacticErrors.EXPECTING_COLON,
                    errorLine: currentToken._line
                });
                return result;
            }
        } else {
            result.push({
                errorName: "SyntacticError",
                errorMessage: syntacticErrors.INVALID_FUNCTION_DECLARATION,
                errorLine: currentToken._line
            });
            return result;
        }
    }

    function analyzeExpression() {
        analyzeSimpleExpression();
        
        let operatorsRegex = /smaior|smaior|smaiorig|sig|smenor|smenorig|sdif/g;
        if (currentToken._symbol.match(operatorsRegex)) {
            currentToken = lexicTokens.shift();

            analyzeSimpleExpression();
        }
    }

    function analyzeSimpleExpression() {
        if (currentToken._symbol === tokenSymbols['<'] || currentToken._symbol === tokenSymbols['>']) {
            currentToken = lexicTokens.shift();

            analyzeTerm();

            while (currentToken._symbol === tokenSymbols['<'] || currentToken._symbol === tokenSymbols['>'] || currentToken._symbol === tokenSymbols['ou']) {
                currentToken = lexicTokens.shift();

                analyzeTerm();
            }
        }
    }

    function analyzeTerm() {
        analyzeFactor();

        while (currentToken._symbol === tokenSymbols['*'] || currentToken._symbol === tokenSymbols['div'] || currentToken._symbol === tokenSymbols['e']) {
            currentToken = lexicTokens.shift();
            
            analyzeFactor();
        }
    }

    function analyzeFactor() {
        if (currentToken._symbol === tokenSymbols['identificador']) {
            analyzeFunctionCall();
            // TODO: Semantic analysis (variables and function)

        } else {
            if (currentToken._symbol === tokenSymbols['numero']) {
                currentToken = lexicTokens.shift();
            } else {
                if (currentToken._symbol === tokenSymbols['nao']) {
                    currentToken = lexicTokens.shift();
                    analyzeFactor();
                } else {
                    if (currentToken._symbol === tokenSymbols['(']) {
                        currentToken = lexicTokens.shift();
                        
                        analyzeExpression();

                        if (currentToken._symbol === tokenSymbols[')']) {
                            currentToken = lexicTokens.shift();
                        } else {
                            result.push({
                                errorName: "SyntacticError",
                                errorMessage: syntacticErrors.EXPECTING_CLOSE_PARENTHESIS,
                                errorLine: currentToken._line
                            });
                            return result;
                        }
                    } else {
                        if (currentToken._symbol === tokenSymbols['verdadeiro'] || currentToken._symbol === tokenSymbols['falso']) {
                            currentToken = lexicTokens.shift();
                        } else {
                            result.push({
                                errorName: "SyntacticError",
                                errorMessage: syntacticErrors.INVALID_EXPRESSION ,
                                errorLine: currentToken._line
                            });
                            return result;
                        }
                    }
                }
            }
        }
    }

    function analyzeAttribution() {
        // Não precisa tratar separado, pode ser tratado como uma expressão, sintaticamente falando
        analyzeExpression();
    }

    function analyzeProcedureCall() {
        // Não precisa de nada no Sintático
    }

    function analyzeFunctionCall() {
        currentToken = lexicTokens.shift();
    }

    return result;
}

export { analyzeSyntactic };