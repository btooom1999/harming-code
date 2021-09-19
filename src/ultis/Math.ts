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
      arr[i - 1] = i;
    }
    return arr;
  };

  getBinaryNumberArray = (number: number) => {
    const arr = [];
    for (let i = 1; i <= number; i++) {
      arr[i - 1] = this.getBinaryNumber(i);
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

  getDataBitAndCheckBitArray = (number: number, dataBit: string) => {
    const index = [];
    const arr = [];
    for (let i = 1; i <= number; i++) {
      if (this.get2ExponentNumber(i - 1) <= number) {
        index.push([this.get2ExponentNumber(i - 1)]);
      }
      arr[i - 1] = "D" + i;
    }

    index.forEach((i) => {
      console.log("i: ", i);
      arr[i[0] - 1] = null;
    });

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

    console.log("index: ", index);

    let positionBit = 0;
    const result = [
      [
        ...newArr.map((i) => {
          if (i !== null) return dataBit[positionBit++] + " - " + i;
          return i;
        }),
      ],
      [...index],
    ];
    return result;
  };

  getXORValue = (array: number[]) => {
    let result = 0;
    array.forEach((i, index) => {
      if (index !== 0) result += i;
    });
    return result % 2;
  };

  calcCheckBitArray = (dataBit: (number[] | string[])[], bit: string) => {
    const newArr = dataBit.map((item) =>
      item.map((i: string | number) => {
        if (typeof i !== "number") {
          console.log(bit[parseInt(i.split("D")[1]) - 1] + " thuộc: " + bit);
          return parseInt(bit[parseInt(i.split("D")[1]) - 1]);
        } else {
          console.log("vi tri: ", i);
        }
        return i;
      })
    );

    const result = [
      [...dataBit],
      [...newArr],
      [[...newArr.map((item) => this.getXORValue(item))]],
    ];

    return result;
  };

  getFullBit = (bit: string, oddParityBits: string[], parityBits: string) => {
    let numBitInput = 0;
    let numParityBits = 0;
    const newOddParityBits = oddParityBits.map((i) => {
      if (i !== null) return bit[numBitInput++];
      return parityBits[numParityBits++];
    });
    return newOddParityBits.join("");
  };

  getErrorBit = (bit: string, positionError: number) => {
    const first = bit.slice(0, positionError - 1);
    const mid = bit[positionError - 1] === "1" ? 0 : 1;
    const last = bit.slice(positionError);
    return first + mid + last;
  };

  getShortErrorBit = (notParityBits: (string | null)[], errorBit: string) => {
    const result = notParityBits
      .map((i, index) => {
        if (i !== null) return errorBit[index];
        return null;
      })
      .filter((i) => i !== null);

    return result.join("");
  };

  getPositionError = (bit: number[], errorBit: number[]) => {
    const binary: number[] = [];
    bit.forEach((i, index) => {
      const val = i + errorBit[index];
      binary.push(val > 1 ? 0 : val);
    });
    const decimal = parseInt(binary.reverse().join(""), 2);
    return { binary, decimal };
  };
}

const _math = new math();

export default _math;
