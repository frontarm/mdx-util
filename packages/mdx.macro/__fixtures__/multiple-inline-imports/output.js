import { mdx } from '@mdx-js/react';

function MDXContent({
  components,
  ...props
}) {
  return <MDXLayout {...layoutProps} {...props} components={components} mdxType="MDXLayout">

    <h2>{`This is some MDX source`}</h2>
    <SomeComponent test={_test2} mdxType="SomeComponent" />
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
import { test as _test2 } from './test.js';

function MDXContent({
  components,
  ...props
}) {
  return <MDXLayout {...layoutProps} {...props} components={components} mdxType="MDXLayout">

    <h2>{`This is some MDX source`}</h2>
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

import { test as _test } from './test.js';
const DocumentA = MDXContent.isMDXComponent = true;
const DocumentB = MDXContent.isMDXComponent = true;