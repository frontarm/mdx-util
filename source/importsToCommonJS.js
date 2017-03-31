// From https://github.com/tomitrescak/transform-to-commonjs/blob/master/src/index.ts
// Copyright Tomi Trescak

const stringLiteral = `"[^"\\\\]*(?:\\\\.[^"\\\\]*)*"|'[^\'\\\\]*(?:\\\\.[^\'\\\\]*)*'`;
const pattern = new RegExp(`^import\\s+((\\* as )?\\s*([\\w_]+)\\s*)?,?\\s*(\\{\\s*([\\w_,\\s]*)\\s\\})?\\s*(from\\s+)?(${stringLiteral})`, 'gm');

export default function transform(source) {
  pattern.lastIndex = 0;

  // handle imports
  return source.replace(pattern,
    (wholeMatch,
      defaultImport,
      defaultAs,
      defaultAsVar,
      specificImportWrapper,
      specificImports,
      fromKeyword,
      source) => {

      if (!fromKeyword) {
        return `require(${source})`;
      }
      else if (defaultImport && specificImports) {
        return handleDefaultImports(defaultAs, defaultAsVar, defaultImport, source) + 
               '\n' +
               handleSpecificImports(specificImports, source);
      }
      else if (defaultImport) {
        return handleDefaultImports(defaultAs, defaultAsVar, defaultImport, source);
      } else if (specificImports) {
        return handleSpecificImports(specificImports, source);
      }
      return wholeMatch;
    });
}

function handleSpecificImports(specificImports: string, source: string) {
  specificImports = specificImports.replace(/ as /g, ': ');
  return `const { ${specificImports} } = require(${source})`;
}

function handleDefaultImports(defaultAs: string, defaultAsVar: string, defaultImport: string, source: string) {
  if (defaultAs) {
    return `const ${defaultAsVar.trim()} = require(${source})`;
  } else {
    return `const ${defaultImport.trim()} = require(${source}).default || require(${source})`;
  }
}
