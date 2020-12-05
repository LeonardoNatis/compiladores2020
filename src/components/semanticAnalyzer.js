import { tokenSymbols, posFixa } from "./Token";

function semanticAnalyzer (){
	let tableOfSymbols= [];
	let functionTokenList = [];
	let lineWithoutReturn;
	let line;


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

		for (i = (tableOfSymbols.length - 1); i >= 0; i--) {
			if (tableOfSymbols[i].token === 'variavel') {
				if (lexema = tableOfSymbols[i].lexema) {
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
				if (lexema = tableOfSymbols[i].lexema) {
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
		for (let i = (tableOfSymbols.length - 1); i >= 0; i--) {
			if (tableOfSymbols[i].token === 'variavel') {
				if (lexema = tableOfSymbols[i].lexema) {
					return true;
				}
			}
		}

		return lookProgramName(lexema);
	}

	function  searchVariableOrFunction(token)  {
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

	function searchFunction2(lexema) {
		for (let i = (tableOfSymbols.length - 1); i >= 0; i--) {
			if (lexema = tableOfSymbols[i].lexema) {
				return true;
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
		for (let i = (tableOfSymbols.length - 1); i >= 0; i--) {
			if (tableOfSymbols[i].token == 'variavel' || tableOfSymbols[i].token == 'funcao') {
				if (lexema == tableOfSymbols[i].lexema) {
					return tableOfSymbols[i].type;
				}
			}
		}
		return null;
	}

	function searchPositionOfVariable(variable) {
		for (let i = (tableOfSymbols.length - 1); i >= 0; i--) {
			if (tableOfSymbols[i].token == 'variavel') {
				if (variable == (tableOfSymbols[i].lexema)) {
					return tableOfSymbols[i].position;
				}
			}
		}
		return -1;
	}


	/* Métodos Semânticos */

	function expressionToPostfix(expression) {
		let stack = [];
		let output = "";

		for (let a = 0; a < expression.length; a++) {
			let parcel = expression[a]._lexema;
			line = expression[a]._line; 
			
			if (tokenSymbols["numero"] == expression[a]._symbol ||
			tokenSymbols["identificador"] == expression[a]._symbol || 
			tokenSymbols["verdadeiro"] == expression[a]._symbol ||
			tokenSymbols["falso"] == expression[a]._symbol) {

				output = output.concat(parcel + " ");
			} else if (tokenSymbols["("] == (expression[a]._symbol)) {
				stack.push(parcel);
			} else if (tokenSymbols[")"] == (expression[a]._symbol)) {
				let stackTop = stack.length - 1;
				while (!(tokenSymbols["("] == (stack[stackTop]))) {
					output = output.concat(stack[stackTop] + " ");
					stack.pop(stackTop);
					stackTop--;
				}
				console.log("remove")
				stack.pop(stackTop); // remove o abre parenteses sem inclui-lo na saida

			} else {
				if (stack == null) {
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

					} while (stackTopOperatorPriority >= newOperatorPriority && !(stack == null));

					if (stackTopOperatorPriority < newOperatorPriority || stack ==  null) {
						stack.push(parcel);
					}
				}
			}

		}

		let stackTop = stack.length - 1;
		if (!stack ==  null) {
			for (let i = stackTop; i >= 0; i--) {
				output = output.concat(stack[i] + " ");
				stack.pop(i);
			}
		}

		return output;
	}

	function returnTypeOfExpression(expression)  {
		let type = separatePostFixExpression(expression);

		if (type == "0") {
			return tokenSymbols["inteiro"];
		} else {
			return tokenSymbols["booleano"];
		}
	}

	function separatePostFixExpression(expression)  {
		let aux = expression.split(" "); // TODO
		let expressionList = aux;

		for (let j = 0; j < expressionList.length; j++) {
			let parcel = expressionList[j];
			if (!(isOperator(parcel)) && !(isUnaryOperator(parcel))) {
				if (tokenSymbols["inteiro"] == (searchTypeOfVariableOrFunction(parcel))) {
					expressionList.push(j, "0"); 
				} else if (tokenSymbols["booleano"] == (searchTypeOfVariableOrFunction(parcel))) {
					expressionList.push(j, "1"); 
				} else if (tokenSymbols["verdadeiro"] == (parcel) || tokenSymbols["falso"] == (parcel)) {
					expressionList.push(j, "1"); 
				} else {
					expressionList.push(j, "0"); 
				}
			}

		}

		for (let i = 0; i < expressionList.length; i++) {
			if (isOperator(expressionList[i])) {

				let operation = returnOperationType(expressionList[i - 2], expressionList[i - 1],
						expressionList[i]);

				expressionList.pop(i);
				expressionList.pop(i - 1);
				expressionList.pop(i - 2);
				expressionList.push(i - 2, operation);

				i = 0;
			} else if (isUnaryOperator(expressionList[i])) {
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
		if (tokenSymbols["se"] == (caller) || tokenSymbols["enquanto"] == (caller)) {
			if (!(tokenSymbols["booleano"] == (type))) {
				throw "A condição presente no '" + caller + "' deveria resultar num tipo booleano";
			}
		} else {
			let callerType = searchTypeOfVariableOrFunction(caller);

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
		let aux = expression.split(" "); // TODO
		let newExpression = "";
		let auxPosition;

		for (let i = 0; i < aux.length; i++) {
			if(!tableOfSymbols.searchFunction2(aux[i])) {
				auxPosition = searchPositionOfVariable(aux[i]);

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
			   && functionTokenList[i]._lexema == label) {
				functionTokenList.pop(i);
				i--;
			} else if (tokenSymbols["entao"] == (functionTokenList[i]._symbol) 
					&& functionTokenList[i]._lexema == label) {
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
					&& functionTokenList[i]._lexema == label) {
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
	
}
export { semanticAnalyzer };