import React, { Component } from 'react';
import { Layout, Menu, Affix, Button, Row, Col, Icon, Popover } from 'antd';
import MoneyFlow from "./features/moneyFlow";
import MediaQuery from 'react-responsive';
import 'antd/dist/antd.css';
const { Content, Sider } = Layout;


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: true,
      accessToken: null,
      availFeatures: [], // each feature is: { featureKey: str, component: reactComponent, pageContent: contentObj }
      currentFeatureKey: null,
      staticPageContent: null,
      showFeatureMenu: false
    };

    this.hideFeatureMenu = this.hideFeatureMenu.bind(this);
    this.toggleFeatureMenu = this.toggleFeatureMenu.bind(this);
  }

  /** State operations begin **/

  updateIsLoggedIn(accessToken) {
    this.setState({
      accessToken: accessToken,
      isLoggedIn: accessToken !== null && accessToken !== undefined
    });
  }

  updateFeatureStates(featureKey) {
    this.setState({
      currentFeatureKey: featureKey,
      staticPageContent: this.state.availFeatures[featureKey].pageContent
    });
  }

  hideFeatureMenu() {
    this.setState({showFeatureMenu: false});
  }

  toggleFeatureMenu(visibility) {
    this.setState({showFeatureMenu: visibility})
  }

  /** State operations end **/

  render() {

    const hideMenu = this.hideFeatureMenu;

    const popMenu = (
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        inlineCollapsed={this.state.collapsed}
      >
        <Menu.Item key="1" onClick={function(item, key, keyPath) {
          console.log(item);
          hideMenu();
        }}>
          <Icon type="pie-chart" />
          <span>Option 1</span>
        </Menu.Item>
        <Menu.Item key="2">
          <Icon type="desktop" />
          <span>Option 2</span>
        </Menu.Item>
      </Menu>
    );

    // TODO
    // https://react-component.github.io/drawer-menu/

    return (
      <Layout>
        <MediaQuery query="(min-width: 576px)">
          <Sider style={{ background: '#ffffff' }}>
            <Menu
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                  >
                  <Menu.Item key="1">
                    <Icon type="pie-chart" />
                    <span>Option 1</span>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Icon type="desktop" />
                    <span>Option 2</span>
                  </Menu.Item>
                  <Menu.Item key="3">
                    <Icon type="inbox" />
                    <span>Option 3</span>
                  </Menu.Item>
            </Menu>
          </Sider>
        </MediaQuery>
        <Content style={{ padding: "15px" }}>
          <MediaQuery query="(max-width: 575px)">
            <Row>
              <Col span={4}>
                <Popover content={popMenu} title="Features" trigger="click" placement="bottom" visible={this.state.showFeatureMenu} onVisibleChange={this.toggleFeatureMenu}>
                  <Button>Menu</Button>
                </Popover>
              </Col>
              <Col span={20}>&nbsp;</Col>
            </Row>
          </MediaQuery>
          <MoneyFlow />
        </Content>
      </Layout>
    );
  }

}

export default App;
