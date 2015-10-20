"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var React = _interopRequire(require("react"));

var classSet = _interopRequire(require("classnames"));

var Const = _interopRequire(require("../Const"));

var ToolBar = (function (_React$Component) {
  function ToolBar(props) {
    _classCallCheck(this, ToolBar);

    _get(Object.getPrototypeOf(ToolBar.prototype), "constructor", this).call(this, props);
    this.state = {
      isInsertRowTrigger: true
    };
    this.editMode = false;
    this.state.item = {};
    this.columns = {};
    this.guid = SiteGlobals.fn.guid();
  }

  _inherits(ToolBar, _React$Component);

  _createClass(ToolBar, {
    handleNewBtnClick: {
      value: function handleNewBtnClick(e) {
        if (this.props.onNewBtnClicked) {
          this.props.onNewBtnClicked();
        }
        this.editMode = false;
        this.state.item = {};
        this.setState(this.state);
        this.props.columns.forEach(function (column, i) {
          if (column.addOptions && column.addOptions.type == "checkbox") {
            this.refs[column.field + i].getDOMNode().checked = false;
          } else {
            this.refs[column.field + i].getDOMNode().value = "";
          }
        }, this);
        setTimeout((function () {
          $("#" + this.guid + ".insertModal .bs-datetime").each((function (idx, ele) {
            var $input = $(ele);
            var field = $input.attr("data-field");
            var d = $input.val();
            // console.log(d);
            $input.datetimepicker({
              stepping: 30 });
          }).bind(this));;
        }).bind(this), 0);
      }
    },
    handleSaveBtnClick: {
      value: function handleSaveBtnClick(e) {
        var newObj = this.editMode ? this.state.item : {};
        this.props.columns.forEach(function (column, i) {
          if (column.addOptions && column.addOptions.type == "checkbox") {
            newObj[column.field] = this.refs[column.field + i].getDOMNode().checked;
          } else {
            newObj[column.field] = this.refs[column.field + i].getDOMNode().value;
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
        } else {
          this.refs.insertWarning.getDOMNode().style.display = "none";
          setTimeout((function () {
            $("#" + this.guid).modal("hide");
          }).bind(this), 0);
          this.editMode = false;
          this.state.item = {};
        }
      }
    },
    handleEditBtnClick: {
      value: function handleEditBtnClick(e) {
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
            this.state.item[k] = "";
          }
        }
        this.setState(this.state);
        setTimeout((function () {
          $("#" + this.guid + ".insertModal .bs-datetime").each((function (idx, ele) {
            var $input = $(ele);
            var field = $input.attr("data-field");
            var d = $input.val();
            $input.datetimepicker({
              stepping: 30 });
            $input.data("DateTimePicker").date(moment(d));
          }).bind(this));;
        }).bind(this), 0);
      }
    },
    onChange: {
      value: function onChange(field, e) {
        this.state.item[field] = e.target.value;
        this.setState(this.state);
      }
    },
    handleDropRowBtnClick: {
      value: function handleDropRowBtnClick(e) {
        this.props.onDropRow();
      }
    },
    handleCloseBtn: {
      value: function handleCloseBtn(e) {
        if (this.editMode) {
          for (var k in this.state.item) {
            this.state.item[k] = this.state.unModifiedItem[k];
          }
        }
      }
    },
    handleCloseWarningBtn: {
      value: function handleCloseWarningBtn(e) {
        this.refs.warning.getDOMNode().style.display = "none";
      }
    },
    handleKeyUp: {
      value: function handleKeyUp(e) {
        this.props.onSearch(e.currentTarget.value);
      }
    },
    componentMounted: {
      value: function componentMounted() {
        setTimeout((function () {
          $("#" + this.guid).on("hide.bs.modal", (function (e) {
            this.handleCloseBtn();
          }).bind(this));
        }).bind(this), 0);
      }
    },
    render: {
      value: function render() {
        var modalClassName = "bs-table-modal-md" + new Date().getTime();
        /* Customize Modal */
        var useExtra = this.props.useExtra && this.props.useExtra == true ? true : false;
        var modalItemsClass = "col-sm-4";
        var modalExtraClass = "col-sm-8";
        // var modalExtra = (<p>I am Extra contents.</p>); // this.props.extra...
        var extraSettings = {
          useExtra: useExtra,
          modalItemsClass: modalItemsClass,
          modalExtraClass: modalExtraClass };
        /* Customize Modal - end */
        var insertBtn = this.props.enableInsert ? React.createElement(
          "button",
          { type: "button", className: "btn btn-primary", "data-toggle": "modal", "data-target": "." + modalClassName, onClick: this.handleNewBtnClick.bind(this) },
          "New"
        ) : null;

        var editBtn = this.props.enableEdit ? React.createElement(
          "button",
          { type: "button", disabled: !this.props.isSelected, className: "btn btn-warning", "data-toggle": "modal", "data-target": "." + modalClassName, onClick: this.handleEditBtnClick.bind(this) },
          "Edit"
        ) : null;

        var deleteBtn = this.props.enableDelete ? React.createElement(
          "button",
          { type: "button", disabled: !this.props.isSelected, className: "btn btn-danger", "data-toggle": "tooltip", "data-placement": "right", title: "Delete selected items",
            onClick: this.handleDropRowBtnClick.bind(this) },
          "Delete"
        ) : null;
        var searchTextInput = this.props.enableSearch ? React.createElement("input", { className: "form-control", type: "text", placeholder: this.props.searchPlaceholder ? this.props.searchPlaceholder : "Search", onKeyUp: this.handleKeyUp.bind(this) }) : null;
        var modal = this.props.enableInsert || this.props.enableEdit ? this.renderInsertRowModal(modalClassName, extraSettings) : null;
        var warningStyle = {
          display: "none",
          marginBottom: 0
        };
        return React.createElement(
          "div",
          null,
          React.createElement(
            "form",
            { className: "form-horizontal" },
            React.createElement(
              "div",
              { className: "row" },
              React.createElement(
                "div",
                { className: "col-xs-8" },
                React.createElement(
                  "div",
                  { className: "btn-group btn-group-sm", role: "group", "aria-label": "..." },
                  insertBtn,
                  editBtn,
                  deleteBtn
                )
              ),
              React.createElement(
                "div",
                { className: "col-xs-4" },
                searchTextInput
              )
            )
          ),
          React.createElement(
            "div",
            { ref: "warning", className: "alert alert-warning", style: warningStyle },
            React.createElement(
              "button",
              { type: "button", className: "close", "aria-label": "Close", onClick: this.handleCloseWarningBtn.bind(this) },
              React.createElement(
                "span",
                { "aria-hidden": "true" },
                "×"
              )
            ),
            React.createElement(
              "strong",
              null,
              "Warning! "
            ),
            React.createElement("font", { ref: "warningText" })
          ),
          modal
        );
      }
    },
    renderInsertRowModal: {
      value: function renderInsertRowModal(modalClassName, extraSettings) {
        this.columns = {};
        var inputField = this.props.columns.map((function (column, i) {
          this.columns[column.field] = column;
          var addOptions = column.addOptions || { type: "text", hidden: false };
          if (!addOptions.hidden) {
            switch (addOptions.type) {
              case "text":
                return React.createElement(
                  "div",
                  { className: "form-group", key: column.field },
                  React.createElement(
                    "label",
                    null,
                    column.name
                  ),
                  React.createElement("input", { ref: column.field + i, type: "text", className: "form-control", placeholder: column.name, value: this.state.item[column.field], onChange: this.onChange.bind(this, column.field) })
                );
                break;
              case "select":
                return React.createElement(
                  "div",
                  { className: "form-group", key: column.field },
                  React.createElement(
                    "label",
                    null,
                    column.name
                  ),
                  React.createElement(
                    "select",
                    { ref: column.field + i, className: "form-control" },
                    addOptions.selects.map((function (val, idx) {
                      if (val.id == this.state.item[column.field]) {
                        return React.createElement(
                          "option",
                          { value: val.id, selected: "selected" },
                          val.name
                        );
                      } else {
                        return React.createElement(
                          "option",
                          { value: val.id },
                          val.name
                        );
                      }
                    }).bind(this))
                  )
                );
                break;
              case "checkbox":
                return React.createElement(
                  "div",
                  { className: "form-group", key: column.field },
                  React.createElement(
                    "label",
                    null,
                    column.name
                  ),
                  React.createElement("input", { ref: column.field + i, type: "checkbox", className: "form-control", checked: this.state.item[column.field] })
                );
                break;
              case "multiline":
                return React.createElement(
                  "div",
                  { className: "form-group", key: column.field },
                  React.createElement(
                    "label",
                    null,
                    column.name
                  ),
                  React.createElement("textarea", { ref: column.field + i, className: "form-control", rows: column.addOptions.lines, placeholder: column.name, value: this.state.item[column.field], onChange: this.onChange.bind(this, column.field) })
                );
                break;
              case "datetime":
                return React.createElement(
                  "div",
                  { className: "form-group", key: column.field },
                  React.createElement(
                    "label",
                    null,
                    column.name
                  ),
                  React.createElement("input", { ref: column.field + i, type: "text", className: "form-control bs-datetime", "data-field": column.field, placeholder: column.name, value: this.state.item[column.field], onChange: this.onChange.bind(this, column.field) })
                );
                break;
            }
          } else {
            return React.createElement(
              "div",
              { className: "form-group", key: column.field },
              React.createElement("input", { ref: column.field + i, type: "hidden", className: "form-control", placeholder: column.name, value: this.state.item[column.field] })
            );
          }
        }).bind(this));
        var modalClass = classSet("modal", "fade", modalClassName, "insertModal", "in");
        var warningStyle = {
          display: "none",
          marginBottom: 0
        };
        var cx = React.addons.classSet;
        var extraContent = null;
        var modalItemsClass = "";
        var modalExtraClass = "";
        if (extraSettings && extraSettings.useExtra) {
          extraContent = this.props.extraContent();
          modalItemsClass = extraSettings.modalItemsClass;
          modalExtraClass = extraSettings.modalExtraClass;
        }
        return React.createElement(
          "div",
          { id: this.guid, className: modalClass, tabIndex: "-1", role: "dialog", "aria-hidden": "false" },
          React.createElement(
            "div",
            { className: "modal-dialog modal-md" },
            React.createElement(
              "div",
              { className: "modal-content" },
              React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                  "div",
                  { className: modalItemsClass },
                  React.createElement(
                    "div",
                    { className: "modal-header" },
                    React.createElement(
                      "button",
                      { type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close" },
                      React.createElement(
                        "span",
                        { "aria-hidden": "true" },
                        "×"
                      )
                    ),
                    React.createElement(
                      "h4",
                      { className: "modal-title" },
                      "New Record"
                    )
                  ),
                  React.createElement(
                    "div",
                    { className: "modal-body" },
                    inputField
                  )
                ),
                React.createElement(
                  "div",
                  { className: modalExtraClass },
                  extraContent
                )
              ),
              React.createElement(
                "div",
                { className: "modal-footer" },
                React.createElement(
                  "button",
                  { type: "button", className: "btn btn-default", onClick: this.handleCloseBtn.bind(this), "data-dismiss": "modal" },
                  "Close"
                ),
                React.createElement(
                  "button",
                  { type: "button", className: "btn btn-primary", onClick: this.handleSaveBtnClick.bind(this) },
                  "Save"
                )
              ),
              React.createElement(
                "div",
                { ref: "insertWarning", className: "alert alert-warning", style: warningStyle },
                React.createElement(
                  "button",
                  { type: "button", className: "close", "aria-label": "Close", onClick: this.handleCloseWarningBtn.bind(this) },
                  React.createElement(
                    "span",
                    { "aria-hidden": "true" },
                    "×"
                  )
                ),
                React.createElement(
                  "strong",
                  null,
                  "Warning! "
                ),
                React.createElement("font", { ref: "insertWarningText" })
              )
            )
          )
        );
      }
    }
  });

  return ToolBar;
})(React.Component);

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
};
module.exports = ToolBar;