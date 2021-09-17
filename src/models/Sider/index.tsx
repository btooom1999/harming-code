import React from "react";
import { Menu, Layout } from "antd";
import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons";
import "./index.scss";

const Index: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const onCollapsed = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  return (
    <Layout.Sider
      id="components-layout-demo-side"
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapsed}
    >
      <div className="logo" />
      <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
        <Menu.Item style={{ marginTop: 0 }} key="1" icon={<PieChartOutlined />}>
          Thực hành
        </Menu.Item>
        <Menu.Item key="2" icon={<DesktopOutlined />}>
          Thuyết trình
        </Menu.Item>
      </Menu>
    </Layout.Sider>
  );
};

export default Index;
