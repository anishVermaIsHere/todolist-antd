import React, { useState} from 'react';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import TaskTable from '../components/TaskTable';
import TaskForm from '../components/TaskForm';


// interface
export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: Date|string;
  due_date?: Date|string;
  labels?: string[];
};


const { Header, Content, Sider } = Layout;

const items1: MenuProps['items'] = ['Blog', 'About', 'Contact'].map((key) => ({
  key,
  label: key,
}));

const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1);

    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `Sub-Menu ${key}`,

      children: new Array(4).fill(null).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `menu-list-${subKey}`,
        };
      }),
    };
  },
);


// main component
const TodoList: React.FC = () => {
  let defaultDate = new Date()
  defaultDate.setDate(defaultDate.getDate() + 3)
  const [task,setTask]=useState<Task[]>([])

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const fetchData=async()=>{
    const response=await fetch('https://raw.githubusercontent.com/anishVermaIsHere/fake-api/main/tasks.json');
    const data=await response.json();
    setTask(data);
  }
  
  return (
    <Layout>
      <Header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="logo" style={{ color: "#fff" }}>
          <h3>TodoList </h3>
        </div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} />
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
            items={items2}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>TodoList</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >

            <TaskForm task={task} setTask={setTask} />
            <TaskTable task={task} setTask={setTask} 
            fetchData={fetchData} />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default TodoList;