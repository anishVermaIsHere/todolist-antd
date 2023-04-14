import React, { useState } from 'react';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Input, Button, message, Form, Popconfirm, Space, Tag, Typography } from 'antd';
import { Task } from '../app/TodoList';
import { getTagColor } from './TaskForm';



type TaskTableProps = {
    task: Task[],
    setTask: React.Dispatch<React.SetStateAction<Task[]>>,
    fetchData: () => void
}


const TaskTable = ({ task, setTask, fetchData }: TaskTableProps) => {

    const handleDelete = (id: React.Key) => {
        const newData = task.filter((item) => item.id !== id);
        setTask(newData);
    };
    

    const columns: ProColumns<Task>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'Task',
            key: 'title',
            dataIndex: 'title',
            copyable: false,
            sorter: (a, b) => a.title.localeCompare(b.title),
            filterDropdown: ({
                setSelectedKeys,
                selectedKeys,
                confirm,
                clearFilters,
            }) => {
                return (
                    <>
                        <Input
                            autoFocus
                            placeholder="Search your tasks"
                            value={selectedKeys[0]}
                            onChange={(e) => {
                                setSelectedKeys(e.target.value ? [e.target.value] : []);
                                confirm({ closeDropdown: false });
                            }}
                            onPressEnter={() => {
                                confirm();
                            }}
                            onBlur={() => {
                                confirm();
                            }}
                        ></Input>
                        
                    </>
                );
            },
            filterIcon: () => {
                return <SearchOutlined />;
            },
            onFilter: (value, record) => {
                return record.title.toLowerCase().includes(value.toString().toLowerCase());
            },
            ellipsis: true,
            hideInSearch: true,
            // tip: 'If the title is too long, it will automatically shrink',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: 'Field Required',
                        max: 100
                    },
                ],
            },
        },
        {
            // disable: true,
            title: 'Description',
            key: 'description',
            dataIndex: 'description',
            sorter: (a, b) => a.description.localeCompare(b.description),
            valueType: 'textarea',
            hideInSearch: true,
            // tip: 'The description should not be more than 1000 characters',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: 'Field Required',
                        max: 100
                    },
                ],
            },
        },
        {
            title: 'Tags',
            key: 'labels',
            dataIndex: 'labels',
            filters: true,
            onFilter: (value, record) => {
                return record["labels"]
                    ? record["labels"]
                        .toString()
                        .toLowerCase()
                        .includes(value.toString().toLowerCase())
                    : false
            },
            ellipsis: true,
            hideInSearch: true,
            // valueType: 'option',
            // valueEnum: {
            //     open: {
            //         text: 'Open',
            //         status: 'green',
            //     },
            // },
            render: (_, record) => (
                <Space>
                    {record.labels?.map((name, ind) => {
                        return <Tag color={getTagColor()} key={`${name}+${ind}`}>
                            {name}
                        </Tag>
                    })}
                </Space>
            ),
        },
        {
            disable: true,
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            filters: true,
            onFilter: (value, record) => {
                return record["status"]
                    ? record["status"]
                        .toString()
                        .toLowerCase()
                        .includes(value.toString().toLowerCase())
                    : false
            },
            ellipsis: true,
            hideInSearch: true,
            valueType: 'select',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: 'Required'
                    },
                ],
            },
            valueEnum: {
                open: {
                    text: 'Open',
                    status: 'open',
                },
                overdue: {
                    text: 'Overdue',
                    status: 'overdue',
                },
                done: {
                    text: 'Done',
                    status: 'done',
                },
                working: {
                    text: 'Working',
                    status: 'working',
                },
            },
        },
        {
            title: 'Created',
            key: 'showTime0',
            dataIndex: 'created_at',
            valueType: 'date',
            sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
            editable: false,
            hideInSearch: true,
        },
        {
            title: 'Due Date',
            key: 'showTime1',
            dataIndex: 'due_date',
            valueType: 'date',
            // sorter: (a,b)=>new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
            hideInSearch: true,
        },
        {
            title: 'Action',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <>
                    <a
                        key="editable"
                        onClick={() => {
                            console.log('action', action);
                            action?.startEditable?.(record.id);
                            // action?.saveEditable?.(record.id);
                            // save(record.id)
                        }}
                    >
                        <EditOutlined />
                    </a>
                    <span
                        style={{ color: 'red' }}
                        onClick={() => {
                            console.log('action', action);
                            action?.clearSelected?.();
                        }}>
                        <Popconfirm
                            placement="top"
                            title={"Are you sure to delete this task?"}
                            description={""}
                            onConfirm={() => {
                                message.info('Task deleted successfully');
                                handleDelete(record.id);
                            }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <DeleteOutlined />
                        </Popconfirm>
                    </span>
                </>
            ]
        },
    ];
    return (
        <ProTable<Task>
            columns={columns}
            cardBordered
            dataSource={task.map(item => item)}
            editable={{
                type: 'multiple',
            }}
            rowKey="id"
            
            form={{
                syncToUrl: (values, type) => {
                    if (type === 'get') {
                        return {
                            ...values,
                            created_at: [values.startTime, values.endTime],
                        };
                    }
                    return values;
                },
            }}
            pagination={{
                pageSize: 10,
            }}
            dateFormatter="string"
            headerTitle="List of Tasks"
            toolBarRender={() => [
                <>
                    <Button key="button" icon={<PlusOutlined />} type="primary" onClick={fetchData}>
                        Tasks from API
                    </Button>
                </>

            ]}
        />
    )
};

export default TaskTable;