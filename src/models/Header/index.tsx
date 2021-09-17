import { Button, Form, Input, Layout } from "antd";
import React, { useState } from "react";
import { _math } from "../../ultis";
import "./index.scss";

type IData = {
  dataBitInput: string;
  dataBitOutput: string;
};

type IProps = {
  onValueChange: (dataBitInput: string, dataBitOutput: string) => void;
};

const Index: React.FC<IProps> = ({ onValueChange }) => {
  const [form] = Form.useForm<IData>();
  const onFinish = ({ dataBitInput, dataBitOutput }: IData) => {
    onValueChange(dataBitInput, dataBitOutput);
  };

  const [checkBit, setCheckBit] = useState(-1);

  return (
    <Layout.Header
      className="site-layout-background"
      style={{ padding: 0, height: "unset", minHeight: 50 }}
    >
      <Form
        form={form}
        layout="inline"
        className="header-form"
        onFinish={onFinish}
      >
        <Form.Item
          label="Bit data đầu vào (P)"
          name="dataBitInput"
          rules={[
            { required: true, message: "Vui lòng nhập bit data đầu vào!" },
            {
              pattern: /^[0-1]*$/,
              message: "Trường này chỉ được nhập 0 hoặc 1!",
            },
            { min: 4, max: 8, message: "Số lượng kí tự phải từ 4 đến 8!" },
          ]}
          style={{ marginBottom: 0 }}
        >
          <Input
            placeholder="VD: 10111001"
            onChange={(e) => setCheckBit(_math.calcCheckBit(e.target.value))}
          />
        </Form.Item>
        <Form.Item
          label="Bit data đầu ra"
          name="dataBitOutput"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập bit data đầu ra!",
            },
            {
              pattern: /^[0-1]*$/,
              message: "Trường này chỉ được nhập 0 hoặc 1!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (
                  !value ||
                  getFieldValue("dataBitInput")?.length === value?.length
                ) {
                  return Promise.resolve();
                } else if (!getFieldValue("dataBitInput")?.length) {
                  return Promise.reject(
                    new Error("Vui lòng nhập bit data đầu vào trước!")
                  );
                } else {
                  return Promise.reject(
                    new Error("Phải cùng độ dài bit data đầu vào!")
                  );
                }
              },
            }),
          ]}
          style={{ marginBottom: 0 }}
        >
          <Input placeholder="VD: 10111001" />
        </Form.Item>
        <Form.Item label="Check bit" name="checkBit" initialValue={checkBit}>
          <p
            className="ant-input ant-input-disabled"
            style={{ width: 100, height: 31.6 }}
          >
            {checkBit < 0 ? "" : checkBit}
          </p>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Layout.Header>
  );
};

export default Index;
