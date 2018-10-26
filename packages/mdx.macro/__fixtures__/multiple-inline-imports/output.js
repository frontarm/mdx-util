import { MDXTag } from '@mdx-js/tag';
import { test as _test2 } from './test.js';
import { test as _test } from './test.js';

const DocumentA = ({
  components,
  ...props
}) => <MDXTag name="wrapper" components={components}>
  <MDXTag name="h2" components={components}>{`This is some MDX source`}</MDXTag>
  <SomeComponent test={_test} /></MDXTag>;

const DocumentB = ({
  components,
  ...props
}) => <MDXTag name="wrapper" components={components}>
  <MDXTag name="h2" components={components}>{`This is some MDX source`}</MDXTag>
  <SomeComponent test={_test2} /></MDXTag>;