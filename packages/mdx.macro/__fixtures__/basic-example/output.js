import { mdx } from '@mdx-js/react';

function MDXContent({
  components,
  ...props
}) {
  return <MDXLayout {...layoutProps} {...props} components={components} mdxType="MDXLayout">

    <h1>{`Don't Panic`}</h1>
    <p><em parentName="p">{`Since we decided a few weeks ago to adopt the leaf as legal tender, we have, of course, all become immensely rich.`}</em></p>
    <SomeComponent test={_test} mdxType="SomeComponent" />
    </MDXLayout>;
}

const MDXLayout = "wrapper";
const layoutProps = {};
const SomeComponent = makeShortcode("SomeComponent");

const makeShortcode = name => function MDXDefaultShortcode(props) {
  console.warn("Component " + name + " was not imported, exported, or provided by MDXProvider as global scope");
  return <div {...props} />;
};

/* @jsx mdx */
import { test as _test } from './test.js';
const Document = MDXContent.isMDXComponent = true;