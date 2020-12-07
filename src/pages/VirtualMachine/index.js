import React, { useState } from 'react';
import './style.css';

import { Button } from '../../React components/Button';
import Upload from "../../services/upload";
import { tokenMachine } from '../../components/Token';

export default function VirtualMachine2() {
    const [instruction, setInstruction] = useState([]);
    const [memory, setMemory] = useState([]);
    
    const renderIntruction = (instruction, index) => {
        return (
            <tr key={index}>
                <td>
                    <center>
                        <input
                            type="checkbox"
                            checked={instruction.breakpoint}
                            onChange={(event) => onChangeBB(event, index)}
                        />
                    </center>
                </td>
                <td>{index + 1}</td>
                <td>{instruction.name}</td>
                <td>{instruction.arg1}</td>
                <td>{instruction.arg2}</td>
            </tr>
        )
    };

    const renderMemory = (memory, index) => {
        return (
            <tr key={index}>
                <td>{index + 1}</td>
                <td>{memory.value}</td>
            </tr>
        )
    };

    const compila = () => {
        if (instruction.instrucao === "START") {
        console.log("entrou");
        } else {
        console.log("deu ruim");
        }
    };

    const onChangeBB = (event, index) => {
        let aux = [...instruction];
        aux[index].breakpoint = event.target.checked;
        setInstruction(aux);
    };

    const onChangeFile = (file) => {
        let stack = [];

        file.toString().split("\n").forEach( (element, index) => {
            let splitedElement= element.split(' ');

            if (splitedElement[0] && splitedElement[0] !== "") {
                if (splitedElement[1] && splitedElement[1] !== "") {
                    // existe argumento 1
                    
                    if (splitedElement[2] && splitedElement[2] !== "") {
                        // existe argumento 2
                        stack.push({ name: splitedElement[0], arg1: isNaN(parseInt(splitedElement[1])) ? splitedElement[1] : parseInt(splitedElement[1]), arg2: isNaN(parseInt(splitedElement[2])) === true ? splitedElement[2] : parseInt(splitedElement[2]), line: index, breakpoint: false });
                    } else if (splitedElement[1] === tokenMachine.NULL) {
                        // encontrou um Label
                        stack.push({ name: splitedElement[1], label: splitedElement[0], line: index, breakpoint: false });
                    } else {
                        // primeiro argumento normal
                        stack.push({ name: splitedElement[0], arg1: parseInt(splitedElement[1]), line: index, breakpoint: false });
                    }

                } else {
                    // só tem comando
                    stack.push({ name: splitedElement[0], line: index, breakpoint: false});
                }
            }
        })

        console.log(stack);

        setInstruction(stack);
    };

    return(
        <> 
            <h1>Virtual Machine</h1>

            <br />
            <div className="instrucoes">
                <p>Instruções a serem executadas pela VM</p>
                <br />
                <table className="tabela">
                    <thead>
                        <tr>
                            <td>Breakpoint</td>
                            <td>Linha</td>
                            <td>Instrução</td>
                            <td>Atributo #1</td>
                            <td>Atributo #2</td>
                        </tr>
                    </thead>
                    <tbody>
                        {instruction.map(renderIntruction)}
                    </tbody>
                </table>
            </div>
            <div className="pilha">
                <p>Conteúdo da Pilha</p>
                <br />
                <table className="tabela">
                    <thead>
                        <tr>
                            <td>Posição</td>
                            <td>Valor</td>
                        </tr>
                    </thead>
                    <tbody>
                        {memory.map(renderMemory)}
                    </tbody>
                </table>
            </div>

            <br />
            <div className="buttonDiv">
                <Button>
                    <Upload onChangefile={onChangeFile} />
                </Button>
                <Button onClick={compila}>Execute All</Button>
                <Button>Execute One</Button>
            </div>
        </>
    );
}