import React, { Component } from 'react';
import moment from 'moment';
import { Popover, Button, Row, Col, List, Pagination, DatePicker, Select, Affix, Modal, Input, Radio, Form } from 'antd';
import 'antd/dist/antd.css';
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

const RecordRows = ({records}) => {
  let result = [];
  for(let i = 0; i < records.length; i++) {
    let item = records[i];
    if(i !== 0) {
      result.push(<hr style={{border: "#d1d3d5 solid 0.5px"}}/>);
    }
    result.push(
      <Row type="flex" align="middle">
        <Col xs={6} sm={2} align="left">
          {item.date}
        </Col>
        <Col xs={6} sm={3} align="right">
          {item.transType}
        </Col>
        <Col xs={6} sm={3} align="right">
          {item.amount}
        </Col>
        <Col xs={6} sm={0} align="right">
          <Button>Detail</Button>
        </Col>
        <Col xs={0} sm={3}>
          &nbsp;
        </Col>
        <Col xs={0} sm={5}>
          {item.issuer}
        </Col>
        <Col xs={0} sm={8} align="right">
          <Button>Modify</Button>
        </Col>
        <Col xs={0} sm={4}>
          {item.depoName}
        </Col>
        <Col xs={0} sm={4} align="right">
          {item.mngAccName}
        </Col>
        <Col xs={0} sm={3}>
          &nbsp;
        </Col>
        <Col xs={0} sm={11}>
          {item.itemName}
        </Col>
        <Col xs={0} sm={24}>
          {item.itemDesc}
        </Col>
      </Row>
    );
  }
  return result;
}

let testData = [];
for(let i = 0; i < 10; i++) {
  testData.push({
    date: "2020/01/21",
    amount: "+ 300",
    transType: "income",
    depoName: "Cash",
    mngAccName: "Living Expense",
    itemName: "Item Name",
    itemDesc: "Item Description",
    issuer: "Issued by Ranian"
  });
}




class FormLayoutDemo extends React.Component {
  constructor() {
    super();
    this.state = {
      formLayout: 'horizontal',
    };
  }
  handleFormLayoutChange = (e) => {
    this.setState({ formLayout: e.target.value });
  }
  render() {
    const { formLayout } = this.state;
    const formItemLayout = formLayout === 'horizontal' ? {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    } : null;
    const buttonItemLayout = formLayout === 'horizontal' ? {
      wrapperCol: { span: 14, offset: 4 },
    } : null;
    return (
      <div>
        <Form layout={formLayout}>
          <FormItem
            label="Form Layout"
            {...formItemLayout}
          >
            <Radio.Group defaultValue="horizontal" onChange={this.handleFormLayoutChange}>
              <Radio.Button value="horizontal">Horizontal</Radio.Button>
              <Radio.Button value="vertical">Vertical</Radio.Button>
              <Radio.Button value="inline">Inline</Radio.Button>
            </Radio.Group>
          </FormItem>
          <FormItem
            label="Field A"
            {...formItemLayout}
          >
            <Input placeholder="input placeholder" />
          </FormItem>
          <FormItem
            label="Field B"
            {...formItemLayout}
          >
            <Input placeholder="input placeholder" />
          </FormItem>
          <FormItem {...buttonItemLayout}>
            <Button type="primary">Submit</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}




const dateFormat = 'YYYY/MM/DD';

class MoneyFlow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      recordsOnPage: [],
      totalRecords: 0,
      currentPage: 1,
      recordsPerPage: 10,
      filterStartDate: null,
      filterEndDate: null,
      filterOwner: null,
      filterIssuer: null,
      filterDepo: null,
      filterMngAcc: null,
      modalVisible: false,
      formOperation: null, // add, edit, delete
      recordOperation: null, // expense, income, transfer
      singleRecordToOperate: {
        recordType: "",
        name: "",
        desc: "",
        amount: 0,
        depoId: "",
        mngAccId: "",
        transDate: "",
        transType: ""
      },
      transferRecordsToOperate: {
        sourceDepoId: "",
        sourceMngAccId: "",
        targetDepoId: "",
        targetMngAccId: "",
        amount: 0
      }
    };

