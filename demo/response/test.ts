#!/usr/bin/env deno run --allow-run --allow-net
import { test, runTests } from "https://deno.land/std/testing/mod.ts";
import { assertEquals, equal } from "https://deno.land/std/testing/asserts.ts";
import {BufferReader} from "./../buffer_reader/mod.ts";

const run = Deno.run;
const testSite = "http://127.0.0.1:3001";
// 启动测试服务

let textServer;
let jsonServer;

async function startTextServer() {
  textServer = run({
    args: ["deno", "run", "--allow-net", "./test_server_text.ts", ".", "--cors"],
    stdout: "piped"
  });
  const buffer = textServer.stdout;
  const bufReader = new BufferReader(buffer);
  const line = await bufReader.readLine();
  equal("listening on 127.0.0.1:3001", line)
}

function closeTextServer() {
  textServer.close();
  textServer.stdout.close();
}

async function startJSONServer() {
  jsonServer = run({
    args: ["deno", "run", "--allow-net", "./test_server_json.ts", ".", "--cors"],
    stdout: "piped"
  });
  const buffer = jsonServer.stdout;
  const bufReader = new BufferReader(buffer);
  const line = await bufReader.readLine();
  equal("listening on 127.0.0.1:3001", line)
}

function closeJSONServer() {
  jsonServer.close();
  jsonServer.stdout.close();
}

test(async function serverTextResponse() {
  try {
    // 等待服务启动
    await startTextServer();
    const res = await fetch(`${testSite}`);
    const text = await res.text();
    const acceptResult = "hello world";
    assertEquals(text, acceptResult);
    // 关闭测试服务
    closeTextServer();
  } catch (err) {
    // 关闭测试服务
    closeTextServer();
    throw new Error(err);
  }
});


test(async function serverJSONResponse() {
  try {
    // 等待服务启动
    await startJSONServer();
    const res = await fetch(`${testSite}`);
    const json = await res.json();
    const acceptResult = {
      "data": "helloworld"
    };
    assertEquals(json, acceptResult);
    // 关闭测试服务
    closeJSONServer();
  } catch (err) {
    // 关闭测试服务
    closeJSONServer();
    throw new Error(err);
  }
});

runTests();