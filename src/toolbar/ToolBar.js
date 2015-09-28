import React from 'react';
import classSet from 'classnames';
import Const from '../Const';

class ToolBar extends React.Component{

  constructor(props) {
		super(props);
    this.state = {
      isInsertRowTrigger: true
    };
  }

  handleNewBtnClick(e) {
    setTimeout(function() {
      $.each($('.insertModal').find('input'), function(idx, ele) {
        $(ele).val('');
      });
    }, 0);
  }

  handleSaveBtnClick(e){
    var newObj = {};
    this.props.columns.forEach(function(column, i){
      if (column.addOptions && (column.addOptions.type == 'checkbox')) {
        newObj[column.field] = this.refs[column.field+i].getDOMNode().checked;
      } else {
        newObj[column.field] = this.refs[column.field+i].getDOMNode().value;
      }
    }, this);
    console.log('handleSaveBtnClick ' + newObj);
    var msg = this.props.onAddRow(newObj);
    if(msg) {
      this.refs.insertWarning.getDOMNode().style.display = "block";
      this.refs.insertWarningText.getDOMNode().textContent = msg;
    } else{
      this.refs.insertWarning.getDOMNode().style.display = "none";
      setTimeout(function() {$('.insertModal').modal('hide');}, 0);
    }
  }

  handleDropRowBtnClick(e){
    this.props.onDropRow();
  }

  handleCloseBtn(e){
    this.refs.warning.getDOMNode().style.display = "none";
  }

  handleKeyUp(e){
    this.props.onSearch(e.currentTarget.value);
  }

  render(){
    var modalClassName = "bs-table-modal-md"+new Date().getTime();
    var insertBtn = this.props.enableInsert?
          <button type="button" className="btn btn-default" data-toggle="modal" data-target={'.'+modalClassName} onClick={this.handleNewBtnClick.bind(this)}>
            New</button>:null;

    var deleteBtn = this.props.enableDelete?
          <button type="button" className="btn btn-default" data-toggle="tooltip" data-placement="right" title="Drop selected row"
            onClick={this.handleDropRowBtnClick.bind(this)}>
            Delete
          </button>:null;
    var searchTextInput = this.props.enableSearch?
      <input type='text' placeholder={this.props.searchPlaceholder?this.props.searchPlaceholder:'Search'} onKeyUp={this.handleKeyUp.bind(this)}/>:null;
    var modal = this.props.enableInsert?this.renderInsertRowModal(modalClassName):null;
    var warningStyle = {
      display: "none",
      marginBottom: 0
    };
    return(
      <div>
        <div className="btn-group btn-group-sm" role="group" aria-label="...">
          {insertBtn}{deleteBtn}
        </div>
        {searchTextInput}
        <div ref="warning" className="alert alert-warning" style={warningStyle}>
          <button type="button" className="close" aria-label="Close" onClick={this.handleCloseBtn.bind(this)}><span aria-hidden="true">&times;</span></button>
          <strong>Warning! </strong><font ref="warningText"></font>
        </div>
        {modal}
      </div>
    )
  }

  renderInsertRowModal(modalClassName){

    var inputField = this.props.columns.map(function(column, i){
      var addOptions = column.addOptions || {};
      if (!addOptions.hidden) {
        switch (addOptions.type) {
          case 'text':
            return(
              <div className="form-group" key={column.field}>
                <label>{column.name}</label>
                <input ref={column.field+i} type="text" className="form-control" placeholder={column.name}></input>
              </div>
            );
            break;
          case 'select':
            break;
          case 'checkbox':
            return(
              <div className="form-group" key={column.field}>
                <label>{column.name}</label>
                <input ref={column.field+i} type="checkbox" className="form-control"></input>
              </div>
            );
            break;
        }
      } else {
        return  (
          <div className="form-group" key={column.field}>
            <input ref={column.field+i} type="hidden" className="form-control" placeholder={column.name}></input>
          </div>
        );
      }
    });
    var modalClass = classSet("modal", "fade", modalClassName, "insertModal");
    var warningStyle = {
      display: "none",
      marginBottom: 0
    };
    return (
      <div className={modalClass} tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title">New Record</h4>
            </div>
            <div className="modal-body">
              {inputField}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={this.handleSaveBtnClick.bind(this)}>Save</button>
            </div>
            <div ref="insertWarning" className="alert alert-warning" style={warningStyle}>
              <button type="button" className="close" aria-label="Close" onClick={this.handleCloseBtn.bind(this)}><span aria-hidden="true">&times;</span></button>
              <strong>Warning! </strong><font ref="insertWarningText"></font>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
ToolBar.propTypes = {
  onAddRow: React.PropTypes.func,
  onDropRow: React.PropTypes.func,
  enableInsert: React.PropTypes.bool,
  enableDelete: React.PropTypes.bool,
  enableSearch: React.PropTypes.bool,
  columns: React.PropTypes.array,
  searchPlaceholder: React.PropTypes.string
};

ToolBar.defaultProps = {
  enableInsert: false,
  enableDelete: false,
  enableSearch: false
}
export default ToolBar;