    this.openEmptyRecordModal = this.openEmptyRecordModal.bind(this);
    this.updateSingleRecordState = this.updateSingleRecordState.bind(this);
    this.updateRecordNameState = this.updateRecordNameState.bind(this);
    this.updateRecordDescState = this.updateRecordDescState.bind(this);
    this.updateRecordAmountState = this.updateRecordAmountState.bind(this);
    this.updateRecordDepoState = this.updateRecordDepoState.bind(this);
    this.updateRecordMngAccState = this.updateRecordMngAccState.bind(this);
    this.updateFormFieldState = this.updateFormFieldState.bind(this);
    this.updateRecordOperationState = this.updateRecordOperationState.bind(this);
    this.updateTransferRecordState = this.updateTransferRecordState.bind(this);
    this.updateTransferSourceDepoIdState = this.updateTransferSourceDepoIdState.bind(this);
    this.updateTransferSourceMngAccIdState = this.updateTransferSourceMngAccIdState.bind(this);
    this.updateTransferTargetDepoIdState = this.updateTransferTargetDepoIdState.bind(this);
    this.updateTransferTargetMngAccIdState = this.updateTransferTargetMngAccIdState.bind(this);
    this.updateTransferAmountState = this.updateTransferAmountState.bind(this);
  }

  openEmptyRecordModal() {
    this.setState({
      modalVisible: true,
      formOperation: "add",
      recordOperation: "expense",
      singleRecordToOperate: {
        recordType: "expense",
        name: "test init name",
        desc: "test init desc",
        amount: 0,
        depoId: "default",
        mngAccId: "default",
        transDate: moment(),
        transType: "expense"
      }
    });
  }

  setModalVisible(visibility) {
    this.setState({ modalVisible: visibility });
  }

  updateSingleRecordState(propName, value) {
    this.setState((prevState) => {
      let recordToBe = Object.assign({}, prevState.singleRecordToOperate);
      recordToBe[propName] = value;
      return { singleRecordToOperate : recordToBe };
    });
  }

  updateRecordNameState(event) {
    this.updateSingleRecordState("name", event.target.value);
  }

  updateRecordDescState(event) {
    this.updateSingleRecordState("desc", event.target.value);
  }

  updateRecordAmountState(event) {
    let value = +event.target.value;
    this.updateSingleRecordState("amount", Number.isNaN(value) ? 0 : value);
  }

  updateRecordDepoState(optionKey) {
    this.updateSingleRecordState("depoId", optionKey);
  }

  updateRecordMngAccState(optionKey) {
    this.updateSingleRecordState("mngAccId", optionKey);
  }

  updateFormFieldState(selectedMoment) {
    this.updateSingleRecordState("transDate", selectedMoment);
  }

  updateRecordOperationState(event) {
    this.setState({ recordOperation : event.target.value });
  }

  updateTransferRecordState(propName, value) {
    this.setState((prevState) => {
      let recordToBe = Object.assign({}, prevState.transferRecordsToOperate);
      recordToBe[propName] = value;
      return { transferRecordsToOperate : recordToBe };
    });
  }

  updateTransferSourceDepoIdState(optionKey) {
    this.updateTransferRecordState("sourceDepoId", optionKey);
  }

  updateTransferSourceMngAccIdState(optionKey) {
    this.updateTransferRecordState("sourceMngAccId", optionKey);
  }

  updateTransferTargetDepoIdState(optionKey) {
    this.updateTransferRecordState("targetDepoId", optionKey);
  }

  updateTransferTargetMngAccIdState(optionKey) {
    this.updateTransferRecordState("targetMngAccId", optionKey);
  }

  updateTransferAmountState(event) {
    let value = +event.target.value;
    this.updateTransferRecordState("amount", Number.isNaN(value) ? 0 : value);
  }

  render() {
    return (
      <div>
        <Row gutter={{ xs: 4, sm: 10 }}>
          <Col xs={12} sm={12} align="middle">
            <DatePicker defaultValue={moment('2015/01/01', dateFormat)} format={dateFormat} />
          </Col>
          <Col xs={12} sm={12} align="middle">
            <DatePicker defaultValue={moment('2015/01/01', dateFormat)} format={dateFormat} />
          </Col>
          <Col xs={12} sm={12} align="middle">
            <Select defaultValue="default" style={{width: "100%"}}>
              <Option value="default">All Depositories</Option>
              <Option value="depo01">Cash</Option>
              <Option value="depo02">Cathay Bank</Option>
            </Select>
          </Col>
          <Col xs={12} sm={12} align="middle">
            <Select defaultValue="default" style={{width: "100%"}}>
              <Option value="default">All Managing Accounts</Option>
              <Option value="mngAcc01">Living Expense</Option>
              <Option value="mngAcc02">Travel</Option>
            </Select>
          </Col>
        </Row>
        <div style={{padding: "10px 0px"}}>
          <RecordRows records={testData} />
        </div>
        <Row>
          <Col align="middle">
            <Pagination size="small" total={50} />
          </Col>
        </Row>
        <Row>
          <Col span="24" align="right" style={{padding: "10px 0px"}}>
            <Affix offsetBottom={5} onChange={affixed => console.log(affixed)}>
              <Button onClick={this.openEmptyRecordModal}>Keep a Record</Button>
            </Affix>
          </Col>
        </Row>
        <Modal
          title="Vertically centered modal dialog"
          wrapClassName="vertical-center-modal"
          visible={this.state.modalVisible}
          onOk={() => this.setModalVisible(false)}
          onCancel={() => this.setModalVisible(false)}
        >
          <RadioGroup value={this.state.recordOperation} onChange={this.updateRecordOperationState}>
            <RadioButton value="expense">Expense</RadioButton>
            <RadioButton value="income">Income</RadioButton>
            <RadioButton value="transfer">Transfer</RadioButton>
          </RadioGroup>
          {
            this.state.recordOperation === "expense" ? (
              <div>
                <div>
                  Item Name
                </div>
                <Input value={this.state.singleRecordToOperate.name} onChange={this.updateRecordNameState} />
                <Input value={this.state.singleRecordToOperate.desc} onChange={this.updateRecordDescState} />
                <Input value={this.state.singleRecordToOperate.amount} onChange={this.updateRecordAmountState} />
                <Select value={this.state.singleRecordToOperate.depoId} style={{width: "100%"}} onChange={this.updateRecordDepoState}>
                  <Option value="default">All Depositories</Option>
                  <Option value="depo01">Cash</Option>
                  <Option value="depo02">Cathay Bank</Option>
                </Select>
                <Select value={this.state.singleRecordToOperate.mngAccId} style={{width: "100%"}} onChange={this.updateRecordMngAccState}>
                  <Option value="default">All Managing Accounts</Option>
                  <Option value="mngAcc01">Living Expense</Option>
                  <Option value="mngAcc02">Travel</Option>
                </Select>
                <DatePicker defaultValue={moment()} format={dateFormat} onChange={this.updateFormFieldState} />
              </div>
            ) : this.state.recordOperation === "transfer" ? (
              <div>
                <Select value={this.state.transferRecordsToOperate.sourceDepoId} style={{width: "100%"}} onChange={this.updateTransferSourceDepoIdState}>
                  <Option value="default">All Depositories</Option>
                  <Option value="depo01">Cash</Option>
                  <Option value="depo02">Cathay Bank</Option>
                </Select>
                <Select value={this.state.transferRecordsToOperate.sourceMngAccId} style={{width: "100%"}} onChange={this.updateTransferSourceMngAccIdState}>
                  <Option value="default">All Managing Accounts</Option>
                  <Option value="mngAcc01">Living Expense</Option>
                  <Option value="mn gAcc02">Travel</Option>
                </Select>
                <Select value={this.state.transferRecordsToOperate.targetDepoId} style={{width: "100%"}} onChange={this.updateTransferTargetDepoIdState}>
                  <Option value="default">All Depositories</Option>
                  <Option value="depo01">Cash</Option>
                  <Option value="depo02">Cathay Bank</Option>
                </Select>
                <Select value={this.state.transferRecordsToOperate.targetMngAccId} style={{width: "100%"}} onChange={this.updateTransferTargetMngAccIdState}>
                  <Option value="default">All Managing Accounts</Option>
                  <Option value="mngAcc01">Living Expense</Option>
                  <Option value="mn gAcc02">Travel</Option>
                </Select>
                <Input value={this.state.transferRecordsToOperate.amount} onChange={this.updateTransferAmountState} />
              </div>
            ) : (
              <FormLayoutDemo />
            )
          }
        </Modal>
      </div>
    );
  }

}

export default MoneyFlow;
