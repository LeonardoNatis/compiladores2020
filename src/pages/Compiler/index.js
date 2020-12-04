import React, { useState } from "react";

import { Button } from "../../React components/Button";
import "../../React components/Button.css";
import Editor from "../../React components/Editor/Editor";

import Upload from "../../services/upload";

import { analyseLexic, printTokenList } from "../../components/lexicAnalyzer";
import { myFile } from "../../components/File";
// import { lexicTest } from '../../components/lexicTest';
import { analyzeSyntactic } from "../../components/syntacticAnalizer";

export default function Compiler() {
  const [code, setCode] = useState('');
  console.log(code);
  const onChangeFile = (file) => {
    setCode(file.toString());
    // setCode(file.toString().replace(/\n/g, '\r\n'));
  };

  const runLexicAnalyser = () => {
    const fileObj = new myFile(code, code.length, 0, 0, " ");
    // const lexicTokens = analyseLexic(fileObj);
    // console.log(lexicTokens);
    // printTokenList(lexicTokens);
    // console.log(fileObj);
    const syntacticResult = analyzeSyntactic(fileObj);
  };

  return (
    <>
      <h1>Compiler</h1>
      <br />
      <br />
      <Editor 
        language='javascript'
        value={code}
        onChange={setCode}
      />
      <br />
      <Button>
        <Upload onChangefile={onChangeFile} />
      </Button>
      <br />
      <br />
      <Button type="button" onClick={runLexicAnalyser}>
        {" "}
        Analise Syntactic{" "}
      </Button>
    </>
  );
}
