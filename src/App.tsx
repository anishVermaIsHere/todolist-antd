import React from 'react';
import TodoList from './app/TodoList';
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';

function App() {
  return (
    <>
      <ConfigProvider locale={enUS}>
        <TodoList />
      </ConfigProvider>
    </>
  );
}

export default App;
