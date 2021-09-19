import { Button, Form, Input, Layout } from "antd";
import React, { useState } from "react";
import { _math } from "../../ultis";
import "./index.scss";

type IData = {
  dataBitInput: string;
  dataBitOutput: string;
};

type IProps = {
  onValueChange: (dataBitInput: string) => void;
};

const Index: React.FC<IProps> = ({ onValueChange }) => {
  const [form] = Form.useForm<IData>();
  const onFinish = ({ dataBitInput }: IData) => {
    onValueChange(dataBitInput);
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
          label="Từ mã"
          name="dataBitInput"
          rules={[
            { required: true, message: "Vui lòng nhập từ mã!" },
            {
              pattern: /^[0-1]*$/,
              message: "Trường này chỉ được nhập 0 hoặc 1!",
            },
            { min: 4, max: 8, message: "Số lượng kí tự phải từ 4 đến 8!" },
          ]}
          style={{ marginBottom: 0 }}
        >
          <Input
            placeholder="VD: 0011001"
            onChange={(e) => setCheckBit(_math.calcCheckBit(e.target.value))}
          />
        </Form.Item>
        <Form.Item
          label="Số lượng bit chẵn lẻ"
          name="checkBit"
          initialValue={checkBit}
        >
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
