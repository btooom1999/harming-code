/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-computed-key */
/* eslint-disable no-lone-blocks */
import {
  Col,
  Divider,
  Layout,
  Row,
  Table,
  Typography,
  Form,
  Input,
  Button,
} from "antd";
import { FC, useMemo, useState } from "react";
import { Breadcrumb, Footer, Header, Sider } from "../../models";
import { _math } from "../../ultis";
import Lottie from "react-lottie";
import working from "../../assets/images/working.json";
import "./index.scss";

const { useForm } = Form;
const { Text } = Typography;
const { Content } = Layout;

type IForm = {
  errorPosition: string;
};

const Index: FC = () => {
  // calculate harming code
  const [bit, setBit] = useState("");
  const [errorPosition, setErrorPosition] = useState(-1);
  const [checkBit, setCheckBit] = useState(-1);

  const onValueChange = (bit: string) => {
    setBit(bit);
    setCheckBit(_math.calcCheckBit(bit));
    setErrorPosition(-1);
  };

  // get data bit and check bit, syndrome data, ...
  const data = useMemo(
    () => _math.getDataBitAndCheckBitArray(bit.length + checkBit, bit),
    [bit.length + checkBit, bit]
  );

  const parityBits = useMemo(
    () => _math.calcCheckBitArray(data[1], bit),
    [data, bit]
  );

  const bitWithEvenParityBits = useMemo(
    () => _math.getFullBit(bit, data[0], parityBits[2][0].join("")),
    [data, bit, parityBits]
  );

  const errorBitWithParityBits = useMemo(
    () => _math.getErrorBit(bitWithEvenParityBits, errorPosition),
    [bitWithEvenParityBits, errorPosition]
  );

  const shortErrorBit = useMemo(
    () => _math.getShortErrorBit(data[0], errorBitWithParityBits),
    [data[0], errorBitWithParityBits]
  );

  const errorParityBits = useMemo(
    () => _math.calcCheckBitArray(data[1], shortErrorBit),
    [data, shortErrorBit]
  );

  const positionError = useMemo(
    () =>
      _math.getPositionError(
        parityBits[2][0] as number[],
        errorParityBits[2][0] as number[]
      ),
    [parityBits[2][0], errorParityBits[2][0]]
  );

  // customize table
  const colData = _math.getNumberArray(bit.length + checkBit);
  const columns = [
    {
      title: "Thứ tự bit",
      dataIndex: "Thứ tự bit",
    },
    ...colData.map((i, index) => {
      return {
        title: i,
        dataIndex: index,
        align: "center",
      } as const;
    }),
  ];

  const rows = [
    {
      key: "1",
      ["Thứ tự bit"]: "Nhị phân",
      ..._math.getBinaryNumberArray(bit.length + checkBit).map((i) => i),
    },
    {
      key: "2",
      ["Thứ tự bit"]: "Nhóm dữ liệu (không có bit chẵn lẽ)",
      ...data[0].map((i) => i),
    },
    {
      key: "3",
      ["Thứ tự bit"]: "Bit chẵn lẽ",
      ...data[0].map((i, index) => {
        if (i !== null) return null;
        return "P" + (index + 1);
      }),
    },
  ];

  const errorColumns = [
    {
      title: "Thứ tự bit",
      dataIndex: "Thứ tự bit",
    },
    ...colData.map((i, index) => {
      return {
        title:
          index === errorPosition - 1 ? (
            <Text strong type="danger">
              {i}
            </Text>
          ) : (
            i
          ),
        dataIndex: index,
        align: "center",
      } as const;
    }),
  ];

  const errorRows = [
    {
      key: "1",
      ["Thứ tự bit"]: "Nhị phân",
      ..._math.getBinaryNumberArray(bit.length + checkBit).map((i) => i),
    },
    {
      key: "2",
      ["Thứ tự bit"]: "Nhóm dữ liệu (không có bit chẵn lẽ)",
      ...data[0].map((i: string, index) => {
        {
          if (i !== null) {
            let val = bitWithEvenParityBits[index];
            if (index === errorPosition - 1) {
              val = val === "1" ? "0" : "1";
            }
            return val + " - " + i.split(" - ")[1];
          }
          return i;
        }
      }),
    },
    {
      key: "3",
      ["Thứ tự bit"]: "Bit chẵn lẽ",
      ...data[0].map((i, index) => {
        if (i !== null) return null;
        return "P" + (index + 1);
      }),
    },
  ];

  // lottie
  const defaultOptionsLottie = {
    loop: true,
    autoplay: true,
    animationData: working,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // example 1 error in bit
  const [form] = useForm<IForm>();
  const onFinish = (data: IForm) => {
    setErrorPosition(parseInt(data.errorPosition));
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider />
      <Layout className="site-layout">
        <Header onValueChange={onValueChange} />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb />
          <div
            className="site-layout-background"
            style={{ padding: 24, height: "100%" }}
          >
            {(!bit.length ||
              _math.getEquationResult(bit.length, checkBit) === -1) && (
              <Lottie options={defaultOptionsLottie} width={600} height={400} />
            )}
            {bit.length > 0 &&
              _math.getEquationResult(bit.length, checkBit) === 1 && (
                <>
                  <Table
                    bordered
                    columns={columns}
                    dataSource={rows}
                    pagination={false}
                  />
                  <Text
                    strong
                    italic
                    style={{
                      display: "block",
                      textAlign: "center",
                      marginTop: 8,
                    }}
                  >
                    H1. Bảng phân tích
                  </Text>
                  <Row gutter={16}>
                    <Col span={12} style={{ padding: "12px 8px 0" }}>
                      <Divider orientation="left">Tính K</Divider>
                      <div>
                        {[...parityBits[0]].map((i: any, index) => (
                          <div key={index} style={{ marginTop: 8 }}>
                            <span>P{i[0]} = </span>
                            {[...i.slice(1)].map((s, p) => {
                              let plus = " + ";
                              if (p === 0) plus = "";
                              return <span key={p}>{plus + s}</span>;
                            })}
                            <span> = </span>
                            {[...parityBits[1][index]].map((n, p) => {
                              let plus = " + ";
                              if (p === 0) return null;
                              else if (p === 1) plus = "";
                              return <span key={p}> {plus + n}</span>;
                            })}
                            <span> = </span>
                            <span>{parityBits[2][0][index]}</span>
                          </div>
                        ))}
                        <div>
                          <Text strong>
                            {"=>"} K ={" "}
                            {[...parityBits[0]].map((_, index) => (
                              <span key={index}>
                                {
                                  parityBits[2][0][
                                    parityBits[0].length - 1 - index
                                  ]
                                }
                              </span>
                            ))}
                          </Text>
                        </div>
                        <div>
                          <Text>
                            Như vậy, ta có nhóm dữ liệu mới bao gồm các bit chẵn
                            lẻ là <b>{bitWithEvenParityBits}</b>
                          </Text>
                        </div>
                      </div>
                    </Col>
                    <Col span={12} style={{ padding: "12px 8px 0" }}>
                      <Divider orientation="left">
                        Giả sử có 1 bit sai ({shortErrorBit})
                      </Divider>
                      <Text>
                        Từ nhóm dữ liệu bao gồm các bit chẵn lẽ có 1 bit sai tại
                        vị trí
                      </Text>
                      <Form
                        form={form}
                        layout="inline"
                        className="header-form"
                        onFinish={onFinish}
                        style={{ height: "auto" }}
                      >
                        <Form.Item
                          label="Vị trí sai"
                          name="errorPosition"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập vị trí sai!",
                            },
                            {
                              pattern: /^[0-9]*$/,
                              message: "Trường này chỉ được nhập số!",
                            },
                            {
                              min: 1,
                              max: (bit.length + checkBit).toString().length,
                              message:
                                "Số lượng kí tự được cho phép là " +
                                Math.round((bit.length + checkBit) / 10),
                            },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (
                                  !value ||
                                  (value > 0 && value <= colData.length)
                                ) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  new Error(
                                    "Chỉ được nhập các số từ 1 - " +
                                      colData.length
                                  )
                                );
                              },
                            }),
                          ]}
                          style={{ marginBottom: 0 }}
                        >
                          <Input placeholder="VD: 10111001" />
                        </Form.Item>
                        <Form.Item>
                          <Button type="primary" htmlType="submit">
                            Submit
                          </Button>
                        </Form.Item>
                      </Form>
                      {errorPosition > 0 && (
                        <>
                          <div>
                            <Text strong italic>
                              * Cách thay đổi bit có 1 vị trí sai. Nếu vị trí đó
                              là 1 thì đổi thành 0 và ngược lại.
                            </Text>
                          </div>
                          <div>
                            <Text>
                              Thay đổi <b>{bitWithEvenParityBits}</b> có{" "}
                              <b>vị trí sai là {errorPosition}</b> thành{" "}
                              <b>{errorBitWithParityBits}</b>
                            </Text>
                          </div>
                        </>
                      )}
                    </Col>
                  </Row>
                </>
              )}
            {errorPosition > 0 && (
              <div style={{ marginTop: 30 }}>
                <Divider>Sửa sai</Divider>
                <Table
                  bordered
                  columns={errorColumns}
                  dataSource={errorRows}
                  pagination={false}
                />
                <Text
                  strong
                  italic
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginTop: 8,
                  }}
                >
                  H2. Bảng phân tích
                </Text>
                <Row gutter={16}>
                  <Col span={12} style={{ padding: "12px 8px 0" }}>
                    <Divider orientation="left">Tính K'</Divider>
                    <div>
                      {[...errorParityBits[0]].map((i: any, index) => (
                        <div key={index} style={{ marginTop: 8 }}>
                          <span>P{i[0]} = </span>
                          {[...i.slice(1)].map((s, p) => {
                            let plus = " + ";
                            if (p === 0) plus = "";
                            return <span key={p}>{plus + s}</span>;
                          })}
                          <span> = </span>
                          {[...errorParityBits[1][index]].map((n, p) => {
                            let plus = " + ";
                            if (p === 0) return null;
                            else if (p === 1) plus = "";
                            return <span key={p}> {plus + n}</span>;
                          })}
                          <span> = </span>
                          <span>{errorParityBits[2][0][index]}</span>
                        </div>
                      ))}
                      <div>
                        <Text strong>
                          {"=>"} K' ={" "}
                          {[...errorParityBits[0]].map((_, index) => (
                            <span key={index}>
                              {
                                errorParityBits[2][0][
                                  errorParityBits[0].length - 1 - index
                                ]
                              }
                            </span>
                          ))}
                        </Text>
                      </div>
                      <div>
                        <Text>
                          Như vậy, ta có nhóm dữ liệu mới bao gồm các bit chẵn
                          lẻ là <b>{errorBitWithParityBits}</b>
                        </Text>
                      </div>
                    </div>
                  </Col>
                  <Col span={12} style={{ padding: "12px 8px 0" }}>
                    <Divider orientation="left">Tìm lỗi</Divider>
                    <div>
                      <Text>
                        Ta có K + K' ={" "}
                        {[...(parityBits[2][0] as number[])].reverse()} +{" "}
                        {[...(errorParityBits[2][0] as number[])].reverse()} ={" "}
                        {positionError.binary} (Nhị phân) ={" "}
                        {positionError.decimal} (Thập phân)
                      </Text>
                    </div>
                    <div>
                      {positionError.decimal > 0 && (
                        <Text strong type="danger">
                          {"=>"} Lỗi ngay tại vị trí số {positionError.decimal}.
                          Như vậy kết quả cuối cùng thu được là thay đổi{" "}
                          <b>{errorBitWithParityBits}</b> có{" "}
                          <b>vị trí sai là {positionError.decimal}</b> thành{" "}
                          <b>{bitWithEvenParityBits}</b>
                        </Text>
                      )}
                      {positionError.decimal === 0 && (
                        <Text strong type="success">
                          {"=>"} Không có bất kỳ lỗi nào
                        </Text>
                      )}
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </div>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default Index;
