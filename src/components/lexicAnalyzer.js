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
    console.log('entrei');
    const tokenList = [];
    let forceBreak = false;
    const File = new myFile(file, file.length, 0, 0, '');
    console.log(`fiz o arquivo: ${File._fileSize} ${File._source}`);

    function treatDigits() {  // faz tratamento dos dígitos, coloca primeiro número na variável local lexema
        let lexema = '';
        lexema.concat(File.getCurChar());
        File.readCurChar();

        while ( /[0-9]/g.test(File.getCurChar()) ) {  // enquanto continuar testando o regexp para um dígito, concatena o caracter no lexema
            lexema = lexema.concat(File.getCurChar());
            File.readCurChar();
        }

        return new Token( lexema, File.getCurLine() );  // retorna o caracter e a linha do arquivo, para marcar o token
    }

    function treatIdentifierOrReservedWord() { // faz tratamento de identificador e palavra reservada, colocando a primeira letra na variável local lexema
        let lexema = '';
        lexema.concat(File.getCurChar());
        File.readCurChar();

        while ( /[0-9]/g.test( File.getCurChar() ) || /[A-Za-z_]/g.test( File.getCurChar() ) ) { // enquanto o próximo caracter lido for uma letra ou um número ou um underline (_), ler o caracter e concatenar ao lexema
            lexema = lexema.concat(File.getCurChar());
            File.readCurChar();
        }

        return new Token( lexema, File.getCurLine() ); // retorna o caracter e a linha do arquivo, para marcar o token
    }

    function treatAttribution() { // tratamento da atribuição caso tenha o =, senão trata o :
        let lexema = '';
        lexema.concat(File.getCurChar());
        File.readCurChar();

        if (File.getCurChar() === '=') { // se próximo caracter é igual (=), está fazendo uma atribuição
            lexema = lexema.concat( File.getCurChar() );
            File.readCurChar();
        }

        return new Token( lexema, File.getCurLine() ); // retorna o caracter e a linha do arquivo, para marcar o token
    }


    function treatAritOp() { // "tratamento" do operador aritmético (+, -, *) => apenas monta o Token, não necessita de tratamento pois o if-else do getToken() já limita os caracteres necessários
        let lexema = '';
        lexema.concat(File.getCurChar());
        File.readCurChar();

        return new Token( lexema, File.getCurLine() );
    }

    function treatReltOp() { // tratamento do operador relacional (< | > | <= | >= | = | !=)
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

    function treatPonct() {  // "tratamento" da pontuação [';' | ',' | '(' | ')' | '.'] => apenas monta o Token, não necessita de tratamento pois o if-else do getToken() já limita os caracteres necessários
        let lexema = '';         // igual ao que acontece com o operador relacional
        lexema.concat(File.getCurChar());
        File.readCurChar();
        
        return new Token( lexema, File.getCurLine() );
    }

    function getToken() {
        const charr = File.getCurChar();
        let exit = false;

        while (forceBreak === false || exit === false) {
            if( /[0-9]/g.test(charr) ) {  // trata dígito achando qualquer um dos caracteres do regexp
                treatDigits();
                // tokenList.push( treatDigits() );
                exit = true;
            } else if ( /[A-Za-z_]/g.test(charr) ) {  // trata identificador ou palavra reservada achando qualquer um dos caracteres do regexp
                treatIdentifierOrReservedWord();
                // tokenList.push(treatIdentifierOrReservedWord());
                exit = true;
            } else if ( charr === ':' ) { // trata atribuição quando achar dois pontos
                treatAttribution();
                // tokenList.push(treatAttribution());
                exit = true;
            } else if ( /[\+\-\*]/g.test(charr) ) { // trata o operador aritmético achando qualquer um dos caracteres do regexp
                treatAritOp();
                // tokenList.push(treatAritOp());
                exit = true;
            } else if ( /[\<\>\=\!]/g.test(charr) ) { // trata o operador relacional achando qualquer um dos caracteres do regexp
                treatReltOp();
                // tokenList.push(treatReltOp());
                exit = true;
            } else if ( /[\;\,\(\)\.]/g.test(charr) ) { // trata a pontuação achando qualquer um dos caracteres do regexp
                treatPonct();
                // tokenList.push(treatPonct());
                exit = true;
            } else { // senão erro léxico de caracter não reconhecido pela gramática
                tokenList.push({ errorName: 'LexicError', errorMessage: lexicErrors.INVALID_CHARACTER });
                forceBreak = true;
            }
        }
    }


    while (!File.endOfFile()) {
        console.log('entrei no while 1');
        let caracter = File.getCurChar();
        console.log(caracter);

        while ( (caracter === '{' || caracter === '/' || // Comentários
        caracter === ' ' || caracter === '\n' || caracter === '\t' || caracter === '\r') && // espaços vazios
        !File.endOfFile() && !forceBreak ) { // fim do arquivo ou break forçado em caso de erro
            console.log('entrei no while 2 -> verificando comentário');
            console.log(caracter);
            if ( caracter === '{' ) { // tratando comentário com chaves
                console.log('entrei no if de { ');
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
                if ( caracter === '*' ) {
                    while ( caracter !== '*' && !File.endOfFile() ) {
                        File.readCurChar();
                        caracter = File.getCurChar();
                    }

                    if ( caracter === '*') {
                        if (caracter !== '/' && !File.endOfFile() ) {
                            File.readCurChar();
                            caracter = File.getCurChar();
                        }
                    }

                    if ( File.endOfFile() ) { // caso o arquivo acabe antes de fechar o comentário, erro de não fechar comentário
                        tokenList.push({ errorName: 'LexicError', errorMessage: lexicErrors.UNCLOSED_COMMENT });
                        File.getCurLine();
                    }
                }
            }

            while(caracter === '' || caracter === '\t' || caracter === '\n' || caracter === '\r' ) { // enquanto for o espaço ou tab ou pula linha, ler o caracter do arquivo e ler caracter
                File.readCurChar();
                caracter = File.getCurChar();
            }
        }

        if( !File.endOfFile() ) {
            const curToken = getToken();

            if( !forceBreak ) {
                tokenList.push(curToken);
                return curToken;
            }
        }
    }

    return printTokenList(tokenList);
}

export { analyseLexic, printTokenList };