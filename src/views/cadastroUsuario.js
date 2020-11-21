import React from 'react'

import Card from '../components/card'
import FormGroup from '../components/form-group'
import { withRouter } from 'react-router-dom'
import UsuarioService from '../app/service/usuarioService'
import {mensagemErro, mensagemSucesso} from '../components/toastr'

class CadastroUsuario extends React.Component {
    state = {
        nome: '',
        email: '',
        senha: '',
        senhaRepeticao: ''
    }

    constructor() {
        super();
        this.service = new UsuarioService();
    }
    
    cadastrar = () => {
        const {nome, email, senha, senhaRepeticao} = this.state
        const usuario = {nome, email, senha, senhaRepeticao}

        try{
           this.service.validar(usuario)
        }catch(erro) {
            const msgs = erro.mensagens;
            msgs.forEach(msg => mensagemErro(msg));
            return false;
        }

        this.service.salvar(usuario)
        .then( response => {
           mensagemSucesso('Usuário cadastrado com sucesso! Faça o login para acessar o sistema')
           this.props.history.push('/login')
        }).catch(error => {
            mensagemErro(error.response.data)
        }) 
    }
    cancelar = () => {
        this.props.history.push('/login')
    }

    render() {
        return (
           
                
                <Card title="Cadastro de Usuário">
                <div className="row">
                    <div className="col-lg-12">
                       <div className="bs-component">
                           <FormGroup label="Nome *" htmlFor="inputNome">
                               <input type="text"
                                      id="inputNome"
                                      name="nome"
                                      className="form-control"
                                      onChange={e => this.setState({nome: e.target.value})} />                               
                           </FormGroup>
                           <FormGroup label="Email *" htmlFor="inputNome">
                               <input type="text"
                                      id="inputEmail"
                                      name="email"
                                      className="form-control"
                                      onChange={e => this.setState({email: e.target.value})} />                               
                           </FormGroup>
                           <FormGroup label="Senha *" htmlFor="inputSenha">
                               <input type="password"
                                      id="inputSenha"
                                      name="senha"
                                      className="form-control"
                                      onChange={e => this.setState({senha: e.target.value})} />                               
                           </FormGroup>
                           <FormGroup label="Repita a senha *" htmlFor="inputRepitaSenha">
                               <input type="password"
                                      id="inputRepitaSenha"
                                      name="repitaSenha"
                                      className="form-control"
                                      onChange={e => this.setState({senhaRepeticao: e.target.value})} />                               
                           </FormGroup>
                           <button type="button" className="btn btn-success" onClick={this.cadastrar}>
                              <i className="pi pi-save"> </i>
                              Salvar                            
                            </button>
                           <button type="button" className="btn btn-danger" onClick={this.cancelar}>
                               <i className="pi pi-times"> </i>                              
                              Cancelar 
                           </button>                        
                        </div>
                    </div>
                </div>

                </Card>
            
        )
    }
}
export default withRouter(CadastroUsuario) 