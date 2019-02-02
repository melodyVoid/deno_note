const funcParamKey = "__DATA__";

function compileToFunctionStr (tpl) {
  const tplCode = tpl;
  const regTpl = /#if[\s]{0,}\(([^\)]+)?\)|#elseif[\s]{0,}\(([^\)]+)?\)|#foreach[\s]{0,}\(([^\)]+)?\)\.indexAs\(([^\)]+)?\)|#foreach[\s]{0,}\(([^\)]+)?\)\.keyAs\(([^\)]+)?\)|{{([^}}]+)?}}|#\/if|#\/foreach/ig;
  const regDirectEnd = /#\/if|#\/foreach/i;
  const regDirectIf = /#if[\s]{0,}\(([^\)]+)?\)/i;
  const regDirectElseif = /#elseif[\s]{0,}\(([^\)]+)?\)/i;
  const regDirectForArray = /#foreach[\s]{0,}\(([^\)]+)?\)\.indexAs\(([^\)]+)?\)/i;
  const regDirectForJSON = /#foreach[\s]{0,}\(([^\)]+)?\)\.keyAs\(([^\)]+)?\)/i;
  const regData = /{{([^}}]+)?}}/i;
  const directiveStock = [];
  let funcCodeStr = "";
  let match = true;
  let codeIndex = 0;
  funcCodeStr += "\r\n let _row=[];\r\n";

  const addFuncCode = function (params) {
    const { currentExec, restCode } = params;

    if (regData.test(currentExec) === true) {
      // set data
      funcCodeStr += `\r\n _row.push(${regData.exec(currentExec)[1]});`;
    } else if (regDirectIf.test(currentExec) === true) {
      funcCodeStr += `\r\n if ( ${regDirectIf.exec(currentExec)[1]} ) {`;
      directiveStock.push("if");
    } else if (regDirectElseif.test(currentExec) === true) {
      funcCodeStr += `\r\n else if ( ${regDirectIf.exec(currentExec)[1]} ) {`;
    } else if (regDirectForArray.test(currentExec) === true) {
      const forArrayName = regDirectForArray.exec(currentExec)[1];
      const forArrayIndexName = regDirectForArray.exec(currentExec)[2] || "idx";
      funcCodeStr += `
      \r\n for ( let ${forArrayIndexName}=0; ${forArrayIndexName}<${forArrayName}.length; ${forArrayIndexName}++ ) {
      `;
      directiveStock.push("for-array");
    } else if (regDirectForJSON.test(currentExec) === true) {
      const forJSONName = regDirectForJSON.exec(currentExec)[1];
      const forJSONKey = regDirectForJSON.exec(currentExec)[2] || "key";
      funcCodeStr += `
      \r\n for ( const ${forJSONKey} in ${forJSONName} ) {
      `;
      directiveStock.push("for-json");
    } else if (regDirectEnd.test(currentExec) === true) {
      funcCodeStr += `\r\n }`;
      directiveStock.pop();
    } else {
      funcCodeStr += `\r\n _row.push(\`${restCode}\`); `;
    }
  };

  let excecResult;
  while (match) {
    // console.log(`tplCode = ${tplCode} \r\r\n`)
    excecResult = regTpl.exec(tplCode);
    if (match && excecResult) {
      const restCode = tplCode.slice(codeIndex, excecResult.index);
      const currentExec = excecResult[0];
      const currentMatch = excecResult[1];
      addFuncCode({ restCode });
      addFuncCode({ currentExec, currentMatch, restCode });
      codeIndex = excecResult.index + excecResult[0].length;
    } else {
      match = false;
    }
  }
  addFuncCode({ restCode: tplCode.substr(codeIndex, tplCode.length) });

  funcCodeStr += `\r\n return _row.join("");`;
  funcCodeStr = funcCodeStr.replace(/[\r\t\r\n]/g, "");
  return funcCodeStr;
}

const template = {
  compile (tpl, data) {
    const funcStr = compileToFunctionStr(tpl);
    // const func = new Function(funcParamKey, funcStr.replace(/[\r\t\r\n]/g, ""));
    console.log('funcStr = \r\n', funcStr)
    // const html = func(data);
    const html = ''
    return html;
  }
};
export const compileTemplate = template.compile;
