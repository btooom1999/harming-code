class math {
  calcCheckBit = (dataBit: string) => {
    const len = dataBit.length;
    if (!len) return -1;
    for (let i = 0; i < 100; i++) {
      if (Math.pow(2, i) - 1 >= len + i) return i;
    }
    return -1;
  };

  getArrayDataBit = (dataBit: string) => {
    const len = dataBit.length;
    const arr = [];
    for (let i = 0; i < len; i++) {
      arr[i] = dataBit[i];
    }
    return arr;
  };

  checkXORBit = (bit: string) => {
    const len = bit.length;
    let result = 0;
    for (let i = 0; i < len; i++) {
      result += parseInt(bit[i]);
    }
    return result % 2;
  };

  get2ExponentNumber = (number: number) => {
    let result = 1;
    for (let i = 1; i <= number; i++) {
      result *= 2;
    }
    return result;
  };

  getExponentNumber = (number: number, exponent: number) => {
    let result = 1;
    for (let i = 1; i <= exponent; i++) {
      result *= number;
    }
    return result;
  };

  getEquationResult = (dataBit: number, checkBit: number) => {
    console.log("dataBit: ", dataBit);
    const resultLeft = this.get2ExponentNumber(checkBit) - 1;
    const resultRight = dataBit + checkBit;
    if (resultLeft >= resultRight) {
      return 1;
    }
    return -1;
  };

  getBinaryNumber = (decimalNumber: number) => {
    let result = decimalNumber.toString(2);
    if (result.length < 4) {
      let len = result.length;
      let zero = "";
      for (let i = len; i < 4; i++) {
        zero += "0";
      }
      return zero + result;
    }
    return result;
  };

  getNumberArray = (number: number) => {
    const arr = [];
    for (let i = 1; i <= number; i++) {
      arr[number - i] = i;
    }
    return arr;
  };

  getBinaryNumberArray = (number: number) => {
    const arr = [];
    for (let i = 1; i <= number; i++) {
      arr[number - i] = this.getBinaryNumber(i);
    }
    return arr;
  };

  getPositionNumber1 = (binaryNumber: string) => {
    const len = binaryNumber.length;
    for (let i = 0; i < len; i++) {
      if (binaryNumber[i] === "1") return i;
    }
    return -1;
  };

  checkPositionNumber1 = (binaryNumber: string, position: number) => {
    if (binaryNumber[position] === "1") return position;
    return -2;
  };

  getDataBitAndCheckBitArray = (number: number) => {
    const index = [];
    const arr = [];
    for (let i = 1; i <= number; i++) {
      if (this.get2ExponentNumber(i - 1) <= number) {
        index.push([this.get2ExponentNumber(i - 1)]);
      }
      arr[i - 1] = "D" + i;
    }

    index.forEach((i) => (arr[i[0] - 1] = null));

    let x = 1;
    const newArr: Array<any> = arr.map((i) => {
      if (i !== null) return "D" + x++;
      return i;
    });

    index.map((i) => {
      const binaryNumber = this.getBinaryNumber(i[0]);
      const positionNumber1 = this.getPositionNumber1(binaryNumber);
      newArr.forEach((n, index) => {
        if (
          n !== null &&
          positionNumber1 ===
            this.checkPositionNumber1(
              this.getBinaryNumber(index + 1),
              positionNumber1
            )
        ) {
          i.push(n);
        }
      });

      return i;
    });

    return [[...newArr.reverse()], [...index]];
  };

  getXORValue = (array: number[]) => {
    let result = 0;
    array.forEach((i) => (result += i));
    return result % 2;
  };

  calcCheckBitArray = (dataBit: (number[] | string[])[], bit: string) => {
    const bitLen = bit.length;
    const newArr = dataBit.map((i) =>
      i.slice(1).map((s: any) => parseInt(bit[bitLen - parseInt(s?.slice(1))]))
    );

    return [
      [...dataBit],
      [...newArr],
      [[...newArr.map((item) => this.getXORValue(item))]],
    ];
  };

  getSyndrome = (
    checkBitArray1: Array<number>,
    checkBitArray2: Array<number>
  ) => {
    const syndrome: string[] = [];
    checkBitArray1.forEach((i, index) => {
      const val = i + checkBitArray2[index] > 1 ? 0 : i + checkBitArray2[index];
      syndrome[index] = val.toString();
    });

    const result = [[...syndrome.reverse()], parseInt(syndrome.join(""), 2)];
    console.log("result: ", result);

    return result;
  };
}

const _math = new math();

export default _math;
