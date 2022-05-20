import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import log from "../utils/logger";
import checkKeyPair from "../utils/checkKeyPair";

// if test runs in devcontainer, foldernames are going to be different
let dockerMode: Boolean = false;
const dockerEnvironment = process.env.NODE_ENV;
if (dockerEnvironment === "docker") {
  dockerMode = true;
}

jest.mock("fs");
jest.mock("../utils/logger");

describe("Encryption keys checking / generating function test", () => {
  let mockPubKey: string;
  let mockPrivKey: string;

  test("path check, .env does not exist", () => {
    // mocking path does not exist
    fs.existsSync = jest.fn().mockImplementation((keyPath) => {
      return false;
    });
    fs.readFileSync = jest
      .fn()
      .mockImplementationOnce((filePath: string, param: string) => {
        throw new Error("No such file");
      })
      .mockImplementation((filePath: string, param: string) => {
        if (filePath.includes("id_rsa_priv.pem"))
          throw new Error("No such file");
        if (filePath.includes("id_rsa_pub.pem")) return "Some text";
      });
    fs.writeFileSync = jest
      .fn()
      .mockImplementationOnce(
        (filePath: string, fileContent: string) => filePath
      );

    fs.mkdirSync = jest
      .fn()
      .mockImplementationOnce((filePath: string) => filePath);

    // mocking log calls
    log.info = jest.fn().mockImplementation((msg) => msg);
    log.error = jest.fn().mockImplementation((msg) => msg);

    // check the correctness of the returned value
    const result = checkKeyPair();
    expect(result).toBe(false);

    // checking that path contained "key" word
    if (dockerMode) {
      expect(fs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining("keys")
      );
    } else {
      expect(fs.existsSync).toHaveBeenCalledWith(
        expect.stringContaining(path.join("server", "keys"))
      );
    }

    // checking that keys folder was created
    expect(fs.mkdirSync).toHaveBeenCalledWith(expect.stringContaining("keys"));

    // checking log message
    expect(log.info).toHaveBeenCalledWith(
      "New .env file is generated with default values"
    );
    expect(log.info).toHaveBeenCalledWith(
      "keys folder does not exist, new keys dir is created"
    );
  });

  test("read keys check", () => {
    // mocking path exists
    fs.existsSync = jest.fn().mockImplementation((keyPath) => {
      return true;
    });
    // mocking log calls
    log.error = jest.fn().mockImplementation((msg) => msg);
    log.info = jest.fn().mockImplementation((msg) => msg);
    // mocking files read call to simulate that public key is not in the folder
    fs.readFileSync = jest
      .fn()
      .mockImplementation((filePath: string, param) => {
        if (filePath.includes("id_rsa_pub.pem"))
          throw new Error("No such file");
        if (filePath.includes("id_rsa_priv.pem")) return "Some text";
      });

    let result = checkKeyPair();
    // mocking files read call to simulate that there public key is not in the folder
    expect(log.info).toHaveBeenCalledWith("Public key is not found");
    expect(result).toBe(false);

    // mocking files read call to simulate that private key is not in the folder
    fs.readFileSync = jest
      .fn()
      .mockImplementation((filePath: string, param: string) => {
        if (filePath.includes("id_rsa_priv.pem"))
          throw new Error("No such file");
        if (filePath.includes("id_rsa_pub.pem")) return "Some text";
      });
    result = checkKeyPair();
    expect(log.info).toHaveBeenCalledWith("Private key is not found");
    expect(result).toBe(false);
  });

  test("Empty keys folder, new keys test", () => {
    // mocking path exists
    fs.existsSync = jest.fn().mockImplementation((keyPath) => {
      return true;
    });
    // mocking log calls
    log.error = jest.fn().mockImplementation((msg) => msg);
    log.info = jest.fn().mockImplementation((msg) => msg);
    // mocking files read call to simulate that public key is not in the folder
    fs.readFileSync = jest
      .fn()
      .mockImplementationOnce((filePath: string, param: string) => {
        return "ENV MOCKED FILE CONTENT"
      })
      .mockImplementationOnce((filePath: string, param: string) => {
        throw new Error("No such file");
      })
      .mockImplementationOnce((filePath: string, param: string) => {
        throw new Error("No such file");
      })
      .mockImplementation((filePath: string, param: string) => {
        if (filePath.includes("id_rsa_pub.pem")) return mockPubKey;
        if (filePath.includes("id_rsa_priv.pem")) return mockPrivKey;
        throw new Error("Error in test logic");
      });
    // mocking new key pair files writing - to the test vars intead of files
    fs.writeFileSync = jest
      .fn()
      .mockImplementation((filePath: string, key: string) => {
        if (filePath.includes("id_rsa_priv.pem")) {
          mockPrivKey = key;
        }
        if (filePath.includes("id_rsa_pub.pem")) {
          mockPubKey = key;
        }
        if (
          !filePath.includes("id_rsa_priv.pem") &&
          !filePath.includes("id_rsa_pub.pem")
        ) {
          throw new Error("Error in test logic");
        }
      });
    // calling function which should work
    const result = checkKeyPair();
    expect(result).toBe(true);
    expect(log.info).toHaveBeenCalledWith(".env file is in place");
    expect(log.info).toHaveBeenCalledWith("Private key is not found");
    expect(log.info).toHaveBeenCalledWith("Public key is not found");
    expect(log.info).toHaveBeenCalledWith("New encryption keys are generated");
  });

  test("Empty keys folder, new corrupted public key test", () => {
    // mocking path exists
    fs.existsSync = jest.fn().mockImplementation((keyPath) => {
      return true;
    });
    // mocking log calls
    log.error = jest.fn().mockImplementation((msg) => msg);
    log.info = jest.fn().mockImplementation((msg) => msg);
    // mocking files read call to simulate that public key is not in the folder
    fs.readFileSync = jest
      .fn()
      .mockImplementationOnce((filePath: string, param: string) => {
        return "ENV MOCKED FILE CONTENT";
      })
      .mockImplementationOnce((filePath: string, param: string) => {
        throw new Error("No such file");
      })
      .mockImplementationOnce((filePath: string, param: string) => {
        throw new Error("No such file");
      })
      .mockImplementation((filePath: string, param: string) => {
        if (filePath.includes("id_rsa_pub.pem")) {
          // generate currupted pub key by deleting a number of symbols
          let corruptedKey = mockPubKey;
          corruptedKey =
            corruptedKey.slice(0, 18) +
            corruptedKey.slice(25, corruptedKey.length);
          return corruptedKey;
        }
        if (filePath.includes("id_rsa_priv.pem")) {
          return mockPrivKey;
        }
        throw new Error("Error in test logic");
      });
    // mocking new key pair files writing - to the test vars intead of files
    fs.writeFileSync = jest
      .fn()
      .mockImplementation((filePath: string, key: string) => {
        if (filePath.includes("id_rsa_priv.pem")) {
          mockPrivKey = key;
        }
        if (filePath.includes("id_rsa_pub.pem")) {
          mockPubKey = key;
        }
        if (
          !filePath.includes("id_rsa_priv.pem") &&
          !filePath.includes("id_rsa_pub.pem")
        ) {
          throw new Error("Error in test logic");
        }
      });
    // calling function which should work
    const result = checkKeyPair();
    expect(result).toBe(false);
    expect(log.info).toHaveBeenCalledWith("Private key is not found");
    expect(log.info).toHaveBeenCalledWith("Public key is not found");
    expect(log.info).toHaveBeenCalledWith("New encryption keys are generated");
    expect(log.error).toHaveBeenCalledWith("Public key is corrupted");
  });

  test("Empty keys folder, new corrupted private key test", () => {
    // mocking path exists
    fs.existsSync = jest.fn().mockImplementation((keyPath) => {
      return true;
    });
    // mocking log calls
    log.error = jest.fn().mockImplementation((msg) => msg);
    log.info = jest.fn().mockImplementation((msg) => msg);
    // mocking files read call to simulate that public key is not in the folder
    fs.readFileSync = jest
      .fn()
      .mockImplementationOnce((filePath: string, param: string) => {
        return "ENV MOCKED FILE CONTENT";
      })
      .mockImplementationOnce((filePath: string, param: string) => {
        throw new Error("No such file");
      })
      .mockImplementationOnce((filePath: string, param: string) => {
        throw new Error("No such file");
      })
      .mockImplementation((filePath: string, param: string) => {
        if (filePath.includes("id_rsa_pub.pem")) {
          return mockPubKey;
        }
        if (filePath.includes("id_rsa_priv.pem")) {
          // generate currupted priv key by deleting a number of symbols
          let corruptedKey = mockPrivKey;
          corruptedKey =
            corruptedKey.slice(0, 18) +
            corruptedKey.slice(25, corruptedKey.length);
          return corruptedKey;
        }
        throw new Error("Error in test logic");
      });
    // mocking new key pair files writing - to the test vars intead of files
    fs.writeFileSync = jest
      .fn()
      .mockImplementation((filePath: string, key: string) => {
        if (filePath.includes("id_rsa_priv.pem")) {
          mockPrivKey = key;
        }
        if (filePath.includes("id_rsa_pub.pem")) {
          mockPubKey = key;
        }
        if (
          !filePath.includes("id_rsa_priv.pem") &&
          !filePath.includes("id_rsa_pub.pem")
        ) {
          throw new Error("Error in test logic");
        }
      });
    // calling function which should work
    const result = checkKeyPair();
    expect(result).toBe(false);
    expect(log.info).toHaveBeenCalledWith("Private key is not found");
    expect(log.info).toHaveBeenCalledWith("Public key is not found");
    expect(log.info).toHaveBeenCalledWith("New encryption keys are generated");
    expect(log.error).toHaveBeenCalledWith("Private key is corrupted");
  });
});
