import React from 'react';
import classSet from 'classnames';
import Const from '../Const';

class ToolBar extends React.Component{

  constructor(props) {
		super(props);
    this.state = {
      isInsertRowTrigger: true
    };
    this.editMode = false;
    this.state.item = {};
    this.columns = {};
    this.guid = SiteGlobals.fn.guid();
  }

  handleNewBtnClick(e) {
    if(this.props.onNewBtnClicked){
      this.props.onNewBtnClicked();
    }
    this.editMode = false;
    this.state.item = {};
    this.setState(this.state);
    this.props.columns.forEach(function(column, i){
      if (column.addOptions && (column.addOptions.type == 'checkbox')) {
        this.refs[column.field+i].getDOMNode().checked = false;
      } else {
        this.refs[column.field+i].getDOMNode().value = '';
      }
    }, this);
    setTimeout(function() {
      $('#'+this.guid+'.insertModal .bs-datetime').each(function(idx, ele) {
        var $input = $(ele);
        var field = $input.attr('data-field');
        var d = $input.val();
        // console.log(d);
        $input.datetimepicker({
          stepping: 30,
        });
      }.bind(this));;
    }.bind(this),0);
  }

  handleSaveBtnClick(e){
    var newObj = (this.editMode) ? this.state.item : {};
    this.props.columns.forEach(function(column, i){
      if (column.addOptions && (column.addOptions.type == 'checkbox')) {
        newObj[column.field] = this.refs[column.field+i].getDOMNode().checked;
      } else {
        newObj[column.field] = this.refs[column.field+i].getDOMNode().value;
      }
    }, this);

    var msg;
    if (this.editMode) {
      msg = this.props.onEditRow(newObj);
    } else {
      msg = this.props.onAddRow(newObj);
    }

    if (msg) {
      this.refs.insertWarning.getDOMNode().style.display = "block";
      this.refs.insertWarningText.getDOMNode().textContent = msg;
    } else{
      this.refs.insertWarning.getDOMNode().style.display = "none";
      setTimeout(function() {$('#'+this.guid).modal('hide');}.bind(this), 0);
      this.editMode = false;
      this.state.item = {};
    }
  }

  handleEditBtnClick(e){
    this.state.item = this.props.onPrepareEditRow();
    if (!this.state.item) {
      e.stopPropagation();
      return false;
    }
    this.editMode = true;
    this.state.unModifiedItem = {};
    for (var k in this.state.item) {
      this.state.unModifiedItem[k] = this.state.item[k];
    }
    for (var k in this.state.item) {
      if (this.columns[k] && this.columns[k].addOptions && this.columns[k].addOptions.clearOnEdit) {
        this.state.item[k] = '';
      }
    }
    this.setState(this.state);
    setTimeout(function() {
      $('#'+this.guid+'.insertModal .bs-datetime').each(function(idx, ele) {
        var $input = $(ele);
        var field = $input.attr('data-field');
        var d = $input.val();
        $input.datetimepicker({
          stepping: 30,
        });
        $input.data("DateTimePicker").date(moment(d));
      }.bind(this));;
    }.bind(this),0);
  }

  onChange(field, e) {
    this.state.item[field] = e.target.value;
    this.setState(this.state);
  }

  handleDropRowBtnClick(e){
    this.props.onDropRow();
  }

  handleCloseBtn(e) {
    if (this.editMode) {
      for (var k in this.state.item) {
        this.state.item[k] = this.state.unModifiedItem[k];
      }
    }
  }

  handleCloseWarningBtn(e){
    this.refs.warning.getDOMNode().style.display = "none";
  }

  handleKeyUp(e){
    this.props.onSearch(e.currentTarget.value);
  }

  componentMounted() {
    setTimeout(function() {
      $('#'+this.guid).on('hide.bs.modal', function(e) {
        this.handleCloseBtn();
      }.bind(this));
    }.bind(this), 0);
  }

  render(){
    var modalClassName = "bs-table-modal-md"+new Date().getTime();
    /* Customize Modal */
    var useExtra = this.props.useExtra && this.props.useExtra==true ? true : false;
    var modalItemsClass = 'col-sm-4';
    var modalExtraClass = 'col-sm-8';
    // var modalExtra = (<p>I am Extra contents.</p>); // this.props.extra...
    var extraSettings = {
      useExtra: useExtra,
      modalItemsClass: modalItemsClass,
      modalExtraClass: modalExtraClass,
    }
    /* Customize Modal - end */
    var insertBtn = this.props.enableInsert?
          <button type="button" className="btn btn-primary" data-toggle="modal" data-target={'.'+modalClassName} onClick={this.handleNewBtnClick.bind(this)}>
            New</button>:null;

    var editBtn = this.props.enableEdit?
          <button type="button" disabled={!this.props.isSelected} className="btn btn-warning" data-toggle="modal" data-target={'.'+modalClassName} onClick={this.handleEditBtnClick.bind(this)}>
            Edit</button>:null;

    var deleteBtn = this.props.enableDelete?
          <button type="button" disabled={!this.props.isSelected} className="btn btn-danger" data-toggle="tooltip" data-placement="right" title="Delete selected items"
            onClick={this.handleDropRowBtnClick.bind(this)}>
            Delete
          </button>:null;
    var searchTextInput = this.props.enableSearch?
      <input className="form-control" type='text' placeholder={this.props.searchPlaceholder?this.props.searchPlaceholder:'Search'} onKeyUp={this.handleKeyUp.bind(this)}/>:null;
    var modal = (this.props.enableInsert || this.props.enableEdit)?this.renderInsertRowModal(modalClassName, extraSettings):null;
    var warningStyle = {
      display: "none",
      marginBottom: 0
    };
    return(
      <div>
        <form className="form-horizontal">
          <div className="row">
            <div className="col-xs-8">
              <div className="btn-group btn-group-sm" role="group" aria-label="...">
                {insertBtn}{editBtn}{deleteBtn}
              </div>
            </div>
            <div className="col-xs-4">
              {searchTextInput}
            </div>
          </div>
        </form>
        <div ref="warning" className="alert alert-warning" style={warningStyle}>
          <button type="button" className="close" aria-label="Close" onClick={this.handleCloseWarningBtn.bind(this)}><span aria-hidden="true">&times;</span></button>
          <strong>Warning! </strong><font ref="warningText"></font>
        </div>
        {modal}
      </div>
    )
  }

