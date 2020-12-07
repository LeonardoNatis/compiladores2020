import tokenMachine from '../components/Token';

function LDC(memoryArray, pos, constant) {
    pos += 1;
    return memoryArray[pos] = constant;
}

function LDV(memoryArray, pos, value) {
    pos += 1;
    return memoryArray[pos] = memoryArray[value];
}

function ADD(memoryArray, pos) {
    memoryArray[pos-1] = memoryArray[pos-1] + memoryArray[pos];
    return pos -= 1;
}

function SUB(memoryArray, pos) {
    memoryArray[pos-1] = memoryArray[pos-1] - memoryArray[pos];
    return pos -= 1;
}

function MULT(memoryArray, pos) {
    memoryArray[pos-1] = memoryArray[pos-1] * memoryArray[pos];
    return pos -= 1;
}

function DIVI(memoryArray, pos) {
    memoryArray[pos-1] = memoryArray[pos-1] / memoryArray[pos];
    return pos -= 1;
}

function INV(memoryArray, pos) {
    return memoryArray[pos] = memoryArray[pos] * -1;
}

function AND(memoryArray, pos) {
    if (memoryArray[pos-1] === 1 && memoryArray[pos] === 1) {
        memoryArray[pos-1] = 1;
    } else {
        memoryArray[pos-1] = 0;
    }
    return pos -= 1;
}

function OR(memoryArray, pos) {
    if (memoryArray[pos-1] === 1 || memoryArray[pos] === 1) {
        memoryArray[pos-1] = 1;
    } else {
        memoryArray[pos-1] = 0;
    }
    return pos -= 1;
}

function NEG(memoryArray, pos) {
    return memoryArray[pos] = 1 - memoryArray[pos];
}

function CME(memoryArray, pos){
    if (memoryArray[pos-1] < memoryArray[pos]) {
        memoryArray[pos-1] = 1;
    } else {
        memoryArray[pos-1] = 0;
    }

    return pos -= 1;
}

function CMA(memoryArray, pos){
    if (memoryArray[pos-1] > memoryArray[pos]) {
        memoryArray[pos-1] = 1;
    } else {
        memoryArray[pos-1] = 0;
    }

    return pos -= 1;
}

function CEQ(memoryArray, pos){
    if (memoryArray[pos-1] === memoryArray[pos]) {
        memoryArray[pos-1] = 1;
    } else {
        memoryArray[pos-1] = 0;
    }

    return pos -= 1;
}

function CDIF(memoryArray, pos){
    if (memoryArray[pos-1] !== memoryArray[pos]) {
        memoryArray[pos-1] = 1;
    } else {
        memoryArray[pos-1] = 0;
    }

    return pos -= 1;
}

function CMEQ(memoryArray, pos){
    if (memoryArray[pos-1] <= memoryArray[pos]) {
        memoryArray[pos-1] = 1;
    } else {
        memoryArray[pos-1] = 0;
    }

    return pos -= 1;
}

function CMAQ(memoryArray, pos){
    if (memoryArray[pos-1] >= memoryArray[pos]) {
        memoryArray[pos-1] = 1;
    } else {
        memoryArray[pos-1] = 0;
    }

    return pos -= 1;
}

function START(pos) {
    return pos = -1;
}

function HLT(executionBool) {
    return executionBool = false;
}

function STR(memoryArray, pos, value) {
    memoryArray[value] = memoryArray[pos];
    return pos -= 1;
}

function PRN(memoryArray, pos) {
    return memoryArray[pos];
}

// Variáveis globais para executar Máquina Virtual
let reading = false;
let currentIndex = 0;
let currentInstruction;

export function executeOne(code) {

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

export function executeAll(instructions, code) {
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
