import { Token, posFixa, tokenMachine, tokenSymbols } from "./Token";
//import { createCode_1, createCode_2, createCode_3, createFile } from "./codeGenerator";
//import { insertProgram, cleanTableLevel, insertVariable, searchInTableOfSymbols, insertTypeOnVariable, searchVariableOrFunction, positionOfVariable,
//searchFunctionLabel, expressionToPostfix, formatExpression, whoCallsMe, insertTokenOnFunctionList, returnTypeOfExpression, verifyFunctionList, 
//searchProcedureWithTheSameName, insertProcOrFunc, searchFunctionWithTheSameName, setLine, insertTypeOnFunction, thisFunctionHasReturn,clearFunctionList,
//searchSymbol, isValidFunction, searchProcedure, searchProcedureLabel, getLexemaOfSymbol,searchFunction} from "./semanticAnalyzer";

function codeGenerator() {

	let code = "";
	let variableInMemory = 0;
	let variableAlloc = [];

	function createCode_3(value1, value2, value3) {

		code = code.concat(value1 + " ").concat(value2 + " ").concat(value3 + "\r\n");

	}

	function createCode_1(expressionPosFix) {
		let aux = expressionPosFix.split(" ");

		for (let a = 0; a < aux.length; a++) {
			if (aux[a].contains("p")) {

				let value = aux[a].split("p");
				code = code.concat(tokenMachine["LDV"] + " ").concat(value[1]).concat("\r\n");

			} else if (aux[a] == "funcao") {

				let value = aux[a].split("funcao");
				code = code.concat(tokenMachine["CALL"] + " ").concat(tokenMachine["LABEL"] + value[1]).concat("\r\n");
				
			} else if (aux[a].equals(posFixa["MAIS"])) {
				code = code.concat(tokenMachine["ADD"]).concat("\r\n");
			} else if (aux[a].equals(posFixa["MENOS"])) {
				code = code.concat(tokenMachine["SUB"]).concat("\r\n");
			} else if (aux[a].equals(posFixa["MULTIPLICACAO"])) {
				code = code.concat(tokenMachine["MULT"]).concat("\r\n");
			} else if (aux[a].equals(posFixa["DIVISAO"])) {
				code = code.concat(tokenMachine["DIVI"]).concat("\r\n");
			} else if (aux[a].equals(posFixa["E"])) {
				code = code.concat(tokenMachine["AND"]).concat("\r\n");
			} else if (aux[a].equals(posFixa["OU"])) {
				code = code.concat(tokenMachine["OR"]).concat("\r\n");
			} else if (aux[a].equals(posFixa["MENOR"])) {
				code = code.concat(tokenMachine["CME"]).concat("\r\n");
			} else if (aux[a].equals(posFixa["MAIOR"])) {
				code = code.concat(tokenMachine["CMA"]).concat("\r\n");
			} else if (aux[a].equals(posFixa["IGUAL"])) {
				code = code.concat(tokenMachine["CEQ"]).concat("\r\n");
			} else if (aux[a].equals(posFixa["DIFERENTE"])) {
				code = code.concat(tokenMachine["CDIF"]).concat("\r\n");
			} else if (aux[a].equals(posFixa["MENOR_IGUAL"])) {
				code = code.concat(tokenMachine["CMEQ"]).concat("\r\n");
			} else if (aux[a].equals(posFixa["MAIOR_IGUAL"])) {
				code = code.concat(tokenMachine["CMAQ"]).concat("\r\n");
			} else if (aux[a].equals(posFixa["MENOS_UNARIO"])) {
				code = code.concat(tokenMachine["INV"]).concat("\r\n");
			} else if (aux[a].equals(posFixa["MAIS_UNARIO"])) {
				// do nothing
			} else if (aux[a].equals(posFixa["NAO"])) {
				code = code.concat(tokenMachine["NEG"]).concat("\r\n");
			} else {
				if(aux[a].equals(tokenSymbols["verdadeiro"])) {
					code = code.concat(tokenMachine["LDC"]).concat(" 1").concat("\r\n");
				} else if(aux[a].equals(tokenSymbols["falso"])) {
					code = code.concat(tokenMachine["LDC"]).concat(" 0").concat("\r\n");
				} else if(aux[a].equals(tokenMachine["EMPTY"])){
					// do nothing
				} else {
					code = code.concat(tokenMachine["LDC"] + " ").concat(aux[a]).concat("\r\n");
				}
			}
		}
	}

	function createCode_2(command, countVariable) {
		if (tokenMachine["ALLOC"] == (command)) {
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
	}
	
	function createFile() {
		console.log("CHEGUEI NO FINAL");

	}

}
export { codeGenerator };