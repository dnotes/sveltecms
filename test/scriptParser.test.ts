import { parseFieldFunctionScript } from '../src/lib/core/FieldFunction'

function testScript({script,expectedScript,expectedConf}) {
  let conf = parseFieldFunctionScript(script)
  expect(conf).toEqual(expectedConf)
  expect(conf.toString()).toEqual(expectedScript)
}

function testNotAScript({script}) {
  let conf = parseFieldFunctionScript(script)
  expect(conf).toBeUndefined()
}

function testFailingScript({script, error}) {
  expect(() => {parseFieldFunctionScript(script)}).toThrowError(error)
}

describe('Test $value.property constructions', () => {
  test.each`
    script | expectedScript | expectedConf
    ${'$value'} | ${'$value'} | ${{function:'getValue',params:[]}}
    ${'$values'} | ${'$value'} | ${{function:'getValue',params:[]}}
    ${'$error'} | ${'$error'} | ${{function:'isError',params:[]}}
    ${'$errors'} | ${'$error'} | ${{function:'isError',params:[]}}
    ${'$touched'} | ${'$touched'} | ${{function:'isTouched',params:[]}}
    ${'$field'} | ${'$field'} | ${{function:'getFieldProperty',params:[]}}
    ${'$value.fieldname'} | ${'$values.fieldname'} | ${{function:'getValue',params:['fieldname']}}
    ${'$values.fieldname'} | ${'$values.fieldname'} | ${{function:'getValue',params:['fieldname']}}
    ${'$error.fieldname.subfield'} | ${'$errors.fieldname.subfield'} | ${{function:'isError',params:['fieldname.subfield']}}
    ${'$errors.fieldname.subfield'} | ${'$errors.fieldname.subfield'} | ${{function:'isError',params:['fieldname.subfield']}}
    ${'$touched.fieldname[0].subfield'} | ${'$touched.fieldname[0].subfield'} | ${{function:'isTouched',params:['fieldname[0].subfield']}}
    ${'$field.hidden'} | ${'$field.hidden'} | ${{function:'getFieldProperty',params:['hidden']}}
    ${'$value.$id'} | ${'$value'} | ${{function:'getValue',params:[]}}
    ${'$values.$id'} | ${'$value'} | ${{function:'getValue',params:[]}}
  `('$script', testScript)
})

describe('Test $value.property constructions as params', () => {
  test.each`
    script | expectedScript | expectedConf
    ${'$not($values.fieldname)'} | ${'$not($values.fieldname)'} | ${{function:'not',params:[{function:'getValue',params:['fieldname']}]}}
  `('$script', testScript)
})

describe('Call functions as a complete script', () => {
  const expectedConf = { function:'now', params:[] }
  const expectedScript = '$now()'
  test.each`
    script | expectedConf | expectedScript
    ${'$functions.now'} | ${expectedConf} | ${expectedScript}
    ${'$function.now'} | ${expectedConf} | ${expectedScript}
    ${'$fns.now'} | ${expectedConf} | ${expectedScript}
    ${'$fn.now'} | ${expectedConf} | ${expectedScript}
    ${'$now'} | ${expectedConf} | ${expectedScript}
    ${'$functions.now()'} | ${expectedConf} | ${expectedScript}
    ${'$function.now()'} | ${expectedConf} | ${expectedScript}
    ${'$fns.now()'} | ${expectedConf} | ${expectedScript}
    ${'$fn.now()'} | ${expectedConf} | ${expectedScript}
    ${'$now()'} | ${expectedConf} | ${expectedScript}
  `('Call $script as a complete script', testScript)
})

describe('Call functions as a parameter', () => {
  const expectedConf = { function:'not', params: [
    { function:'now', params:[] }
  ]}
  const expectedScript = '$not($now())'
  test.each`
    script | expectedConf | expectedScript
    ${'$not($functions.now)'} | ${expectedConf} | ${expectedScript}
    ${'$not($function.now)'} | ${expectedConf} | ${expectedScript}
    ${'$not($fns.now)'} | ${expectedConf} | ${expectedScript}
    ${'$not($fn.now)'} | ${expectedConf} | ${expectedScript}
    ${'$not($now)'} | ${expectedConf} | ${expectedScript}
    ${'$not($functions.now())'} | ${expectedConf} | ${expectedScript}
    ${'$not($function.now())'} | ${expectedConf} | ${expectedScript}
    ${'$not($fns.now())'} | ${expectedConf} | ${expectedScript}
    ${'$not($fn.now())'} | ${expectedConf} | ${expectedScript}
    ${'$not($now())'} | ${expectedConf} | ${expectedScript}
  `('Call $script as a parameter', testScript)
})

