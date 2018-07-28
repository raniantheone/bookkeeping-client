import React, { Component } from 'react';
import { Layout, Menu, Icon, Drawer } from 'antd';
import ListOfData from "./features/moneyFlow";
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
      staticPageContent: null
    };
  }

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

  // render() {
  //   return (
  //     <Layout>
  //         {this.state.isLoggedIn ? (
  //           <Sider
  //             breakpoint="sm"
  //             collapsedWidth="0"
  //             onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
  //             style={{ minHeight: "100vh" }}
  //           >
  //             <Menu theme="dark" mode="inline" selectedKeys={['1']}>
  //               <Menu.Item key="1">
  //                 <Icon type="user" />
  //                 <span className="nav-text">nav 1</span>
  //               </Menu.Item>
  //               <Menu.Item key="2">
  //                 <Icon type="video-camera" />
  //                 <span className="nav-text">nav 2</span>
  //               </Menu.Item>
  //               <Menu.Item key="3">
  //                 <Icon type="upload" />
  //                 <span className="nav-text">nav 3</span>
  //               </Menu.Item>
  //               <Menu.Item key="4">
  //                 <Icon type="user" />
  //                 <span className="nav-text">nav 4</span>
  //               </Menu.Item>
  //             </Menu>
  //           </Sider>
  //         ) : (
  //           null
  //         )}
  //         <Layout>
  //           <Content style={{ margin: '10px', padding: "15px" }}>
  //             <MoneyFlow />
  //           </Content>
  //         </Layout>
  //       </Layout>
  //   );
  // }

  render() {
    return (
      <Layout>
        <Sider
          breakpoint="sm"
          collapsedWidth="0"
          onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
          style={{ minHeight: "100vh" }}
        >
          <Menu theme="dark" mode="inline" selectedKeys={['1']}>
            <Menu.Item key="1">
              <Icon type="user" />
              <span className="nav-text">nav 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="video-camera" />
              <span className="nav-text">nav 2</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ margin: '10px', padding: "15px" }}>
            <ListOfData />
          </Content>
        </Layout>
      </Layout>
    );
  }

}

export default App;
