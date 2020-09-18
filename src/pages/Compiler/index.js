import React, { useState } from 'react';

import { Button } from '../../React components/Button';
import '../../React components/Button.css';

import Upload from '../../services/upload';

import { analyseLexic, printTokenList } from '../../components/lexicAnalyzer';

export default function Compiler() {
    const [code, setCode] = useState([]);

    const onChangeFile = (file) => {
        setCode( file.toString().replace(/\n/g, '\r\n') );
        // setCode( file.filter(line => line !== '' && line !== null).toString() );
        // setCode( file.split("\n\t").toString() );
        // setCode( file.split("\n\t").filter(line => line !== '' && line !== null).toString() );
    };

    // const list = analyseLexic(code);

    const runLexicAnalyser = () => {
        
        console.log(code);
        console.log(typeof code);
        // const lexicTokens = analyseLexic(code);
        // console.log(lexicTokens);
        // printTokenList(lexicTokens);

        analyseLexic(code);
    }
    
    return (
        <>
            <h1>Compiler</h1>
            <br />
            <Button>
                <Upload onChangefile={onChangeFile} />
            </Button>
            <br />
            <br />
            <Button type="button" onClick={runLexicAnalyser}>Analise Lexic</Button>
        </>
    );

    // const fileInput = '';

    // function onSubmitFile() {
    //     const item = document.getElementById('fileEntry');
    //     if (item) {
    //         item.click();
    //     }
    // }

    // function onFileChange(event) {
    //     if(event.target.files.length) {
    //         fileInput = event.target.files[0];
    //         readFile();
    //     }
    // }

    // function readFile() {
    //     const fileReader = new FileReader();
    //     fileReader.onload = e => {
    //         parseCode(fileReader.result);
    //     };
    //     fileReader.readAsText(fileInput);
    // }

    // function parseCode(){

    // }

    // return (
    //     <>
    //         <h1>Compiler</h1>
    //         <br />
    //         <Button>
    //             <input id="fileEntry" type="file" accept=".txt" onChange={onFileChange(event)}/>
    //         </Button>
    //         <br />
    //         <button type="button" onClick={onSubmitFile()}></button>
    //     </>
    // );
}