import { myFile } from "./File";
import { Token, tokenSymbols, tokenMachine,posFixa } from "./Token";
import { analyseLexic } from "./lexicAnalyzer";
import { syntacticErrors } from "./Errors";


function analyzeSyntactic(file)  {
  let theFile = file;
  let currentToken = analyseLexic(theFile);
  let result = [];
  let expression = [];
  
	// São as nominações para onde será realizado o pulo (Ex: L"0", L"1", etc)
	let label = 0;

	// São as posições na memória que está alocado a variável
	let position = 0;
	let countVariable = 0;
	let variableOfAlloc = [];
	let flagProcedureList = [false];
	let flagFunctionList = [false];
	let nameOfFunction = [];
  let auxLabel = 0;
  let tokenAux = [];
  let isFunction = false;

  //======= Geração de codigo ========
  let code = "";
	let variableInMemory = 0;
  let variableAlloc = [];
  //======= Geração de codigo ========
  //======= Semantico ========
  let tableOfSymbols= [];
	let functionTokenList = [];
	let lineWithoutReturn;
  let line;
  let error;
  //======= Semantico ========

  if (currentToken[0]._symbol === tokenSymbols["programa"]) {
    //=========== INICIO DE GERAÇÃO DE CODIGO ===========
    createCode_3(tokenMachine["START"], tokenMachine["EMPTY"], tokenMachine["EMPTY"]);
    currentToken = analyseLexic(theFile);
   
    // se token.simbolo = sidentificador
    if (currentToken[0]._symbol === tokenSymbols["identificador"]) {
      insertProgram(currentToken[0]._symbol);
      currentToken = analyseLexic(theFile);
      
      // se token.simbolo = spontovirgula
      if (currentToken[0]._symbol === tokenSymbols[";"]) {
        analyzeBlock();

        // se token.simbolo = sponto
        if (currentToken[0]._symbol === tokenSymbols["."]) {
          // se fim do arquivo ou é comentário
          currentToken = analyseLexic(theFile);
          if (currentToken.length > 0) {
            result.push({
              errorName: "SyntacticError",
              errorMessage: syntacticErrors.UNEXPECTED_CHARACTER,
              errorLine: currentToken[0]._line,
            });
            //console.log(result);
            throw result;
          } else{
            createCode_3(tokenMachine["HLT"], tokenMachine["EMPTY"], tokenMachine["EMPTY"]);
            createFile(code, 'resultado.txt');
            cleanTableLevel();
            //console.log("Compilação realizada com sucesso.");
          }
          // TODO falta verificar array de tokens do léxico e imprimir erro no caso do Sintático todo estar OK
        } else {
          // senão ERRO -> faltando token ponto
          result.push({
            errorName: "SyntacticError",
            errorMessage: syntacticErrors.EXPECTING_DOT,
            errorLine: currentToken[0]._line,
          });
          //console.log(result);
          throw result;
        }
      } else {
        // senão ERRO -> faltando token ponto e vírgula
        result.push({
          errorName: "SyntacticError",
          errorMessage: syntacticErrors.EXPECTING_SEMICOLON,
          errorLine: currentToken[0]._line,
        });
        //console.log(result);
        throw result;
      }
    } else {
      // senão ERRO -> faltando nome do programa
      result.push({
        errorName: "SyntacticError",
        errorMessage: syntacticErrors.MISSING_PROGRAM_NAME,
        errorLine: currentToken[0]._line,
      });
      //console.log(result);
      throw result;
    }
  } else {
    // senão ERRO -> faltando token programa
    result.push({
      errorName: "SyntacticError",
      errorMessage: syntacticErrors.MISSING_PROGRAM_TOKEN,
      errorLine: currentToken[0]._line,
    });
    //console.log(result);
    throw result;
  }
  
  function analyzeBlock() {
    //console.log("..........[analyzeBlock]");
    currentToken = analyseLexic(theFile);
    
    //console.log(currentToken);
    
    analyzeVariableStage();
    analyzeSubroutines();
    analyzeCommands();

    if(variableOfAlloc.length > 0 && (!flagProcedureList[flagProcedureList.length - 1]) && (!flagFunctionList[flagFunctionList.length - 1])) {
			if(variableOfAlloc[variableOfAlloc.length - 1] > 0) {
				position = position - variableOfAlloc[variableOfAlloc.length - 1];
				createCode_2(tokenMachine["DALLOC"], -1);
				variableOfAlloc.pop(variableOfAlloc.length - 1);
			}
			else {
        variableOfAlloc.pop(variableOfAlloc.length - 1);
			}
		}
  }

  function analyzeVariableStage() {
    //console.log("..........[analyzeVariableStage]");
    if (currentToken[0]._symbol === tokenSymbols["var"]) { //if (token.getSymbol().equals(Constants.VAR_SIMBOLO)) {
      currentToken = analyseLexic(theFile);      //token = la.lexical();
      if (currentToken[0]._symbol === tokenSymbols["identificador"]) { //if (token.getSymbol().equals(Constants.IDENTIFICADOR_SIMBOLO)) {
        while (currentToken[0]._symbol === tokenSymbols["identificador"]) { //while (token.getSymbol().equals(Constants.IDENTIFICADOR_SIMBOLO)) {
          analyzeVariableDeclaration(); //analisaVariaveis();
          if (currentToken[0]._symbol === tokenSymbols[";"]) {
            currentToken = analyseLexic(theFile);
          } else {
            result.push({
              errorName: "SyntacticError",
              errorMessage: syntacticErrors.EXPECTING_SEMICOLON,
              errorLine: currentToken[0]._line,
            });
            //console.log(result);
            throw result;
          }
        }
      } else {
        result.push({
          errorName: "SyntacticError",
          errorMessage: syntacticErrors.INVALID_VARIABLE_NAME,
          errorLine: currentToken[0]._line,
        });
        //console.log(result);
        throw result;
      }
    }
    //console.log("oiiiiiiiiiiiiiiii")
		variableOfAlloc.push(countVariable);
		countVariable = 0;
		//console.log(variableOfAlloc)
		if(variableOfAlloc[variableOfAlloc.length - 1] > 0) {
			createCode_2(tokenMachine["ALLOC"], variableOfAlloc[variableOfAlloc.length - 1]);
		}
  }

  //ok
  function analyzeVariableDeclaration() {
    //console.log("..........[analyzeVariableDeclaration]");
    do {
      if (currentToken[0]._symbol === tokenSymbols["identificador"]) {
        //console.log(currentToken);
        searchInTableOfSymbols(currentToken);
				insertVariable(currentToken, position);
				countVariable++;
				position++;
        //console.log(tableOfSymbols)
        currentToken = analyseLexic(theFile);
        //console.log(currentToken);
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

              //console.log(result);
              throw result;
            }
          }
        } else {
          result.push({
            errorName: "SyntacticError",
            errorMessage: syntacticErrors.INVALID_VARIABLE_DECLARATION,
            errorLine: currentToken[0]._line,
          });
          //console.log(result);
          throw result;
        }
      } else {
        result.push({
          errorName: "SyntacticError",
          errorMessage: syntacticErrors.INVALID_VARIABLE_NAME,
          errorLine: currentToken[0]._line,
        });
        //console.log(result);
        throw result;
      }
    } while (currentToken[0]._symbol != tokenSymbols[":"]);

    analyzeType();
  }



  function analyzeType() {
    //console.log("..........[analyzeType]");
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
      //console.log(result);
      throw result;
    }else{
      insertTypeOnVariable(currentToken);
      //console.log("tipo")
      // AVISO - coloquei para fora pega token.
    }
    currentToken = analyseLexic(theFile);
    
    
  }

  function analyzeCommands() {
    //console.log("..........[analyzeCommands]");
    
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
          //console.log(result);
          throw result;
        }
      }

      currentToken = analyseLexic(theFile);
    } else {
      result.push({
        errorName: "SyntacticError",
        errorMessage: syntacticErrors.UNEXPECTED_CHARACTER,
        errorLine: currentToken[0]._line,
      });
      //console.log(result);
      throw result;
    }
  }

  function analyzeSimpleCommand() {
    //console.log("..........[analyzeSimpleCommand]");
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

  function analyzeAttributionProcedureCall() {
    //console.log("..........[analyzeAttributionProcedureCall]");
    tokenAux = currentToken;

    currentToken = analyseLexic(theFile);

    if (currentToken[0]._symbol === tokenSymbols[":="]) {
      //console.log("aqui")
      let recebe = searchVariableOrFunction(tokenAux); 
      
      analyzeAttribution(tokenAux);
    } else {
      analyzeProcedureCall(tokenAux);
    }
  }
  
  function analyzeRead() {
    createCode_3(tokenMachine["RD"], tokenMachine["EMPTY"], tokenMachine["EMPTY"]);
    currentToken = analyseLexic(theFile);

    if (currentToken[0]._symbol === tokenSymbols["("]) {
      currentToken = analyseLexic(theFile);

      if (currentToken[0]._symbol === tokenSymbols["identificador"]) {
        searchVariable(currentToken);
        createCode_3(tokenMachine["STR"], positionOfVariable(currentToken[0]._lexema), tokenMachine["EMPTY"]);
        currentToken = analyseLexic(theFile);

        if (currentToken[0]._symbol === tokenSymbols[")"]) {  
          currentToken = analyseLexic(theFile);
        } else {
          result.push({
            errorName: "SyntacticError",
            errorMessage: syntacticErrors.EXPECTING_CLOSE_PARENTHESIS,
            errorLine: currentToken[0]._line,
          });
          //console.log(result);
          throw result;
        }
      } else {
        result.push({
          errorName: "SyntacticError",
          errorMessage: syntacticErrors.INVALID_READ_COMMAND,
          errorLine: currentToken[0]._line,
        });
        //console.log(result);
        throw result;
      }
    } else {
      result.push({
        errorName: "SyntacticError",
        errorMessage: syntacticErrors.EXPECTING_OPEN_PARENTHESIS,
        errorLine: currentToken[0]._line,
      });
      //console.log(result);
      throw result;
    }
  }
  //ok
  function analyzeWrite() {
    currentToken = analyseLexic(theFile);

    if (currentToken[0]._symbol === tokenSymbols["("]) {
      currentToken = analyseLexic(theFile);

      if (currentToken[0]._symbol === tokenSymbols["identificador"]) {

        isFunction = searchVariableOrFunction(currentToken);
        
        if (isFunction) {
					let labelResult = searchFunctionLabel(currentToken);
					createCode_3(tokenMachine["CALL"],tokenMachine["LABEL"] + labelResult,tokenMachine["EMPTY"]);// erro aqui talvez
				} else {
					// LDV de Variável para o PRN
					let positionOfVar = positionOfVariable(currentToken[0]._lexema);
					createCode_3(tokenMachine["LDV"], positionOfVar,tokenMachine["EMPTY"]);
				}

        currentToken = analyseLexic(theFile);

        if (currentToken[0]._symbol === tokenSymbols[")"]) {

          createCode_3(tokenMachine["PRN"], tokenMachine["EMPTY"], tokenMachine["EMPTY"]);
          currentToken = analyseLexic(theFile);
        
        } else {
          result.push({
            errorName: "SyntacticError",
            errorMessage: syntacticErrors.EXPECTING_CLOSE_PARENTHESIS,
            errorLine: currentToken[0]._line,
          });
          //console.log(result);
          throw result;
        }
      } else {
        result.push({
          errorName: "SyntacticError",
          errorMessage: syntacticErrors.INVALID_READ_COMMAND,
          errorLine: currentToken[0]._line,
        });
        //console.log(result);
        throw result;
      }
    } else {
      result.push({
        errorName: "SyntacticError",
        errorMessage: syntacticErrors.EXPECTING_OPEN_PARENTHESIS,
        errorLine: currentToken[0]._line,
      });
      //console.log(result);
      throw result;
    }
  }


  function analyzeWhile() {
    //console.log("..........[analyzeWhile]");
    let auxrot1, auxrot2;

		auxrot1 = label;
		createCode_3(tokenMachine["LABEL"] + label,tokenMachine["NULL"],tokenMachine["EMPTY"]);
		label++;

    currentToken = analyseLexic(theFile);
    analyzeExpression();
    
    let aux = expressionToPostfix(expression);

		let newExpression = formatExpression(aux);
		createCode_1(newExpression);

		
    let type = returnTypeOfExpression(aux);
    
		whoCallsMe(type,tokenSymbols["enquanto"]);
    expression = [];

    if (currentToken[0]._symbol === tokenSymbols["faca"]) {
      auxrot2 = label;
      createCode_3(tokenMachine["JMPF"],tokenMachine["LABEL"] + label, tokenMachine["EMPTY"]);
      label++;

      currentToken = analyseLexic(theFile);
      analyzeSimpleCommand();

      createCode_3(tokenMachine["JMP"] ,tokenMachine["LABEL"]  + auxrot1,tokenMachine["EMPTY"]);
      createCode_3(tokenMachine["LABEL"] + auxrot2,tokenMachine["NULL"],tokenMachine["EMPTY"]);
      
    } else {
      result.push({
        errorName: "SyntacticError",
        errorMessage: syntacticErrors.EXPECTING_FAÇA_TOKEN,
        errorLine: currentToken[0]._line,
      });
      //console.log(result);
      throw result;
    }
  
  }
  //ok
  function analyzeIf() {
    //console.log("..........[analyzeIf]");

    let auxrot_1, auxrot_2;
    //console.log("ANALISA SE")
		auxLabel++;
		if (flagFunctionList[flagFunctionList.length - 1]) {
      //console.log("aqui")
			insertTokenOnFunctionList(new Token(currentToken[0]._symbol, currentToken[0]._lexema + auxLabel, currentToken[0]._line));// TODO
		}
		
    currentToken = analyseLexic(theFile);
    //console.log(currentToken)
    
    analyzeExpression();

		let aux = expressionToPostfix(expression);
		
		let newExpression = formatExpression(aux);
		createCode_1(newExpression);
		
    let type = returnTypeOfExpression(aux);
    console.log("type: "+type)
    //console.log(tokenSymbols["se"])
		whoCallsMe(type,tokenSymbols["se"]);
		expression = [];

    if (currentToken[0]._symbol === tokenSymbols["entao"]) {
      
      auxrot_1 = label;
      createCode_3(tokenMachine["JMPF"] ,tokenMachine["LABEL"] + label,tokenMachine["EMPTY"]);
      label++;

      if (flagFunctionList[flagFunctionList.length - 1]) {
				insertTokenOnFunctionList(new Token(currentToken[0]._symbol, currentToken[0]._lexema + auxLabel, currentToken[0]._line));
			}

      currentToken = analyseLexic(theFile);
      analyzeSimpleCommand();


      if (currentToken[0]._symbol === tokenSymbols["senao"]) {

        auxrot_2 = label;
				createCode_3(tokenMachine["JMP"],tokenMachine["LABEL"] + label,tokenMachine["EMPTY"]);
				label++;

				createCode_3(tokenMachine["LABEL"] + auxrot_1,tokenMachine["NULL"],tokenMachine["EMPTY"]);

				if (flagFunctionList[flagFunctionList.length - 1]) {
					insertTokenOnFunctionList(new Token(currentToken[0]._symbol, currentToken[0]._lexema + auxLabel, currentToken[0]._line));
				}

        currentToken = analyseLexic(theFile);
        analyzeSimpleCommand();
      
        createCode_3(tokenMachine["LABEL"] + auxrot_2,tokenMachine["NULL"],tokenMachine["EMPTY"]);
      }else{
        createCode_3(tokenMachine["LABEL"] + auxrot_1,tokenMachine["NULL"],tokenMachine["EMPTY"]);
      }
    } else {
      result.push({
        errorName: "SyntacticError",
        errorMessage: syntacticErrors.EXPECTING_ENTAO_TOKEN,
        errorLine: currentToken[0]._line,
      });
      //console.log(result);
      throw result;
    }
    if (flagFunctionList[flagFunctionList.length - 1]) {
			verifyFunctionList(String.valueOf(auxLabel)); // TODO
		}
		auxLabel--;
  }
  
  function analyzeSubroutines() {
    //console.log("..........[analyzeSubroutines]");
    let flag = 0;
    let auxrot = 0;

    if (
      currentToken[0]._symbol === tokenSymbols["procedimento"] ||
      currentToken[0]._symbol === tokenSymbols["funcao"]
    ) {
      auxrot = label;
			createCode_3(tokenMachine["JMP"],tokenMachine["LABEL"] + label,tokenMachine["EMPTY"]);
			label++;
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
        //console.log(result);
        throw result;
      }

      if (flag === 1) {
        createCode_3(tokenMachine["LABEL"] + auxrot,tokenMachine["NULL"],tokenMachine["EMPTY"]);
      }
    }
  }
  

  function analyzeProcedureDeclaration() {
    //console.log("..........[analyzeProcedureDeclaration]");
    
    flagProcedureList.push(true);

    currentToken = analyseLexic(theFile);

    if (currentToken[0]._symbol === tokenSymbols["identificador"]) {

      searchProcedureWithTheSameName(currentToken);
			insertProcOrFunc(currentToken,tokenSymbols["procedimento"], label);

			createCode_3(tokenMachine["LABEL"] + label, tokenMachine["NULL"],tokenMachine["EMPTY"]);
			label++;

      currentToken = analyseLexic(theFile);

      if (currentToken[0]._symbol === tokenSymbols[";"]) {
        analyzeBlock();
      } else {
        result.push({
          errorName: "SyntacticError",
          errorMessage: syntacticErrors.EXPECTING_SEMICOLON,
          errorLine: currentToken[0]._line,
        });
        //console.log(result);
        throw result;
      }
    } else {
      result.push({
        errorName: "SyntacticError",
        errorMessage: syntacticErrors.INVALID_PROCEDURE_DECLARATION,
        errorLine: currentToken[0]._line,
      });
      //console.log(result);
      throw result;
    }
    cleanTableLevel();

		if (variableOfAlloc[variableOfAlloc.length - 1] > 0) {
			position = position - variableOfAlloc[variableOfAlloc.length - 1];
			createCode_2(tokenMachine["DALLOC"], -1);
			variableOfAlloc.pop(variableOfAlloc.length - 1);
		}
		else {
			variableOfAlloc.pop(variableOfAlloc.length - 1);
		}
		
		createCode_3(tokenMachine["RETURN"],tokenMachine["EMPTY"] ,tokenMachine["EMPTY"]);
		
    flagProcedureList.pop(flagProcedureList.length - 1);// tem que remover a ultima posicao
  }
  

  function analyzeFunctionDeclaration() {
    flagFunctionList.push(true);
    currentToken = analyseLexic(theFile);

    if (currentToken[0]._symbol === tokenSymbols["identificador"]) {
      
      searchFunctionWithTheSameName(currentToken);
			insertProcOrFunc(currentToken,tokenSymbols["funcao"], label);

			createCode_3(tokenMachine["LABEL"] + label,tokenMachine["NULL"],tokenMachine["EMPTY"]);
			label++;
			
			nameOfFunction.push(currentToken[0]._lexema);
			setLine(currentToken[0]._line);

      currentToken = analyseLexic(theFile);

      if (currentToken[0]._symbol === tokenSymbols[":"]) {
        currentToken = analyseLexic(theFile);

        if (
          currentToken[0]._symbol === tokenSymbols["inteiro"] ||
          currentToken[0]._symbol === tokenSymbols["booleano"]
        ) {
          if (currentToken[0]._symbol === tokenSymbols["inteiro"]) {
						insertTypeOnFunction(tokenSymbols["inteiro"]);
					} else {
						insertTypeOnFunction(tokenSymbols["booleano"]);
          }
          
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
          //console.log(result);
          throw result;
        }
      } else {
        result.push({
          errorName: "SyntacticError",
          errorMessage: syntacticErrors.EXPECTING_COLON,
          errorLine: currentToken[0]._line,
        });
        //console.log(result);
        throw result;
      }
    } else {
      result.push({
        errorName: "SyntacticError",
        errorMessage: syntacticErrors.INVALID_FUNCTION_DECLARATION,
        errorLine: currentToken[0]._line,
      });
      //console.log(result);
      throw result;
    }

    cleanTableLevel();
		flagFunctionList.pop(flagFunctionList.length - 1);
		thisFunctionHasReturn(nameOfFunction[nameOfFunction.length - 1]);
		nameOfFunction.pop(nameOfFunction.length - 1);
		
		if(variableOfAlloc[variableOfAlloc.length - 1] > 0) {
			position = position - variableOfAlloc[variableOfAlloc.length - 1];
			createCode_2(tokenMachine["RETURNF"], -1);
			variableOfAlloc.pop(variableOfAlloc.length - 1);
		}
		else {
			createCode_2(tokenMachine["RETURNF"], 0);
			variableOfAlloc.pop(variableOfAlloc.length - 1);
		}
		clearFunctionList();

  }
  

  function analyzeExpression() {
    //console.log("..........[analyzeExpression]");
    analyzeSimpleExpression();

    let operatorsRegex = /smaior|smaiorig|sig|smenor|smenorig|sdif/g;
    if (currentToken[0]._symbol.match(operatorsRegex)) {
      expression.push(currentToken);
      currentToken = analyseLexic(theFile);
      analyzeSimpleExpression();
    }
  }
  

  function analyzeSimpleExpression() {
    
    //console.log("..........[analyzeSimpleExpression]");
 
    if (
      currentToken[0]._symbol === tokenSymbols["+"] ||
      currentToken[0]._symbol === tokenSymbols["-"]
    ) {
      let aux = new Token(currentToken[0]._symbol, currentToken[0]._lexema + "u", currentToken[0]._line)
      expression.push(aux);
      currentToken = analyseLexic(theFile);
        
     
    }
    analyzeTerm();
    while (
      currentToken[0]._symbol === tokenSymbols["+"] ||
      currentToken[0]._symbol === tokenSymbols["-"] ||
      currentToken[0]._symbol === tokenSymbols["ou"]
    ) {
      expression.push(currentToken);
      currentToken = analyseLexic(theFile);

      analyzeTerm();
    }
  }
  

  function analyzeTerm() {
    //console.log("..........[analyzeTerm]");
    analyzeFactor();

    while (
      currentToken[0]._symbol === tokenSymbols["*"] ||
      currentToken[0]._symbol === tokenSymbols["div"] ||
      currentToken[0]._symbol === tokenSymbols["e"]
    ) {
      expression.push(currentToken);
      currentToken = analyseLexic(theFile);

      analyzeFactor();
    }
  }
  

  function analyzeFactor() {
    //console.log("..........[analyzeFactor]");
    //console.log(currentToken[0]._symbol)
    if (currentToken[0]._symbol === tokenSymbols["identificador"]) {

      let index = searchSymbol(currentToken);
			if (isValidFunction(index)) {
				expression.push(currentToken);
				analyzeFunctionCall(index);
			} else {
				expression.push(currentToken);
				currentToken = analyseLexic(theFile);
      }
      
    } else {
      if (currentToken[0]._symbol === tokenSymbols["numero"]) {
        expression.push(currentToken);
        //console.log(expression[0])
        currentToken = analyseLexic(theFile);
      } else {
        if (currentToken[0]._symbol === tokenSymbols["nao"]) {
          expression.push(currentToken);
          currentToken = analyseLexic(theFile);
          analyzeFactor();
        } else {
          if (currentToken[0]._symbol === tokenSymbols["("]) {
            expression.push(currentToken);
            currentToken = analyseLexic(theFile);
            //console.log(currentToken)
            //console.log("expression")
            //console.log(expression)
            analyzeExpression();

            if (currentToken[0]._symbol === tokenSymbols[")"]) {
              expression.push(currentToken);
              currentToken = analyseLexic(theFile);
            } else {
              result.push({
                errorName: "SyntacticError",
                errorMessage: syntacticErrors.EXPECTING_CLOSE_PARENTHESIS,
                errorLine: currentToken[0]._line,
              });
              //console.log(result);
              throw result;
            }
          } else {
            if (
              currentToken[0]._symbol === tokenSymbols["verdadeiro"] ||
              currentToken[0]._symbol === tokenSymbols["falso"]
            ) {
              expression.push(currentToken);
              currentToken = analyseLexic(theFile);
            } else {

                result.push({
                  errorName: "SyntacticError",
                  errorMessage: syntacticErrors.INVALID_EXPRESSION,
                  errorLine: currentToken[0]._line,
                });
                //console.log(result);
                throw result;
            }
          }
        }
      }
    }
  }

  function analyzeAttribution(attributionToken) {  
    // Não precisa tratar separado, pode ser tratado como uma expressão, sintaticamente falando
    currentToken = analyseLexic(theFile);
    //console.log(currentToken)
    analyzeExpression();
    //console.log("oi")
    let aux = expressionToPostfix(expression);
    //console.log("sai posfix")
		//console.log(aux)
    let newExpression = formatExpression(aux);
		createCode_1(newExpression);
    //console.log("aqui")
    let type = returnTypeOfExpression(aux);
    //console.log("chamada whoCallsMe")
    //console.log(attributionToken[0]._lexema)
    //console.log(type)
		whoCallsMe(type, attributionToken[0]._lexema);

		expression = [];
		
		if (flagFunctionList[flagFunctionList.length - 1] && (nameOfFunction[nameOfFunction.length - 1]) === (attributionToken[0]._lexema)) {
			insertTokenOnFunctionList(attributionToken);
		}
		
		if (nameOfFunction.length > 0) {
			if (!((nameOfFunction[nameOfFunction.length - 1]) === (attributionToken[0]._lexema))) {
				createCode_3(tokenMachine["STR"], positionOfVariable(attributionToken[0]._lexema),tokenMachine["EMPTY"]);	
			}
		} else {
			createCode_3(tokenMachine["STR"], positionOfVariable(attributionToken[0]._lexema), tokenMachine["EMPTY"]);
		}

  }

  function analyzeProcedureCall(auxToken) {
    searchProcedure(auxToken);
		// se houver erro, dentro do semântico lancará a exceção. Caso seja um
		// procedimento
		// válido, continuará a excecução

		let labelResult = searchProcedureLabel(auxToken);
		createCode_3(tokenMachine["CALL"],tokenMachine["LABEL"] + labelResult,tokenMachine["EMPTY"]);
  }

  function analyzeFunctionCall(index) {

    let symbolLexema = getLexemaOfSymbol(index);
		searchFunction(new Token(tokenMachine["EMPTY"], symbolLexema,currentToken[0]._line));
		// se houver erro, dentro do semântico lancará a exceção. Caso seja uma funcao
		// válida, continuará a excecução

		currentToken = analyseLexic(theFile);
    // //console.log("..........[analyzeFunctionCall]");
    // currentToken = analyseLexic(theFile);
    // if(currentToken[0]._symbol === tokenSymbols[":="]){
    //   currentToken = analyseLexic(theFile);
    //   analyzeExpression();
    // }
  }
  //console.log(result);
  return result;

	//==================================================================================================================

	function createCode_3(value1, value2, value3) {

		code = code.concat(value1 + " ").concat(value2 + " ").concat(value3 + "\r\n");
    console.log(code);
	}

	function createCode_1(expressionPosFix) {
		let aux = expressionPosFix.split(" ");
    //console.log("createCode_1")
		for (let a = 0; a < aux.length; a++) {

			if (aux[a].includes("p")) {

				let value = aux[a].split("p");
				code = code.concat(tokenMachine["LDV"] + " ").concat(value[1]).concat("\r\n");

			} else if (aux[a] == "funcao") {

				let value = aux[a].split("funcao");
				code = code.concat(tokenMachine["CALL"] + " ").concat(tokenMachine["LABEL"] + value[1]).concat("\r\n");
				
			} else if (aux[a] == posFixa["MAIS"]) {
				code = code.concat(tokenMachine["ADD"]).concat("\r\n");
			} else if (aux[a] == posFixa["MENOS"]) {
				code = code.concat(tokenMachine["SUB"]).concat("\r\n");
			} else if (aux[a] == posFixa["MULTIPLICACAO"]) {
				code = code.concat(tokenMachine["MULT"]).concat("\r\n");
			} else if (aux[a] == posFixa["DIVISAO"]) {
				code = code.concat(tokenMachine["DIVI"]).concat("\r\n");
			} else if (aux[a] == posFixa["E"]) {
				code = code.concat(tokenMachine["AND"]).concat("\r\n");
			} else if (aux[a] == posFixa["OU"]) {
				code = code.concat(tokenMachine["OR"]).concat("\r\n");
			} else if (aux[a] == posFixa["MENOR"]) {
				code = code.concat(tokenMachine["CME"]).concat("\r\n");
			} else if (aux[a] == posFixa["MAIOR"]) {
				code = code.concat(tokenMachine["CMA"]).concat("\r\n");
			} else if (aux[a] == posFixa["IGUAL"]) {
				code = code.concat(tokenMachine["CEQ"]).concat("\r\n");
			} else if (aux[a] == posFixa["DIFERENTE"]) {
				code = code.concat(tokenMachine["CDIF"]).concat("\r\n");
			} else if (aux[a] == posFixa["MENOR_IGUAL"]) {
				code = code.concat(tokenMachine["CMEQ"]).concat("\r\n");
			} else if (aux[a] == posFixa["MAIOR_IGUAL"]) {
				code = code.concat(tokenMachine["CMAQ"]).concat("\r\n");
			} else if (aux[a] == posFixa["MENOS_UNARIO"]) {
				code = code.concat(tokenMachine["INV"]).concat("\r\n");
			} else if (aux[a] == posFixa["MAIS_UNARIO"]) {
				// do nothing
			} else if (aux[a] == posFixa["NAO"]) {
				code = code.concat(tokenMachine["NEG"]).concat("\r\n");
			} else {
				if(aux[a] == tokenSymbols["verdadeiro"]) {
					code = code.concat(tokenMachine["LDC"]).concat(" 1").concat("\r\n");
				} else if(aux[a] == tokenSymbols["falso"]) {
					code = code.concat(tokenMachine["LDC"]).concat(" 0").concat("\r\n");
				} else if(aux[a] == tokenMachine["EMPTY"]){
					// do nothing
				} else {
					code = code.concat(tokenMachine["LDC"] + " ").concat(aux[a]).concat("\r\n");
				}
			}
    }
    console.log(code);
	}

	function createCode_2(command, countVariable) {
    //console.log("createCode_2")
    //console.log("command: "+command)
		if (tokenMachine["ALLOC"] == (command)) {
      //console.log("eae")
      
			code = code.concat(command + " ").concat(variableInMemory + " ").concat(countVariable + "\r\n");
			variableInMemory = variableInMemory + countVariable;
			variableAlloc.push(countVariable);
		}
		else {		
			
			if (countVariable == 0) {
				code = code.concat(command + "\r\n");
			} else {
				let position = variableAlloc.length - 1;
				let countVariableToDalloc = variableAlloc[position];
				
				variableInMemory = variableInMemory - countVariableToDalloc;
				code = code.concat(command + " ").concat(variableInMemory + " ").concat(countVariableToDalloc + "\r\n");
				variableAlloc.pop(position);	
			}		
				
			
    }
    console.log(code);
	}
	
	function createFile(codeGenerated, fileName) {
    console.log("CHEGUEI NO FINAL");

    // cria um Blob, para poder montar o arquivo txt resultante da compilação
    const codeBlob = new Blob([codeGenerated], { type: 'text/plain' });
    const a = document.createElement('a');

    a.setAttribute('download', fileName);
    a.setAttribute('href', window.URL.createObjectURL(codeBlob));
    a.click();
    window.URL.revokeObjectURL(a);
	}


  //-------------------------------------------------------------------------------------------



	/* Métodos envolvidos com a Tabela de Símbolos */

	/* Métodos de inserção */

	// Programa
	function insertProgram(token) {
		tableOfSymbols.push({lexema: token[0]._symbol,closed: false,type: null,label: -1,position: -1, token: 'programa'});
    
  }

	// Procedimento ou Função
	function insertProcOrFunc(token,type,label) {
		if (tokenSymbols["PROCEDIMENTO"] === type) {
			tableOfSymbols.push({lexema: token[0]._lexema,closed: false,type: null,label: label,position: -1, token: 'procedimento'});
		} else if (tokenSymbols["FUNCAO"] === type) {
			tableOfSymbols.push({lexema: token[0]._lexema,closed: false,type: null,label: label,position: -1, token: 'funcao'});
		}
	}

	// Variável
	function insertVariable(token, position) {
    //console.log(token)
    //console.log(position)
		tableOfSymbols.push({lexema: token[0]._lexema,closed: false,type: null,label: -1,position: position, token: 'variavel'});
	}

	// Tipo Função
	function insertTypeOnFunction(type) {

		let symbol = tableOfSymbols[tableOfSymbols.length - 1];

		if (symbol[0].token === 'funcao' && symbol[0].type == null) {
			tableOfSymbols[tableOfSymbols.length - 1].type = type;
		}
	}

	// Tipo Variável
	function insertTypeOnVariable(type/*token Tipo*/) {
		
		for (let i = (tableOfSymbols.length - 1); i > 0; i--) {
			if (tableOfSymbols[i].token === 'variavel') {
				if (tableOfSymbols[i].type == null) {
					tableOfSymbols[i].type = type[0]._lexema;
				}
			}else{
				break;
			}
		}
	}

	/* Métodos de busca */



	function searchFunction(token){
		if (!(searchFunction2(token[0]._lexema))) {
			throw "Função '" + token[0].lexema + "' não está declarada.\nLinha: " + token[0]._line;
		}
	}
	function searchFunctionLabel(token){
		let labelResult = searchFunctionLabel2(token[0]._lexema);

		if (labelResult == -1) {
			throw "Função '" + token[0]._lexema + "' não está declarada.\nLinha: " + token[0]._line;
		} else {
			return labelResult;
		}
	}

	function searchFunctionLabel2(lexema) {
		for (let i = (tableOfSymbols.length - 1); i >= 0; i--) {
			if (tableOfSymbols[i] == 'funcao') {
				if (lexema == tableOfSymbols[i].lexema) {
					return tableOfSymbols[i].label;
				}
			}
		}

		return -1;
	}

	function searchFunctionWithTheSameName(token){
		for (let i = (tableOfSymbols.length - 1); i >= 0; i--) {
			if (token[0]._lexema = tableOfSymbols[i].lexema) {
				throw "Já existe uma função com o mesmo nome da função da linha: " + token[0]._line;
			}
		}
	}

	function searchInTableOfSymbols(token)  {
		if (search(token[0]._lexema)) {
			throw "Já existe uma variável com o mesmo nome da variável da linha: " + token[0]._line;
		}
	}

	function search(lexema) {
		let i;
    //console.log(lexema);
    //console.log(tableOfSymbols.length);
		for (i = (tableOfSymbols.length - 1); i >= 0; i--) {
      //console.log(tableOfSymbols[i].token);
			if (tableOfSymbols[i].token == 'variavel') {
        //console.log("aqui")
        //console.log(lexema)
        //console.log(tableOfSymbols[i].lexema)
				if (lexema == tableOfSymbols[i].lexema) {
					return true;
				}
			}else{
				break;
			}
		}

		for (let j = i; j >= 0; j--) {
			if (tableOfSymbols[i].token === 'procedimento' || tableOfSymbols[i].token === 'funcao' ) {
				if (lexema = tableOfSymbols[i].lexema) {
					return true;
				}
			}
		}

		return lookProgramName(lexema);
	}

	function lookProgramName(lexema) {
		if (lexema = tableOfSymbols[0].lexema) {
			return true;
		}
		return false;
	}

	function searchProcedure(token) {
		if (!(searchProcedure2(token[0]._lexema))) {
			throw "Procedimento '" + token[0]._lexema + "' não está declarado.\nLinha: " + token[0]._line;
		}
	}

	function searchProcedure2(lexema) {
		for (let i = (tableOfSymbols.length - 1); i >= 0; i--) {
			if (tableOfSymbols[i].token === 'procedimento') {
				if (lexema = tableOfSymbols[i].lexema) {
					return true;
				}
			}
		}

		return lookProgramName(lexema);
	}

	function searchProcedureLabel(token)  {
		let labelResult = searchProcedureLabel2(token[0]._lexema);

		if (labelResult == -1) {
			throw "Procedimento '" + token[0]._lexema + "' não está declarado.\nLinha: " + token[0]._line;
		} else {
			return labelResult;
		}
	}

	function searchProcedureLabel2(lexema) {
		for (let i = (tableOfSymbols.length - 1); i >= 0; i--) {
			if (tableOfSymbols[i] === 'procedimento') {
				if (lexema = tableOfSymbols[i].lexema) {
					return tableOfSymbols[i].label;
				}
			}
		}
		return -1;
	}

	function searchProcedureWithTheSameName(token)  {
		if (searchProcedure2(token[0]._lexema)) {
			throw "Já existe um procedimento com o mesmo nome do procedimento da linha: " + token[0]._line;
		}
	}

	function searchSymbol(token)  {
		let index = searchSymbol2(token[0]._lexema);

		if (index >= 0) {
			return index;
		}

		throw "Variável ou Função '" + token[0]._lexema + "' não está definida no escopo atual. \n Linha: " + token[0]._line;
	}

	function searchSymbol2(lexema) {
		for (let i = (tableOfSymbols.length - 1); i >= 0; i--) {
			if (tableOfSymbols[i].token === 'variavel' || tableOfSymbols[i] === 'funcao') {
				if (lexema == tableOfSymbols[i].lexema) {
					return i;
				}
			}
		}
		return -1;
	}

	function searchVariable(token)  {
		if (!(searchVariable2(token[0]._lexema))) {
			throw "A variável " + token[0]._lexema + " não está definida.\nLinha: " + token[0]._line;
		}
	}
	
	function searchVariable2(lexema) {
    //console.log(lexema)
		for (let i = (tableOfSymbols.length - 1); i >= 0; i--) {
			if (tableOfSymbols[i].token === 'variavel') {
				if (lexema == tableOfSymbols[i].lexema) {
          //console.log("achou?")
					return true;
				}
			}
		}

		return lookProgramName(lexema);
	}

	function  searchVariableOrFunction(token)  {
    //console.log("token: "+token)
    //console.log(token)
		if (!(searchVariable2(token[0]._lexema) || searchFunction2(token[0]._lexema))) {
			throw "A variável ou função " + token[0]._lexema + " não está definida.\n Linha: " + token[0]._line;
		} else {
      // Variável
      
			if (searchVariable2(token[0]._lexema)) {
				return false;
			}
			// Função
			return true;
		}
	}


  function searchFunction2(lexema){
    
		for (let i = (tableOfSymbols.length - 1); i >= 0; i--) {
			if (tableOfSymbols[i].token === 'funcao') {

				if (lexema == tableOfSymbols[i].lexema) {
					return true;
				}
			}
		}

		return lookProgramName(lexema);
	}

	/* Métodos de recuperação */
	function getLexemaOfSymbol(index) {
		return getSymbol2(index);
	}
	function getSymbol2(index) {
		return tableOfSymbols[index].lexema;
	}

	/* Outros métodos sobre a tabela de simbolos */
	function  isValidFunction(index) {
		if ((tableOfSymbols[index].type == tokenSymbols["inteiro"] || tableOfSymbols[index].type == tokenSymbols["booleano"])) {
			return true;
		}
		return false;
	}



	function cleanTableLevel() {
		for (let i = (tableOfSymbols.length - 1); i > 0; i--) {
			if (tableOfSymbols[i].token == 'funcao' || tableOfSymbols[i].token == 'procedimento') {
				if (!tableOfSymbols[i].closed) {
					tableOfSymbols[i].closed = true;
					break;
				} else {
					tableOfSymbols.pop(i);
				}
			} else {
				tableOfSymbols.pop(i);
			}
		}
	}
	
	function searchTypeOfVariableOrFunction( lexema) {
    //console.log("searchTypeOfVariableOrFunction")

		for (let i = (tableOfSymbols.length - 1); i >= 0; i--) {

      //console.log("lexema: "+tableOfSymbols[i].lexema+" igual: "+lexema)
			if (tableOfSymbols[i].token == 'variavel' || tableOfSymbols[i].token == 'funcao') {
				if (lexema == tableOfSymbols[i].lexema) {
          
					return tableOfSymbols[i].type;
				}
			}
		}
		return null;
	}

	function searchPositionOfVariable(variable) {
    //console.log(variable)
    //console.log(tableOfSymbols)
		for (let i = (tableOfSymbols.length - 1); i >= 0; i--) {
			if (tableOfSymbols[i].token == 'variavel') {
        //console.log("to AQUI")
        //console.log(variable)
        //console.log(tableOfSymbols[i].lexema)
				if (variable == (tableOfSymbols[i].lexema)) {
          
					return tableOfSymbols[i].position;
				}
			}
		}
		return -1;
	}


	/* Métodos Semânticos */

	function expressionToPostfix(expression2) {

		let stack = [];
    let output = "";

		for (let a = 0; a < expression2.length; a++) {
      let parcel = expression2[a][0]._lexema;
      
			line = expression2[a][0]._line; 
			
			if (tokenSymbols["numero"] == expression2[a][0]._symbol ||
			tokenSymbols["identificador"] == expression2[a][0]._symbol || 
			tokenSymbols["verdadeiro"] == expression2[a][0]._symbol ||
			tokenSymbols["falso"] == expression2[a][0]._symbol) {

        output = output.concat(parcel + " ");

			} else if (tokenSymbols["("] === (expression2[a][0]._symbol)) {
        console.log("final")
				stack.push(parcel);
			} else if (tokenSymbols[")"] === (expression2[a][0]._symbol)) {
        let stackTop = stack.length - 1;

				while (stack[stackTop]  !== "(") {

          output = output.concat(stack[stackTop] + " ");

					stack.pop(stackTop);
          stackTop--;

        }
        //console.log("remove")
				stack.pop(stackTop); // remove o abre parenteses sem inclui-lo na saida

			} else {

				if (stack.length === 0) {
          
          stack.push(parcel);
          
				} else {
					let newOperatorPriority;
					let stackTopOperatorPriority;
          let stackTop = stack.length - 1;
          
					do {
            newOperatorPriority = defineOperatorsPriority(parcel);
						stackTopOperatorPriority = defineOperatorsPriority(stack[stackTop]);
						if (stackTopOperatorPriority >= newOperatorPriority) {
							output = output.concat(stack[stackTop] + " ");
							stack.pop(stackTop);
							stackTop--;
						}

					} while (stackTopOperatorPriority >= newOperatorPriority && (stack.length > 0));

					if (stackTopOperatorPriority < newOperatorPriority || stack.length ===  0) {
						stack.push(parcel);
					}
        }
        
      }  
      
		}
    
    let stackTop = stack.length - 1;
		if (stack.length > 0) {
      console.log("aqui")
			for (let i = stackTop; i >= 0; i--) {

				output = output.concat(stack[i] + " ");
        stack.pop(i);
        console.log(output)
			}
		}
    
		return output;
	}

	function returnTypeOfExpression(expression2)  {
    //console.log("returnTypeOfExpression")
    console.log(expression2)
		let type = separatePostFixExpression(expression2);
    //console.log("Type:"+type)
		if (type == "0") {
			return "inteiro";
		} else {
			return "booleano";
		}
	}

	function separatePostFixExpression(expression2)  {
    //console.log("separatePostFixExpression")
    let aux = expression2.split(" "); 
    console.log(aux);
    let expressionList = aux;
    let count = expressionList.length

		for (let j = 0; j < count; j++) {
      let parcel = expressionList[j];
      //console.log(expressionList)
      
			if (!(isOperator(parcel)) && !(isUnaryOperator(parcel))) {
        // !(false && false) = true
				if (tokenSymbols["inteiro"] == (searchTypeOfVariableOrFunction(parcel))) {
          //console.log("Inteiro")
          expressionList[j] = "0";
           
				} else {
          if (tokenSymbols["booleano"] == (searchTypeOfVariableOrFunction(parcel))) {
            //console.log("Booleano")
            expressionList[j] = "1"; 
          } else {
            if (tokenSymbols["verdadeiro"] == (parcel) || tokenSymbols["falso"] == (parcel)) {
              //console.log("Verdadeiro ou Falso")
              expressionList[j] = "1"; 
            } else {

              expressionList[j] = "0";
              //console.log(expressionList) 
            }
          }
        }
			}

		}
    console.log(expressionList);

		for (let i = 0; i < expressionList.length; i++) {
      //console.log("Operador: "+expressionList[i])
			if (isOperator(expressionList[i])) {
				let operation = returnOperationType(expressionList[i - 2], expressionList[i - 1],expressionList[i]);
        console.log("começa aqui");
        //console.log(operation)
        console.log("i: "+i)
        console.log(expressionList)
        expressionList.splice(i,1);
        console.log(expressionList)
        expressionList.splice(i - 1,1);
        console.log(expressionList)
        expressionList[i - 2]=  operation;
        console.log(expressionList)

        i = 0;
        console.log("i: "+i)
			} else if (isUnaryOperator(expressionList[i])) {
        //console.log("oi")
				let operation = returnOperationType(expressionList[i - 1], null, expressionList[i]);

				expressionList.pop(i);
				expressionList.pop(i - 1);
				expressionList.push(i - 1, operation);

				i = 0;
			}
		}
		return expressionList[0];
	}

	function isOperator(parcel) {
  //console.log(parcel)
  //console.log(posFixa["MULTIPLICACAO"])
  //console.log(posFixa["MAIS"])
		if (posFixa["MULTIPLICACAO"] == (parcel) || posFixa["DIVISAO"] == (parcel) || posFixa["MAIS"] == (parcel)
				|| posFixa["MENOS"] == (parcel) || posFixa["MAIOR"] == (parcel) || posFixa["MENOR"] == (parcel)
				|| posFixa["MAIOR_IGUAL"] == (parcel) || posFixa["MENOR_IGUAL"] == (parcel)
				|| posFixa["IGUAL"] == (parcel) || posFixa["DIFERENTE"] == (parcel) || posFixa["E"] == (parcel)
				|| posFixa["OU"] == (parcel)) {

			return true;
		}

		return false;
	}

	function returnOperationType( firstType,  secondType,  operator)  {
		// 0 representa um tipo inteiro
		// 1 representa um tipo booleano

		if (isOperator(operator)) {
			if (isMathOperator(operator)) {
				if (firstType == "0" && secondType == "0") {
					return "0";
				}

				throw "Operações aritméticas(+ | - | * | div) devem envolver duas variáveis inteiras.\n" + "Linha: " + line;
			} else if (isRelationalOperator(operator)) {
				if (firstType == "0" && secondType == "0") {
					return "1";
				}

				throw "Operações relacionais(!= | = | < | <= | > | >=) devem envolver duas variáveis inteiras.\n" + "Linha: " + line;
			} else {
				if (firstType == "1" && secondType == "1") {
					return "1";
				}

				throw "Operações lógicas(e | ou) devem envolver duas variáveis booleanas.\n" + "Linha: " + line;
			}
		} else {
			if (isUnaryMathOperator(operator)) {
				if (firstType == "0") {
					return "0";
				}

				throw "Operações envolvendo operadores unários(+ | -) devem ser com variáveis inteiras.\n" + "Linha: " + line;
			} else {
				if (firstType == "1") {
					return "1";
				}

				throw "Operações envolvendo operador unário(NÃO) devem ser com variáveis booleanas.\n" + "Linha: " + line;
			}
		}
	}

	function isUnaryOperator(parcel) {

		if (posFixa["MAIS_UNARIO"] == (parcel) || posFixa["MENOS_UNARIO"] == (parcel)
				|| posFixa["NAO"] == (parcel)) {
			return true;
		}

		return false;
	}

	function isUnaryMathOperator(parcel) {

		if (posFixa["MAIS_UNARIO"] == (parcel) || posFixa["MENOS_UNARIO"] == (parcel)) {
			return true;
		}

		return false;
	}

	function isMathOperator( parcel) {

		if (posFixa["MULTIPLICACAO"] == (parcel) || posFixa["DIVISAO"] == (parcel) || posFixa["MAIS"] == (parcel)
				|| posFixa["MENOS"] == (parcel)) {

			return true;
		}

		return false;
	}

	function isRelationalOperator( parcel) {

		if (posFixa["MAIOR"] == (parcel) || posFixa["MENOR"] == (parcel) || posFixa["MAIOR_IGUAL"] == (parcel)
				|| posFixa["MENOR_IGUAL"] == (parcel) || posFixa["IGUAL"] == (parcel)
				|| posFixa["DIFERENTE"] == (parcel)) {
			return true;
		}
		return false;
	}

	function defineOperatorsPriority(operator) {
		if (posFixa["MAIS_UNARIO"] == (operator) || posFixa["MENOS_UNARIO"] == (operator)
				|| posFixa["NAO"] == (operator)) {
			return 5;
		} else if (posFixa["MULTIPLICACAO"] == (operator) || posFixa["DIVISAO"] == (operator)) {
			return 4;
		} else if (posFixa["MAIS"] == (operator) || posFixa["MENOS"] == (operator)) {
			return 3;
		} else if (posFixa["MAIOR"] == (operator) || posFixa["MENOR"] == (operator)
				|| posFixa["MAIOR_IGUAL"] == (operator) || posFixa["MENOR_IGUAL"] == (operator)
				|| posFixa["IGUAL"] == (operator) || posFixa["DIFERENTE"] == (operator)) {
			return 2;
		} else if (posFixa["E"] == (operator)) {
			return 1;
		} else if (posFixa["OU"] == (operator)) {
			return 0;
		}

		return -1;
	}

	function whoCallsMe( type, caller)  {
    console.log(tokenSymbols["se"])
    console.log(caller);
		if (tokenSymbols["se"] === (caller) || tokenSymbols["enquanto"] === (caller)) {
      console.log("aqui");
      console.log(type);
      console.log(tokenSymbols["booleano"]);
			if ("booleano" !== (type)) {
				throw "A condição presente no '" + caller + "' deveria resultar num tipo booleano";
			}
		} else {
      let callerType = searchTypeOfVariableOrFunction(caller);
      //console.log(callerType)
      //console.log(type)
			if (!(type == (callerType))) {
				throw "Não é possível realizar a atribuição de uma expressão do tipo " + type + " em uma variável/função do tipo " + callerType;
			}
		}
	}

	function positionOfVariable(variable) {
		let position = searchPositionOfVariable(variable);

		return position;
	}

	// Formata a expressão para usar na geração de código
	function formatExpression(expression) {
    console.log(" formatExpression")
    let aux = expression.split(" "); 
    //console.log(aux)
		let newExpression = "";
		let auxPosition;

		for (let i = 0; i < aux.length; i++) {
      //console.log(aux[i])
			if(!searchFunction2(aux[i])) {
        //console.log("oi")
				auxPosition = searchPositionOfVariable(aux[i]);
        //console.log(auxPosition)
				if (auxPosition != -1) {
					newExpression = newExpression.concat("p" + auxPosition + " ");
				} else {
					newExpression = newExpression.concat(aux[i] + " ");
				}
			} else {
				let labelResult = searchFunctionLabel(aux[i]);
				newExpression = newExpression.concat("funcao" + labelResult + " ");
			}
			
		}
    console.log("acabou formatExpression")
		return newExpression;
	}

	
	/* Métodos envolvendo o retorno de função */
	
	function insertTokenOnFunctionList(token) {
		functionTokenList.push(token);
	}
	
	function verifyFunctionList(label) {
		let auxToken = null;
		
		let conditionalThenReturn = false;
		let conditionalElseReturn = false;
		let thenPosition = -1;
		let elsePosition = thenPosition;
		
		for(let i = 0; i < functionTokenList.length; i++) {
			if(tokenSymbols["se"] == (functionTokenList[i]._symbol)
			   && functionTokenList[i]._lexema.includes(label)) {
				functionTokenList.pop(i);
				i--;
			} else if (tokenSymbols["entao"] == (functionTokenList[i]._symbol) 
					&& functionTokenList[i]._lexema.includes(label)) {
				if(functionTokenList.length > (i + 1)) {
					if (tokenSymbols["identificador"] == (functionTokenList[i + 1]._symbol)) {
						conditionalThenReturn = true;
						auxToken = functionTokenList[i + 1];
					}	
				} else {
					lineWithoutReturn = functionTokenList[i]._line;
				}
				thenPosition = i;
			}  else if (tokenSymbols["senao"] == (functionTokenList[i]._symbol) 
					&& functionTokenList[i]._lexema.includes(label)) {
				if(functionTokenList.length > (i + 1)) {
					if (tokenSymbols["identificador"] == (functionTokenList[i + 1]._symbol)) {
						conditionalElseReturn = true;
						elsePosition = i + 1;
						auxToken = functionTokenList[i + 1];
					} 	
				} else {
					lineWithoutReturn = functionTokenList[i]._line;
					elsePosition = i;
				}
				
			}
		}
		
		if(elsePosition == (-1)) elsePosition = functionTokenList.length - 1;
		
		removeIf(elsePosition, thenPosition, (conditionalThenReturn && conditionalElseReturn), auxToken);
	}
	
	function  thisFunctionHasReturn(nameOfFunction) {
		let aux = 0;
		
		for(let i = 0 ; i < functionTokenList.length; i++ ) {
			if (nameOfFunction == (functionTokenList[i]._lexema)) {
				aux++;
				if (aux == functionTokenList.length) {
					return true;
				}
			}	
		}
		
		

		error = true;
		if (lineWithoutReturn != 0)	line = lineWithoutReturn;
		
		throw "Nem todos os caminhos possíveis da função possuem retorno." + "\nLinha: " + line;
	}
	
	function removeIf(start,end,functionReturn, tokenFunction) {
		for(let i = start; i >= end; i--) {
			functionTokenList.pop(i);
		}
		
		if(functionReturn && tokenFunction != null) {
			functionTokenList.push(tokenFunction);
		}
	}
	
	function clearFunctionList() {
		functionTokenList = [];
  }
  
	function setLine(line) {
		this.line = line;
	}
  
}

export { analyzeSyntactic };