describe('Use specific variables', () => {
  test.each`
    script | expectedScript | expectedConf
    ${'$if(true)'} | ${'$if(true)'} | ${{function:'if',params:[true]}}
    ${'$if(false)'} | ${'$if(false)'} | ${{function:'if',params:[false]}}
    ${'$if(null)'} | ${'$if(null)'} | ${{function:'if',params:[null]}}
    ${'$if(123)'} | ${'$if(123)'} | ${{function:'if',params:[123]}}
    ${'$if(123.123)'} | ${'$if(123.123)'} | ${{function:'if',params:[123.123]}}
    ${'$if($value)'} | ${'$if($value)'} | ${{function:'if',params:[{function:'getValue',params:[]}]}}
    ${'$and($not(true),true,false,null,123,123.123,$value,$value.fieldname)'} | ${'$and($not(true),true,false,null,123,123.123,$value,$values.fieldname)'} | ${{
      function:'and',
      params:[
        {function:'not',params:[true]},
        true,
        false,
        null,
        123,
        123.123,
        {function:'getValue',params:[]},
        {function:'getValue',params:['fieldname']}
      ]}}
  `('$script', testScript)
})

describe('Use $values in different configurations', () => {
  test.each`
    script | expectedScript | expectedConf
    ${'$if($values.fieldname,$values.truefield,$values.falsefield)'} | ${'$if($values.fieldname,$values.truefield,$values.falsefield)'} | ${{
      function:'if',
      params: [
        {function:'getValue',params:['fieldname']},
        {function:'getValue',params:['truefield']},
        {function:'getValue',params:['falsefield']},
      ]
    }} used as all three parameters in a single-level function
    ${'$if($if($values.fieldname,$values.truefield,$values.falsefield),$if($values.fieldname,$values.truefield,$values.falsefield),$if($values.fieldname,$values.truefield,$values.falsefield))'} | ${'$if($if($values.fieldname,$values.truefield,$values.falsefield),$if($values.fieldname,$values.truefield,$values.falsefield),$if($values.fieldname,$values.truefield,$values.falsefield))'} | ${{
      function:'if',
      params: [
        {
          function:'if',
          params: [
            {function:'getValue',params:['fieldname']},
            {function:'getValue',params:['truefield']},
            {function:'getValue',params:['falsefield']},
          ]
        },
        {
          function:'if',
          params: [
            {function:'getValue',params:['fieldname']},
            {function:'getValue',params:['truefield']},
            {function:'getValue',params:['falsefield']},
          ]
        },
        {
          function:'if',
          params: [
            {function:'getValue',params:['fieldname']},
            {function:'getValue',params:['truefield']},
            {function:'getValue',params:['falsefield']},
          ]
        },
      ]
    }} used as all three parameters in a nested function
  `('$script', testScript)
})

describe('Use delimited strings in scripts', () => {
  test.each`
    script | expectedScript | expectedConf
    ${'$not(simple string)'} | ${'$not(simple string)'} | ${{function:'not',params:['simple string']}}
    ${'$not("simple string")'} | ${'$not(simple string)'} | ${{function:'not',params:['simple string']}}
    ${'$not(string, with comma)'} | ${'$not(string,with comma)'} | ${{function:'not',params:['string', 'with comma']}}
    ${'$not("string, with comma")'} | ${'$not("string, with comma")'} | ${{function:'not',params:['string, with comma']}}
    ${'$not(string, with "quotation marks")'} | ${'$not(string,"with ""quotation marks""")'} | ${{function:'not',params:['string','with "quotation marks"']}}
    ${'$not("string, with ""quotation marks""")'} | ${'$not("string, with ""quotation marks""")'} | ${{function:'not',params:['string, with "quotation marks"']}}
    ${'$not("this (parenthetical) text")'} | ${'$not("this (parenthetical) text")'} | ${{function:'not',params:['this (parenthetical) text']}}
  `('$script', testScript)
})

