class myFile {
  /* Construtor da classe Arquivo ==> source é a fonte do arquivo, vulgo o programa todo em string;
   *  fileSize é o tamanho do arquivo;
   *  position é a posição dentro do arquivo;
   *  curLine é a linha atual do arquivo;
   *  curChar é o caracter atual no arquivo.
   */
  constructor(source, fileSize, position, curLine, curChar) {
    this._source = source;
    this._fileSize = fileSize;
    this._position = position;
    this._curLine = curLine;
    this._curChar = curChar;
  }

  getSource() {
    return this._source;
  }

  setSource(s) {
    this._source = s;
  }

  getFileSize() {
    return this._fileSize;
  }

  setFileSize(fs) {
    this._fileSize = fs;
  }

  getPosition() {
    return this._position;
  }

  setPosition(i) {
    this._position = i;
  }

  getCurLine() {
    return this._curLine;
  }

  setCurLine(cl) {
    this._curLine = cl;
  }

  getCurChar() {
    return this._curChar;
  }

  readCurChar() {
    const index = this.getPosition();

    this.incrPosition();

    try {
      this._curChar = this._source.charAt(index); // pega o caracter na fonte do arquivo e compara com o caracter atual

      if (this._curChar === "\n") {
        // caso seja um \n, vulgo pula linha, incrementa a contagem de linha do arquivo
        this.incrCurLine();
      }
    } catch (err) {
      this._curChar = "\0"; // no caso de erro, colocar um caracter nulo, ou seja o \0
    }
  }

  incrPosition() {
    this._position++;
  }

  incrCurLine() {
    this._curLine++;
  }

  endOfFile() {
    // return this.getCurLine() > this.getFileSize() ? true : false;
    return this._position > this._fileSize ? true : false;
  }
}

export { myFile };
