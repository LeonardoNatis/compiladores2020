import React, { useState } from 'react';

import { Button } from '../../React components/Button';
import '../../React components/Button.css';

import Upload from '../../services/upload';

export default function Compiler() {
    const [instrucao, setInstrucao] = useState([]);

    const onChangeFile = (file) => {
        setInstrucao(
        file.split("\r\n").map((instrucao) => ({ instrucao, breakpoint: false }))
        );
    };

    return (
        <>
            <h1>Compiler</h1>
            <Button>
                <Upload onChangefile={onChangeFile} />
            </Button>
        </>
    );
}