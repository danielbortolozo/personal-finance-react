import React from 'react'
import {withRouter} from 'react-router-dom'
import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import LancamentosTable from './lancamentosTable'
import LancamentoService from '../../app/service/lancamentoService'
import LocalStorageService from '../../app/service/localstorageService'
import * as messages from '../../components/toastr'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

class ConsultaLancamentos extends React.Component{
   state = {
       ano: '',
       mes: '',
       tipo: '',
       descricao: '',
       showConfirmDialog: false,
       lancamentoDeletar: {},
       lancamentos: []
   }
    constructor(){
        super();
        this.service = new LancamentoService();
    }
   buscar = () => {
       if (!this.state.ano) {
          messages.mensagemErro('O preenchimento do campo ano é obrigatório.');
          return false;
       }

       const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');
       const lancamentoFiltro = {
           ano: this.state.ano,
           mes: this.state.mes,
           tipo: this.state.tipo,
           descricao: this.state.descricao,
           usuario: usuarioLogado.id
       }

       this.service
           .consultar(lancamentoFiltro)
           .then(response => {
               const lista = response.data;
               if (lista.length < 1 ) {
                   messages.mensagemWarn("Nenhum resultado encontrado.")
               }
               this.setState({ lancamentos: lista})
           }).catch( error => {
               console.log(error);
           })
   }
   editar = (id) => {
       this.props.history.push(`/cadastro-lancamentos/${id}`)
   }
   abrirConfirmacao = (lancamento) => {
      this.setState({ showConfirmDialog : true, lancamentoDeletar: lancamento })
   }

   alterarStatus = (lancamento, status) => {
       this.service
           .alterarStatus(lancamento.id, status)
           . then(response => {
               const lancamentos = this.state.lancamentos;
               const index = lancamentos.indexOf(lancamento);
               if (index !== -1) {
                   lancamento['status'] = status;
                   lancamentos[index] = lancamento;
                   this.setState({lancamentos});
               }

               messages.mensagemSucesso("Status atualizado com sucesso.")
           })
    }

   cancelarDelecao = () => {
    this.setState({ showConfirmDialog : false, lancamentoDeletar: {} })
   }
   deletar = () => {
       this.service
           .deletar(this.state.lancamentoDeletar.id)
           .then(response => {
               const lancamentos = this.state.lancamentos;
               const index = lancamentos.indexOf(this.lancamentoDeletar);
               lancamentos.splice(index, 1);
               this.setState({ lancamentos: lancamentos, showConfirmDialog: false});
               messages.mensagemSucesso('Lançamento excluído com sucesso.')
               this.buscar();
           }).catch(error => {
               messages.mensagemErro('Ocorreu um erro ao excluir lançamento.')
           })       
   }
   preparaFormularioCadastro = () => {
       this.props.history.push('/cadastro-lancamentos')
   }
   
    render() {
       const meses = this.service.obterListaMeses();
       const tipos = this.service.obterListaTipos();
       const confirmDialogFooter = (
        <div>
            <Button label="Confirmar"  onClick={this.deletar} />
            <Button label="Cancelar"  onClick={this.cancelarDelecao} className="p-button-secondary" />
        </div>
       );
       return (
           <Card title='Consulta Lançamentos'>
               <div className="row">
                  <div className="col-md-6">
                     <div className="bs-component"> 
                       <FormGroup htmlFor="inputAno" label="Ano: *" >
                           <input type="text" className="form-control" id="inputAno"
                                  value={this.state.ano} 
                                  onChange={e => this.setState({ano: e.target.value})}
                                  placeholder="Digite o Ano" />
                       </FormGroup>

                       <FormGroup htmlFor="inputMes" label="Mês: *" >
                           <SelectMenu id="inputMes"
                                       value={this.state.mes}
                                       onChange={e => this.setState({mes: e.target.value})}
                                       className="form-control" lista={meses} />                         
                       </FormGroup>

                       <FormGroup htmlFor="inputDescricao" label="Descrição: " >
                           <input type="text" className="form-control" 
                                  id="inputDescricao"
                                  value={this.state.descricao} 
                                  onChange={e => this.setState({descricao: e.target.value})}
                                  placeholder="Digite a descrição." />
                       </FormGroup>

                       <FormGroup htmlFor="inputTipo" label="Tipo Lançamento: *" >
                           <SelectMenu id="inputTipo"
                                       value={this.state.tipo}
                                       onChange={e => this.setState({tipo: e.target.value})}
                                       className="form-control" lista={tipos} />                         
                       </FormGroup>
                       <Button onClick={this.buscar} label="Buscar" icon="pi pi-search" iconPos="right" className="p-button-success" />
                       <Button onClick={this.preparaFormularioCadastro} label="Cadastrar" icon="pi pi-plus" iconPos="right" className="p-button-danger" />
  
                     </div>
                  </div>
               </div>
               <br />
               <div className="row"> 
                     <div className="col-md-12" >
                        <div class="bs-component">
                            <LancamentosTable lancamentos={this.state.lancamentos} 
                                            deleteAction={this.abrirConfirmacao} 
                                            editAction={this.editar} 
                                            alterarStatus={this.alterarStatus} />                      
                        </div>
                     </div>    
               </div>
                <div>
              
                <Dialog header="Excluir lançamento." 
                        visible={this.state.showConfirmDialog} 
                        style={{ width: '50vw' }} 
                        modal={true}
                        footer={confirmDialogFooter}
                        onHide={() => this.setState({showConfirmDialog: false})}>
                    <p>Confirma a exclusão deste lançamento?</p>
                </Dialog>
                </div>

           </Card>

       )
   }

}
export default withRouter(ConsultaLancamentos);
