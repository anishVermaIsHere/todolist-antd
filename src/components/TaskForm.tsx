import React from 'react';
import { Button, Form, Input, Select, DatePicker } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import type { SelectProps } from 'antd';
import { Task } from '../app/TodoList';
import { PlusOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';


type TaskFormProps = {
    task: Task[],
    setTask: React.Dispatch<React.SetStateAction<Task[]>>,
}

const TagOptions: SelectProps['options'] = [];
const StatusOptions: SelectProps['options'] = [
    {
        label: 'Open',
        value: 'open'
    }
];

export const getTagColor: () => string = () => {
    const colors = ["green", "blue", "red", "yellow", "purple", "pink"]
    const color = colors[Math.floor(Math.random() * colors.length)];
    return color;
}


const TaskForm = ({ task, setTask }: TaskFormProps) => {
    const onFinish = (values: Task) => {
        values.created_at = new Date(new Date().getTime());
        values.id = uuidv4();
        setTask([...task, values]);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Can not select days before today and today
        return current && current < dayjs().endOf('day');
    };

    return <>
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item
                label="Task Title"
                name="title"
                rules={[{ required: true, message: 'Please enter your task!' }]}
            >
                <Input
                    showCount
                    maxLength={100}
                    placeholder="Enter title"
                />
            </Form.Item>

            <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'Please enter task description!' }]}
            >
                <Input.TextArea
                    showCount
                    maxLength={1000}
                    placeholder="Enter description"
                />
            </Form.Item>

            <Form.Item
                label="Tag"
                tooltip="Please type and enter to add"
                name="labels"
            >
                <Select
                    mode="tags"
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Enter tag"
                    options={TagOptions}
                />

            </Form.Item>

            <Form.Item
                label="Status"
                name="status"
                tooltip="Choose open"
                rules={[{ required: true, message: "Status Required" }]}
            >
                <Select
                    defaultValue={"Open"}
                    style={{ width: 120 }}
                    options={StatusOptions}
                />
            </Form.Item>

            <Form.Item label="Due Date" name="due_date">
                    <DatePicker
                    format="YYYY-MM-DD"
                    disabledDate={disabledDate}
                />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                    Add Task
                </Button>
            </Form.Item>
        </Form>
    </>
}

export default TaskForm;