import getTextResources, {
  AppLanguageOptions,
  TextResources,
} from "../res/textResourcesFunction";

jest.mock("../res/textResourcesConst", () => ({
  get textResourcesMultilang(): TextResources {
    return {
      testName1: {
        EN: "English name1",
        DE: "German name1",
        UA: "Ukrainian name1",
        RU: "Russian name1",
      },
      testName2: {
        EN: "English name2",
      },
    };
  },
}));

describe("localized text resourses generation test", () => {
  test("checking getTextResourses function", () => {
    const textResoursesEN = getTextResources(AppLanguageOptions.EN);
    const textResoursesDE = getTextResources(AppLanguageOptions.DE);
    const textResoursesUA = getTextResources(AppLanguageOptions.UA);
    const textResoursesRU = getTextResources(AppLanguageOptions.RU);

    expect(textResoursesEN.testName1).toBe("English name1");
    expect(textResoursesEN.testName2).toBe("English name2");

    expect(textResoursesDE.testName1).toBe("German name1");
    expect(textResoursesDE.testName2).toBe("...");

    expect(textResoursesUA.testName1).toBe("Ukrainian name1");
    expect(textResoursesUA.testName2).toBe("...");

    expect(textResoursesRU.testName1).toBe("Russian name1");
    expect(textResoursesRU.testName2).toBe("...");
  });
});

// hint for myself for further use

// jest.mock("../middleware/authorizedAccess", () =>
//   jest.fn((req: Request, res: Response, next: NextFunction) => {
//     return next();
//   })
// );

// jest.mock("../middleware/adminAccess", () =>
//   jest.fn((req: Request, res: Response, next: NextFunction) => {
//     return next();
//   })
// );
