class lexicAnalizer {
    constructor(file) {
        this.tokenList = [];
        this._file = file;
    }

    getTokenList() {
        return this.tokenList;
    }

    printTokenList() {
        for (let token in this.tokenList) {
            console.log(`Token: ${token++}  |  Lexema: ${token._lexema}  |  Símbolo: ${token._symbol}  |  Linha: ${token._line} `);
        }
    }

    
}

export { lexicAnalizer };