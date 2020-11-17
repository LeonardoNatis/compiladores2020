import { myFile } from "./File";
import { Token, tokenSymbols } from "./Token";
import { analyseLexic } from "./lexicAnalyzer";
import { syntacticErrors } from "./Errors";

function analyzeSyntactic(file) {
  let theFile = file;
  let currentToken = analyseLexic(theFile);
  let result = [];

  // Lexico(Token)
  // ok
  if (currentToken[0]._symbol === tokenSymbols["programa"]) {
    // Lexico(Token)
    currentToken = analyseLexic(theFile);

    // se token.simbolo = sidentificador
    if (currentToken[0]._symbol === tokenSymbols["identificador"]) {
      // Lexico(Token)
      currentToken = analyseLexic(theFile);

      // se token.simbolo = spontovirgula
      if (currentToken[0]._symbol === tokenSymbols[";"]) {
        analyzeBlock();

        // se token.simbolo = sponto
        if (currentToken[0]._symbol === tokenSymbols["."]) {
          // se fim do arquivo ou é comentário

          if (currentToken[0]._symbol) {
            result.push({
              errorName: "SyntacticError",
              errorMessage: syntacticErrors.UNEXPECTED_CHARACTER,
              errorLine: currentToken[0]._line,
            });
            console.log(result);
            return result;
          }
          console.log("sucesso");
          // falta verificar array de tokens do léxico e imprimir erro no caso do Sintático todo estar OK
        } else {
          // senão ERRO -> faltando token ponto
          result.push({
            errorName: "SyntacticError",
            errorMessage: syntacticErrors.EXPECTING_DOT,
            errorLine: currentToken[0]._line,
          });
          console.log(result);
          return result;
        }
      } else {
        // senão ERRO -> faltando token ponto e vírgula
        result.push({
          errorName: "SyntacticError",
          errorMessage: syntacticErrors.EXPECTING_SEMICOLON,
          errorLine: currentToken[0]._line,
        });
        console.log(result);
        return result;
      }
    } else {
      // senão ERRO -> faltando nome do programa
      result.push({
        errorName: "SyntacticError",
        errorMessage: syntacticErrors.MISSING_PROGRAM_NAME,
        errorLine: currentToken[0]._line,
      });
      console.log(result);
      return result;
    }
  } else {
    // senão ERRO -> faltando token programa
    result.push({
      errorName: "SyntacticError",
      errorMessage: syntacticErrors.MISSING_PROGRAM_TOKEN,
      errorLine: currentToken[0]._line,
    });
    console.log(result);
    return result;
  }
  //ok
  function analyzeBlock() {
    console.log("..........[analyzeBlock]");
    currentToken = analyseLexic(theFile);

    analyzeVariableStage();
    analyzeSubroutines();
    analyzeCommands();
  }
  //ok
  function analyzeVariableStage() {
    console.log("..........[analyzeVariableStage]");
    if (currentToken[0]._symbol === tokenSymbols["var"]) {
      currentToken = analyseLexic(theFile);

      if (currentToken[0]._symbol === tokenSymbols["identificador"]) {
        while (currentToken[0]._symbol === tokenSymbols["identificador"]) {
          analyzeVariableDeclaration();

          if (currentToken[0]._symbol === tokenSymbols[";"]) {
            currentToken = analyseLexic(theFile);
          } else {
            result.push({
              errorName: "SyntacticError",
              errorMessage: syntacticErrors.EXPECTING_SEMICOLON,
              errorLine: currentToken[0]._line,
            });
            console.log(result);
            return result;
          }
        }
      } else {
        result.push({
          errorName: "SyntacticError",
          errorMessage: syntacticErrors.INVALID_VARIABLE_NAME,
          errorLine: currentToken[0]._line,
        });
        console.log(result);
        return result;
      }
    }
  }
  //ok
  function analyzeVariableDeclaration() {
    console.log("..........[analyzeVariableDeclaration]");
    do {
      if (currentToken[0]._symbol === tokenSymbols["identificador"]) {
        currentToken = analyseLexic(theFile);

        if (
          currentToken[0]._symbol === tokenSymbols[","] ||
          currentToken[0]._symbol === tokenSymbols[":"]
        ) {
          if (currentToken[0]._symbol === tokenSymbols[","]) {
            currentToken = analyseLexic(theFile);

            if (currentToken[0]._symbol === tokenSymbols[":"]) {
              result.push({
                errorName: "SyntacticError",
                errorMessage: syntacticErrors.INVALID_VARIABLE_DECLARATION,
                errorLine: currentToken[0]._line,
              });

              console.log(result);
              return result;
            }
          }
        } else {
          result.push({
            errorName: "SyntacticError",
            errorMessage: syntacticErrors.INVALID_VARIABLE_DECLARATION,
            errorLine: currentToken[0]._line,
          });
          console.log(result);
          return result;
        }
      } else {
        result.push({
          errorName: "SyntacticError",
          errorMessage: syntacticErrors.INVALID_VARIABLE_NAME,
          errorLine: currentToken[0]._line,
        });
        console.log(result);
        return result;
      }
    } while (currentToken[0]._symbol != tokenSymbols[":"]);

    analyzeType();
  }
  //ok
  function analyzeType() {
    console.log("..........[analyzeType]");
    currentToken = analyseLexic(theFile);

    if (
      currentToken[0]._symbol !== tokenSymbols["inteiro"] &&
      currentToken[0]._symbol !== tokenSymbols["booleano"]
    ) {
      result.push({
        errorName: "SyntacticError",
        errorMessage: syntacticErrors.INVALID_DATA_TYPE,
        errorLine: currentToken[0]._line,
      });
      console.log(result);
      return result;
    }else{
      currentToken = analyseLexic(theFile);
    }
    
  }
  //ok
  function analyzeCommands() {
    console.log("..........[analyzeCommands]");
    if (currentToken[0]._symbol === tokenSymbols["inicio"]) {
      currentToken = analyseLexic(theFile);

      analyzeSimpleCommand();

      while (currentToken[0]._symbol !== tokenSymbols["fim"]) {
        if (currentToken[0]._symbol === tokenSymbols[";"]) {
          currentToken = analyseLexic(theFile);

          if (currentToken[0]._symbol !== tokenSymbols["fim"]) {
            analyzeSimpleCommand();
          }
        } else {
          result.push({
            errorName: "SyntacticError",
            errorMessage: syntacticErrors.NOT_A_STATEMENT,
            errorLine: currentToken[0]._line,
          });
          console.log(result);
          return result;
        }
      }

      currentToken = analyseLexic(theFile);
    } else {
      result.push({
        errorName: "SyntacticError",
        errorMessage: syntacticErrors.UNEXPECTED_CHARACTER,
        errorLine: currentToken[0]._line,
      });
      console.log(result);
      return result;
    }
  }
  //ok
  function analyzeSimpleCommand() {
    console.log("..........[analyzeSimpleCommand]");
    if (currentToken[0]._symbol === tokenSymbols["identificador"]) {
      analyzeAttributionProcedureCall();
    } else if (currentToken[0]._symbol === tokenSymbols["se"]) {
      analyzeIf();
    } else if (currentToken[0]._symbol === tokenSymbols["enquanto"]) {
      analyzeWhile();
    } else if (currentToken[0]._symbol === tokenSymbols["leia"]) {
      analyzeRead();
    } else if (currentToken[0]._symbol === tokenSymbols["escreva"]) {
      analyzeWrite();
    } else {
      analyzeCommands();
    }
  }
  //ok
  function analyzeAttributionProcedureCall() {
    console.log("..........[analyzeAttributionProcedureCall]");
    currentToken = analyseLexic(theFile);

    if (currentToken[0]._symbol === tokenSymbols[":="]) {
      currentToken = analyseLexic(theFile);
      analyzeAttribution();
    } else {
      analyzeProcedureCall();
    }
  }
  //ok
  function analyzeRead() {
    currentToken = analyseLexic(theFile);

    if (currentToken[0]._symbol === tokenSymbols["("]) {
      currentToken = analyseLexic(theFile);

      if (currentToken[0]._symbol === tokenSymbols["identificador"]) {
        currentToken = analyseLexic(theFile);

        if (currentToken[0]._symbol === tokenSymbols[")"]) {
          currentToken = analyseLexic(theFile);
        } else {
          result.push({
            errorName: "SyntacticError",
            errorMessage: syntacticErrors.EXPECTING_CLOSE_PARENTHESIS,
            errorLine: currentToken[0]._line,
          });
          console.log(result);
          return result;
        }
      } else {
        result.push({
          errorName: "SyntacticError",
          errorMessage: syntacticErrors.INVALID_READ_COMMAND,
          errorLine: currentToken[0]._line,
        });
        console.log(result);
        return result;
      }
    } else {
      result.push({
        errorName: "SyntacticError",
        errorMessage: syntacticErrors.EXPECTING_OPEN_PARENTHESIS,
        errorLine: currentToken[0]._line,
      });
      console.log(result);
      return result;
    }
  }
  //ok
  function analyzeWrite() {
    currentToken = analyseLexic(theFile);

    if (currentToken[0]._symbol === tokenSymbols["("]) {
      currentToken = analyseLexic(theFile);

      if (currentToken[0]._symbol === tokenSymbols["identificador"]) {
        currentToken = analyseLexic(theFile);

        if (currentToken[0]._symbol === tokenSymbols[")"]) {
          currentToken = analyseLexic(theFile);
        } else {
          result.push({
            errorName: "SyntacticError",
            errorMessage: syntacticErrors.EXPECTING_CLOSE_PARENTHESIS,
            errorLine: currentToken[0]._line,
          });
          console.log(result);
          return result;
        }
      } else {
        result.push({
          errorName: "SyntacticError",
          errorMessage: syntacticErrors.INVALID_READ_COMMAND,
          errorLine: currentToken[0]._line,
        });
        console.log(result);
        return result;
      }
    } else {
      result.push({
        errorName: "SyntacticError",
        errorMessage: syntacticErrors.EXPECTING_OPEN_PARENTHESIS,
        errorLine: currentToken[0]._line,
      });
      console.log(result);
      return result;
    }
  }
  //ok
  function analyzeWhile() {
    console.log("..........[analyzeWhile]");
    currentToken = analyseLexic(theFile);
    analyzeExpression();
    if (currentToken[0]._symbol === tokenSymbols["faca"]) {
      currentToken = analyseLexic(theFile);

      analyzeSimpleCommand();
    } else {
      result.push({
        errorName: "SyntacticError",
        errorMessage: syntacticErrors.EXPECTING_FAÇA_TOKEN,
        errorLine: currentToken[0]._line,
      });
      console.log(result);
      return result;
    }
  
  }
  //ok
  function analyzeIf() {
    console.log("..........[analyzeIf]");
    currentToken = analyseLexic(theFile);

    analyzeExpression();

    if (currentToken[0]._symbol === tokenSymbols["entao"]) {
      currentToken = analyseLexic(theFile);
      analyzeSimpleCommand();

      if (currentToken[0]._symbol === tokenSymbols["senao"]) {
        currentToken = analyseLexic(theFile);

        analyzeSimpleCommand();
      }
    } else {
      result.push({
        errorName: "SyntacticError",
        errorMessage: syntacticErrors.EXPECTING_ENTAO_TOKEN,
        errorLine: currentToken[0]._line,
      });
      console.log(result);
      return result;
    }
  }
  //ok
  function analyzeSubroutines() {
    console.log("..........[analyzeSubroutines]");
    let flag = 0;

    if (
      currentToken[0]._symbol === tokenSymbols["procedimento"] ||
      currentToken[0]._symbol === tokenSymbols["funcao"]
    ) {
      // TODO: Code generating
      flag = 1;
    }

    while (
      currentToken[0]._symbol === tokenSymbols["procedimento"] ||
      currentToken[0]._symbol === tokenSymbols["funcao"]
    ) {
      if (currentToken[0]._symbol === tokenSymbols["procedimento"]) {
        analyzeProcedureDeclaration();
      } else {
        analyzeFunctionDeclaration();
      }

      if (currentToken[0]._symbol === tokenSymbols[";"]) {
        currentToken = analyseLexic(theFile);
      } else {
        result.push({
          errorName: "SyntacticError",
          errorMessage: syntacticErrors.EXPECTING_SEMICOLON,
          errorLine: currentToken[0]._line,
        });
        console.log(result);
        return result;
      }

      if (flag === 1) {
        // TODO: Code generating
      }
    }
  }
  //ok
  function analyzeProcedureDeclaration() {
    console.log("..........[analyzeProcedureDeclaration]");
    currentToken = analyseLexic(theFile);

    if (currentToken[0]._symbol === tokenSymbols["identificador"]) {
      currentToken = analyseLexic(theFile);

      if (currentToken[0]._symbol === tokenSymbols[";"]) {
        analyzeBlock();
      } else {
        result.push({
          errorName: "SyntacticError",
          errorMessage: syntacticErrors.EXPECTING_SEMICOLON,
          errorLine: currentToken[0]._line,
        });
        console.log(result);
        return result;
      }
    } else {
      result.push({
        errorName: "SyntacticError",
        errorMessage: syntacticErrors.INVALID_PROCEDURE_DECLARATION,
        errorLine: currentToken[0]._line,
      });
      console.log(result);
      return result;
    }
  }
  //ok
  function analyzeFunctionDeclaration() {
    currentToken = analyseLexic(theFile);

    if (currentToken[0]._symbol === tokenSymbols["identificador"]) {
      currentToken = analyseLexic(theFile);

      if (currentToken[0]._symbol === tokenSymbols[":"]) {
        currentToken = analyseLexic(theFile);

        if (
          currentToken[0]._symbol === tokenSymbols["inteiro"] ||
          currentToken[0]._symbol === tokenSymbols["booleano"]
        ) {
          currentToken = analyseLexic(theFile);

          if (currentToken[0]._symbol === tokenSymbols[";"]) {
            analyzeBlock();
          }
        } else {
          result.push({
            errorName: "SyntacticError",
            errorMessage: syntacticErrors.INVALID_FUNCTION_DECLARATION,
            errorLine: currentToken[0]._line,
          });
          console.log(result);
          return result;
        }
      } else {
        result.push({
          errorName: "SyntacticError",
          errorMessage: syntacticErrors.EXPECTING_COLON,
          errorLine: currentToken[0]._line,
        });
        console.log(result);
        return result;
      }
    } else {
      result.push({
        errorName: "SyntacticError",
        errorMessage: syntacticErrors.INVALID_FUNCTION_DECLARATION,
        errorLine: currentToken[0]._line,
      });
      console.log(result);
      return result;
    }
  }
  //ok
  function analyzeExpression() {
    console.log("..........[analyzeExpression]");
    analyzeSimpleExpression();

    let operatorsRegex = /smaior|smaiorig|sig|smenor|smenorig|sdif/g;
    if (currentToken[0]._symbol.match(operatorsRegex)) {
      currentToken = analyseLexic(theFile);
      analyzeSimpleExpression();
    }
  }
  //ok
  function analyzeSimpleExpression() {
    
    console.log("..........[analyzeSimpleExpression]");
 
    if (
      currentToken[0]._symbol === tokenSymbols["+"] ||
      currentToken[0]._symbol === tokenSymbols["-"]
    ) {
        currentToken = analyseLexic(theFile);
        

       
    }
    analyzeTerm();
    while (
      currentToken[0]._symbol === tokenSymbols["+"] ||
      currentToken[0]._symbol === tokenSymbols["-"] ||
      currentToken[0]._symbol === tokenSymbols["ou"]
    ) {
      currentToken = analyseLexic(theFile);

      analyzeTerm();
    }
  }
  //ok
  function analyzeTerm() {
    console.log("..........[analyzeTerm]");
    analyzeFactor();

    while (
      currentToken[0]._symbol === tokenSymbols["*"] ||
      currentToken[0]._symbol === tokenSymbols["div"] ||
      currentToken[0]._symbol === tokenSymbols["e"]
    ) {
      currentToken = analyseLexic(theFile);

      analyzeFactor();
    }
  }
  //ok
  function analyzeFactor() {
    console.log("..........[analyzeFactor]");
    
    if (currentToken[0]._symbol === tokenSymbols["identificador"]) {
      analyzeFunctionCall();
      // TODO: Semantic analysis (variables and function)
    } else {
      if (currentToken[0]._symbol === tokenSymbols["numero"]) {
        currentToken = analyseLexic(theFile);
      } else {
        if (currentToken[0]._symbol === tokenSymbols["nao"]) {
          currentToken = analyseLexic(theFile);
          analyzeFactor();
        } else {
          if (currentToken[0]._symbol === tokenSymbols["("]) {
            currentToken = analyseLexic(theFile);

            analyzeExpression();

            if (currentToken[0]._symbol === tokenSymbols[")"]) {
              currentToken = analyseLexic(theFile);
            } else {
              result.push({
                errorName: "SyntacticError",
                errorMessage: syntacticErrors.EXPECTING_CLOSE_PARENTHESIS,
                errorLine: currentToken[0]._line,
              });
              console.log(result);
              return result;
            }
          } else {
            if (
              currentToken[0]._symbol === tokenSymbols["verdadeiro"] ||
              currentToken[0]._symbol === tokenSymbols["falso"]
            ) {
              currentToken = analyseLexic(theFile);
            } else {

                result.push({
                  errorName: "SyntacticError",
                  errorMessage: syntacticErrors.INVALID_EXPRESSION,
                  errorLine: currentToken[0]._line,
                });
                console.log(result);
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
    console.log("..........[analyzeFunctionCall]");
    currentToken = analyseLexic(theFile);
    if(currentToken[0]._symbol === tokenSymbols[":="]){
      currentToken = analyseLexic(theFile);
      analyzeExpression();
    }
  }

  console.log(result);
  return result;
}

export { analyzeSyntactic };
