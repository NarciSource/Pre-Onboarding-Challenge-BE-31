import getValidateDTO from "__test-utils__/getValidateDTO";

import ReviewSummaryDTO from "./ReviewSummary.dto";

describe("ReviewSummaryDTO", () => {
  const validateDTO = getValidateDTO(ReviewSummaryDTO);

  const validData: Partial<ReviewSummaryDTO> = {
    average: 4.5,
    count: 150,
    distribution: {
      1: 10,
      2: 20,
      3: 30,
      4: 25,
      5: 15,
    },
  };

  it("필수 필드가 누락된 경우 검증 실패", async () => {
    const invalidData = {};

    const errors = await validateDTO(invalidData);

    expect(errors).toHaveLength(3);
    expect(errors).toContain("average");
    expect(errors).toContain("count");
    expect(errors).toContain("distribution");
  });

  it("average 필드가 범위를 벗어난 경우 검증 실패", async () => {
    const invalidData = { ...validData, average: 6 };

    const errors = await validateDTO(invalidData);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toContain("average");
  });

  it("count 필드가 음수일 경우 검증 실패", async () => {
    const invalidData = { ...validData, count: -10 };

    const errors = await validateDTO(invalidData);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toContain("count");
  });

  it("distribution 필드가 객체가 아닐 경우 검증 실패", async () => {
    const invalidData = {
      ...validData,
      distribution: "not_an_object",
    } as unknown as Partial<ReviewSummaryDTO>;

    const errors = await validateDTO(invalidData);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toContain("distribution");
  });

  it("distribution 필드가 정해진 키 (1-5)가 아닐 경우 검증 실패", async () => {
    const invalidData = {
      ...validData,
      distribution: {
        1: 10,
        6: 5,
      },
    } as unknown as Partial<ReviewSummaryDTO>;

    const errors = await validateDTO(invalidData);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toContain("distribution");
  });

  it("distribution 필드의 값이 음수일 경우 검증 실패", async () => {
    const invalidData = {
      ...validData,
      distribution: {
        1: -5,
        2: 20,
        3: 30,
        4: 25,
        5: 15,
      },
    };

    const errors = await validateDTO(invalidData);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toContain("distribution");
  });

  it("average 필드가 숫자가 아닐 경우 검증 실패", async () => {
    const invalidData = { ...validData, average: "not_a_number" as unknown as number };

    const errors = await validateDTO(invalidData);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toContain("average");
  });

  it("count 필드가 정수가 아닐 경우 검증 실패", async () => {
    const invalidData = { ...validData, count: 10.5 };

    const errors = await validateDTO(invalidData);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toContain("count");
  });
});
