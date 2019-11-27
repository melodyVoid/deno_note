import { test, runTests } from "https://deno.land/std/testing/mod.ts";
import { assertEquals, equal } from "https://deno.land/std/testing/asserts.ts";
import { add, addAsync } from "./mod.ts";

test(function example() {
  const result = add(1, 2);
  assertEquals(result, 3);
});

test(async function exampleAsync() {
  const result = await addAsync(1, 2);
  assertEquals(result, 3);
});

runTests();