  renderInsertRowModal(modalClassName, extraSettings){
    this.columns = {};
    var inputField = this.props.columns.map(function(column, i){
      this.columns[column.field] = column;
      var addOptions = column.addOptions || {type: 'text', hidden: false};
      if (!addOptions.hidden) {
        switch (addOptions.type) {
          case 'text':
            return(
              <div className="form-group" key={column.field}>
                <label>{column.name}</label>
                <input ref={column.field+i} type="text" className="form-control" placeholder={column.name} value={this.state.item[column.field]} onChange={this.onChange.bind(this, column.field)}></input>
              </div>
            );
            break;
          case 'select':
            return(
              <div className="form-group" key={column.field}>
                <label>{column.name}</label>
                <select ref={column.field+i} className="form-control">
                {addOptions.selects.map(function (val, idx) {
                  if (val.id == this.state.item[column.field]) {
                    return (<option value={val.id} selected="selected">{val.name}</option>);
                  } else {
                    return (<option value={val.id}>{val.name}</option>);
                  }
                }.bind(this))}
                </select>
              </div>
            );
            break;
          case 'checkbox':
            return(
              <div className="form-group" key={column.field}>
                <label>{column.name}</label>
                <input ref={column.field+i} type="checkbox" className="form-control" checked={this.state.item[column.field]}></input>
              </div>
            );
            break;
          case 'multiline':
            return (
              <div className="form-group" key={column.field}>
                <label>{column.name}</label>
                <textarea ref={column.field+i} className="form-control" rows={column.addOptions.lines} placeholder={column.name} value={this.state.item[column.field]} onChange={this.onChange.bind(this, column.field)}></textarea>
              </div>
            );
            break;
          case 'datetime':
            return (
              <div className="form-group" key={column.field}>
                <label>{column.name}</label>
                <input ref={column.field+i} type="text" className="form-control bs-datetime" data-field={column.field} placeholder={column.name} value={this.state.item[column.field]} onChange={this.onChange.bind(this, column.field)}></input>
              </div>
            )
            break;
        }
      } else {
        return  (
          <div className="form-group" key={column.field}>
            <input ref={column.field+i} type="hidden" className="form-control" placeholder={column.name} value={this.state.item[column.field]}></input>
          </div>
        );
      }
    }.bind(this));
    var modalClass = classSet("modal", "fade", modalClassName, "insertModal", "in");
    var warningStyle = {
      display: "none",
      marginBottom: 0
    };
    var cx = React.addons.classSet;
    var extraContent = (null);
    var modalItemsClass = '';
    var modalExtraClass = '';
    if (extraSettings && extraSettings.useExtra) {
      extraContent = this.props.extraContent();
      modalItemsClass = extraSettings.modalItemsClass;
      modalExtraClass = extraSettings.modalExtraClass;
    }
    return (
      <div id={this.guid} className={modalClass} tabIndex="-1" role="dialog" aria-hidden="false">
        <div className="modal-dialog modal-md">
          <div className="modal-content">
            <div className="row">
              <div className={modalItemsClass}>
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title">New Record</h4>
                </div>
                <div className="modal-body">
                  {inputField}
                </div>
              </div>
              <div className={modalExtraClass}>
                {extraContent}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={this.handleCloseBtn.bind(this)} data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={this.handleSaveBtnClick.bind(this)}>Save</button>
            </div>
            <div ref="insertWarning" className="alert alert-warning" style={warningStyle}>
              <button type="button" className="close" aria-label="Close" onClick={this.handleCloseWarningBtn.bind(this)}><span aria-hidden="true">&times;</span></button>
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
  enableEdit: React.PropTypes.bool,
  enableDelete: React.PropTypes.bool,
  enableSearch: React.PropTypes.bool,
  columns: React.PropTypes.array,
  searchPlaceholder: React.PropTypes.string
};

ToolBar.defaultProps = {
  enableInsert: false,
  enableEdit: false,
  enableDelete: false,
  enableSearch: false
}
export default ToolBar;