describe('Strings that are not scripts (should any of these fail?)', () => {
  test.each`
    script
    ${'just a string'} doesn't start with a $
    ${'$foo()'} doesn't match a provided function, but it's the base level so it doesn't throw an error
    ${'$9.99'} after all we can't throw errors at every $
    ${'$now(),'} has text after the parenthesis
    ${'$now ,'} has text after the function definition
    ${'$fields.something'} fields is not an alias
    ${'$not($values'} no closing parenthesis
    ${'$not($values.fieldname'} no closing parenthesis
    ${'$not($values.)'} extra dot in values
    ${'$not($values or something)'} extra characters in values
    ${'$not(this (parenthetical) text)'} unquoted parentheses
    ${'$if($not(null,true,123'} left out all closing parentheses in a nested script
  `('Expected no script for $script', testNotAScript)
})

// There are a few times when failing a script might prevent a misconfiguration
describe('Scripts that should fail', () => {
  test.each`
    script | error
    ${'$transform(toFloat,$9.99)'} | ${'Script error: Function not found at $9.99)'} there is a dollars sign that isn't quoted
    ${'$not($valu)'} | ${'Script error: Function not found at $valu)'} "valu" is not a provided function
  `('Expected failure for $script', testFailingScript)
})

describe("Scripts that look like they should fail but work anyhow, and I can't be bothered to make sure they don't", () => {
  test.each`
    script | expectedScript | expectedConf
    ${'$now('} | ${'$now()'} | ${{function:'now',params:[]}} This only works if you leave off a closing parenthesis on a single-level script; does this hurt anything?
    ${'$if(null,true,123'} | ${'$if(null,true,123)'} | ${{function:'if',params:[null,true,123]}} This also works...
    ${'$if($not(null,true,123)'} | ${'$if($not(null,true,123))'} | ${{function:'if',params:[{function:'not',params:[null,true,123]}]}} left out closing parenthesis in a nested script
    ${'$not(,,,,$value,,,,$value.fieldname,,,,,)'} | ${'$not($value,$values.fieldname)'} | ${{function:'not',params:[{function:'getValue',params:[]},{function:'getValue',params:['fieldname']}]}} Extra commas are ignored! TODO: maybe fix this? Coders might use ",2" instead of "null,2"
  `('$script', testScript)
})

describe("Scripts that did not work in practice", () => {
  test.each`
    script | expectedScript | expectedConf
    ${'$setValue(slug,$transform(slugify,$values.title))'} | ${'$setValue(slug,$transform(slugify,$values.title))'} | ${{function:'setValue',params:['slug',{function:'transform',params:['slugify', {function:'getValue',params:['title']}]}]}}
    ${'$if($values.manualSlug,null,$setValue(slug,$transform(slugify,$values.title)))'} | ${'$if($values.manualSlug,null,$setValue(slug,$transform(slugify,$values.title)))'} | ${{
      "function": "if",
      "params": [
        {"function": "getValue", "params": ["manualSlug"]},
        null,
        {"function": "setValue", "params": [
          "slug",
          {"function": "transform", "params": [
            "slugify",
            {"function": "getValue", "params": ["title"]}
          ]}
        ]}
      ]}}
  `('Problem script $script', testScript)
})

// describe('Scripts with expanded spacing', () => {
//   const expected = {
//     function:'if',
//     params:[
//       {function:'not',params:[
//         {function:'getValue',params:['switch']},
//         {function:'getValue',params:['first']},
//         {function:'getValue',params:['second']},
//       ]}
//     ]
//   }
//   test.each`
//     script | expectedScript | expectedConf
//     ${'$if(\n  $not(\n    $values.switch\n    $values.first\n    $values.second\n  )\n)'} | ${'$if($not($values.switch,$values.first,$values.second))'} | ${expected}
//     ${'$if(\n  $not(\n    $values.switch,\n    $values.first,\n    $values.second\n  )\n)'} | ${'$if($not($values.switch,$values.first,$values.second))'} | ${expected}
//   `('Expanded form of $expectedScript', testScript)
// })
