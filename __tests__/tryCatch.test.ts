import { describe, expect, it } from "vitest";

import { tryCatch } from "@/utils/tryCatch";

describe("tryCatch", () => {
  describe("Synchronous operations", () => {
    it("should return success tuple for successful sync function", () => {
      const result = tryCatch(() => 42);

      expect(result).toEqual([null, 42]);
    });

    it("should return error tuple for throwing sync function", () => {
      const error = new Error("Test error");
      const result = tryCatch(() => {
        throw error;
      });

      expect(result).toEqual([error, null]);
    });

    it("should return string result", () => {
      const result = tryCatch(() => "hello world");

      expect(result).toEqual([null, "hello world"]);
    });

    it("should return object result", () => {
      const obj = { name: "test", value: 123 };
      const result = tryCatch(() => obj);

      expect(result).toEqual([null, obj]);
    });

    it("should return array result", () => {
      const arr = [1, 2, 3];
      const result = tryCatch(() => arr);

      expect(result).toEqual([null, arr]);
    });

    it("should handle null return value", () => {
      const result = tryCatch(() => null);

      expect(result).toEqual([null, null]);
    });

    it("should handle undefined return value", () => {
      const result = tryCatch(() => undefined);

      expect(result).toEqual([null, undefined]);
    });
  });

  describe("Promise operations", () => {
    it("should return success tuple for resolved promise", async () => {
      const result = await tryCatch(Promise.resolve(42));

      expect(result).toEqual([null, 42]);
    });

    it("should return error tuple for rejected promise", async () => {
      const error = new Error("Promise error");
      const result = await tryCatch(Promise.reject(error));

      expect(result).toEqual([error, null]);
    });

    it("should handle promise with string value", async () => {
      const result = await tryCatch(Promise.resolve("async hello"));

      expect(result).toEqual([null, "async hello"]);
    });

    it("should handle promise with object value", async () => {
      const obj = { async: true, data: [1, 2, 3] };
      const result = await tryCatch(Promise.resolve(obj));

      expect(result).toEqual([null, obj]);
    });
  });

  describe("Async function operations", () => {
    it("should return success tuple for async function that resolves", async () => {
      const result = await tryCatch(async () => {
        return "async result";
      });

      expect(result).toEqual([null, "async result"]);
    });

    it("should return error tuple for async function that rejects", async () => {
      const error = new Error("Async error");
      const result = await tryCatch(async () => {
        throw error;
      });

      expect(result).toEqual([error, null]);
    });

    it("should handle delayed async operation", async () => {
      const result = await tryCatch(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return "delayed result";
      });

      expect(result).toEqual([null, "delayed result"]);
    });
  });

  describe("Error handling", () => {
    it("should capture error with custom properties", () => {
      class CustomError extends Error {
        code = "CUSTOM";
      }

      const error = new CustomError("Custom error");
      const result = tryCatch((): string => {
        throw error;
      });

      expect(result[0]).toBeInstanceOf(CustomError);
      expect((result[0] as CustomError).code).toBe("CUSTOM");
    });

    it("should return success for valid operation", () => {
      const result = tryCatch((): { id: number; name: string } => ({
        id: 1,
        name: "test",
      }));

      expect(result[0]).toBeNull();
      expect(result[1]?.id).toBe(1);
      expect(result[1]?.name).toBe("test");
    });

    it("should return error for throwing operation", () => {
      const error = new Error("Narrowing test");
      const result = tryCatch((): string => {
        throw error;
      });

      expect(result[1]).toBeNull();
      expect(result[0]).toBeInstanceOf(Error);
      expect((result[0] as Error).message).toBe("Narrowing test");
    });
  });

  describe("Real-world scenarios", () => {
    it("should handle JSON parsing success", () => {
      const json = '{"name": "test", "value": 42}';
      const result = tryCatch(() => JSON.parse(json));

      expect(result).toEqual([null, { name: "test", value: 42 }]);
    });

    it("should handle JSON parsing failure", () => {
      const invalidJson = "not valid json";
      const result = tryCatch(() => JSON.parse(invalidJson));

      expect(result[0]).toBeInstanceOf(SyntaxError);
      expect(result[1]).toBeNull();
    });

    it("should handle array operations", () => {
      const result = tryCatch(() => {
        const arr = [1, 2, 3];
        return arr.map((x) => x * 2);
      });

      expect(result).toEqual([null, [2, 4, 6]]);
    });

    it("should handle fetch-like async operations", async () => {
      const mockFetch = async (url: string) => {
        if (url === "/api/success") {
          return { data: "success" };
        }
        throw new Error("Not found");
      };

      const successResult = await tryCatch(() => mockFetch("/api/success"));
      expect(successResult).toEqual([null, { data: "success" }]);

      const errorResult = await tryCatch(() => mockFetch("/api/error"));
      const [error] = errorResult;
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toBe("Not found");
    });
  });
});
