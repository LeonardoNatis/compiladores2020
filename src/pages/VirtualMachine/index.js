import React, { useState, useEffect } from 'react';
import './style.css';

import { Button } from '../../React components/Button';
import Upload from "../../services/upload";
import { tokenMachine } from '../../components/Token';

export default function VirtualMachine() {
    const [instruction, setInstruction] = useState([]);
    const [mem, setMem] = useState([]);

    useEffect( () => {
        setMem(memory);
    },[]);

    let value ;
    
    let file = [];
    let memory = [];
    let pos = -1;
    let indexInstruction = 0;
    let op = '';
    let exec = true;
    let numInstrucao = 1;

    const compila = () => {
        while (exec) {
            op = instruction[indexInstruction];
            console.log("Proxima instrucao: "+op);
            switch (op.name.trim()) {
                case "LDC":
                    LDC(op.arg1);
                    break;
                case "LDV":
                    LDV();
                    break;
                case "ADD":
                    ADD();
                    break;
                case "SUB":
                    SUB();
                    break;
                case "MULT":
                    MULT();
                    break;
                case "DIVI":
                    DIVI();
                    break;
                case "INV":
                    INV();
                    break;
                case "AND":
                    AND();
                    break;
                case "OR":
                    OR();
                    break;
                case "NEG":
                    NEG();
                    break;
                case "CME":
                    CME();
                    break;
                case "CMA":
                    CMA();
                    break;
                case "CEQ":
                    CEQ();
                    break;
                case "CDIF":
                    CDIF();
                    break;
                case "CMEQ":
                    CMEQ();
                    break;
                case "CMAQ":
                    CMAQ();
                    break;
                case "START":
                    START();
                    break;
                case "HLT":
                    HLT();
                    console.log("HLT")
                    break;
                case "STR":
                    STR();
                    break;
                case "JMP":
                    JMP();
                    break;
                case "JMPF":
                    JMPF();
                    break;
                case "NULL":
                    break;
                case "RD":
                    RD();
                    break;
                case "PRN":
                    PRN();
                    break;
                case "ALLOC":
                    ALLOC();
                    break;
                case "DALLOC":
                    DALLOC();
                    break;
                case "CALL":
                    CALL();
                    break;
                case "RETURN":
                    RETURN();
                    indexInstruction = indexInstruction - 1;
                    break;
                case "RETURNF":
                    RETURNF();
                    indexInstruction = indexInstruction - 1;
                    break;
                default:
                    break;
            }
            console.log("Somando + 1, para proxima posicao");
            indexInstruction = indexInstruction + 1;

            setMem(memory);
        }
    };


    function LDC(constant) {
        console.log(constant);
        console.log("Posicao: "+pos);
        pos += 1;
        memory[pos] = constant;
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory);
    }
    
    function LDV() {
        pos += 1;
        memory[pos] = memory[instruction[indexInstruction].arg1];
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory);
    }
    
    function ADD() {
        memory[pos-1] = parseInt(memory[pos-1] + memory[pos]);
        pos -= 1;
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory);
    }
    
    function SUB() {
        memory[pos-1] = memory[pos-1] - memory[pos];
        pos -= 1;
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory);
    }
    
    function MULT() {
        memory[pos-1] = memory[pos-1] * memory[pos];
        pos -= 1;
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory);
    }
    
    function DIVI() {
        memory[pos-1] = memory[pos-1] / memory[pos];
        pos -= 1;
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory);
    }
    
    function INV() {
        memory[pos] = memory[pos] * -1;
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory);
    }
    
    function AND() {
        if (memory[pos-1] === 1 && memory[pos] === 1) {
            memory[pos-1] = 1;
        } else {
            memory[pos-1] = 0;
        }
        pos -= 1;
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory);
    }
    
    function OR() {
        if (memory[pos-1] === 1 || memory[pos] === 1) {
            memory[pos-1] = 1;
        } else {
            memory[pos-1] = 0;
        }
        pos -= 1;
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory);
    }
    
    function NEG() {
        memory[pos] = 1 - memory[pos];
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory);
    }
    
    function CME(){
        if (memory[pos-1] < memory[pos]) {
            memory[pos-1] = 1;
        } else {
            memory[pos-1] = 0;
        }
    
        pos -= 1;
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory);
    }
    
    function CMA(){
        if (memory[pos-1] > memory[pos]) {
            memory[pos-1] = 1;
        } else {
            memory[pos-1] = 0;
        }
    
        pos -= 1;
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory);
    }
    
    function CEQ(){
        if (memory[pos-1] === memory[pos]) {
            memory[pos-1] = 1;
        } else {
            memory[pos-1] = 0;
        }
    
        pos -= 1;
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory);
    }
    
    function CDIF(){
        if (memory[pos-1] !== memory[pos]) {
            memory[pos-1] = 1;
        } else {
            memory[pos-1] = 0;
        }
    
        pos -= 1;
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory);
    }
    
    function CMEQ(){
        if (memory[pos-1] <= memory[pos]) {
            memory[pos-1] = 1;
        } else {
            memory[pos-1] = 0;
        }
    
        pos -= 1;
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory);
    }
    
    function CMAQ(){
        if (memory[pos-1] >= memory[pos]) {
            memory[pos-1] = 1;
        } else {
            memory[pos-1] = 0;
        }
    
        pos -= 1;
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory);
    }
    
    function START() {
        pos = -1;
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory);
    }
    
    function HLT() {
        exec = false;
    }
    
    function STR() {
        memory[instruction[indexInstruction].arg1] = memory[pos];
        pos -= 1;
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory);
    }
    
    function PRN() {
        console.log(memory[pos]);
        console.log(pos)
        alert(memory[pos])
        pos = pos - 1;
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory);
    }

    function JMP() {
        console.log("Buscar: "+instruction[indexInstruction].arg1);
        indexInstruction = findLabel(instruction[indexInstruction].arg1).line;
        console.log("Index: "+indexInstruction);
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory);
    }

    function JMPF() {
        if (memory[pos] == 0) {
            indexInstruction = findLabel(instruction[indexInstruction].arg1).line;
            // Decrementa pois será incrementado na main.
            indexInstruction = indexInstruction - 1;
            //i = i + 1;
        } else {
            // Não faz nada pois será incrementado na main
            // i = i - 1;
        }
        pos = pos - 1;
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory);
    }

    function RD() {
        let entryValue = parseInt(prompt("Entre um valor"));
        pos = pos + 1;
        memory[pos] = entryValue;
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory);
    }

    function ALLOC() {
        for (let k = 0; k < instruction[indexInstruction].arg2; k++) {
            pos+= 1;
            memory[pos] = memory[instruction[indexInstruction].arg1 + k];
        }
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory);
    }

    function DALLOC() {
        for (let k = instruction[indexInstruction].arg2 - 1; k >= 0; k--) {

            memory[instruction[indexInstruction].arg1 + k] = memory[pos];
            pos = pos - 1;
        }
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory);
    }

    function CALL() {
        pos = pos + 1;
        memory[pos] = indexInstruction + 1;
        console.log(instruction[indexInstruction].arg1);
        //console.log(findLabel(instruction[indexInstruction].arg1));
        indexInstruction = findLabel(instruction[indexInstruction].arg1).line;
        console.log(indexInstruction);
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory);
    }
    
    function RETURN() {
        indexInstruction = memory[pos];
        pos = pos - 1;
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory); 
    }

    function RETURNF() {
        if (instruction[indexInstruction].arg2 != 0) {
            let retorno = pos;
            pos--;
            DALLOC();
            pos++;
            memory[pos] = memory[pos - 1];
            memory[pos - 1] = memory[retorno];
        } else {
            DALLOC();
            if (instruction[indexInstruction].arg2 != 1) {
                let aux = memory[pos];
                memory[pos] = memory[pos - 1];
                memory[pos - 1] = aux;
            }
        } 
        RETURN();
        console.log("Executando: "+op.name);
        console.log("Posicao: "+pos);
        console.log(memory);
    }

    function findLabel(label) {
        let pos = instruction.find(function (item, index) {
            if (item.name === label.trim()) {
                console.log(index)
                return index;
            }
        });
        return pos;
    }



    // Variáveis globais para executar Máquina Virtual
    let reading = false;
    let currentIndex = 0;
    let currentInstruction;
    
    function executeOne(code) {
    
        if (currentIndex < code.length) {
            if (!reading) {
                currentInstruction = code[currentIndex];
    
                if (currentInstruction.name !== tokenMachine.HLT) {
                    if (currentInstruction.name === tokenMachine.PRN) {
                        let aux = PRN();
                        alert(aux);
                        executeInstruction(currentInstruction);
                    } else {
                        executeInstruction(currentInstruction);
                    }
                } else {
                    alert('Execution Complete!');
                    return true;
                }
            } else {
                let result = prompt('Please enter a number value');
                if (result) {
                    const value = +result;
                    executeInstruction(currentInstruction, value);
                    reading = false;
                }
            }
        } else {
            currentIndex = 0;
            clearVM();
            return true;
        }
    
        return false;
    }
    
    function executeAll(instructions, code) {
        for (let i = currentIndex; i <= code.length; i++) {
            const stopExecution = executeOne(code);
            if (stopExecution) {
                break;
            }
        }
    }
    
    function executeInstruction(instruction, value = null) {
        const formerIndex = currentIndex;
        currentIndex = handleInstruction(instruction, currentInstruction, value);
        // setMemory();
    
        if (instruction.name === tokenMachine.JMP || instruction.name === tokenMachine.CALL || instruction.name === tokenMachine.JMPF) {
            currentIndex += 1;
        }
    
    }
    
    function handleInstruction(instruction, pos, value = null) {
        switch (instruction.name) {
            case tokenMachine.START:
                START(pos);
                break;
            
            default:
                // label
                break;
        }
    }
    
    function clearVM() {
        reading = false;
        currentIndex = 0;
    }

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
                <td>{index}</td>
                <td>{memory}</td>
            </tr>
        )
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
                        stack.push({ name: splitedElement[0].trim(), arg1: isNaN(parseInt(splitedElement[1].trim())) ? splitedElement[1].trim() : parseInt(splitedElement[1].trim()), arg2: isNaN(parseInt(splitedElement[2].trim())) === true ? splitedElement[2].trim() : parseInt(splitedElement[2].trim()), line: index, breakpoint: false });
                    } else if (splitedElement[1] === tokenMachine.NULL) {
                        // encontrou um Label
                        stack.push({ name: splitedElement[1].trim(), label: splitedElement[0].trim(), line: index, breakpoint: false });
                    } else {
                        // primeiro argumento normal
                        stack.push({ name: splitedElement[0].trim(), arg1: isNaN(parseInt(splitedElement[1].trim())) ? splitedElement[1].trim() : parseInt(splitedElement[1].trim()), line: index, breakpoint: false });
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
                        {mem.map(renderMemory)}
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