import React from 'react';
import './style.css';

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

// import { Container } from './styles';

const code = `let test = true;`;

class Teste extends React.Component {
    state = { code };

    render() {
        return <>
            <div className="container_editor_area">    
                <Editor 
                    value={this.state.code}
                    onValueChange={code => this.setState({ code })}
                    highlight={code => 
                        highlight(code, languages.js)
                        .split('\n')
                        .map(
                            line =>
                                `<span class="container_editor_line_number">${line}</span>`
                        )
                        .join('\n')
                    }
                    padding={10}
                    style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 12
                    }}
                    className="container__editor"
                />
            </div>
        </>
    }
}

export default Teste;