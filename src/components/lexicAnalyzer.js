import { myFile } from './File';
import { Token } from './Token';
import { fileErrors, lexicErrors } from './Errors';

function printTokenList(tokenList) {
    for (let token in tokenList) {
        if(token.lexema) {
            console.log(`Token: ${token++}  |  Lexema: ${token._lexema}  |  Símbolo: ${token._symbol}  |  Linha: ${token._line} `);
        } else {
            console.log(`${token.errorName}: ${token.errorMessage}`);
        }
    }
}

function analyseLexic(file) {
    const tokenList = [];
    let forceBreak = false;
    const File = new myFile(file, file.length, 0, 0, ' ');


    function treatDigits(file) {  // faz tratamento dos dígitos, coloca primeiro número na variável local lexema
        let lexema = '';
        lexema.concat(File.getCurChar());
        File.readCurChar();

        while ( /[0-9]/g.test(File.getCurChar()) ) {  // enquanto continuar testando o regexp para um dígito, concatena o caracter no lexema
            lexema = lexema.concat(File.getCurChar());
            File.readCurChar();
        }

        return new Token( lexema, File.getCurLine() );  // retorna o caracter e a linha do arquivo, para marcar o token
    }

    function treatIdentifierOrReservedWord(file) { // faz tratamento de identificador e palavra reservada, colocando a primeira letra na variável local lexema
        let lexema = '';
        lexema.concat(File.getCurChar());
        File.readCurChar();

        while ( /[0-9]/g.test( File.getCurChar() ) || /[A-Za-z_]/g.test( File.getCurChar() ) ) { // enquanto o próximo caracter lido for uma letra ou um número ou um underline (_), ler o caracter e concatenar ao lexema
            lexema = lexema.concat(File.getCurChar());
            File.readCurChar();
        }

        return new Token( lexema, File.getCurLine() ); // retorna o caracter e a linha do arquivo, para marcar o token
    }

    function treatAttribution(file) { // tratamento da atribuição caso tenha o =, senão trata o :
        let lexema = '';
        lexema.concat(File.getCurChar());
        File.readCurChar();

        if (File.getCurChar() === '=') { // se próximo caracter é igual (=), está fazendo uma atribuição
            lexema = lexema.concat( File.getCurChar() );
            File.readCurChar();
        }

        return new Token( lexema, File.getCurLine() ); // retorna o caracter e a linha do arquivo, para marcar o token
    }


    function treatAritOp(file) { // "tratamento" do operador aritmético (+, -, *) => apenas monta o Token, não necessita de tratamento pois o if-else do getToken() já limita os caracteres necessários
        let lexema = '';
        lexema.concat(File.getCurChar());
        File.readCurChar();

        return new Token( lexema, File.getCurLine() );
    }

    function treatReltOp(file) { // tratamento do operador relacional (< | > | <= | >= | = | !=)
        let lexema = '';
        lexema.concat(File.getCurChar());
        File.readCurChar();

        switch ( lexema ) { // verifica em qual caso o caracter atual se enquadra
            case '<':
                if ( File.getCurChar() === '=' ) { // se próximo caracter for um igual, trata o menor ou igual (<=)
                    lexema = lexema.concat(File.getCurChar());
                    File.readCurChar();
                }
                break;

            case '>':
                if ( File.getCurChar() === '=' ) { // se próximo caracter for um igual, trata o maior ou igual (>=)
                    lexema = lexema.concat(File.getCurChar());
                    File.readCurChar();
                }
                break;

            case '!':
                if ( File.getCurChar() === '=' ) { // se próximo caracter for um igual, trata o diferente (!=)
                    lexema = lexema.concat(File.getCurChar());
                    File.readCurChar();
                } else { // erro léxico de caracter inválido após a exclamação (!)
                    tokenList.push({ errorName: 'LexicError', errorMessage: lexicErrors.INVALID_CHARACTER });
                    forceBreak = true;
                }
                break;

            case '=': // não necessita de tratamento se tem apenas o igual (=)
                break;

            default: // erro léxico de caracter inválido
                tokenList.push({ errorName: 'LexicError', errorMessage: lexicErrors.INVALID_CHARACTER });
                forceBreak = true;
                break;
        }

        if (forceBreak) {
            return null;
        } else {
            return new Token ( lexema, File.getCurLine() );
        }
    }

    function treatPonct(file) {  // "tratamento" da pontuação [';' | ',' | '(' | ')' | '.'] => apenas monta o Token, não necessita de tratamento pois o if-else do getToken() já limita os caracteres necessários
        let lexema = '';         // igual ao que acontece com o operador relacional
        lexema.concat(File.getCurChar());
        File.readCurChar();
        
        return new Token( lexema, File.getCurLine() );
    }

    function getToken(file) {
        const charr = File.getCurChar();

        while (forceBreak === false) {
            if( /[0-9]/g.test(charr) ) {  // trata dígito achando qualquer um dos caracteres do regexp
                treatDigits(File);
            } else if ( /[A-Za-z_]/g.test(charr) ) {  // trata identificador ou palavra reservada achando qualquer um dos caracteres do regexp
                treatIdentifierOrReservedWord(File);
            } else if ( charr === ':' ) { // trata atribuição quando achar dois pontos
                treatAttribution();
            } else if ( /[\+\-\*]/g.test(charr) ) { // trata o operador aritmético achando qualquer um dos caracteres do regexp
                treatAritOp(File);
            } else if ( /[\<\>\=\!]/g.test(charr) ) { // trata o operador relacional achando qualquer um dos caracteres do regexp
                treatReltOp(File);
            } else if ( /[\;\,\(\)\.]/g.test(charr) ) { // trata a pontuação achando qualquer um dos caracteres do regexp
                treatPonct();
            } else { // senão erro léxico de caracter não reconhecido pela gramática
                tokenList.push({ errorName: 'LexicError', errorMessage: lexicErrors.INVALID_CHARACTER });
                forceBreak = true;
            }
        }
    }


    while (!File.endOfFile()) {
        let caracter = File.getCurChar();

        while ( (caracter === '{' || caracter === '/' || // Comentários
        caracter === ' ' || caracter === '\n' || caracter === '\t' || caracter === '\r') && // espaços vazios
        !File.endOfFile() && !forceBreak ) { // fim do arquivo ou break forçado em caso de erro
            if ( caracter === '{' ) { // tratando comentário com chaves
                while ( caracter !== '}' && !File.endOfFile() ) {
                    File.readCurChar();
                    caracter = File.getCurChar();
                }

                File.readCurChar();
                caracter = File.getCurChar();

                if ( File.endOfFile() ) { // caso o arquivo acabe antes de fechar o comentário, erro de não fechar comentário
                    tokenList.push({ errorName: 'LexicError', errorMessage: lexicErrors.UNCLOSED_COMMENT });
                    File.getCurLine();
                }
            } else if ( caracter === '/' ) {  //TODO terminar o tratamento de comentário /* */
                while ( caracter !== '*' && !File.endOfFile() ) {
                    
                }
            }

            while(caracter === '' || caracter === '\t' || caracter === '\n' || caracter === '\r' ) { // enquanto for o espaço ou tab ou pula linha, ler o caracter do arquivo e ler caracter
                File.readCurChar();
                caracter = File.getCurChar();
            }
        }

        if( !File.endOfFile() ) {
            const curToken = getToken(File);

            if( !forceBreak ) {
                tokenList.push(curToken);
                return curToken;
            }
        }
    }

    return tokenList;
}

export { analyseLexic, printTokenList };