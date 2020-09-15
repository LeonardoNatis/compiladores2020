import React, { useState } from 'react';
import './style.css';

import Up from "../../services/upload";

export default function VirtualMachine() {
    const [instrucao, setInstrucao] = useState([]);
    const tabela = [
        {
        coluna0: "BreakPoint",
        coluna1: "L",
        coluna2: "Instruções",
        coluna3: "Atributo #1",
        coluna4: "Atributo #2",
        coluna5: "Comentarios",
        },
    ];

    const pilha = [
        {
        coluna1: "Endereço",
        coluna2: "Valor",
        },
    ];

    const compila = () => {
        if (instrucao.instrucao === "START") {
        console.log("entrou");
        } else {
        console.log("deu ruim");
        }
    };

    const onChangeBB = (event, index) => {
        let aux = [...instrucao];
        aux[index].breakpoint = event.target.checked;
        setInstrucao(aux);
    };

    const onChangeFile = (file) => {
        setInstrucao(
        file.split("\r\n").map((instrucao) => ({ instrucao, breakpoint: false }))
        );
    };

    return(
        <>
            <div>
                <div className="instrucoes">
                    <p>Instruções a serem executadas pela VM</p>
                    <table className="tabela">
                        {tabela.map((header) => {
                        return (
                            <tr className="tabela">
                                <td className="tabela">{header.coluna0}</td>
                                <td className="tabela">{header.coluna1}</td>
                                <td className="tabela">{header.coluna2}</td>
                                <td className="tabela">{header.coluna3}</td>
                                <td className="tabela">{header.coluna4}</td>
                                <td className="tabela">{header.coluna5}</td>
                            </tr>
                        );
                        })}
                        {instrucao.map((linha, index) => {
                        let separaInstrucao = linha.instrucao.split(" ");
                        return (
                            <tr className="tabela">
                                <td className="tabela">
                                    <center>
                                    <input
                                        type="checkbox"
                                        checked={linha.breakpoint}
                                        onChange={(event) => onChangeBB(event, index)}
                                    />
                                    </center>
                                </td>
                                <td className="tabela">{index + 1}</td>
                                <td className="tabela">{separaInstrucao[0]}</td>
                                <td className="tabela">{separaInstrucao[1]}</td>
                                <td className="tabela">{separaInstrucao[2]}</td>
                                <td className="tabela">{separaInstrucao[3]}</td>
                            </tr>
                        );
                        })}
                    </table>
                </div>
                <div className="mainJanelas">
                    <div className="janelas">
                        <p>Janela de Entrada</p>
                        <textarea></textarea>
                    </div>
                    <div className="janelas">
                        <p>Janela de Saída</p>
                        <textarea readOnly></textarea>
                    </div>
                    <div className="janelas">
                        <p>BreakPoint</p>
                        <textarea readOnly></textarea>
                    </div>
                </div>
                <div className="mainJanelas">
                    <div>
                        <Up onChangefile={onChangeFile} />
                    </div>
                <div>
                    <button class="botao" type="button" onClick={compila}>
                    Compilar
                    </button>
                </div>
                <div>
                    <button class="botao" type="button">
                    Proximo
                    </button>
                </div>
                </div>

                <div className="pilha">
                    <p>Conteúdo da Pilha</p>
                    <table className="tabela">
                    {tabela.map((linha) => {
                        return (
                        <tr className="tabela">
                            <td className="tabela">{linha.coluna1}</td>
                            <td className="tabela">{linha.coluna2}</td>
                        </tr>
                        );
                    })}
                    </table>
                </div>
            </div>
        </>
    );
}